import { saveMessage } from '../controllers/messageController.js';

export default function chatSocket(io, socket) {
  // User joins a group room
  socket.on('join_group', ({ groupId }) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group ${groupId}`);
  });

  // User leaves a group room
  socket.on('leave_group', ({ groupId }) => {
    socket.leave(groupId);
  });

  // Typing indicator
  socket.on('typing', ({ groupId, user }) => {
    socket.to(groupId).emit('typing', { user });
  });

  // User sends message
  socket.on('send_message', async ({ groupId, senderId, content }) => {
    if (!content.trim()) return;

    const saved = await saveMessage({ groupId, senderId, content });

    io.to(groupId).emit('new_message', saved);
  });
}
