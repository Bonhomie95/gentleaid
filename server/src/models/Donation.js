import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.5,
    },

    currency: {
      type: String,
      default: 'USD',
    },

    platformShare: {
      type: Number,
      required: true,
    },

    userPoolShare: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ['manual', 'crypto', 'stripe', 'paystack'],
      default: 'manual',
    },

    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Donation', donationSchema);
