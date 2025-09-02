import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userroute.js";
import botRouter from "./routes/botroute.js";
import apiRouter from "./routes/apiroute.js";
import cookieParser from 'cookie-parser';
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

// === CORS CONFIGURATION START ===

// 1. protected origins ( frontend domain list) 
const protectedOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://botcraft-k4ri.onrender.com'] // Production domain
    : ["http://localhost:3000", "http://localhost:5173"]; // Development domain

// 2. public API routes 
const publicApiRoutes = [
    '/api/v2/bot/widget.js',
    '/api/v2/bot/widget-config',
    '/api/v/bot'
];

// 3. define CORS options in form function
const corsOptions = (req, callback) => {
    const origin = req.header('Origin');
    const path = req.path;

    // Check whether request is for public API route 
    if (publicApiRoutes.includes(path)) {
       
        callback(null, { origin: true, credentials: false });
    } else if (origin && protectedOrigins.includes(origin)) {

        callback(null, { origin: true, credentials: true });
    } else if (!origin && req.method === 'GET') {
       
        callback(null, { origin: true, credentials: true });
    } else {
        
        callback(new Error('Not allowed by CORS'));
    }
};

// use the Global CORS middleware 
app.use(cors(corsOptions));

// === CORS CONFIGURATION END ===

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v2/bot", botRouter);
app.use("/api/v", apiRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

// ... aapke baaki ke app.get routes ...
app.get("/dashboard", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

app.get("/dashboard/:path", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});
app.get("/dashboard/bot/:botId", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});
app.get("/signin", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});


app.listen(PORT, () => {
    console.log(`server connected at ${PORT}`);
});