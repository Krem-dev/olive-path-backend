import { Request, Response } from 'express';
import { Announcement } from '../../models';
import { success } from '../../utils/response';

export async function list(_req: Request, res: Response): Promise<void> {
  const items = await Announcement.findAll({
    where: { isActive: true },
    order: [['date', 'DESC']],
    limit: 20,
  });
  success(res, items);
}
