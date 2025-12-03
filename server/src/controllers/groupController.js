import Group from '../models/Group.js';
import GroupMember from '../models/GroupMember.js';

// -----------------------------------------
// Get all groups (for explore screen)
// -----------------------------------------
export const getAllGroups = async (req, res) => {
  const groups = await Group.find().sort({ name: 1 }).lean();
  res.json(groups);
};

// -----------------------------------------
// Join Group
// -----------------------------------------
export const joinGroup = async (req, res) => {
  const userId = req.userId;
  const { groupId } = req.body;

  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: 'Group not found' });

  // Check if already in group
  const existing = await GroupMember.findOne({ userId, groupId });
  if (existing) return res.json({ message: 'Already joined' });

  await GroupMember.create({ userId, groupId });

  group.memberCount = await GroupMember.countDocuments({ groupId });
  await group.save();

  res.json({ message: 'Joined successfully' });
};

// -----------------------------------------
// Leave Group
// -----------------------------------------
export const leaveGroup = async (req, res) => {
  const userId = req.userId;
  const { groupId } = req.body;

  await GroupMember.deleteOne({ userId, groupId });

  const group = await Group.findById(groupId);
  if (group) {
    group.memberCount = await GroupMember.countDocuments({ groupId });
    await group.save();
  }

  res.json({ message: 'Left group' });
};

// -----------------------------------------
// Get groups a user belongs to
// -----------------------------------------
export const getMyGroups = async (req, res) => {
  const userId = req.userId;

  const joins = await GroupMember.find({ userId }).populate('groupId').lean();

  const list = joins.map((j) => j.groupId);

  res.json(list);
};
