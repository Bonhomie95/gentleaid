import { Router } from "express";
import {
  sendOtpEmail,
  verifyOtpEmail,
  completeOnboarding,
  me,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// 1. Request OTP
router.post("/send-otp", sendOtpEmail);

router.post("/verify-otp", verifyOtpEmail);
// 3. Complete onboarding (new users)
router.post("/onboarding", completeOnboarding);

// 4. Get user details
router.get("/me", authMiddleware, me);

export default router;
