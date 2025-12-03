import mongoose from 'mongoose';

const payoutLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    helpRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HelpRequest',
    },
    amount: Number,
    cycle: { type: String, enum: ['DAILY', 'WEEKLY'] },
  },
  { timestamps: true }
);

export default mongoose.model('PayoutLog', payoutLogSchema);
