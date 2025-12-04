import { Router } from 'express';
import {
  getMe,
  updateProfile,
  deleteAccount,
} from '../controllers/userController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.patch('/update-profile', authMiddleware, updateProfile);
router.delete('/delete', authMiddleware, deleteAccount);

export default router;
