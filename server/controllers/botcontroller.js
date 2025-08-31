import crypto from "crypto";
import prisma from "../config/database.js";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
import { v4 as uuidv4 } from 'uuid';
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
  /*  export const uploadPdf = async (req, res) => {
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
*/
 
export const createBot = async (req, res) => {
  try {
      // --- Step 1: Initial Validations ---
      const userId = req.id;
      if (!userId) {
          return res.status(401).json({ success: false, message: "User not authenticated." });
      }

      const { botName, url } = req.body;
      if (!botName) {
          return res.status(400).json({ error: "botName is required." });
      }

      // Check karo ki ya toh file hai ya URL. Dono mein se ek hona zaroori hai.
      if (!req.file && !url) {
          return res.status(400).json({ error: "Please provide either a PDF file or a URL." });
      }

      // --- Step 2: Generate API Key FIRST ---
      const newApiKey = `sa-${uuidv4()}`;

      // --- Step 3: Load Document based on source (PDF or URL) ---
      let doc;
      let source;

      if (req.file) {
          // Agar PDF file aayi hai
          console.log("Preparing documents from PDF...");
          source = req.file.originalname;
          const blob = new Blob([req.file.buffer], { type: 'application/pdf' });
          const loader = new PDFLoader(blob, { splitPages: false });
          doc = await loader.load();
      } else if (url) {
          // Agar URL aaya hai
          console.log(`Preparing documents from URL: ${url}`);
          source = url;
          const loader = new PlaywrightWebBaseLoader(url, {
              evaluate: async (page) => await page.evaluate(() => document.body.innerText),
          });
          doc = await loader.load();
      }

      // --- Step 4: Split Text and Prepare for Pinecone (Common Logic) ---
      const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 100 });
      const texts = await textSplitter.splitText(doc[0].pageContent);

      const documents = texts.map((chunk) => ({
          pageContent: chunk,
          metadata: {
              ...doc[0].metadata,
              source: source, // source variable (file name or URL) yahan use hoga
              apiKey: newApiKey,
          },
      }));
      
      // --- Step 5: Upload to Pinecone ---
      console.log("Uploading documents to Pinecone...");
      await vectorStore.addDocuments(documents);
      console.log("Document successfully indexed in Pinecone.");

      // --- Step 6: Create Bot in DB (Only after successful upload) ---
      console.log("Creating bot and API key in the database...");
      const newBot = await prisma.bot.create({
          data: {
              name: botName,
              owner: { connect: { id: userId } },
              apiKey: { create: { key: newApiKey } }
          },
          include: { apiKey: true }
      });

      console.log(`Bot '${newBot.name}' and its API key created successfully.`);

      // --- Step 7: Send Final Success Response ---
      res.status(201).json({
          success: true,
          message: `Bot '${newBot.name}' created and document indexed successfully from ${source}.`,
          bot: {
              id: newBot.id,
              name: newBot.name,
              createdAt: newBot.createdAt,
          },
          apiKey: newBot.apiKey.key
      });

  } catch (error) {
      console.error("Error in createBot function:", error);
      res.status(500).json({
          success: false,
          message: "An error occurred while creating the bot. Please try again.",
          error: error.message,
      });
  }
};

// User the web crawler to fetch the data from the web




//IMPORTANT SECTION
// Retrive the pdf from the pinecone db
const groq = new Groq({ apiKey:process.env.GROQ_API_KEY });


export const retrivePdf = async (req, res) => {
  try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ success: false, message: "Authorization header with Bearer token is missing." });
      }
      const apiKey = authHeader.split(' ')[1];

      const { question } = req.body;

      if (!question) {
          return res.status(400).json({ success: false, message: "Question is required." });
      }

      const apiKeyRecord = await prisma.apiKey.findUnique({
          where: { key: apiKey },
          include: {
              bot: {
                  include: {
                      owner: true
                  }
              }
          }
      });

      if (!apiKeyRecord || !apiKeyRecord.bot || !apiKeyRecord.bot.owner) {
          return res.status(401).json({ success: false, message: "Invalid API Key." });
      }

      const owner = apiKeyRecord.bot.owner;

      if (owner.requestsLeft <= 0) {
          return res.status(403).json({ success: false, message: "You have exceeded your request limit." });
      }
      
      // --- IMPORTANT CHANGE ---
      // Ab hum botName ki jagah unique apiKey se filter kar rahe hain
      const relevantChunks = await vectorStore.similaritySearch(
          question,
          3,
          { apiKey: apiKey } 
      );

      const context = relevantChunks.length > 0
          ? relevantChunks.map(chunk => chunk.pageContent).join('\n\n')
          : "No relevant context found in the provided documents.";

      const SYSTEM_PROMPT = `You are an assistant for question-answering tasks. Use the following relevant pieces of retrieved context to answer the question. If you do not know the answer based on the context, say "I couldn't find an answer in the provided documents.". Be concise and helpful.`;

      const userQuery = `Relevant context: \n${context}\n\nQuestion: ${question}`;

      const completion = await groq.chat.completions.create({
          messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: 'user', content: userQuery }
          ],
          model: "llama3-8b-8192",
      });

      const answer = completion.choices[0].message.content;

      await prisma.user.update({
          where: { id: owner.id },
          data: { requestsLeft: { decrement: 1 } },
      });

      res.status(200).json({
          success: true,
          answer: answer,
      });

  } catch (error) {
      console.error("Error in retrivePdf:", error);
      res.status(500).json({ success: false, message: "An internal server error occurred." });
  }
};



  // Demo bot use on the bot detailed page
  export const retrivePdfDemo = async (req, res) => {
    try {
    const { question, botName } = req.body;
  
      const relevantChunks = await vectorStore.similaritySearch(
        question,
        3, // Number of chunks to retrieve
        { botName: botName } // <-- Here filtering done
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

  // Get a specific bot by ID
  export const getBot = async (req, res) => {
    try {
      const userId = req.id;
      const { botId } = req.params;

      if (!botId) {
        return res.status(400).json({ success: false, message: "Bot ID is required." });
      }

      const bot = await prisma.bot.findUnique({
        where: {
          id: botId,
        },
      });

      if (!bot) {
        return res.status(404).json({ success: false, message: "Bot not found." });
      }

      // Check if the user owns this bot
      if (bot.ownerId !== userId) {
        return res.status(403).json({ success: false, message: "You are not authorized to access this bot." });
      }

      res.status(200).json({
        success: true,
        bot: bot,
      });

    } catch (error) {
      console.error("Error getting bot:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the bot.",
      });
    }
  };

  // Get all bots for a user
  export const getUserBots = async (req, res) => {
    try {
      const userId = req.id;

      const bots = await prisma.bot.findMany({
        where: {
          ownerId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).json({
        success: true,
        bots: bots,
      });

    } catch (error) {
      console.error("Error getting user bots:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching your bots.",
      });
    }
  };


  