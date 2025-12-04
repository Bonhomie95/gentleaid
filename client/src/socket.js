import { io } from 'socket.io-client';
// import api from './api/http';

// Base URL – same as your API base
const API_URL = import.meta.env.VITE_API_URL || '';

export const socket = io(API_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

// Small helper to attach token before connect
export const connectSocketWithToken = (token) => {
  socket.auth = { token };
  if (!socket.connected) socket.connect();
};
