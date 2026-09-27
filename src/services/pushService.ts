import './firebase';
import { getApps } from 'firebase-admin/app';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';
import { PushToken } from '../models';

export async function sendPushToUser(
  userId: number,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<number> {
  const tokens = await PushToken.findAll({ where: { userId } });
  if (!tokens.length) return 0;

  return sendPushToTokens(
    tokens.map((t) => t.token),
    title,
    body,
    data,
  );
}

export async function sendPushToAll(
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<number> {
  const tokens = await PushToken.findAll();
  if (!tokens.length) return 0;

  return sendPushToTokens(
    tokens.map((t) => t.token),
    title,
    body,
    data,
  );
}

async function sendPushToTokens(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<number> {
  if (!getApps().length) return 0;

  const message: MulticastMessage = {
    tokens,
    notification: { title, body },
    data,
    android: {
      priority: 'high' as const,
    },
  };

  const response = await getMessaging().sendEachForMulticast(message);

  const invalidIndices: number[] = [];
  response.responses.forEach((resp: { error?: { code: string } }, idx: number) => {
    if (
      resp.error &&
      (resp.error.code === 'messaging/invalid-registration-token' ||
        resp.error.code === 'messaging/registration-token-not-registered')
    ) {
      invalidIndices.push(idx);
    }
  });

  if (invalidIndices.length) {
    const invalidTokens = invalidIndices.map((i) => tokens[i]);
    await PushToken.destroy({ where: { token: invalidTokens } });
  }

  return response.successCount;
}
