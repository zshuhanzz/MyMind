import { Router } from 'express';
import { checkInController } from '../controllers/check-in.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { checkInSchema } from '../utils/validators.js';

const router = Router();

router.use(authenticate);

router.get('/', checkInController.list);
router.get('/pending', checkInController.pending);
router.get('/streak', checkInController.streak);
router.post('/', validate(checkInSchema), checkInController.complete);

export default router;
