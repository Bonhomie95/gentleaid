import { Router } from 'express';
import {
  donate,
  getPoolToday,
  getMyDonations,
} from '../controllers/donationController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, donate);
router.get('/mine', authMiddleware, getMyDonations);
router.get('/pool/today', getPoolToday);

export default router;
