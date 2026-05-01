import { Request, Response } from 'express';
import { CounsellingBooking, PastorBooking } from '../../models';
import { success } from '../../utils/response';
import { AuthenticatedRequest } from '../../types/express';

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

  success(res, booking, 201);
}
