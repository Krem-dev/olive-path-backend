import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { daily } from './quotes.controller';

const router = Router();

router.get('/daily', asyncHandler(daily));

export default router;
