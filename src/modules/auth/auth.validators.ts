import { body } from 'express-validator';

export const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2–100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

export const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
];

export const googleAuthValidation = [
  body('googleId').notEmpty().withMessage('Google ID required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('name').trim().notEmpty().withMessage('Name required'),
];
