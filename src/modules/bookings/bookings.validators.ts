import { body } from 'express-validator';

export const counsellingValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name required'),
  body('phone').trim().notEmpty().withMessage('Phone number required'),
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
  body('phone').trim().notEmpty().withMessage('Phone number required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('programDate').optional({ checkFalsy: true }).isISO8601(),
  body('location').optional({ checkFalsy: true }).isLength({ max: 255 }),
  body('message').optional({ checkFalsy: true }).isLength({ max: 2000 }),
];
