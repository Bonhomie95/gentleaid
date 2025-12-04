import Group from '../models/Group.js';
import GroupMember from '../models/GroupMember.js';

// -----------------------------------------
// Get ALL groups with membership + count
// -----------------------------------------
export const getAllGroups = async (req, res) => {
  try {
    const userId = req.userId;

    const groups = await Group.find().sort({ name: 1 }).lean();

    // Get memberships of user
    const myMemberships = await GroupMember.find({ userId }).lean();
    const myGroupIds = new Set(myMemberships.map((m) => m.groupId.toString()));

    // Get member counts
    const counts = await GroupMember.aggregate([
      { $group: { _id: '$groupId', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const formatted = groups.map((g) => ({
      ...g,
      memberCount: countMap[g._id.toString()] || 0,
      isMember: myGroupIds.has(g._id.toString()),
    }));

    res.json({ groups: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load groups' });
  }
};

// -----------------------------------------
// Join Group
// -----------------------------------------
export const joinGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const groupId = req.params.groupId;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const existing = await GroupMember.findOne({ userId, groupId });
    if (existing) {
      const count = await GroupMember.countDocuments({ groupId });
      return res.json({
        message: 'Already joined',
        isMember: true,
        memberCount: count,
      });
    }

    await GroupMember.create({ userId, groupId });

    const count = await GroupMember.countDocuments({ groupId });

    group.memberCount = count;
    await group.save();

    res.json({
      message: 'Joined successfully',
      isMember: true,
      memberCount: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to join group' });
  }
};

// -----------------------------------------
// Leave Group
// -----------------------------------------
export const leaveGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const groupId = req.params.groupId;

    await GroupMember.deleteOne({ userId, groupId });

    const count = await GroupMember.countDocuments({ groupId });

    const group = await Group.findById(groupId);
    if (group) {
      group.memberCount = count;
      await group.save();
    }

    res.json({
      message: 'Left group',
      isMember: false,
      memberCount: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to leave group' });
  }
};

// -----------------------------------------
// Get groups that user belongs to
// -----------------------------------------
export const getMyGroups = async (req, res) => {
  try {
    const userId = req.userId;

    const joins = await GroupMember.find({ userId }).populate('groupId').lean();

    const list = joins.map((j) => ({
      _id: j.groupId._id,
      name: j.groupId.name,
      description: j.groupId.description,
      memberCount: j.groupId.memberCount,
    }));

    res.json({ groups: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load user groups' });
  }
};
