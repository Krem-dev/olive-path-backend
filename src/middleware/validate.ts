import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

/**
 * Runs the given validators and returns 400 on failure.
 * Replaces the duplicated validationResult check that lived in every controller.
 *
 *   router.post('/login', validate(loginValidation), asyncHandler(login));
 */
export function validate(validations: ValidationChain[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    await Promise.all(validations.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }
    res.status(400).json({
      error: errors.array()[0].msg,
      details: errors.array().map((e) => ({
        field: 'path' in e ? e.path : undefined,
        message: e.msg,
      })),
    });
  };
}
