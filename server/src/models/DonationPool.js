import mongoose from "mongoose";

const donationPoolSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // '2025-11-27'
    totalReceived: { type: Number, default: 0 },  // all donations today
    totalAllocated: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("DonationPool", donationPoolSchema);
