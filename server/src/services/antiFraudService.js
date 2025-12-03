import FraudEvent from '../models/FraudEvent.js';
import KycRecord from '../models/KycRecord.js';
import HelpRequest from '../models/HelpRequest.js';
import DeviceFingerprint from '../models/DeviceFingerprint.js';
import crypto from 'crypto';

// simple fingerprint from IP + UA
export const buildFingerprint = (req) => {
  const raw = `${req.ip || ''}|${req.headers['user-agent'] || ''}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
};

// -------------------------------
// KYC Fraud Analysis
// -------------------------------
export const analyzeKycSubmission = async (user, kycData) => {
  let score = 0;
  const flags = [];

  // 1. Duplicate ID number used by multiple users
  const duplicate = await KycRecord.findOne({
    idNumber: kycData.idNumber,
    userId: { $ne: user._id },
  });

  if (duplicate) {
    score += 50;
    flags.push('ID number already used by another account');

    await FraudEvent.create({
      userId: user._id,
      type: 'DUPLICATE_KYC',
      severity: 'HIGH',
      details: { idNumber: kycData.idNumber },
    });
  }

  return { score, flags };
};

// -------------------------------
// Help Request Fraud Analysis
// -------------------------------
export const analyzeHelpRequest = async (user, helpData) => {
  let score = 0;
  const flags = [];

  // 1. Too many requests in short time
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const recentRequests = await HelpRequest.countDocuments({
    userId: user._id,
    createdAt: { $gte: since },
  });

  if (recentRequests > 2) {
    score += 30;
    flags.push('More than 2 help requests in last 30 days');

    await FraudEvent.create({
      userId: user._id,
      type: 'TOO_MANY_REQUESTS',
      severity: 'MEDIUM',
      details: { recentRequests },
    });
  }

  // 2. Very high requested amount
  if (helpData.amountRequested > 2000) {
    score += 20;
    flags.push('High amount requested (> $2000)');
  }

  // 3. Suspicious vague description (very short)
  if ((helpData.description || '').length < 40) {
    score += 10;
    flags.push('Very short description');
  }

  let action = 'ALLOW';

  if (score >= 60) action = 'BLOCK';
  else if (score >= 30) action = 'FLAG';

  return { score, flags, action };
};

// -------------------------------
// Device / Multi-account analysis
// -------------------------------
export const trackDevice = async (userId, req) => {
  const fingerprint = buildFingerprint(req);

  const existing = await DeviceFingerprint.findOne({ fingerprint });

  await DeviceFingerprint.create({
    userId,
    fingerprint,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  // fingerprint already tied to a different user -> suspicious
  if (existing && existing.userId.toString() !== userId.toString()) {
    await FraudEvent.create({
      userId,
      type: 'DEVICE_SHARED',
      severity: 'MEDIUM',
      details: {
        fingerprint,
        otherUserId: existing.userId,
      },
    });

    return { shared: true, otherUserId: existing.userId };
  }

  return { shared: false };
};
