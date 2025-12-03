import { Router } from 'express';
import {
  getMyNotifications,
  markAsRead,
  markAllRead,
} from '../controllers/notificationController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getMyNotifications);
router.patch('/read/:id', authMiddleware, markAsRead);
router.patch('/read-all', authMiddleware, markAllRead);

export default router;
