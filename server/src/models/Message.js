import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema(
  {
    emoji: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    // GROUP or DM
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      default: null,
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      default: null,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    content: {
      type: String,
      default: '',
    },

    type: {
      type: String,
      enum: ['text', 'emoji', 'voice'],
      default: 'text',
    },

    voiceUrl: {
      type: String,
      default: null,
    },

    durationMs: {
      type: Number,
      default: null,
    },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },

    reactions: {
      type: [reactionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
