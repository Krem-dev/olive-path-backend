import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getCurrent, list, getById } from './devotions.controller';

const router = Router();

router.get('/current', asyncHandler(getCurrent));
router.get('/', asyncHandler(list));
router.get('/:id', asyncHandler(getById));

export default router;
