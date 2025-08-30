import express from "express"
import { signIn, signUp } from "../controllers/usercontroller.js";
// import isauthenticated from "../middleware/isAuthenticated.js";

const router=express.Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);



export default router

