import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions): Promise<void> {
  if (!config.smtp.user) {
    console.warn('SMTP not configured — skipping email to', to);
    return;
  }

  await transporter.sendMail({
    from: `"Olive Path" <${config.smtp.user}>`,
    to,
    subject,
    html,
  });
}

export async function sendNotificationEmail(
  subject: string,
  body: string,
): Promise<void> {
  const adminEmail = config.smtp.notifyEmail || config.smtp.user;
  if (!adminEmail) return;

  await sendMail({
    to: adminEmail,
    subject: `[Olive Path] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B1D3A;">${subject}</h2>
        <div style="color: #333; line-height: 1.6;">${body}</div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">Olive Path Network — EBroni Global Media</p>
      </div>
    `,
  });
}
