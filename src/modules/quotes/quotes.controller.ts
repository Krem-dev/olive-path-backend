import { Request, Response } from 'express';
import { Quote } from '../../models';
import { success } from '../../utils/response';

export async function daily(_req: Request, res: Response): Promise<void> {
  const count = await Quote.count({ where: { isActive: true } });
  if (count === 0) {
    success(res, null);
    return;
  }
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const offset = dayOfYear % count;
  const quote = await Quote.findOne({
    where: { isActive: true },
    order: [['id', 'ASC']],
    offset,
  });
  success(res, quote);
}
