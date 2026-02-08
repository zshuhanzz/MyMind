import { Router } from 'express';
import { conversationController } from '../controllers/conversation.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { aiLimiter } from '../middleware/rate-limiter.js';
import { messageSchema } from '../utils/validators.js';

const router = Router();

router.use(authenticate);

router.get('/', conversationController.list);
router.post('/', conversationController.create);
router.get('/:id', conversationController.getById);
router.delete('/:id', conversationController.archive);
router.post('/:id/messages', aiLimiter, validate(messageSchema), conversationController.sendMessage);
router.get('/:id/messages', conversationController.getMessages);

export default router;
