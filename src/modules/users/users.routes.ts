import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { updateMe } from './users.controller';

const router = Router();
router.use(authenticate);

router.patch(
  '/me',
  validate([
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('notificationsEnabled').optional().isBoolean(),
    body('avatarUrl').optional({ checkFalsy: true }).isURL(),
  ]),
  asyncHandler(updateMe),
);

export default router;
