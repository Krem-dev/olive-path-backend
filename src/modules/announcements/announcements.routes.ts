import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { list } from './announcements.controller';

const router = Router();

router.get('/', asyncHandler(list));

export default router;
