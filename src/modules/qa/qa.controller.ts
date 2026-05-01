import { Request, Response } from 'express';
import { Op, WhereOptions } from 'sequelize';
import { QAItem } from '../../models';
import { success } from '../../utils/response';

const ACTIVE: WhereOptions = { isActive: true };

export async function list(req: Request, res: Response): Promise<void> {
  const { category, search } = req.query;
  const where: Record<string, unknown> = { ...ACTIVE };

  if (category && category !== 'All') where.category = category;
  if (search) {
    Object.assign(where, {
      [Op.or]: [
        { question: { [Op.like]: `%${search}%` } },
        { answer: { [Op.like]: `%${search}%` } },
      ],
    });
  }

  const items = await QAItem.findAll({
    where,
    order: [
      ['sortOrder', 'ASC'],
      ['createdAt', 'DESC'],
    ],
  });

  success(res, items);
}

export async function categories(_req: Request, res: Response): Promise<void> {
  const rows = await QAItem.findAll({
    attributes: ['category'],
    where: ACTIVE,
    group: ['category'],
    order: [['category', 'ASC']],
  });
  success(res, rows.map((r) => r.category));
}
