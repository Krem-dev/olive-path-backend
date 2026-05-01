import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { initialize, verify } from './payments.controller';
import { initializeValidation, verifyParam } from './payments.validators';

const router = Router();

router.use(authenticate);

router.post(
  '/initialize',
  validate(initializeValidation),
  asyncHandler(initialize),
);
router.get('/verify/:reference', validate(verifyParam), asyncHandler(verify));

export default router;
