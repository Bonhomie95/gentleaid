import Notification from '../models/Notification.js';

export const createNotification = async (userId, data, io = null) => {
  const notif = await Notification.create({
    userId,
    type: data.type || 'GENERAL',
    title: data.title,
    message: data.message,
    link: data.link || null,
  });

  // Emit real-time notification if socket is available
  if (io) {
    io.to(userId.toString()).emit('notification', notif);
  }

  return notif;
};
