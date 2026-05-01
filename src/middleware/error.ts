import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public details?: unknown,
  ) {
    super(message);
    Error.captureStackTrace?.(this, this.constructor);
  }
}

/** 401 — missing/invalid auth */
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}

/** 403 — authenticated but not allowed */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

/** 404 — resource not found */
export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 404);
  }
}

/** 409 — conflict (duplicate, etc.) */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

/** 400 — request payload invalid */
export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isApp = err instanceof AppError;
  const statusCode = isApp ? err.statusCode : 500;
  const message = isApp ? err.message : 'Internal server error';

  if (config.isDev) {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    error: message,
    ...(isApp && err.details ? { details: err.details } : {}),
    ...(config.isDev && !isApp ? { stack: err.stack } : {}),
  });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Route not found' });
}
