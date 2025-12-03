import { Router } from 'express';
import {
  createHelpRequest,
  getMyRequests,
  getAllRequests,
  getSingleRequest,
} from '../controllers/helpRequestController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, createHelpRequest);
router.get('/mine', authMiddleware, getMyRequests);

// Admin view later
router.get('/all', authMiddleware, getAllRequests);

router.get('/:id', authMiddleware, getSingleRequest);

export default router;
