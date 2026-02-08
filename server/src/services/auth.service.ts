import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/environment.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../middleware/error-handler.js';
import type { JwtPayload, UserRow } from '../types/index.js';

function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpiry } as jwt.SignOptions);
}

function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiry } as jwt.SignOptions);
}

function sanitizeUser(user: UserRow) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    avatarUrl: user.avatar_url,
    isAnonymous: user.is_anonymous,
    onboardingComplete: user.onboarding_complete,
    timezone: user.timezone,
    createdAt: user.created_at,
  };
}

export const authService = {
  async register(email: string, password: string, displayName: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError(409, 'An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userRepository.create({ email, passwordHash, displayName });

    const tokenPayload: JwtPayload = { userId: user.id, isAnonymous: false };
    return {
      user: sanitizeUser(user),
      accessToken: generateAccessToken(tokenPayload),
      refreshToken: generateRefreshToken(tokenPayload),
    };
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.password_hash) {
      throw new AppError(401, 'Invalid email or password.');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new AppError(401, 'Invalid email or password.');
    }

    await userRepository.updateLastActive(user.id);

    const tokenPayload: JwtPayload = { userId: user.id, isAnonymous: user.is_anonymous };
    return {
      user: sanitizeUser(user),
      accessToken: generateAccessToken(tokenPayload),
      refreshToken: generateRefreshToken(tokenPayload),
    };
  },

  async createAnonymousSession() {
    const anonymousToken = crypto.randomBytes(32).toString('hex');
    const user = await userRepository.create({
      displayName: 'Anonymous',
      isAnonymous: true,
      anonymousToken,
    });

    const tokenPayload: JwtPayload = { userId: user.id, isAnonymous: true };
    return {
      user: sanitizeUser(user),
      accessToken: generateAccessToken(tokenPayload),
      refreshToken: generateRefreshToken(tokenPayload),
      anonymousToken,
    };
  },

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as JwtPayload;
      const user = await userRepository.findById(payload.userId);
      if (!user) throw new AppError(401, 'User not found.');

      return {
        accessToken: generateAccessToken({ userId: user.id, isAnonymous: user.is_anonymous }),
      };
    } catch {
      throw new AppError(401, 'Invalid refresh token. Please sign in again.');
    }
  },

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError(404, 'User not found.');
    return sanitizeUser(user);
  },

  async convertAnonymousAccount(userId: string, email: string, password: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new AppError(409, 'An account with this email already exists.');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userRepository.update(userId, {
      email,
      passwordHash,
      isAnonymous: false,
      anonymousToken: null,
    });
    if (!user) throw new AppError(404, 'User not found.');
    return sanitizeUser(user);
  },
};
