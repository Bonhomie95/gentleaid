import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    // For future features like images, videos
    type: {
      type: String,
      enum: ['text', 'media'],
      default: 'text',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
