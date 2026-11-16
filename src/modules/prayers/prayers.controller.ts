import { Request, Response } from 'express';
import { PrayerRequest } from '../../models';
import { success } from '../../utils/response';
import { AuthenticatedRequest } from '../../types/express';
import { sendNotificationEmail } from '../../utils/mailer';
import { escapeHtml } from '../../utils/escapeHtml';

export async function submit(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const prayer = await PrayerRequest.create({
    userId: auth.user.id,
    message: req.body.message,
  });

  sendNotificationEmail(
    'New Prayer Request',
    `<p><strong>${escapeHtml(auth.user.name)}</strong> (${escapeHtml(auth.user.email)}) submitted a prayer request:</p>
     <blockquote style="border-left: 3px solid #0F8FCF; padding-left: 12px; color: #555;">${escapeHtml(req.body.message)}</blockquote>`,
  ).catch(() => {});

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
