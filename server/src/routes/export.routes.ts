import { Router } from 'express';
import { exportController } from '../controllers/export.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/csv', exportController.csv);
router.get('/therapist-summary', exportController.therapistSummary);

export default router;
