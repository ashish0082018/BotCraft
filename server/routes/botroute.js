import express from "express";
import multer from "multer"; 
import isauthenticated from "../middlewares/isAuthenticated.js";
import { createBot, deleteBot, generateApiKey } from "../controllers/botcontroller.js"; // Sahi function ka naam `uploadPdf` hai

const router = express.Router();

// Step 2: Multer ko memory storage ke liye configure karein
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.route("/apikey").get(isauthenticated, generateApiKey);

// Step 3: `upload.single('pdfFile')` middleware ko apne route mein add karein
// Yeh middleware `uploadPdf` controller se theek pehle aayega.
// 'pdfFile' woh key hai jiska use hum Postman mein file bhejne ke liye karenge.
router.route("/uploadpdf").post(isauthenticated, upload.single('pdfFile'), createBot); // Corrected function name and added middleware
router.route("/delete/:botId").get(isauthenticated, deleteBot);
export default router;