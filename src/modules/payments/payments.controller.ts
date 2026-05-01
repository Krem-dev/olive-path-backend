import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { Book, BookPurchase, User } from '../../models';
import { paystack } from '../../utils/paystack';
import { success } from '../../utils/response';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../../middleware/error';
import { AuthenticatedRequest } from '../../types/express';
import { paramStr } from '../../utils/params';

/**
 * POST /payments/initialize
 *
 * Body: { bookId }
 * - Free books: creates a 'free' purchase immediately, no Paystack call.
 * - Paid books: creates a 'pending' purchase + Paystack transaction; returns
 *   the authorization_url for the app to open in a WebView/browser.
 */
export async function initialize(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const bookId = parseInt(req.body.bookId, 10);

  const book = await Book.findOne({ where: { id: bookId, isActive: true } });
  if (!book) throw new NotFoundError('Book not found');

  // Already owned?
  const existing = await BookPurchase.findOne({
    where: { userId: auth.user.id, bookId, status: ['paid', 'free'] as any },
  });
  if (existing) throw new ConflictError('You already own this book');

  // Free book — claim instantly
  if (book.price === 0) {
    const purchase = await BookPurchase.create({
      userId: auth.user.id,
      bookId,
      amount: 0,
      currency: book.currency,
      status: 'free',
      paidAt: new Date(),
    });
    success(res, { type: 'free', purchaseId: purchase.id }, 201);
    return;
  }

  // Paid book — initialize Paystack
  const user = await User.findByPk(auth.user.id);
  if (!user) throw new NotFoundError('User not found');

  const reference = `op_${book.id}_${user.id}_${randomUUID().slice(0, 8)}`;

  const tx = await paystack.initialize({
    email: user.email,
    amount: book.price,
    currency: book.currency,
    reference,
    metadata: { userId: user.id, bookId: book.id, bookTitle: book.title },
  });

  await BookPurchase.create({
    userId: user.id,
    bookId,
    amount: book.price,
    currency: book.currency,
    paystackRef: tx.reference,
    status: 'pending',
  });

  success(
    res,
    {
      type: 'paid',
      reference: tx.reference,
      authorizationUrl: tx.authorization_url,
    },
    201,
  );
}

/**
 * GET /payments/verify/:reference
 *
 * App calls this after Paystack redirects back. Idempotent: returns
 * the current purchase status and re-checks Paystack as needed.
 */
export async function verify(req: Request, res: Response): Promise<void> {
  const auth = req as AuthenticatedRequest;
  const reference = paramStr(req.params.reference);

  const purchase = await BookPurchase.findOne({
    where: { paystackRef: reference, userId: auth.user.id },
  });
  if (!purchase) throw new NotFoundError('Transaction not found');

  if (purchase.status === 'paid') {
    success(res, { status: 'paid', bookId: purchase.bookId });
    return;
  }
  if (purchase.status === 'failed') {
    success(res, { status: 'failed', bookId: purchase.bookId });
    return;
  }

  // Still pending — ask Paystack
  const result = await paystack.verify(reference);

  if (result.status === 'success') {
    purchase.status = 'paid';
    purchase.paidAt = result.paid_at ? new Date(result.paid_at) : new Date();
    await purchase.save();
    success(res, { status: 'paid', bookId: purchase.bookId });
    return;
  }

  if (result.status === 'failed' || result.status === 'abandoned') {
    purchase.status = 'failed';
    await purchase.save();
    success(res, { status: 'failed', bookId: purchase.bookId });
    return;
  }

  success(res, { status: 'pending', bookId: purchase.bookId });
}

/**
 * POST /payments/webhook
 *
 * Paystack webhook endpoint. Mounted with `express.raw({ type: 'application/json' })`
 * in index.ts so we can verify the HMAC signature against the raw body.
 */
export async function webhook(req: Request, res: Response): Promise<void> {
  const signature = req.headers['x-paystack-signature'] as string | undefined;
  const rawBody = req.body as Buffer;

  if (!paystack.verifyWebhookSignature(rawBody, signature)) {
    throw new BadRequestError('Invalid webhook signature');
  }

  const event = JSON.parse(rawBody.toString('utf8')) as {
    event: string;
    data: { reference: string; status: string; paid_at?: string };
  };

  if (event.event === 'charge.success') {
    const purchase = await BookPurchase.findOne({
      where: { paystackRef: event.data.reference },
    });
    if (purchase && purchase.status !== 'paid') {
      purchase.status = 'paid';
      purchase.paidAt = event.data.paid_at
        ? new Date(event.data.paid_at)
        : new Date();
      await purchase.save();
    }
  } else if (event.event === 'charge.failed') {
    const purchase = await BookPurchase.findOne({
      where: { paystackRef: event.data.reference },
    });
    if (purchase && purchase.status === 'pending') {
      purchase.status = 'failed';
      await purchase.save();
    }
  }

  // Always 200 — Paystack retries non-2xx responses
  res.status(200).json({ received: true });
}
