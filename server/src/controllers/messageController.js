import Message from '../models/Message.js';
import GroupMember from '../models/GroupMember.js';

export const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;
  if (!groupId || groupId === 'undefined') {
    return res.status(400).json({ message: 'Invalid groupId' });
  }

  const messages = await Message.find({ groupId })
    .populate('senderId', 'username firstName lastName displayAsUsername')
    .populate('replyTo', 'content senderId')
    .sort({ createdAt: 1 });

  // format display name
  const formatted = messages.map((m) => ({
    _id: m._id,
    content: m.content,
    groupId: m.groupId,
    senderId: m.senderId?._id,
    replyTo: m.replyTo
      ? {
          _id: m.replyTo._id,
          content: m.replyTo.content,
        }
      : null,

    senderDisplayName: m.senderId?.displayAsUsername
      ? m.senderId?.username
      : `${m.senderId?.firstName || ''} ${m.senderId?.lastName || ''}`.trim(),
    createdAt: m.createdAt,
  }));

  console.log('Fetched messages for group', formatted);
  res.json({ messages: formatted });
};

export const sendGroupMessage = async (req, res) => {
  const userId = req.userId;
  const { groupId } = req.params;
  const {
    content = '',
    type = 'text',
    voiceUrl = null,
    durationMs = null,
  } = req.body;

  const isMember = await GroupMember.findOne({ userId, groupId });
  if (!isMember) {
    return res.status(403).json({ message: 'Join group to send messages' });
  }

  const message = await Message.create({
    groupId,
    senderId: userId,
    content,
    type,
    voiceUrl,
    durationMs,
  });

  const populated = await Message.findById(message._id).populate(
    'senderId',
    'username firstName lastName displayAsUsername'
  );

  const formatted = {
    _id: populated._id,
    groupId,
    senderId: populated.senderId._id,
    senderDisplayName: populated.senderId.displayAsUsername
      ? populated.senderId.username
      : `${populated.senderId.firstName || ''} ${
          populated.senderId.lastName || ''
        }`.trim(),
    content: populated.content,
    type: populated.type,
    voiceUrl: populated.voiceUrl,
    durationMs: populated.durationMs,
    createdAt: populated.createdAt,
  };

  res.json({ message: formatted });
};

// SOCKET SAVE
export const saveMessage = async ({ groupId, senderId, content }) => {
  return await Message.create({
    groupId,
    senderId,
    content,
  });
};

export const toggleReaction = async (req, res) => {
  const userId = req.userId;
  const { messageId } = req.params;
  const { emoji } = req.body;

  const message = await Message.findById(messageId);
  if (!message) return res.status(404).json({ message: 'Not found' });

  const existing = message.reactions.find(
    (r) => r.emoji === emoji && r.userId.toString() === userId
  );

  if (existing) {
    message.reactions = message.reactions.filter(
      (r) => !(r.emoji === emoji && r.userId.toString() === userId)
    );
  } else {
    message.reactions.push({ emoji, userId });
  }

  await message.save();

  res.json({ reactions: message.reactions });
};
