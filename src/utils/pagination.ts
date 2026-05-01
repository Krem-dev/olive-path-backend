import { Request } from 'express';

export interface PageParams {
  page: number;
  limit: number;
  offset: number;
}

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

export function getPageParams(req: Request): PageParams {
  const page = Math.max(1, parseInt((req.query.page as string) || '1', 10) || 1);
  const rawLimit = parseInt(
    (req.query.limit as string) || String(DEFAULT_LIMIT),
    10,
  );
  const limit = Math.min(MAX_LIMIT, Math.max(1, rawLimit || DEFAULT_LIMIT));
  return { page, limit, offset: (page - 1) * limit };
}
