import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { userRepository } from '../repositories/user.repository.js';

export const userController = {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile(req.user!.userId);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { displayName, timezone, avatarUrl } = req.body;
      const user = await userRepository.update(req.user!.userId, {
        displayName,
        timezone,
        avatarUrl,
      });
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  async convertAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await authService.convertAnonymousAccount(req.user!.userId, email, password);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      await userRepository.softDelete(req.user!.userId);
      res.clearCookie('refreshToken', { path: '/api/auth' });
      res.json({ message: 'Account deleted. We hope you found some value in MindBridge.' });
    } catch (err) {
      next(err);
    }
  },
};
