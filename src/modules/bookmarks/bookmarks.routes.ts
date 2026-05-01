import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { list, toggle } from './bookmarks.controller';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(list));
router.post(
  '/toggle',
  validate([body('sermonId').isInt({ min: 1 }).withMessage('sermonId required')]),
  asyncHandler(toggle),
);

export default router;
