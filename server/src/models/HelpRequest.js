import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    amountRequested: {
      type: Number,
      required: true,
      min: 1,
    },

    attachments: [
      {
        url: String,
        type: String, // image/pdf/file
      },
    ],

    kycVerified: {
      type: Boolean,
      default: false, // copied from User at creation
    },

    status: {
      type: String,
      enum: ['PENDING', 'REVIEWING', 'APPROVED', 'DECLINED', 'COMPLETED'],
      default: 'PENDING',
    },

    priorityScore: {
      type: Number,
      default: 0,
    },

    reasonForPriority: {
      type: String,
      default: '',
    },

    fraudScore: {
      type: Number,
      default: 0,
    },

    adminNotes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('HelpRequest', helpRequestSchema);
