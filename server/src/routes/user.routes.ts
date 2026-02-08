import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/me', authenticate, userController.getProfile);
router.put('/me', authenticate, userController.updateProfile);
router.post('/me/convert', authenticate, userController.convertAccount);
router.delete('/me', authenticate, userController.deleteAccount);

export default router;
