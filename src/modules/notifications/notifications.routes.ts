import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import { list, markRead, markAllRead } from './notifications.controller';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(list));
router.patch('/read-all', asyncHandler(markAllRead));
router.patch('/:id/read', asyncHandler(markRead));

export default router;
