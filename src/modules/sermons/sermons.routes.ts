import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { list, recent, getById } from './sermons.controller';

const router = Router();

router.get('/', asyncHandler(list));
router.get('/recent', asyncHandler(recent));
router.get('/:id', asyncHandler(getById));

export default router;
