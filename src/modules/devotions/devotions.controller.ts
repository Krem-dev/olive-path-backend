import { Request, Response } from 'express';
import { WeeklyDevotion } from '../../models';
import { success, paginated } from '../../utils/response';
import { NotFoundError } from '../../middleware/error';
import { getPageParams } from '../../utils/pagination';
import { paramInt } from '../../utils/params';

function serialize(d: WeeklyDevotion) {
  return {
    id: d.id,
    title: d.title,
    weekStart: d.weekStart,
    weekEnd: d.weekEnd,
    scripture: d.scripture,
    scriptureRef: d.scriptureRef,
    encouragement: d.encouragement,
    reflection: d.reflection,
    prayer: d.prayer,
    pastor: { name: d.pastorName, title: d.pastorTitle },
  };
}

/** GET /devotions/current — most recent active weekly devotion. */
export async function getCurrent(_req: Request, res: Response): Promise<void> {
  const devotion = await WeeklyDevotion.findOne({
    where: { isActive: true },
    order: [['weekStart', 'DESC']],
  });
  if (!devotion) throw new NotFoundError('No devotion available');
  success(res, serialize(devotion));
}

/** GET /devotions — paginated past devotions (newest first). */
export async function list(req: Request, res: Response): Promise<void> {
  const { page, limit, offset } = getPageParams(req);
  const { count, rows } = await WeeklyDevotion.findAndCountAll({
    where: { isActive: true },
    order: [['weekStart', 'DESC']],
    limit,
    offset,
  });
  paginated(res, rows.map(serialize), count, page, limit);
}

/** GET /devotions/:id */
export async function getById(req: Request, res: Response): Promise<void> {
  const id = paramInt(req.params.id);
  const devotion = await WeeklyDevotion.findByPk(id);
  if (!devotion || !devotion.isActive)
    throw new NotFoundError('Devotion not found');
  success(res, serialize(devotion));
}
