import crypto from 'crypto';
import { sendMail } from './mailer';

const otpStore = new Map<string, { code: string; expiresAt: number }>();

export function generateOTP(email: string): string {
  const code = crypto.randomInt(100000, 999999).toString();
  otpStore.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });
  return code;
}

export function verifyOTP(email: string, code: string): boolean {
  const entry = otpStore.get(email.toLowerCase());
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }
  if (entry.code !== code) return false;
  otpStore.delete(email.toLowerCase());
  return true;
}

export async function sendOTPEmail(email: string, code: string): Promise<void> {
  await sendMail({
    to: email,
    subject: 'Olive Path — Verify your email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; text-align: center;">
        <h2 style="color: #0B1D3A;">Verify your email</h2>
        <p style="color: #555;">Use this code to complete your registration:</p>
        <div style="background: #F5F7FA; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #0B1D3A;">${code}</span>
        </div>
        <p style="color: #999; font-size: 13px;">This code expires in 10 minutes.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">Olive Path Network — EBroni Global Media</p>
      </div>
    `,
  });
}
