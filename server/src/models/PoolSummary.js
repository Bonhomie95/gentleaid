import mongoose from "mongoose";

const poolSummarySchema = new mongoose.Schema(
  {
    date: { type: String, unique: true }, // "2025-11-27"
    totalDonations: { type: Number, default: 0 },
    totalUserPool: { type: Number, default: 0 },
    totalPlatform: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("PoolSummary", poolSummarySchema);
