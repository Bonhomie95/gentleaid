import { Server } from 'socket.io';
import chatSocket from './chatSocket.js';

export const initSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  console.log('Socket.IO initialized');

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('register_user', (userId) => {
      socket.join(userId.toString());
      console.log(`User ${userId} joined their personal room.`);
    });
    chatSocket(io, socket);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
