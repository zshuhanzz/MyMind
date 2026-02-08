import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/summary', dashboardController.summary);
router.get('/mood-trends', dashboardController.moodTrends);
router.get('/emotion-breakdown', dashboardController.emotionBreakdown);

export default router;
