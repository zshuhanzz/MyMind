import { Router } from 'express';
import authRoutes from './auth.routes.js';
import checkInRoutes from './check-in.routes.js';
import conversationRoutes from './conversation.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import journalRoutes from './journal.routes.js';
import userRoutes from './user.routes.js';
import exportRoutes from './export.routes.js';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/check-ins', checkInRoutes);
router.use('/conversations', conversationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/journal', journalRoutes);
router.use('/users', userRoutes);
router.use('/export', exportRoutes);
