import Message from '../models/Message.js';
import GroupMember from '../models/GroupMember.js';

// ------------------------------
// Fetch messages for a group
// ------------------------------
export const getMessages = async (req, res) => {
  const { groupId } = req.params;
  const limit = parseInt(req.query.limit) || 30;
  const page = parseInt(req.query.page) || 1;

  // Ensure user is a member
  const isMember = await GroupMember.findOne({
    userId: req.userId,
    groupId,
  });

  if (!isMember) {
    return res.status(403).json({ message: 'Not a member of this group' });
  }

  const messages = await Message.find({ groupId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate(
      'senderId',
      'username firstName lastName avatarUrl displayPreference'
    )
    .lean();

  res.json(messages.reverse());
};

// ------------------------------
// Save a message (used by socket)
// ------------------------------
export const saveMessage = async ({ groupId, senderId, content }) => {
  const message = await Message.create({
    groupId,
    senderId,
    content,
  });

  return message;
};
