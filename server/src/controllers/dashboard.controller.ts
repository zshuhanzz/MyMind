import { Request, Response, NextFunction } from 'express';
import { moodEntryRepository } from '../repositories/mood-entry.repository.js';
import { checkInRepository } from '../repositories/check-in.repository.js';

export const dashboardController = {
  async summary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const [streak, pendingCheckIn, recentMoods, weeklyAvg, topEmotions] = await Promise.all([
        checkInRepository.getStreak(userId),
        checkInRepository.findPending(userId),
        moodEntryRepository.findByUser(userId, 7),
        moodEntryRepository.getWeeklyAverage(userId),
        moodEntryRepository.getEmotionBreakdown(userId, 7),
      ]);

      res.json({
        currentStreak: streak,
        pendingCheckIn,
        recentMoods,
        weeklyAverage: weeklyAvg,
        topEmotions: topEmotions.slice(0, 5),
      });
    } catch (err) {
      next(err);
    }
  },

  async moodTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const period = (req.query.period as string) || '7d';
      const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
      const days = daysMap[period] || 7;

      const trends = await moodEntryRepository.getTrends(req.user!.userId, days);
      res.json(trends);
    } catch (err) {
      next(err);
    }
  },

  async emotionBreakdown(req: Request, res: Response, next: NextFunction) {
    try {
      const period = (req.query.period as string) || '7d';
      const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
      const days = daysMap[period] || 7;

      const breakdown = await moodEntryRepository.getEmotionBreakdown(req.user!.userId, days);
      res.json(breakdown);
    } catch (err) {
      next(err);
    }
  },
};
