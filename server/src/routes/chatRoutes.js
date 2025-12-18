import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  getGroupMessages,
  sendGroupMessage,
} from '../controllers/messageController.js';
import { uploadVoice } from '../controllers/voiceController.js';
import {
  sendDM,
  getDMs,
  getConversations,
  toggleReaction,
} from '../controllers/dmController.js';

const router = express.Router();

router.get('/group/:groupId', authMiddleware, getGroupMessages);
router.post('/group/:groupId', authMiddleware, sendGroupMessage);
router.post('/voice/upload', authMiddleware, uploadVoice);
router.get('/conversations', authMiddleware, getConversations);
router.get('/dm/:conversationId', authMiddleware, getDMs);
router.post('/dm/send', authMiddleware, sendDM);
router.post('/message/:messageId/react', authMiddleware, toggleReaction);

export default router;
