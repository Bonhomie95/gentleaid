import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const displayName = (u) =>
  u.displayAsUsername
    ? u.username
    : `${u.firstName || ''} ${u.lastName || ''}`.trim();

export const sendDM = async (req, res) => {
  const senderId = req.userId;
  const { toUserId, content, type = 'text', voiceUrl, durationMs } = req.body;

  if (!toUserId || (!content && type !== 'voice')) {
    return res.status(400).json({ message: 'Invalid DM payload' });
  }

  const participants = [senderId, toUserId].map((id) => id.toString()).sort();

  // 🔥 auto-create or reuse
  let conversation = await Conversation.findOne({
    participants,
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants });
  }

  const message = await Message.create({
    conversationId: conversation._id,
    senderId,
    content,
    type,
    voiceUrl,
    durationMs,
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  const populated = await Message.findById(message._id).populate(
    'senderId',
    'username firstName lastName displayAsUsername'
  );

  const formatted = {
    _id: populated._id,
    conversationId: conversation._id,
    senderId: populated.senderId._id,
    senderDisplayName: displayName(populated.senderId),
    content: populated.content,
    type: populated.type,
    voiceUrl: populated.voiceUrl,
    durationMs: populated.durationMs,
    createdAt: populated.createdAt,
  };

  res.json({ message: formatted, conversationId: conversation._id });
};

export const getDMs = async (req, res) => {
  const { conversationId } = req.params;

  const messages = await Message.find({
    conversationId,
  })
    .populate('senderId', 'username firstName lastName displayAsUsername')
    .sort({ createdAt: 1 });

  const formatted = messages.map((m) => ({
    _id: m._id,
    conversationId,
    senderId: m.senderId._id,
    senderDisplayName: displayName(m.senderId),
    content: m.content,
    type: m.type,
    voiceUrl: m.voiceUrl,
    durationMs: m.durationMs,
    createdAt: m.createdAt,
  }));

  res.json({ messages: formatted });
};

export const getConversations = async (req, res) => {
  const userId = req.userId;

  const list = await Conversation.find({
    participants: userId,
  })
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'senderId',
        select: 'username firstName lastName displayAsUsername',
      },
    })
    .sort({ updatedAt: -1 });

  res.json(list);
};

export const toggleReaction = async (req, res) => {
  const userId = req.userId;
  const { messageId } = req.params;
  const { emoji } = req.body;

  if (!emoji) {
    return res.status(400).json({ message: 'Emoji required' });
  }

  const message = await Message.findById(messageId).populate(
    'senderId',
    'username firstName lastName displayAsUsername'
  );

  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }

  const alreadyReacted = message.reactions.find(
    (r) => r.emoji === emoji && r.userId.toString() === userId.toString()
  );

  let action;

  if (alreadyReacted) {
    // TOGGLE OFF
    message.reactions = message.reactions.filter(
      (r) => !(r.emoji === emoji && r.userId.toString() === userId.toString())
    );
    action = 'removed';
  } else {
    // TOGGLE ON
    message.reactions.push({ emoji, userId });
    action = 'added';
  }

  await message.save();
  req.io
    .to(
      message.groupId
        ? message.groupId.toString()
        : message.conversationId.toString()
    )
    .emit('message:reaction', {
      messageId: message._id,
      reactions: message.reactions,
    });

  // 🔔 CREATE NOTIFICATION (ONLY WHEN ADDED & NOT SELF)
  if (
    action === 'added' &&
    message.senderId._id.toString() !== userId.toString()
  ) {
    const senderName = message.senderId.displayAsUsername
      ? message.senderId.username
      : `${message.senderId.firstName || ''} ${
          message.senderId.lastName || ''
        }`.trim();

    await Notification.create({
      userId: message.senderId._id,
      type: 'GROUP',
      title: 'New reaction',
      message: `${senderName} reacted ${emoji} to your message`,
      link: message.groupId
        ? `/groups/${message.groupId}`
        : `/chat/dm/${message.conversationId}`,
    });
  }

  res.json({
    messageId: message._id,
    reactions: message.reactions,
  });
};
