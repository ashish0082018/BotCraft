import express from "express"
import { signIn, signOut, signUp,  getUserData } from "../controllers/usercontroller.js";
import isauthenticated from "../middlewares/isAuthenticated.js";
import { createOrder, getKey, verifyOrder } from "../controllers/paymentcontroller.js";

const router=express.Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/createorder").post(isauthenticated, createOrder);
router.route("/verifyorder").post(isauthenticated, verifyOrder);
router.route("/dashboard").get(isauthenticated, getUserData);
router.route("/getkey").get(getKey);



export default router

