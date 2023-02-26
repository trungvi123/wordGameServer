import express from "express";
import { checkAccessToken } from "../middleware/authMiddleware.js";
import { getAllKey } from "../controllers/wordController.js";

const router = express.Router();

router.get("/",checkAccessToken, getAllKey);


export default router 
