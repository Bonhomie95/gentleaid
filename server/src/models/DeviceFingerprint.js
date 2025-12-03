import mongoose from 'mongoose';

const deviceFingerprintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fingerprint: {
      type: String,
      required: true,
    },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

deviceFingerprintSchema.index({ fingerprint: 1 });

export default mongoose.model('DeviceFingerprint', deviceFingerprintSchema);
