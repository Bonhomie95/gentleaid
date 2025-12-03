import { distributeFunds } from '../services/distributionService.js';

export const runDailyDistribution = async (req, res) => {
  const result = await distributeFunds('DAILY');
  res.json(result);
};

export const runWeeklyDistribution = async (req, res) => {
  const result = await distributeFunds('WEEKLY');
  res.json(result);
};
