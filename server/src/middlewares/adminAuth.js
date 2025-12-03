import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const adminAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Admin token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.adminId);
    if (!admin) return res.status(401).json({ message: "Invalid admin token" });

    req.adminId = admin._id;
    req.adminRole = admin.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
