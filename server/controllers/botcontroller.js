import crypto from "crypto";
import prisma from "../config/database.js";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CohereEmbeddings } from "@langchain/cohere";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

// helper to generate secure API key
function generateKey(length = 32) {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
}

export const generateApiKey = async (req, res) => {
  try {
    const userId = req.id;// author
    const newKey = generateKey();

    // check if user already has an API key
    const existingKey = await prisma.apiKey.findUnique({
      where: { userId },
    });

    let apiKey;

    if (existingKey) {
      // reset the existing key
      apiKey = await prisma.apiKey.update({
        where: { userId },
        data: { key: newKey },
      });
    } else {
      // create a new key
      apiKey = await prisma.apiKey.create({
        data: {
          key: newKey,
          userId,
        },
      });
    }

    return res.status(200).json({
      success: true,
      apiKey: apiKey.key,
    });
  } catch (error) {
    console.error("Error generating API key:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};




// Uplaod the pdf and save to the pinecone db
// Initialize Cohere Embeddings
const embeddings = new CohereEmbeddings({
    model: "embed-english-v3.0",
    apiKey: process.env.COHERE_API_KEY, // Best practice is to use .env file
  });
  
  // Initialize Pinecone Client
  const pinecone = new PineconeClient({
    apiKey: process.env.PINECONE_API_KEY, // Best practice is to use .env file
  });
  const pineconeIndex = pinecone.Index("careerstack-chat-bot"); // Use your index name
  
  // Create a PineconeStore instance
  const vectorStore = new PineconeStore(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });
  
  /**
   * Handles PDF file upload, processes its content, and stores embeddings in Pinecone.
   * The file is processed directly from memory without saving it to the server.
   * Each vector is associated with a 'botName' for namespaced querying.
   */
  export const uploadPdf = async (req, res) => {
    try {
      // 1. Get user, file, and botName from the request
      const userId = req.id; // Assuming your 'isAuthenticated' middleware adds user to req
      if (!userId) {
        return res.status(401).json({ success: false, message: "User not authenticated." });
      }
  
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded. Please upload a PDF file." });
      }
  
      const { botName } = req.body;
      if (!botName) {
        return res.status(400).json({ error: "botName is required in the request body." });
      }
  
      // NEW STEP 2: Check if a bot with the same name already exists for this user
      const existingBot = await prisma.bot.findFirst({
          where: {
              name: botName,
              ownerId: userId,
          }
      });
  
      if (existingBot) {
          return res.status(409).json({ success: false, message: `You already have a bot named '${botName}'. Please choose a different name.` });
      }
  
      // NEW STEP 3: Create the bot entry in your database
      // Hum bot ko Pinecone mein data daalne se pehle create kar rahe hain.
      const newBot = await prisma.bot.create({
          data: {
              name: botName,
              ownerId: userId, // Bot ko current user se link kar rahe hain
          }
      });
  
      console.log(`Bot '${newBot.name}' created successfully in the database.`);
  
      // 4. Load PDF from buffer (memory)
      const blob = new Blob([req.file.buffer], { type: 'application/pdf' });
      const loader = new PDFLoader(blob, { splitPages: false });
      const doc = await loader.load();
  
      // 5. Split the document text into smaller chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
      });
      const texts = await textSplitter.splitText(doc[0].pageContent);
  
      // 6. Create documents with metadata for Pinecone
      const documents = texts.map((chunk) => ({
        pageContent: chunk,
        metadata: {
          ...doc[0].metadata,
          source: req.file.originalname,
          botName: newBot.name, // Use the name from the created bot
        },
      }));
  
      // 7. Add documents to Pinecone
      await vectorStore.addDocuments(documents);
      console.log("Document successfully indexed in Pinecone.");
  
      // 8. Send success response with the new bot details
      res.status(201).json({ // 201 Created is a better status code here
        success: true,
        message: `Bot '${newBot.name}' created and document indexed successfully.`,
        bot: newBot, // Frontend ke liye naya bot object bhej rahe hain
      });
  
    } catch (error) {
      console.error("Error in uploadPdf function:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the bot.",
        error: error.message,
      });
    }
  };




