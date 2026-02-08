import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rate-limiter.js';
import { registerSchema, loginSchema } from '../utils/validators.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/anonymous', authLimiter, authController.anonymous);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
