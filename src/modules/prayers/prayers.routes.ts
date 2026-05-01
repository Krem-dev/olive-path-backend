import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { submit, listMine } from './prayers.controller';

const router = Router();
router.use(authenticate);

router.post(
  '/',
  validate([
    body('message')
      .trim()
      .isLength({ min: 5, max: 2000 })
      .withMessage('Prayer request must be 5–2000 characters'),
  ]),
  asyncHandler(submit),
);
router.get('/me', asyncHandler(listMine));

export default router;
