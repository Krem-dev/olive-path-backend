import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Program } from '../../models';
import { success } from '../../utils/response';

export async function upcoming(_req: Request, res: Response): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const items = await Program.findAll({
    where: { isActive: true, date: { [Op.gte]: today } },
    order: [['date', 'ASC']],
    limit: 20,
  });
  success(res, items);
}
