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


// Uplaod the pdf and save to the pinecone db
// Initialize Cohere Embeddings
const embeddings = new CohereEmbeddings({
    model: "embed-english-v3.0",
    apiKey: process.env.COHERE_API_KEY, 
  });
  
  // Initialize Pinecone Client
  const pinecone = new PineconeClient({
    apiKey: process.env.PINECONE_API_KEY, 
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
 
/*export const createBot = async (req, res) => {
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
*/

// User the web crawler to fetch the data from the web
export const createBot = async (req, res) => {
  try {
      const userId = req.id;
      const { botName, url } = req.body;

      if (!botName) return res.status(400).json({ error: "botName is required." });
      if (!req.file && !url) return res.status(400).json({ error: "Please provide a PDF file or a URL." });

      const newApiKey = `sa-${uuidv4()}`;
      let doc;
      const source = req.file ? req.file.originalname : url;

      if (req.file) {
          const blob = new Blob([req.file.buffer], { type: 'application/pdf' });
          const loader = new PDFLoader(blob, { splitPages: false });
          doc = await loader.load();
      } else {
          const loader = new PlaywrightWebBaseLoader(url, {
              evaluate: async (page) => await page.evaluate(() => document.body.innerText),
          });
          doc = await loader.load();
      }

      const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 100 });
      const texts = await textSplitter.splitText(doc[0].pageContent);

      const documents = texts.map((chunk) => ({
          pageContent: chunk,
          metadata: { source: source, apiKey: newApiKey },
      }));
      
      await vectorStore.addDocuments(documents);

      const newBot = await prisma.bot.create({
          data: {
              name: botName,
              owner: { connect: { id: userId } },
              trainedSources: [source], // Training source ko save karein
              apiKey: { create: { key: newApiKey } }
          },
          include: { apiKey: true }
      });

      res.status(201).json({
          success: true,
          message: `Bot '${newBot.name}' created successfully.`,
          bot: { id: newBot.id, name: newBot.name },
          apiKey: newBot.apiKey.key
      });

  } catch (error) {
      console.error("Error in createBot function:", error);
      res.status(500).json({ success: false, message: "Error creating bot." });
  }
};



//IMPORTANT SECTION
// Retrive the pdf from the pinecone db
const groq = new Groq({ apiKey:process.env.GROQ_API_KEY });


export const retrivePdf = async (req, res) => {
  try {
      const authHeader = req.headers['authorization'];
      const apiKey = authHeader?.split(' ')[1];
      const { question } = req.body;

      if (!apiKey || !question) return res.status(400).json({ success: false, message: "API key and question are required." });

      const apiKeyRecord = await prisma.apiKey.findUnique({
          where: { key: apiKey },
          include: { bot: { include: { owner: true } } }
      });

      if (!apiKeyRecord?.bot?.owner) return res.status(401).json({ success: false, message: "Invalid API Key." });
      
      const { bot, bot: { owner } } = apiKeyRecord;

      // CRITICAL: Check if the bot is active
      if (bot.status !== 'ACTIVE') {
          return res.status(403).json({ success: false, answer: "This bot is currently inactive." });
      }

      if (owner.requestsLeft <= 0) return res.status(403).json({ success: false, message: "Request limit exceeded." });
      
      const relevantChunks = await vectorStore.similaritySearch(question, 3, { apiKey: apiKey });
      const context = relevantChunks.length > 0 ? relevantChunks.map(chunk => chunk.pageContent).join('\n\n') : "No relevant context found.";
      const SYSTEM_PROMPT = `You are a helpful assistant. Use the following context to answer the question. If you don't know the answer, say so.`;
      const userQuery = `Context: \n${context}\n\nQuestion: ${question}`;

      const completion = await groq.chat.completions.create({
          messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: 'user', content: userQuery }],
          model: "llama-3.1-8b-instant",
      });
      const answer = completion.choices[0].message.content;

      // Update stats and credits in parallel for speed
      await Promise.all([
          prisma.bot.update({
              where: { id: bot.id },
              data: { totalQueries: { increment: 1 }, lastActivityAt: new Date() },
          }),
          prisma.user.update({
              where: { id: owner.id },
              data: { requestsLeft: { decrement: 1 } },
          })
      ]);

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).json({ success: true, answer: answer });

  } catch (error) {
      console.error("Error in retrivePdf:", error);
      res.status(500).json({ success: false, message: "An internal server error occurred." });
  }
};



  // Demo bot use on the bot detailed page
