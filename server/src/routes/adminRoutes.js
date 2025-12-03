import { Router } from 'express';
import {
  reviewKyc,
  getPendingKyc,
  reviewHelpRequest,
  getPendingHelpRequests,
  completeHelpRequest,
} from '../controllers/adminReviewController.js';

import { adminAuth } from '../middlewares/adminAuth.js';

const router = Router();

// KYC
router.get('/kyc/pending', adminAuth, getPendingKyc);
router.post('/kyc/review', adminAuth, reviewKyc);

// Help Requests
router.get('/help/pending', adminAuth, getPendingHelpRequests);
router.post('/help/review', adminAuth, reviewHelpRequest);
router.post('/help/complete', adminAuth, completeHelpRequest);

export default router;
