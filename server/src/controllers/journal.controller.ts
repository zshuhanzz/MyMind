import { Request, Response, NextFunction } from 'express';
import { journalRepository } from '../repositories/journal.repository.js';
import { AppError } from '../middleware/error-handler.js';

export const journalController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const search = req.query.search as string | undefined;
      const entries = await journalRepository.findByUser(req.user!.userId, limit, offset, search);
      res.json(entries);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content, tags, moodEntryId } = req.body;
      const entry = await journalRepository.create({
        userId: req.user!.userId,
        title,
        content,
        tags,
        moodEntryId,
      });
      res.status(201).json(entry);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await journalRepository.findById(req.params.id as string);
      if (!entry || entry.user_id !== req.user!.userId) {
        throw new AppError(404, 'Journal entry not found.');
      }
      res.json(entry);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await journalRepository.findById(req.params.id as string);
      if (!entry || entry.user_id !== req.user!.userId) {
        throw new AppError(404, 'Journal entry not found.');
      }
      const { title, content, tags } = req.body;
      const updated = await journalRepository.update(req.params.id as string, { title, content, tags });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async toggleFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await journalRepository.findById(req.params.id as string);
      if (!entry || entry.user_id !== req.user!.userId) {
        throw new AppError(404, 'Journal entry not found.');
      }
      const updated = await journalRepository.toggleFavorite(req.params.id as string);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await journalRepository.findById(req.params.id as string);
      if (!entry || entry.user_id !== req.user!.userId) {
        throw new AppError(404, 'Journal entry not found.');
      }
      await journalRepository.delete(req.params.id as string);
      res.json({ message: 'Entry deleted.' });
    } catch (err) {
      next(err);
    }
  },
};
