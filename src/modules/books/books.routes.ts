import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import {
  getCatalog,
  getOwned,
  getById,
  getContent,
  getProgress,
  updateProgress,
} from './books.controller';
import { bookIdParam, updateProgressValidation } from './books.validators';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(getCatalog));
router.get('/owned', asyncHandler(getOwned));
router.get('/:id', validate(bookIdParam), asyncHandler(getById));
router.get('/:id/content', validate(bookIdParam), asyncHandler(getContent));
router.get('/:id/progress', validate(bookIdParam), asyncHandler(getProgress));
router.patch(
  '/:id/progress',
  validate(updateProgressValidation),
  asyncHandler(updateProgress),
);

export default router;
