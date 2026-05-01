import { Request, Response } from 'express';
import { PrayerRequest } from '../../models';
import { success } from '../../utils/response';
import { AuthenticatedRequest } from '../../types/express';

export async function submit(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const prayer = await PrayerRequest.create({
    userId: auth.user.id,
    message: req.body.message,
  });
  success(res, prayer, 201);
}

export async function listMine(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const prayers = await PrayerRequest.findAll({
    where: { userId: auth.user.id },
    order: [['createdAt', 'DESC']],
  });
  success(res, prayers);
}
