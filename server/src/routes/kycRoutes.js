import { Router } from 'express';
import {
  submitKyc,
  getMyKycStatus,
  reviewKyc,
} from '../controllers/kycController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadKyc } from '../middlewares/uploadKyc.js';

const router = Router();

// Upload 3 files: idFront, idBack, selfie
router.post(
  '/submit',
  authMiddleware,
  uploadKyc.fields([
    { name: 'idFront', maxCount: 1 },
    { name: 'idBack', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]),
  submitKyc
);

router.get('/status', authMiddleware, getMyKycStatus);

// Admin endpoint (will secure later)
router.post('/review', reviewKyc);

export default router;
