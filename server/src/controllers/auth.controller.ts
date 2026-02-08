import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/auth',
};

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, displayName } = req.body;
      const result = await authService.register(email, password, displayName);
      res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
      res.status(201).json({ user: result.user, accessToken: result.accessToken });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
      res.json({ user: result.user, accessToken: result.accessToken });
    } catch (err) {
      next(err);
    }
  },

  async anonymous(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.createAnonymousSession();
      res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
      res.status(201).json({
        user: result.user,
        accessToken: result.accessToken,
        anonymousToken: result.anonymousToken,
      });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) {
        res.status(401).json({ error: 'No refresh token provided.' });
        return;
      }
      const result = await authService.refreshAccessToken(token);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.json({ message: 'Logged out successfully.' });
  },
};
