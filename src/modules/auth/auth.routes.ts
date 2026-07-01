import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  googleAuth,
  forgotPassword,
  getMe,
} from './auth.controller';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  googleAuthValidation,
} from './auth.validators';

const router = Router();

router.post('/register', validate(registerValidation), asyncHandler(register));
router.post('/verify-otp', asyncHandler(verifyOtp));
router.post('/resend-otp', asyncHandler(resendOtp));
router.post('/login', validate(loginValidation), asyncHandler(login));
router.post('/google', validate(googleAuthValidation), asyncHandler(googleAuth));
router.post(
  '/forgot-password',
  validate(forgotPasswordValidation),
  asyncHandler(forgotPassword),
);
router.get('/me', authenticate, asyncHandler(getMe));

export default router;