//IMPORTANT SECTION
// Retrive the pdf from the pinecone db
const groq = new Groq({ apiKey:process.env.GROQ_API_KEY });
export const retrivePdf = async (req, res) => {
    try {
      // 1. Header se 'authorization' nikalna
    const authHeader = req.headers['authorization'];

    // 2. Check karna ki header मौजूद hai aur 'Bearer ' se start hota hai
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Authorization header with Bearer token is missing or invalid.",
      });
    }

    // 3. 'Bearer ' prefix ko hatakar actual API key nikalna
    const apiKey = authHeader.split(' ')[1];

    // 4. Body se question aur botName nikalna
    const { question, botName } = req.body;
  
      // 2. API Key ko validate karna aur user details fetch karna
      const apiKeyRecord = await prisma.apiKey.findUnique({
        where: { key: apiKey },
        include: { user: true }, // User details bhi saath mein le aayenge
      });
  
      if (!apiKeyRecord || !apiKeyRecord.user) {
        return res.status(401).json({ success: false, message: "Invalid API Key." });
      }
  
      const user = apiKeyRecord.user;
  
      // 3. User ke remaining request credits check karna
      if (user.requestsLeft <= 0) {
        return res.status(403).json({
          success: false,
          message: "You have exceeded your request limit. Please upgrade your plan.",
        });
      }
  
      // 4. Pinecone se relevant data retrieve karna (botName ke basis par filter karke)
      // Hum `similaritySearch` ke teesre argument mein filter object pass kar rahe hain.
      // Isse search sirf uss bot ke vectors par hoga jiska naam match karega.
      const relevantChunks = await vectorStore.similaritySearch(
        question,
        3, // Number of chunks to retrieve
        { botName: botName } // <-- Yahan par filtering ho rahi hai
      );
  
      // Agar koi relevant chunk nahi mila
      if (relevantChunks.length === 0) {
        return res.status(200).json({
          success: true,
          answer: "I'm sorry, I couldn't find any relevant information in the provided document for that bot to answer your question.",
        });
      }
      
      const context = relevantChunks.map(chunk => chunk.pageContent).join('\n\n');
  
      // 5. Groq LLM ko context aur question bhejkar answer generate karna
      const SYSTEM_PROMPT = `You are an assistant for question-answering tasks. Use the following relevant pieces of retrieved context to answer the question. If you do not know the answer, say "I don't know". Be concise and helpful.`;
      
      const userQuery = `Question: ${question}
      Relevant context: ${context}`;
      
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: 'user', content: userQuery }
        ],
        model: "llama3-8b-8192", // Using a fast and capable model from Groq
      });
  
      const answer = completion.choices[0].message.content;
  
      // 6. User ke request credits ko 1 se kam karna
      await prisma.user.update({
        where: { id: user.id },
        data: {
          requestsLeft: {
            decrement: 1, // Atomically decreases the count by 1
          },
        },
      });
  
      // 7. Final answer client ko send karna
      res.status(200).json({ success: true, answer: answer });
  
    } catch (error) {
      console.error("Error in retrivePdf:", error);
      res.status(500).json({
        success: false,
        message: "An internal server error occurred.",
      });
    }
  };




  // Delete the bot  and data form the the pinecone db
  export const deleteBot = async (req, res) => {
    try {
      // 1. User ID aur Bot ID ko request se nikalna
      // User ID aapke authentication middleware (jaise 'isAuthenticated') se aayega.
      const userId = req.id; 
      const { botId } = req.params; // Hum bot ID ko URL parameter se lenge (e.g., /api/bots/:botId)
  
      if (!botId) {
        return res.status(400).json({ success: false, message: "Bot ID is required." });
      }
  
      // 2. Database se bot ko find karna
      const bot = await prisma.bot.findUnique({
        where: {
          id: botId,
        },
      });
  
      // Check karna ki bot exist karta hai ya nahi
      if (!bot) {
        return res.status(404).json({ success: false, message: "Bot not found." });
      }
  
      // 3. Authorize karna: Check karna ki request karne wala user hi bot ka owner hai
      if (bot.ownerId !== userId) {
        return res.status(403).json({ success: false, message: "You are not authorized to delete this bot." });
      }
  
      // 4. Pinecone se saare related vectors delete karna
      // Humne vectors ke metadata mein 'botName' save kiya tha, usi ka use karke delete karenge.
      console.log(`Deleting vectors from Pinecone for bot: ${bot.name}...`);
      await pineconeIndex.deleteMany({
        botName: bot.name,
      });
      console.log("Vectors deleted successfully from Pinecone.");
  
      // 5. PostgreSQL database se bot ka record delete karna
      await prisma.bot.delete({
        where: {
          id: botId,
        },
      });
      console.log("Bot record deleted successfully from database.");
  
      // 6. Success response bhejna
      res.status(200).json({
        success: true,
        message: `Bot '${bot.name}' and all its data have been deleted successfully.`,
      });
  
    } catch (error) {
      console.error("Error deleting bot:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while deleting the bot.",
      });
    }
  };