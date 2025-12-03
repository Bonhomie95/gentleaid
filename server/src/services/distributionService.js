import DonationPool from '../models/DonationPool.js';
import HelpRequest from '../models/HelpRequest.js';
import PayoutLog from '../models/PayoutLog.js';
import { createNotification } from './notificationService.js';

const COMPANY_SHARE_PERCENT = 0.2;
const USER_SHARE_PERCENT = 0.8;

// ------------------------------
// Core distribution function
// ------------------------------
export const distributeFunds = async (mode, io = null) => {
  const today = new Date().toISOString().split('T')[0];

  const pool = await DonationPool.findOne({ date: today });
  if (!pool || pool.totalReceived === 0) {
    return { message: 'No donations available for this cycle' };
  }

  const distributable = pool.totalReceived * USER_SHARE_PERCENT;

  // Get top-priority pending requests
  const requests = await HelpRequest.find({
    status: 'APPROVED',
  })
    .sort({ priorityScore: -1, createdAt: 1 })
    .limit(50);

  let remaining = distributable;

  for (const req of requests) {
    if (remaining <= 0) break;

    const amountToGive = Math.min(req.amountRequested, remaining);

    // Payout log
    await PayoutLog.create({
      userId: req.userId,
      helpRequestId: req._id,
      amount: amountToGive,
      cycle: mode,
    });

    remaining -= amountToGive;

    // If request fully funded → mark completed
    if (amountToGive >= req.amountRequested) {
      req.status = 'COMPLETED';
      await req.save();

      // Notify user
      await createNotification(
        req.userId,
        {
          type: 'HELP_REQUEST',
          title: 'Your request was fully funded 🎉',
          message: `You received $${amountToGive}`,
        },
        io
      );
    } else {
      // Partial funding — reduce amount requested
      req.amountRequested -= amountToGive;
      req.status = 'REVIEWING'; // move back for future cycles
      await req.save();

      await createNotification(
        req.userId,
        {
          type: 'HELP_REQUEST',
          title: 'You received partial support',
          message: `You received $${amountToGive}. Remaining balance: $${req.amountRequested}`,
        },
        io
      );
    }
  }

  // Update pool
  pool.totalAllocated += distributable - remaining;
  await pool.save();

  return {
    message: `${mode} distribution complete`,
    distributed: distributable - remaining,
    leftover: remaining,
  };
};
