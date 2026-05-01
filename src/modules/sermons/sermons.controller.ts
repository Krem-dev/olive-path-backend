import { Request, Response } from 'express';
import { Op, WhereOptions } from 'sequelize';
import { Sermon } from '../../models';
import { success, paginated } from '../../utils/response';
import { NotFoundError } from '../../middleware/error';
import { getPageParams } from '../../utils/pagination';
import { paramInt } from '../../utils/params';

const ACTIVE: WhereOptions = { isActive: true };

export async function list(req: Request, res: Response): Promise<void> {
  const { page, limit, offset } = getPageParams(req);
  const { category, contentType, search, sort } = req.query;

  const where: Record<string, unknown> = { ...ACTIVE };

  if (category && ['preaching', 'motivation'].includes(category as string)) {
    where.category = category;
  }
  if (
    contentType &&
    ['video', 'audio', 'reading'].includes(contentType as string)
  ) {
    where.contentType = contentType;
  }
  if (search) {
    Object.assign(where, {
      [Op.or]: [
        { title: { [Op.like]: `%${search}%` } },
        { scripture: { [Op.like]: `%${search}%` } },
        { summary: { [Op.like]: `%${search}%` } },
      ],
    });
  }

  let order: [string, string][] = [['publishedAt', 'DESC']];
  if (sort === 'popular') order = [['viewCount', 'DESC']];
  if (sort === 'title') order = [['title', 'ASC']];

  const { count, rows } = await Sermon.findAndCountAll({
    where,
    order,
    limit,
    offset,
  });

  paginated(res, rows, count, page, limit);
}

export async function recent(_req: Request, res: Response): Promise<void> {
  const sermons = await Sermon.findAll({
    where: ACTIVE,
    order: [['publishedAt', 'DESC']],
    limit: 10,
  });
  success(res, sermons);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = paramInt(req.params.id);
  const sermon = await Sermon.findByPk(id);
  if (!sermon || !sermon.isActive) throw new NotFoundError('Sermon not found');

  await sermon.increment('viewCount');
  success(res, sermon);
}
