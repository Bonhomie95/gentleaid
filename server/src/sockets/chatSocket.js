import Message from '../models/Message.js';

export default function chatSocket(io, socket) {
  // Join group room
  socket.on('join_group', ({ groupId }) => {
    if (!groupId) return;
    socket.join(groupId.toString());
  });

  // Leave group room
  socket.on('leave_group', ({ groupId }) => {
    if (!groupId) return;
    socket.leave(groupId.toString());
  });

  // Typing indicator
  socket.on('typing', ({ groupId, userId, displayName }) => {
    socket.to(groupId).emit('typing', {
      groupId,
      userId,
      displayName,
    });
  });

  socket.on('stop_typing', ({ groupId, userId }) => {
    socket.to(groupId).emit('stop_typing', {
      groupId,
      userId,
    });
  });

  // Send message (WITH ACK)
  socket.on('send_message', async (payload, ack) => {
    try {
      const { groupId, senderId, content, clientTempId } = payload;

      if (!content || !content.trim()) return;

      const message = await Message.create({
        groupId,
        senderId,
        content,
      });

      const populated = await Message.findById(message._id).populate(
        'senderId',
        'username firstName lastName displayAsUsername'
      );

      const formatted = {
        _id: populated._id,
        groupId: populated.groupId.toString(),
        senderId: populated.senderId._id,
        senderDisplayName: populated.senderId.displayAsUsername
          ? populated.senderId.username
          : `${populated.senderId.firstName || ''} ${
              populated.senderId.lastName || ''
            }`.trim(),
        content: populated.content,
        createdAt: populated.createdAt,
      };

      // Broadcast to everyone in group
      io.to(groupId.toString()).emit('new_message', formatted);
      io.to(room).emit('message:reaction', { messageId, reactions });

      // Ack back to sender (for optimistic UI replace)
      ack?.({ ok: true, message: formatted, clientTempId });
    } catch (err) {
      console.error('send_message error:', err);
      ack?.({ ok: false });
    }
  });
}
