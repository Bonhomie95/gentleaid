import { Router } from 'express';
import {
  getAllGroups,
  joinGroup,
  leaveGroup,
  getMyGroups,
} from '../controllers/groupController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getAllGroups);

router.get('/mine', authMiddleware, getMyGroups);

router.post('/:groupId/join', authMiddleware, joinGroup);

router.post('/leave', authMiddleware, leaveGroup);

export default router;
