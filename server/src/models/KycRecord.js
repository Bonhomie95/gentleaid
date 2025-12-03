import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },

    idType: {
      type: String,
      enum: ['NIN', 'PASSPORT', 'DRIVERS_LICENSE', 'VOTER_CARD', 'OTHER'],
      required: true,
    },

    idNumber: {
      type: String,
      required: true,
    },

    idFrontImage: {
      type: String,
      required: true,
    },

    idBackImage: {
      type: String,
      default: null,
    },

    selfieImage: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'FAILED'],
      default: 'PENDING',
    },

    fraudScore: {
      type: Number,
      default: 0,
    },
    fraudFlags: {
      type: [String],
      default: [],
    },

    similarityScore: {
      type: Number,
      default: 0, // later will be face match %
    },

    adminNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('KycRecord', kycSchema);
