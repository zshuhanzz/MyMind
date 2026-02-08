import { Request, Response, NextFunction } from 'express';
import { checkInService } from '../services/check-in.service.js';

export const checkInController = {
  async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const { rating, emotionTags, note } = req.body;
      const result = await checkInService.complete(req.user!.userId, { rating, emotionTags, note });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 30;
      const offset = parseInt(req.query.offset as string) || 0;
      const checkIns = await checkInService.getHistory(req.user!.userId, limit, offset);
      res.json(checkIns);
    } catch (err) {
      next(err);
    }
  },

  async pending(req: Request, res: Response, next: NextFunction) {
    try {
      const checkIn = await checkInService.getPending(req.user!.userId);
      res.json(checkIn);
    } catch (err) {
      next(err);
    }
  },

  async streak(req: Request, res: Response, next: NextFunction) {
    try {
      const streak = await checkInService.getStreak(req.user!.userId);
      res.json({ streak });
    } catch (err) {
      next(err);
    }
  },
};
