import { Request, Response } from 'express';
import { User } from '../../models';
import { success } from '../../utils/response';
import { NotFoundError } from '../../middleware/error';
import { AuthenticatedRequest } from '../../types/express';

export async function updateMe(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const user = await User.findByPk(auth.user.id);
  if (!user) throw new NotFoundError('User not found');

  const { name, notificationsEnabled, avatarUrl } = req.body;
  if (name !== undefined) user.name = name;
  if (notificationsEnabled !== undefined)
    user.notificationsEnabled = notificationsEnabled;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

  await user.save();
  success(res, user.toSafeJSON());
}
