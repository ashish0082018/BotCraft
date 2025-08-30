import express from "express"

import { retrivePdf } from "../controllers/botcontroller.js";
// import isauthenticated from "../middleware/isAuthenticated.js";

const router=express.Router();

router.route("/bot").post(retrivePdf);




export default router

