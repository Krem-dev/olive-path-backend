import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
      };
    }
  }
}

/** Use in routes that mount `authenticate` — `req.user` is guaranteed. */
export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    name: string;
  };
}
