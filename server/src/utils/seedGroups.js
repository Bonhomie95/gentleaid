import Group from '../models/Group.js';

export const seedGroups = async () => {
  const groups = [
    'Married Men',
    'Single Men',
    'Divorced Men',
    'Widowed Men',
    'Job Hunting',
    'Financial Struggles',
    'Hospital Bills & Health Support',
    'Mental Health Support',
    'Sports & Games',
    'Career Advice',
    'Legal Support',
    'Business Mentorship',
    'Fatherhood',
    'Tech & Learning',
  ];

  for (const name of groups) {
    const exists = await Group.findOne({ name });
    if (!exists) {
      await Group.create({ name, description: `${name} discussion group` });
    }
  }

  console.log('Groups seeded');
};
