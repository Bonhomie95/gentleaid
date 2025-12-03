import Donation from '../models/Donation.js';
import PoolSummary from '../models/PoolSummary.js';
import dayjs from 'dayjs';

// ------------------------------
// Donate
// ------------------------------
export const donate = async (req, res) => {
  const userId = req.userId;
  const { amount } = req.body;

  if (!amount || amount < 0.5) {
    return res.status(400).json({ message: 'Minimum donation is $0.50' });
  }

  if (amount > 5000) {
    return res.status(400).json({ message: 'Maximum donation is $5000' });
  }

  const platformShare = amount * 0.2;
  const userPoolShare = amount * 0.8;

  // Save donation
  const donation = await Donation.create({
    donorId: userId,
    amount,
    platformShare,
    userPoolShare,
  });

  // Update daily summary
  const today = dayjs().format('YYYY-MM-DD');
  const summary = await PoolSummary.findOne({ date: today });

  if (summary) {
    summary.totalDonations += amount;
    summary.totalUserPool += userPoolShare;
    summary.totalPlatform += platformShare;
    await summary.save();
  } else {
    await PoolSummary.create({
      date: today,
      totalDonations: amount,
      totalUserPool: userPoolShare,
      totalPlatform: platformShare,
    });
  }

  res.json({
    message: 'Donation successful',
    donation,
  });
};

// ------------------------------
// Get Daily Pool Summary
// ------------------------------
export const getPoolToday = async (req, res) => {
  const today = dayjs().format('YYYY-MM-DD');
  const summary = await PoolSummary.findOne({ date: today });

  res.json(summary || { total: 0, userPool: 0, platform: 0 });
};

// ------------------------------
// Donation History
// ------------------------------
export const getMyDonations = async (req, res) => {
  const list = await Donation.find({ donorId: req.userId }).sort({
    createdAt: -1,
  });
  res.json(list);
};


