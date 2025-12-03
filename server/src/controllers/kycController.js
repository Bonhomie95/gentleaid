import KycRecord from '../models/KycRecord.js';
import User from '../models/User.js';
import { analyzeKycSubmission } from '../services/antiFraudService.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Cloudinary global config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// helper to upload + clean temp
const uploadToCloud = async (path, folder = 'gentelaid/kyc') => {
  const res = await cloudinary.uploader.upload(path, {
    folder,
    resource_type: 'image',
  });
  fs.unlinkSync(path);
  return res.secure_url;
};

// -------------------------------------
// Submit KYC
// -------------------------------------

export const submitKyc = async (req, res) => {
  try {
    const userId = req.userId;
    const { idType, idNumber } = req.body;

    // --- Basic validation ---
    if (!idType || !idNumber) {
      return res.status(400).json({ message: 'Missing ID fields' });
    }

    // --- Ensure user exists ---
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // --- Ensure KYC not already submitted ---
    const existing = await KycRecord.findOne({ userId });
    if (existing) {
      return res.status(400).json({
        message: 'KYC already submitted',
        status: existing.status,
      });
    }

    // --- Extract uploaded file paths ---
    const idFrontPath = req.files?.idFront?.[0]?.path;
    const idBackPath = req.files?.idBack?.[0]?.path || null;
    const selfiePath = req.files?.selfie?.[0]?.path;

    if (!idFrontPath || !selfiePath) {
      return res.status(400).json({ message: 'Missing required images' });
    }

    // --- Step 1: Fraud analysis BEFORE upload ---
    const risk = await analyzeKycSubmission(user, {
      idNumber,
      idType,
    });

    // --- Step 2: Upload to Cloudinary (secure_url only) ---
    const idFrontUrl = await uploadToCloud(idFrontPath);
    const idBackUrl = idBackPath ? await uploadToCloud(idBackPath) : null;
    const selfieUrl = await uploadToCloud(selfiePath);

    // --- Step 3: Save KYC record ---
    const kyc = await KycRecord.create({
      userId,
      idType,
      idNumber,
      idFrontImage: idFrontUrl,
      idBackImage: idBackUrl,
      selfieImage: selfieUrl,
      fraudScore: risk.score,
      fraudFlags: risk.flags,
      status: risk.score >= 50 ? 'REVIEWING' : 'PENDING',
    });

    // --- Step 4: Respond to client ---
    res.json({
      message:
        risk.score >= 50
          ? 'KYC submitted but flagged for manual review.'
          : 'KYC submitted. Awaiting review.',
      flags: risk.flags,
      kyc,
    });
  } catch (err) {
    console.error('KYC ERROR:', err);
    res.status(500).json({ message: 'Server error during KYC' });
  }
};

// -------------------------------------
// Get my KYC status
// -------------------------------------
export const getMyKycStatus = async (req, res) => {
  const userId = req.userId;

  const kyc = await KycRecord.findOne({ userId });
  if (!kyc) return res.json({ status: 'NOT_SUBMITTED' });

  res.json(kyc);
};

// -------------------------------------
// Admin: Review KYC
// -------------------------------------
export const reviewKyc = async (req, res) => {
  const { userId, status, adminNotes } = req.body;

  if (!['VERIFIED', 'FAILED'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const kyc = await KycRecord.findOne({ userId });
  if (!kyc) return res.status(404).json({ message: 'KYC record not found' });

  kyc.status = status;
  kyc.adminNotes = adminNotes || '';
  await kyc.save();

  // Update user model
  await User.findByIdAndUpdate(userId, {
    isKycVerified: status === 'VERIFIED',
  });

  res.json({ message: 'KYC reviewed', kyc });
};