export const retrivePdfDemo = async (req, res) => {
    try {
        const userId = req.id;
        const { botId } = req.params;
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ success: false, message: "Question is required." });
        }
        
        if (!botId) {
            return res.status(400).json({ success: false, message: "Bot ID is required." });
        }
        
        // Security: Find bot and check ownership
        const bot = await prisma.bot.findFirst({
            where: { id: botId, ownerId: userId },
            include: { apiKey: true }
        });

        if (!bot) {
            return res.status(404).json({ success: false, message: "Bot not found or you are not the owner." });
        }

        if (!bot.apiKey) {
            return res.status(404).json({ success: false, message: "Bot API key is missing." });
        }

        // For now, provide a demo response since vector store might not be set up
        // TODO: Implement actual vector search when vector store is configured
        let answer;
        
        try {
            // Try to use vector store if available
            if (typeof vectorStore !== 'undefined' && vectorStore.similaritySearch) {
                const relevantChunks = await vectorStore.similaritySearch(question, 3, { apiKey: bot.apiKey.key });
                const context = relevantChunks.map(chunk => chunk.pageContent).join('\n\n'); 
                const SYSTEM_PROMPT = `You are an AI assistant trained on specific documents. Use the following context to answer the question. If the context doesn't contain relevant information, say so politely.`;
                const userQuery = `Question: ${question}\nRelevant context: ${context}`;
                
                // Try to use Groq if available
                if (typeof groq !== 'undefined' && groq.chat) {
                    const completion = await groq.chat.completions.create({
                        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: 'user', content: userQuery }],
                        model: "llama-3.1-8b-instant",
                    });
                    answer = completion.choices[0].message.content;
                } else {
                    // Fallback response when Groq is not available
                    answer = `I understand you're asking: "${question}". Based on the documents I've been trained on, I can provide relevant information. This is a demo response showing how the bot would interact with your trained content. In a production environment, I would search through your documents and provide specific answers.`;
                }
            } else {
                // Fallback when vector store is not available
                answer = `I understand you're asking: "${question}". This is a demo response. In the full implementation, I would search through your trained documents and provide specific answers based on the content. The vector store integration will enable me to access and reference your actual document content.`;
            }
        } catch (vectorError) {
          
            answer = `I understand you're asking: "${question}". This is a demo response. The AI service is currently being configured. Once fully set up, I'll be able to search through your documents and provide specific, accurate answers based on your content.`;
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({ success: true, answer: answer });
    } catch (error) {
        console.error("Error in retrivePdfDemo:", error);
        res.status(500).json({ success: false, message: "An error occurred while processing your question." });
    }
};

  // Delete the bot  and data form the the pinecone db
  export const deleteBot = async (req, res) => {
    try {
        const userId = req.id; 
        const { botId } = req.params;

        if (!botId) return res.status(400).json({ success: false, message: "Bot ID is required." });
        
        const bot = await prisma.bot.findFirst({
            where: { id: botId, ownerId: userId },
            include: { apiKey: true }
        });

        if (!bot) return res.status(404).json({ success: false, message: "Bot not found or you are not the owner." });
        
        // Pinecone se vectors delete karein using unique API key
        if (bot.apiKey?.key) {
            await pineconeIndex.deleteMany({ apiKey: bot.apiKey.key });
        }
        
        // Database se bot delete karein (ApiKey apne aap delete ho jaayega "onDelete: Cascade" ki wajah se)
        await prisma.bot.delete({ where: { id: botId } });
        
        res.status(200).json({ success: true, message: `Bot '${bot.name}' has been deleted.` });
    } catch (error) {
        console.error("Error deleting bot:", error);
        res.status(500).json({ success: false, message: "Error deleting the bot." });
    }
};

  // Get a specific bot by ID
  export const getBotDetails = async (req, res) => {
    try {
        const userId = req.id;
        const { botId } = req.params;

        if (!botId) return res.status(400).json({ success: false, message: "Bot ID is required." });

        const bot = await prisma.bot.findUnique({
            where: { id: botId, ownerId: userId },
            include: { apiKey: true },
        });

        if (!bot) return res.status(404).json({ success: false, message: "Bot not found or you are not the owner." });
        
        const botDetails = {
            id: bot.id,
            name: bot.name,
            createdAt: bot.createdAt,
            apiKey: bot.apiKey ? bot.apiKey.key : "Not available",
            stats: {
                status: bot.status,
                totalQueries: bot.totalQueries,
                lastActivityAt: bot.lastActivityAt,
            },
            customization: {
                primaryColor: bot.primaryColor,
                headerText: bot.headerText,
                initialMessage: bot.initialMessage,
            },
            trainedSources: bot.trainedSources
        };

        res.status(200).json({ success: true, data: botDetails });
    } catch (error) {
        console.error("Error in getBotDetails:", error);
        res.status(500).json({ success: false, message: "Error fetching bot details." });
    }
};

 


