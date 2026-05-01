import { Request, Response, NextFunction } from 'express';

/**
 * Wraps async route handlers so thrown errors are caught and forwarded to Express error handler.
 */
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
