import express from "express";
import {authMiddleware} from "../middlewares/authMiddleware.js";
import { getGroupMessages, sendGroupMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/group/:groupId", authMiddleware, getGroupMessages);
router.post("/group/:groupId", authMiddleware, sendGroupMessage);

export default router;
