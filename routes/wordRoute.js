import express from "express";
import {
  checkAccessToken,
  checkAdminAccessToken,
} from "../middleware/authMiddleware.js";
import {
  getAllKey,
  getWord,
  createWord,
  udms,
  udls,
  pendingWord,
  testWord,getAllPendingWord,deteleWord,getTopUsers
} from "../controllers/wordController.js";

const router = express.Router();

router.get("/", checkAccessToken, getAllKey);
router.get("/getWord", checkAccessToken, getWord);
router.get("/getAllPendingWord", checkAdminAccessToken, getAllPendingWord);
router.get("/getTopUsers",checkAccessToken, getTopUsers);


router.post("/testWord",checkAccessToken, testWord);


router.post("/createWord", checkAdminAccessToken, createWord);

router.post("/pendingWord", checkAccessToken, pendingWord);

router.post("/udms/:id", checkAccessToken, udms);
router.post("/udls/:id", checkAccessToken, udls);


router.delete("/deteleWord/:id",checkAdminAccessToken,deteleWord)

export default router;
