import crypto from 'crypto';
import sequelize from '../db/connection';
import { sendMail } from './mailer';

// Create OTP table if it doesn't exist
sequelize.query(`
  CREATE TABLE IF NOT EXISTS otp_codes (
    email VARCHAR(255) PRIMARY KEY,
    code VARCHAR(4) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).catch(() => {});

export async function generateOTP(email: string): Promise<string> {
  const code = crypto.randomInt(1000, 9999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await sequelize.query(
    `REPLACE INTO otp_codes (email, code, expires_at) VALUES (:email, :code, :expiresAt)`,
    { replacements: { email: email.toLowerCase(), code, expiresAt } },
  );

  return code;
}

export async function verifyOTP(email: string, code: string): Promise<boolean> {
  const [rows]: any = await sequelize.query(
    `SELECT code, expires_at AS expiresAt FROM otp_codes WHERE email = :email`,
    { replacements: { email: email.toLowerCase() } },
  );

  if (!rows.length) return false;

  const entry = rows[0];
  const expired = new Date(entry.expiresAt).getTime() < Date.now();

  // Delete regardless — one-time use
  await sequelize.query(
    `DELETE FROM otp_codes WHERE email = :email`,
    { replacements: { email: email.toLowerCase() } },
  );

  if (expired) return false;
  if (entry.code !== code) return false;

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
