import HelpRequest from '../models/HelpRequest.js';
import User from '../models/User.js';
import { analyzeHelpRequest } from '../services/antiFraudService.js';
import { calculatePriority } from '../services/priorityService.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';

// --------------------------------------------
// Create a help request
// --------------------------------------------
export const createHelpRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, amountRequested } = req.body;

    // Validate input
    if (!title || !description || !amountRequested) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Banned?
    if (user.status === 'BANNED') {
      return res.status(403).json({ message: 'You are banned from applying' });
    }

    // Must be KYC verified
    if (!user.isKycVerified) {
      return res.status(403).json({ message: 'KYC verification required' });
    }

    // Existing active request?
    const active = await HelpRequest.findOne({
      userId,
      status: { $in: ['PENDING', 'REVIEWING'] },
    });
    if (active) {
      return res.status(400).json({
        message: 'You already have an active help request',
        activeRequestId: active._id,
      });
    }

    // Upload attachments
    const uploadedAttachments = [];
    const files = req.files?.attachments || [];

    for (const f of files) {
      const url = await uploadToCloudinary(f.path);
      uploadedAttachments.push({ url, type: 'image' });
    }

    // Fraud analysis
    const risk = await analyzeHelpRequest(user, {
      amountRequested,
      description,
    });

    // Priority scoring
    const { score, reason } = calculatePriority({
      title,
      description,
      amountRequested,
      attachments: uploadedAttachments,
      kycVerified: user.isKycVerified,
    });

    // Risk-based status
    let initialStatus = 'PENDING';
    if (risk.action === 'BLOCK' || risk.action === 'FLAG') {
      initialStatus = 'REVIEWING';
    }

    // Create help request
    const help = await HelpRequest.create({
      userId,
      title,
      description,
      amountRequested,
      attachments: uploadedAttachments,
      kycVerified: user.isKycVerified,
      priorityScore: score,
      reasonForPriority: reason,
      fraudScore: risk.score,
      fraudFlags: risk.flags,
      status: initialStatus,
    });

    res.json({
      message:
        initialStatus === 'REVIEWING'
          ? 'Request submitted and marked for manual review.'
          : 'Help request submitted successfully.',
      flags: risk.flags,
      help,
    });
  } catch (err) {
    console.error('HELP REQUEST ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --------------------------------------------
// Get My Help Requests
// --------------------------------------------
export const getMyRequests = async (req, res) => {
  const list = await HelpRequest.find({ userId: req.userId }).sort({
    createdAt: -1,
  });

  res.json(list);
};

// --------------------------------------------
// Get All Requests (sorted by priority)
// --------------------------------------------
export const getAllRequests = async (req, res) => {
  const list = await HelpRequest.find()
    .sort({ priorityScore: -1, createdAt: -1 })
    .limit(200);

  res.json(list);
};

// --------------------------------------------
// Get One Request
// --------------------------------------------
export const getSingleRequest = async (req, res) => {
  const help = await HelpRequest.findById(req.params.id);

  if (!help) return res.status(404).json({ message: 'Not found' });

  res.json(help);
};
