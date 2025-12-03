import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      default: null,
    },

    // Username for anonymity (auto required)
    username: {
      type: String,
      default: null,
    },

    firstName: { type: String, required: false, default: null },
    lastName: { type: String, required: false, default: null },
    otpCode: { type: String },
    otpExpires: { type: Date },

    avatarUrl: {
      type: String,
      default: null,
    },

    // USERNAME or REAL_NAME
    displayPreference: {
      type: String,
      enum: ['USERNAME', 'REAL_NAME'],
      default: 'USERNAME',
    },

    displayAsUsername: {
      type: Boolean,
      default: true,
    },

    // LOGIN FLOW SUPPORT
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },

    // Flags
    isKycVerified: {
      type: Boolean,
      default: false,
    },

    // For anti-fraud, logs, last active etc.
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },

    // Soft delete or ban
    status: {
      type: String,
      enum: ['ACTIVE', 'BANNED', 'DELETED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
