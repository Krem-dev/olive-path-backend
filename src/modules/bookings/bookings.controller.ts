import { Request, Response } from 'express';
import { CounsellingBooking, PastorBooking } from '../../models';
import { success } from '../../utils/response';
import { AuthenticatedRequest } from '../../types/express';
import { sendNotificationEmail } from '../../utils/mailer';
import { escapeHtml } from '../../utils/escapeHtml';

export async function submitCounselling(
  req: Request,
  res: Response,
): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const { fullName, phone, email, type, preferredDate, concern } = req.body;

  const booking = await CounsellingBooking.create({
    userId: auth.user.id,
    fullName,
    phone,
    email: email || null,
    type,
    preferredDate: preferredDate || null,
    concern: concern || null,
  });

  sendNotificationEmail(
    'New Counselling Booking',
    `<p><strong>${escapeHtml(fullName)}</strong> has requested a counselling session.</p>
     <ul>
       <li><strong>Type:</strong> ${escapeHtml(type)}</li>
       <li><strong>Phone:</strong> ${escapeHtml(phone)}</li>
       <li><strong>Email:</strong> ${escapeHtml(email || 'Not provided')}</li>
       <li><strong>Preferred Date:</strong> ${escapeHtml(preferredDate || 'Not specified')}</li>
       <li><strong>Concern:</strong> ${escapeHtml(concern || 'Not provided')}</li>
     </ul>`,
  ).catch(() => {});

  success(res, booking, 201);
}

export async function submitPastor(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const { fullName, church, phone, email, programDate, location, message } =
    req.body;

  const booking = await PastorBooking.create({
    userId: auth.user.id,
    fullName,
    church,
    phone,
    email,
    programDate: programDate || null,
    location: location || null,
    message: message || null,
  });

  sendNotificationEmail(
    'New Pastor Booking Request',
    `<p><strong>${escapeHtml(fullName)}</strong> from <strong>${escapeHtml(church)}</strong> wants to book Ps. Eric for a program.</p>
     <ul>
       <li><strong>Phone:</strong> ${escapeHtml(phone)}</li>
       <li><strong>Email:</strong> ${escapeHtml(email)}</li>
       <li><strong>Program Date:</strong> ${escapeHtml(programDate || 'Not specified')}</li>
       <li><strong>Location:</strong> ${escapeHtml(location || 'Not specified')}</li>
       <li><strong>Message:</strong> ${escapeHtml(message || 'None')}</li>
     </ul>`,
  ).catch(() => {});

  success(res, booking, 201);
}
