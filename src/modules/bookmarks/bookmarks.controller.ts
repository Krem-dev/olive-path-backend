import { Request, Response } from 'express';
import { Bookmark, Sermon } from '../../models';
import { success } from '../../utils/response';
import { NotFoundError } from '../../middleware/error';
import { AuthenticatedRequest } from '../../types/express';

export async function list(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const bookmarks = await Bookmark.findAll({
    where: { userId: auth.user.id },
    include: [{ model: Sermon, as: 'sermon' }],
    order: [['createdAt', 'DESC']],
  });
  success(res, bookmarks);
}

export async function toggle(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const sermonId = parseInt(req.body.sermonId, 10);

  const sermon = await Sermon.findByPk(sermonId);
  if (!sermon) throw new NotFoundError('Sermon not found');

  const existing = await Bookmark.findOne({
    where: { userId: auth.user.id, sermonId },
  });

  if (existing) {
    await existing.destroy();
    success(res, { bookmarked: false });
  } else {
    await Bookmark.create({ userId: auth.user.id, sermonId });
    success(res, { bookmarked: true });
  }
}
