import express from "express";
import multer from "multer"; 
import isauthenticated from "../middlewares/isAuthenticated.js";
import { createBot, deleteBot, getBotDetails, getWidgetConfig, retrivePdfDemo, serveWidget, toggleBotStatus, updateBotCustomization } from "../controllers/botcontroller.js"; // Sahi function ka naam `uploadPdf` hai

const router = express.Router();

// Step 2: Multer ko memory storage ke liye configure karein
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.route("/uploadpdf").post(isauthenticated, upload.single('pdfFile'), createBot); // Corrected function name and added middleware
router.route("/delete/:botId").get(isauthenticated, deleteBot);
router.route("/widget.js").get(serveWidget);
router.route("/widget-config").get(getWidgetConfig);
router.route("/toggle-status/:botId").post(isauthenticated, toggleBotStatus);
router.route("/update-customization/:botId").post(isauthenticated, updateBotCustomization);
router.route("/test-bot/:botId").post(isauthenticated, retrivePdfDemo);
router.route("/get-bot-details/:botId").get(isauthenticated, getBotDetails);
export default router;