import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../models';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = header.slice(7);

  try {
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'name', 'isActive'],
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'User not found or inactive' });
      return;
    }

    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
