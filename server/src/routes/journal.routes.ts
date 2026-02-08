import { Router } from 'express';
import { journalController } from '../controllers/journal.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { journalSchema } from '../utils/validators.js';

const router = Router();

router.use(authenticate);

router.get('/', journalController.list);
router.post('/', validate(journalSchema), journalController.create);
router.get('/:id', journalController.getById);
router.put('/:id', journalController.update);
router.patch('/:id/favorite', journalController.toggleFavorite);
router.delete('/:id', journalController.delete);

export default router;
