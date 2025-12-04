import User from '../models/User.js';

// Get current user
export const getMe = async (req, res) => {
  const user = await User.findById(req.userId).lean();
  res.json(user);
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, firstName, lastName, displayAsUsername, avatar } =
      req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Unique username check
    if (username && username !== user.username) {
      const exists = await User.findOne({ username });
      if (exists) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    user.username = username ?? user.username;
    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.displayAsUsername =
      displayAsUsername !== undefined
        ? displayAsUsername
        : user.displayAsUsername;

    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};


// Soft delete account
export const deleteAccount = async (req, res) => {
  const userId = req.userId;

  await User.findByIdAndUpdate(userId, { status: 'DELETED' });

  res.json({ message: 'Account deleted' });
};
