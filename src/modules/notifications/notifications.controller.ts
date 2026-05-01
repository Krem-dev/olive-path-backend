import { Request, Response } from 'express';
import { Notification } from '../../models';
import { success } from '../../utils/response';
import { NotFoundError } from '../../middleware/error';
import { AuthenticatedRequest } from '../../types/express';
import { paramInt } from '../../utils/params';

export async function list(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const notifications = await Notification.findAll({
    where: { userId: auth.user.id },
    order: [['createdAt', 'DESC']],
    limit: 50,
  });
  success(res, notifications);
}

export async function markRead(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const id = paramInt(req.params.id);

  const notification = await Notification.findOne({
    where: { id, userId: auth.user.id },
  });
  if (!notification) throw new NotFoundError('Notification not found');

  notification.isRead = true;
  await notification.save();
  success(res, notification);
}

export async function markAllRead(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  await Notification.update(
    { isRead: true },
    { where: { userId: auth.user.id, isRead: false } },
  );
  success(res, { message: 'All notifications marked as read' });
}
