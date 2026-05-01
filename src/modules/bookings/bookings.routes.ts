import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { submitCounselling, submitPastor } from './bookings.controller';
import { counsellingValidation, pastorValidation } from './bookings.validators';

const router = Router();
router.use(authenticate);

router.post(
  '/counselling',
  validate(counsellingValidation),
  asyncHandler(submitCounselling),
);
router.post(
  '/pastor',
  validate(pastorValidation),
  asyncHandler(submitPastor),
);

export default router;
