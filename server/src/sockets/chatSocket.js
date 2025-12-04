import { saveMessage } from '../controllers/messageController.js';

export default function chatSocket(io, socket) {
  // join group room
  socket.on('joinRoom', (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined room ${groupId}`);
  });

  // leave group room
  socket.on('leaveRoom', (groupId) => {
    socket.leave(groupId);
  });

  // typing
  socket.on('typing', ({ groupId, user }) => {
    socket.to(groupId).emit('typing', { user });
  });

  // send message
  socket.on('message:send', async ({ groupId, content }) => {
    const senderId = socket.userId;

    if (!content?.trim()) return;

    const saved = await saveMessage({ groupId, senderId, content });

    io.to(groupId).emit('message:new', {
      _id: saved._id,
      content: saved.content,
      groupId: saved.groupId,
      senderId: saved.senderId,
      createdAt: saved.createdAt,
    });
  });
}
