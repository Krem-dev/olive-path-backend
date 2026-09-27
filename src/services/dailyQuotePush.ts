import { Quote } from '../models';
import { sendPushToAll } from './pushService';

export async function sendDailyQuotePush(): Promise<number> {
  const count = await Quote.count({ where: { isActive: true } });
  if (count === 0) return 0;

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const offset = dayOfYear % count;
  const quote = await Quote.findOne({
    where: { isActive: true },
    order: [['id', 'ASC']],
    offset,
  });

  if (!quote) return 0;

  const title = 'Daily Word';
  const body = `"${quote.text}" — ${quote.author}`;

  return sendPushToAll(title, body, { type: 'daily_quote', quoteId: String(quote.id) });
}
