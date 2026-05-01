import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { upcoming } from './programs.controller';

const router = Router();

router.get('/', asyncHandler(upcoming));

export default router;
