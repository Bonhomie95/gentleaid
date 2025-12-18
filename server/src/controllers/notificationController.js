import Notification from '../models/Notification.js';


export const getMyNotifications = async (req, res) => {
  const userId = req.userId;

  const list = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(200);

  res.json(list);
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  const notif = await Notification.findOne({ _id: id, userId });

  if (!notif) return res.status(404).json({ message: 'Not found' });

  notif.isRead = true;
  await notif.save();

  res.json({ message: 'Marked as read', notif });
};

// Mark ALL notifications as read
export const markAllRead = async (req, res) => {
  const userId = req.userId;

  await Notification.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true } }
  );

  res.json({ message: 'All cleared' });
};
