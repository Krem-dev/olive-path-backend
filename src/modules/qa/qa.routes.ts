import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { list, categories } from './qa.controller';

const router = Router();

router.get('/', asyncHandler(list));
router.get('/categories', asyncHandler(categories));

export default router;
