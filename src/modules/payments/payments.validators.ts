import { body, param } from 'express-validator';

export const initializeValidation = [
  body('bookId').isInt({ min: 1 }).withMessage('bookId required'),
];

export const verifyParam = [
  param('reference').notEmpty().withMessage('reference required'),
];
