import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    device: { type: String, default: "unknown" },
    ip: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
