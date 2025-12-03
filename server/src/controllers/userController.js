import User from '../models/User.js';

// Get current user
export const getMe = async (req, res) => {
  const user = await User.findById(req.userId).lean();
  res.json(user);
};

// Update profile (username, real name, avatar, display pref)
export const updateProfile = async (req, res) => {
  const userId = req.userId;

  const { username, firstName, lastName, avatarUrl, displayPreference } =
    req.body;

  // username must be unique
  if (username) {
    const exists = await User.findOne({ username, _id: { $ne: userId } });
    if (exists) {
      return res.status(400).json({ message: 'Username already taken' });
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      username,
      firstName,
      lastName,
      avatarUrl,
      displayPreference,
    },
    { new: true }
  );

  res.json({ message: 'Profile updated', user });
};

// Soft delete account
export const deleteAccount = async (req, res) => {
  const userId = req.userId;

  await User.findByIdAndUpdate(userId, { status: 'DELETED' });

  res.json({ message: 'Account deleted' });
};