export const getWidgetConfig = async (req, res) => {
  try {
      const { apiKey } = req.query;
      if (!apiKey) return res.status(400).json({ message: "API Key is required." });

      const apiKeyRecord = await prisma.apiKey.findUnique({
          where: { key: apiKey },
          include: {
              bot: {
                  select: { primaryColor: true, headerText: true, initialMessage: true }
              }
          }
      });

      if (!apiKeyRecord?.bot) return res.status(404).json({ message: "Configuration not found." });

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).json(apiKeyRecord.bot);
  } catch (error) {
      console.error("Error fetching widget config:", error);
      res.status(500).json({ message: "Server Error" });
  }
};


export const updateBotCustomization = async (req, res) => {
  try {
      const userId = req.id;
      const { botId } = req.params;
      const { primaryColor, headerText, initialMessage } = req.body;

      const bot = await prisma.bot.findFirst({ where: { id: botId, ownerId: userId } });
      if (!bot) return res.status(404).json({ success: false, message: "Bot not found or you are not the owner." });

      const updatedBot = await prisma.bot.update({
          where: { id: botId },
          data: { primaryColor, headerText, initialMessage },
      });

      res.status(200).json({ success: true, message: "Customization updated!", data: updatedBot });
  } catch (error) {
      console.error("Error updating bot customization:", error);
      res.status(500).json({ success: false, message: "An error occurred." });
  }
};

// ==========================================================
//  9. NEW - Bot ka Status Toggle Karne ka Function
// ==========================================================
export const toggleBotStatus = async (req, res) => {
  try {
      const userId = req.id;
      const { botId } = req.params;
      const { status } = req.body;

      if (!status || (status !== 'ACTIVE' && status !== 'INACTIVE')) {
          return res.status(400).json({ success: false, message: "Invalid status provided." });
      }

      const bot = await prisma.bot.findFirst({ where: { id: botId, ownerId: userId } });
      if (!bot) return res.status(404).json({ success: false, message: "Bot not found or you are not the owner." });

      const updatedBot = await prisma.bot.update({
          where: { id: botId },
          data: { status: status },
      });

      res.status(200).json({ success: true, message: `Bot status updated to ${updatedBot.status}`, newStatus: updatedBot.status });
  } catch (error) {
      console.error("Error toggling bot status:", error);
      res.status(500).json({ success: false, message: "An error occurred." });
  }
};



// controllers/botcontroller.js

// controllers/botcontroller.js

