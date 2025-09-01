console.log("!!!!!!!!!! FILE IS SAVED AND RUNNING !!!!!!!!!!");
import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import userRouter from "./routes/userroute.js"
import botRouter from "./routes/botroute.js"
import apiRouter from "./routes/apiroute.js"
import cookieParser from 'cookie-parser';
import path from "path"
dotenv.config()

const app=express();
const PORT=process.env.PORT || 8000;
const __dirname=path.resolve(); 
app.use(cors());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://botcraft-k4ri.onrender.com'
        : ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use("/api/v1/user",userRouter);
app.use("/api/v2/bot",botRouter);
app.use("/api/v",apiRouter);


app.use(express.static(path.join(__dirname,"/client/dist")));

// Serve React app for frontend routes (excluding API routes)
app.get("/dashboard", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

app.get("/dashboard/:path", (req, res) => {
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

app.listen(PORT,()=>{
    console.log(`server connected at ${PORT}`);
    
})