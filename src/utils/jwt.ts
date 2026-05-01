import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface JwtPayload {
  id: number;
  email: string;
}

export interface JwtUser {
  id: number;
  email: string;
}

function expiryToSeconds(value: string): number {
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 86400; // default 7 days
  const num = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's':
      return num;
    case 'm':
      return num * 60;
    case 'h':
      return num * 3600;
    case 'd':
      return num * 86400;
    default:
      return 7 * 86400;
  }
}

export function signAccessToken(user: JwtUser): string {
  const opts: SignOptions = { expiresIn: expiryToSeconds(config.jwt.expiresIn) };
  return jwt.sign({ id: user.id, email: user.email }, config.jwt.secret, opts);
}

export function signRefreshToken(user: JwtUser): string {
  const opts: SignOptions = {
    expiresIn: expiryToSeconds(config.jwt.refreshExpiresIn),
  };
  return jwt.sign({ id: user.id, email: user.email }, config.jwt.secret, opts);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
}
