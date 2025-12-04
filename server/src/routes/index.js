import { Router } from 'express';

import authRoutes from './authRoutes.js';
import chatRoutes from './chatRoutes.js';
import userRoutes from './userRoutes.js';
import groupRoutes from './groupRoutes.js';
// import messageRoutes from './messageRoutes.js';
import donationRoutes from './donationRoutes.js';
import helpRequestRoutes from './helpRequestRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import kycRoutes from './kycRoutes.js';
import adminRoutes from './adminRoutes.js';
import fundRoutes from './fundRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
// router.use('/messages', messageRoutes);
router.use('/donations', donationRoutes);
router.use('/help', helpRequestRoutes);
router.use('/notifications', notificationRoutes);
router.use('/kyc', kycRoutes);
router.use('/admin', adminRoutes);
router.use('/funds', fundRoutes);
router.use('/upload', uploadRoutes);

export default router;
