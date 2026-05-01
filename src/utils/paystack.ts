import crypto from 'crypto';
import { config } from '../config';

const BASE_URL = 'https://api.paystack.co';

export interface InitializeParams {
  email: string;
  /** Amount in major units (e.g. 40 GHS) — converted to minor units internally. */
  amount: number;
  currency?: string;
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface InitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface VerifyResponse {
  status: 'success' | 'failed' | 'abandoned' | string;
  reference: string;
  amount: number;       // in minor units (e.g. pesewas)
  currency: string;
  paid_at: string | null;
  customer: { email: string };
  metadata: Record<string, unknown> | null;
}

interface PaystackEnvelope<T> {
  status: boolean;
  message: string;
  data: T;
}

async function request<T>(
  path: string,
  init: RequestInit,
): Promise<PaystackEnvelope<T>> {
  if (!config.paystack.secretKey) {
    throw new Error('PAYSTACK_SECRET_KEY is not configured');
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.paystack.secretKey}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const json = (await res.json()) as PaystackEnvelope<T>;
  if (!res.ok || !json.status) {
    throw new Error(json.message || `Paystack ${path} failed`);
  }
  return json;
}

export const paystack = {
  async initialize(params: InitializeParams): Promise<InitializeResponse> {
    const body = {
      email: params.email,
      amount: Math.round(params.amount * 100), // major → minor units
      currency: params.currency || config.defaultCurrency,
      reference: params.reference,
      callback_url: params.callbackUrl || config.paystack.callbackUrl,
      metadata: params.metadata,
    };
    const json = await request<InitializeResponse>('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return json.data;
  },

  async verify(reference: string): Promise<VerifyResponse> {
    const json = await request<VerifyResponse>(
      `/transaction/verify/${encodeURIComponent(reference)}`,
      { method: 'GET' },
    );
    return json.data;
  },

  /**
   * Verify a webhook signature using HMAC-SHA512 of the raw body
   * with the Paystack secret key. Compare against `x-paystack-signature`.
   */
  verifyWebhookSignature(rawBody: string | Buffer, signature: string | undefined): boolean {
    if (!signature || !config.paystack.secretKey) return false;
    const computed = crypto
      .createHmac('sha512', config.paystack.secretKey)
      .update(rawBody)
      .digest('hex');
    return computed === signature;
  },
};
