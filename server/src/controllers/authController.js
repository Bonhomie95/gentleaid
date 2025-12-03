import User from '../models/User.js';
import OtpCode from '../models/OtpCode.js';
import Session from '../models/Session.js';
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import { sendOtpSms } from '../services/smsService.js';
import { sendEmail } from '../services/emailService.js';

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

export const sendOtpEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Normalize email
    const formattedEmail = email.trim().toLowerCase();

    // Find or create user
    let user = await User.findOne({ email: formattedEmail });

    if (!user) {
      user = await User.create({
        email: formattedEmail,
        isKycVerified: false,
      });
    }

    // Generate OTP
    const otp = generateOtp();

    // Save OTP + expiry (5 minutes)
    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Email content
    const html = `
      <p>Your GentelAid verification code is:</p>
      <h2>${otp}</h2>
      <p>This code expires in 5 minutes.</p>
    `;

    await sendEmail(formattedEmail, 'Your GentelAid Login Code', html);

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('SEND OTP ERROR:', err);
    res.status(500).json({ message: 'Server error sending OTP' });
  }
};

export const verifyOtpEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const formattedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: formattedEmail });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check expiry
    if (!user.otpCode || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Check code
    if (user.otpCode !== code) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clear OTP
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const isNewUser = !user.username;

    res.json({
      message: 'OTP verified',
      token,
      user,
      isNewUser,
    });
  } catch (err) {
    console.error('VERIFY OTP ERROR:', err);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
};

// ---------------------------
// 3. Onboarding for New Users
// ---------------------------
export const completeOnboarding = async (req, res) => {
  const { phone, username, firstName, lastName, avatarUrl, displayPreference } =
    req.body;

  if (!phone || !username) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // username must be unique
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  const user = await User.create({
    phone,
    username,
    firstName,
    lastName,
    avatarUrl,
    displayPreference: displayPreference || 'USERNAME',
  });

  const token = createToken(user._id);

  await Session.create({
    userId: user._id,
    token,
    ip: req.ip,
    device: req.headers['user-agent'],
  });

  res.json({
    token,
    user,
  });
};

// ---------------------------
// 4. Me
// ---------------------------
export const me = async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
};