export const serveWidget = (req, res) => {
    // Step 1: Server par HTML aur CSS ko strings mein prepare karein
    const widgetHTML = `
        <div id="botcraft-chat-icon" class="chat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg>
        </div>
        <div id="botcraft-widget-container">
            <div class="chat-widget">
                <div class="chat-header">
                    <h3 class="header-title"></h3> 
                    <button class="close-btn">&times;</button>
                </div>
                <div class="chat-body">
                    <div class="message assistant initial-message"></div>
                </div>
                <div class="chat-footer">
                    <form id="chat-form">
                        <input type="text" id="chat-input" placeholder="Ask a question..." autocomplete="off" required>
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    // === COMPLETE CSS STARTS HERE ===
    const widgetCSS = `
        .chat-widget, .chat-icon { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        .chat-icon { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background-color: var(--primary-color, #007bff); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9998; transition: transform 0.2s ease-in-out; }
        .chat-icon:hover { transform: scale(1.1); }
        .chat-widget { position: fixed; bottom: 90px; right: 20px; width: 350px; max-width: calc(100% - 40px); height: 500px; background-color: white; border-radius: 15px; box-shadow: 0 5px 25px rgba(0,0,0,0.2); display: flex; flex-direction: column; overflow: hidden; transform: scale(0); transform-origin: bottom right; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 9999; }
        .chat-widget.open { transform: scale(1); }
        .chat-header { background: var(--primary-color, #007bff); color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center; }
        .chat-header h3 { margin: 0; font-size: 18px; font-weight: 600; }
        .chat-header .close-btn { background: none; border: none; color: white; opacity: 0.8; font-size: 24px; cursor: pointer; transition: opacity 0.2s; }
        .chat-body { flex-grow: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background-color: #f9f9f9; }
        .message { padding: 10px 15px; border-radius: 18px; max-width: 85%; line-height: 1.5; word-wrap: break-word; }
        .message.user { background-color: var(--primary-color, #007bff); color: white; align-self: flex-end; border-bottom-right-radius: 5px; }
        .message.assistant { background-color: #e9e9eb; color: #333; align-self: flex-start; border-bottom-left-radius: 5px; }
        .message.loading { align-self: flex-start; background: #e9e9eb; padding: 12px 15px; border-radius: 18px; }
        .message.loading span { display: inline-block; width: 8px; height: 8px; background-color: #999; border-radius: 50%; animation: bounce 1.2s infinite ease-in-out; }
        .message.loading span:nth-child(2) { animation-delay: -0.2s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        .chat-footer { padding: 10px; border-top: 1px solid #ddd; background: #fff; }
        #chat-form { display: flex; align-items: center; }
        #chat-input { flex-grow: 1; border: 1px solid #ccc; border-radius: 20px; padding: 10px 15px; font-size: 16px; transition: border-color 0.2s; }
        #chat-input:focus { border-color: var(--primary-color, #007bff); outline: none; }
        #chat-form button { background-color: var(--primary-color, #007bff); border: none; color: white; border-radius: 8px; width: 50px; height: 40px; margin-left: 10px; cursor: pointer; font-weight: bold; display: flex; justify-content: center; align-items: center; transition: background-color 0.2s; }
    `;
    // === COMPLETE CSS ENDS HERE ===

    const widgetScript = `
(async function() {
    const scriptTag = document.currentScript;
    const apiKey = scriptTag.getAttribute('data-api-key');
    if (!apiKey) return console.error("Botcraft API key is missing.");

    let config = {
        primaryColor: '#007bff',
        headerText: 'Chat with AI',
        initialMessage: 'Hi! How can I help you today?'
    };

    try {
        const response = await fetch(\`https://botcraft-k4ri.onrender.com/api/v2/bot/widget-config?apiKey=\${apiKey}\`);
        if (response.ok) {
            const fetchedConfig = await response.json();
            config = { ...config, ...fetchedConfig };
        }
    } catch (error) {
        console.error("Could not load bot configuration.", error);
    }

    const finalHTML = \`${widgetHTML}\`;
    const finalCSS = \`${widgetCSS}\`;

    document.body.insertAdjacentHTML('beforeend', finalHTML);
    const styleTag = document.createElement('style');
    styleTag.innerHTML = finalCSS;
    document.head.appendChild(styleTag);
    
    // Apply the primary color to both the widget container and the chat icon
    const widgetContainer = document.getElementById('botcraft-widget-container');
    const chatIcon = document.getElementById('botcraft-chat-icon');
    
    // Set CSS custom property for the entire widget
    document.documentElement.style.setProperty('--primary-color', config.primaryColor);
    
    // Also set it specifically on the chat icon for better compatibility
    chatIcon.style.backgroundColor = config.primaryColor;
    
    widgetContainer.querySelector('.header-title').textContent = config.headerText;
    widgetContainer.querySelector('.initial-message').textContent = config.initialMessage;
    
    // === COMPLETE JAVASCRIPT LOGIC STARTS HERE ===
    const chatWidget = widgetContainer.querySelector('.chat-widget');
    const closeBtn = widgetContainer.querySelector('.close-btn');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBody = widgetContainer.querySelector('.chat-body');

    chatIcon.addEventListener('click', () => chatWidget.classList.toggle('open'));
    closeBtn.addEventListener('click', () => chatWidget.classList.remove('open'));
    
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;
        appendMessage(userMessage, 'user');
        chatInput.value = '';
        showLoadingIndicator();
        try {
            const response = await fetch('https://botcraft-k4ri.onrender.com/api/v/bot', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${apiKey}\` },
                body: JSON.stringify({ question: userMessage })
            });
            removeLoadingIndicator();
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            appendMessage(data.answer, 'assistant');
        } catch (error) {
            removeLoadingIndicator();
            appendMessage('Sorry, something went wrong.', 'assistant');
        }
    });

    function appendMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.innerText = text; 
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    function showLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'loading');
        loadingDiv.innerHTML = \`<span></span><span></span><span></span>\`;
        chatBody.appendChild(loadingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    function removeLoadingIndicator() {
        const loadingDiv = chatBody.querySelector('.loading');
        if (loadingDiv) loadingDiv.remove();
    }
    // === COMPLETE JAVASCRIPT LOGIC ENDS HERE ===
})();
    `;

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(widgetScript);
};
  
 

