import { Router } from 'express';
import { getMessages } from '../controllers/messageController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/:groupId', authMiddleware, getMessages);

export default router;
