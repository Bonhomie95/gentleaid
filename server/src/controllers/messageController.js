import Message from '../models/Message.js';
import GroupMember from '../models/GroupMember.js';

export const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  const messages = await Message.find({ groupId })
    .populate('senderId', 'username firstName lastName displayAsUsername')
    .sort({ createdAt: 1 });

  // format display name
  const formatted = messages.map((m) => ({
    _id: m._id,
    content: m.content,
    groupId: m.groupId,
    senderId: m.senderId?._id,
    senderDisplayName: m.senderId?.displayAsUsername
      ? m.senderId?.username
      : `${m.senderId?.firstName || ''} ${m.senderId?.lastName || ''}`.trim(),
    createdAt: m.createdAt,
  }));

  res.json({ messages: formatted });
};

export const sendGroupMessage = async (req, res) => {
  const userId = req.userId;
  const { groupId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Message cannot be empty' });
  }

  // Ensure user is a member
  const isMember = await GroupMember.findOne({ userId, groupId });
  if (!isMember) {
    return res.status(403).json({ message: 'Join group to send messages' });
  }

  const message = await Message.create({
    groupId,
    senderId: userId,
    content,
  });

  res.json({ message });
};

// SOCKET SAVE
export const saveMessage = async ({ groupId, senderId, content }) => {
  return await Message.create({
    groupId,
    senderId,
    content,
  });
};
