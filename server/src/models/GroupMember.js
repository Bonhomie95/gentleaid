import mongoose from "mongoose";

const groupMemberSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  },
  { timestamps: true }
);

groupMemberSchema.index({ userId: 1, groupId: 1 }, { unique: true });

export default mongoose.model("GroupMember", groupMemberSchema);
