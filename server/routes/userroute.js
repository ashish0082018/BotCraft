import express from "express"
import { signIn, signOut, signUp, getUserStats, getUserData } from "../controllers/usercontroller.js";
import isauthenticated from "../middlewares/isAuthenticated.js";
import { createOrder } from "../controllers/paymentcontroller.js";

const router=express.Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/signout").get(signOut);
// router.route("/stats").get(isauthenticated, getUserStats);
router.route("/createorder").post(createOrder);
router.route("/dashboard").get(isauthenticated, getUserData);



export default router

