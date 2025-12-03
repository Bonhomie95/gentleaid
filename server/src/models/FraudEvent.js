import mongoose from 'mongoose';

const fraudEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'MULTI_ACCOUNT',
        'DUPLICATE_KYC',
        'TOO_MANY_REQUESTS',
        'DEVICE_SHARED',
        'SUSPICIOUS_HELP_REQUEST',
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'LOW',
    },
    details: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model('FraudEvent', fraudEventSchema);
