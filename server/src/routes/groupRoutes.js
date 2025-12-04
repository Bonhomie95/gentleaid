import { Router } from 'express';
import {
  getAllGroups,
  joinGroup,
  leaveGroup,
  getMyGroups,
} from '../controllers/groupController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Get all groups + membership + counts
router.get('/', authMiddleware, getAllGroups);

// Get only the groups THIS user belongs to
router.get('/mine', authMiddleware, getMyGroups);

// Join group
router.post('/:groupId/join', authMiddleware, joinGroup);

// Leave group
router.post('/:groupId/leave', authMiddleware, leaveGroup);

export default router;
