import KycRecord from '../models/KycRecord.js';
import HelpRequest from '../models/HelpRequest.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { createNotification } from '../services/notificationService.js';

export const reviewKyc = async (req, res) => {
  const { userId, status, adminNotes } = req.body;

  const kyc = await KycRecord.findOne({ userId });
  if (!kyc) return res.status(404).json({ message: 'KYC not found' });

  kyc.status = status;
  kyc.adminNotes = adminNotes || '';
  await kyc.save();

  // Update user KYC status
  await User.findByIdAndUpdate(userId, {
    isKycVerified: status === 'VERIFIED',
  });

  // Log it
  await AuditLog.create({
    adminId: req.adminId,
    action: `KYC ${status}`,
    targetType: 'KYC',
    targetId: userId,
    details: { adminNotes },
  });

  // Notify user
  await createNotification(userId, {
    type: 'SYSTEM',
    title: 'KYC Update',
    message:
      status === 'VERIFIED'
        ? 'Your KYC was successfully verified!'
        : 'Your KYC submission was rejected. Please re-submit.',
  });

  res.json({ message: 'KYC reviewed', kyc });
};

export const reviewHelpRequest = async (req, res) => {
  const { requestId, status, adminNotes } = req.body;

  const help = await HelpRequest.findById(requestId);
  if (!help) return res.status(404).json({ message: 'Help request not found' });

  help.status = status; // APPROVED or DECLINED
  help.adminNotes = adminNotes || '';
  await help.save();

  // Log
  await AuditLog.create({
    adminId: req.adminId,
    action: `HELP_REQUEST ${status}`,
    targetType: 'HELP_REQUEST',
    targetId: requestId,
    details: { adminNotes },
  });

  // Notify user
  await createNotification(help.userId, {
    type: 'HELP_REQUEST',
    title: `Your Request was ${status}`,
    message:
      status === 'APPROVED'
        ? 'Your help request has been approved!'
        : 'Your help request was declined.',
    link: `/help/${help._id}`,
  });

  res.json({ message: 'Help request reviewed', help });
};

export const completeHelpRequest = async (req, res) => {
  const { requestId } = req.body;

  const help = await HelpRequest.findById(requestId);
  if (!help) return res.status(404).json({ message: 'Request not found' });

  help.status = 'COMPLETED';
  await help.save();

  await AuditLog.create({
    adminId: req.adminId,
    action: 'HELP_REQUEST COMPLETED',
    targetType: 'HELP_REQUEST',
    targetId: requestId,
  });

  await createNotification(help.userId, {
    type: 'HELP_REQUEST',
    title: 'Support Delivered',
    message: 'Your help request has been marked as completed.',
    link: `/help/${help._id}`,
  });

  res.json({ message: 'Help request marked as completed', help });
};

export const getPendingKyc = async (req, res) => {
  const list = await KycRecord.find({ status: 'PENDING' })
    .populate('userId', 'username firstName lastName phone')
    .sort({ createdAt: 1 });

  res.json(list);
};

export const getPendingHelpRequests = async (req, res) => {
  const list = await HelpRequest.find({ status: 'PENDING' }).sort({
    priorityScore: -1,
    createdAt: 1,
  });

  res.json(list);
};
