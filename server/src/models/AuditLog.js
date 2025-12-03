import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    action: String,
    targetType: String, // "KYC", "HELP_REQUEST"
    targetId: String,
    details: Object,
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
