import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "GENERAL",
        "DONATION",
        "HELP_REQUEST",
        "SYSTEM",
        "GROUP",
      ],
      default: "GENERAL",
    },

    title: { type: String, required: true },
    message: { type: String, required: true },

    isRead: {
      type: Boolean,
      default: false,
    },

    link: {
      type: String, // e.g., "/help/123"
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
