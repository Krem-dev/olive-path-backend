import { body } from 'express-validator';

/** Ghana local (0XXXXXXXXX) or international (+ and 9–15 digits). Mirrors the app. */
function isValidPhone(value: string): boolean {
  if (!/^\+?[\d\s()-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  if (value.startsWith('+')) {
    if (digits.startsWith('233')) return digits.length === 12;
    return digits.length >= 9 && digits.length <= 15;
  }
  return /^0\d{9}$/.test(digits);
}

const phoneField = () =>
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number required')
    .bail()
    .custom(isValidPhone)
    .withMessage('Enter a valid phone number');

export const counsellingValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name required'),
  phoneField(),
  body('email').optional({ checkFalsy: true }).isEmail(),
  body('type').trim().notEmpty().withMessage('Counselling type required'),
  body('preferredDate').optional({ checkFalsy: true }).isISO8601(),
  body('concern').optional({ checkFalsy: true }).isLength({ max: 2000 }),
];

export const pastorValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name required'),
  body('church').trim().notEmpty().withMessage('Church / organization required'),
  phoneField(),
  body('email').isEmail().withMessage('Valid email required'),
  body('programDate').optional({ checkFalsy: true }).isISO8601(),
  body('location').optional({ checkFalsy: true }).isLength({ max: 255 }),
  body('message').optional({ checkFalsy: true }).isLength({ max: 2000 }),
];
