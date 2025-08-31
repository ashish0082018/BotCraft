import express from "express"
import { signIn, signOut, signUp, getUserStats } from "../controllers/usercontroller.js";
import isauthenticated from "../middlewares/isAuthenticated.js";

const router=express.Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/signout").get(signOut);
router.route("/stats").get(isauthenticated, getUserStats);



export default router

