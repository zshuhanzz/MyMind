import { Request, Response, NextFunction } from 'express';
import { conversationRepository } from '../repositories/conversation.repository.js';
import { messageRepository } from '../repositories/message.repository.js';
import { geminiService } from '../services/gemini.service.js';
import { crisisDetectionService } from '../services/crisis-detection.service.js';
import { AppError } from '../middleware/error-handler.js';

export const conversationController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const conversations = await conversationRepository.findByUser(req.user!.userId, limit, offset);
      res.json(conversations);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation = await conversationRepository.create(req.user!.userId, req.body.title);
      res.status(201).json(conversation);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation = await conversationRepository.findById(req.params.id as string);
      if (!conversation || conversation.user_id !== req.user!.userId) {
        throw new AppError(404, 'Conversation not found.');
      }
      const messages = await messageRepository.findByConversation(conversation.id);
      res.json({ ...conversation, messages });
    } catch (err) {
      next(err);
    }
  },

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation = await conversationRepository.findById(req.params.id as string);
      if (!conversation || conversation.user_id !== req.user!.userId) {
        throw new AppError(404, 'Conversation not found.');
      }

      const { content } = req.body;
      const result = await geminiService.sendMessage(conversation.id, content, req.user!.userId);

      res.json({
        message: {
          id: result.messageId,
          conversationId: conversation.id,
          role: 'assistant' as const,
          content: result.fullResponse,
          isCrisisFlagged: result.crisisDetected,
        },
        crisisDetected: result.crisisDetected,
        crisisResources: result.crisisDetected ? crisisDetectionService.getResources() : undefined,
      });
    } catch (err) {
      next(err);
    }
  },

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation = await conversationRepository.findById(req.params.id as string);
      if (!conversation || conversation.user_id !== req.user!.userId) {
        throw new AppError(404, 'Conversation not found.');
      }
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const messages = await messageRepository.findByConversation(conversation.id, limit, offset);
      res.json(messages);
    } catch (err) {
      next(err);
    }
  },

  async archive(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation = await conversationRepository.findById(req.params.id as string);
      if (!conversation || conversation.user_id !== req.user!.userId) {
        throw new AppError(404, 'Conversation not found.');
      }
      await conversationRepository.archive(conversation.id);
      res.json({ message: 'Conversation archived.' });
    } catch (err) {
      next(err);
    }
  },
};
