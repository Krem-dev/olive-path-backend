import { body, param } from 'express-validator';

export const bookIdParam = [
  param('id').isInt({ min: 1 }).withMessage('Invalid book id'),
];

export const updateProgressValidation = [
  param('id').isInt({ min: 1 }).withMessage('Invalid book id'),
  body('currentPage')
    .isInt({ min: 0 })
    .withMessage('currentPage must be a non-negative integer'),
];
