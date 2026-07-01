import { Request, Response } from 'express';
import { User } from '../../models';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';
import { success } from '../../utils/response';
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from '../../middleware/error';
import { AuthenticatedRequest } from '../../types/express';
import { generateOTP, verifyOTP, sendOTPEmail } from '../../utils/otp';

function authResponse(user: User) {
  return {
    user: user.toSafeJSON(),
    token: signAccessToken({ id: user.id, email: user.email }),
    refreshToken: signRefreshToken({ id: user.id, email: user.email }),
  };
}

/**
 * POST /auth/register — sends OTP to email. Account created on verify.
 */
export async function register(req: Request, res: Response): Promise<void> {
  const { email } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new ConflictError('An account with this email already exists');
  }

  const code = await generateOTP(email);
  await sendOTPEmail(email, code);

  success(res, { message: 'OTP sent to your email', email: email.toLowerCase() });
}

/**
 * POST /auth/verify-otp — verifies OTP and creates the account.
 */
export async function verifyOtp(req: Request, res: Response): Promise<void> {
  const { name, email, password, otp } = req.body;

  if (!(await verifyOTP(email, otp))) {
    throw new BadRequestError('Invalid or expired OTP');
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new ConflictError('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  success(res, authResponse(user), 201);
}

/**
 * POST /auth/resend-otp — resends OTP to email.
 */
export async function resendOtp(req: Request, res: Response): Promise<void> {
  const { email } = req.body;
  const code = await generateOTP(email);
  await sendOTPEmail(email, code);
  success(res, { message: 'OTP resent' });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) throw new UnauthorizedError('Invalid email or password');

  if (user.authProvider === 'google' && !user.password) {
    throw new UnauthorizedError(
      'This account uses Google Sign-In. Please sign in with Google.',
    );
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new UnauthorizedError('Invalid email or password');

  success(res, authResponse(user));
}

export async function googleAuth(req: Request, res: Response): Promise<void> {
  const { googleId, email, name, avatarUrl } = req.body;

  let user = await User.findOne({ where: { googleId } });

  if (!user) {
    user = await User.findOne({ where: { email } });
    if (user) {
      // Link Google to existing email account
      user.googleId = googleId;
      user.authProvider = 'google';
      if (avatarUrl) user.avatarUrl = avatarUrl;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        avatarUrl,
        authProvider: 'google',
      });
    }
  }

  success(res, authResponse(user));
}

export async function forgotPassword(_req: Request, res: Response): Promise<void> {
  // Always 200 to avoid email enumeration. Real send happens via mail worker.
  success(res, {
    message: 'If an account exists with this email, a reset link has been sent.',
  });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const user = await User.findByPk(auth.user.id, {
    attributes: { exclude: ['password'] },
  });
  if (!user) throw new NotFoundError('User not found');
  success(res, user);
}
