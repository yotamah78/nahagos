import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = env.EMAIL_SMTP_HOST
  ? nodemailer.createTransport({
      host: env.EMAIL_SMTP_HOST,
      port: env.EMAIL_SMTP_PORT,
      secure: env.EMAIL_SMTP_PORT === 465,
      auth: { user: env.EMAIL_SMTP_USER, pass: env.EMAIL_SMTP_PASS },
    })
  : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!transporter) {
    console.log(`📧 [MOCK EMAIL] To: ${to}`);
    console.log(`   Subject: ${subject}`);
    return;
  }
  await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
}

// ─── Templates ────────────────────────────────────────────────────────────────

export function bidConfirmationEmail({
  driverName,
  carModel,
  pickupAddress,
  price,
}: {
  driverName: string;
  carModel: string;
  pickupAddress: string;
  price: number;
}) {
  return {
    subject: '✅ הצעת המחיר שלך נשלחה בהצלחה – CarRelay',
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:#16a34a;padding:24px 32px">
          <h1 style="color:white;margin:0;font-size:22px;font-weight:900">CarRelay</h1>
          <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px">שירות מסירת רכב חכם</p>
        </div>
        <div style="padding:28px 32px">
          <p style="font-size:16px;font-weight:700;color:#0a0a0a">שלום ${driverName},</p>
          <p style="color:#374151;font-size:14px;line-height:1.6">הצעת המחיר שלך נשלחה ללקוח בהצלחה. נעדכן אותך כשיבחרו בהצעה שלך.</p>
          <div style="background:#f9fafb;border-radius:10px;padding:18px;margin:20px 0;border:1px solid #e5e7eb">
            <table style="width:100%;font-size:13px;color:#374151;border-collapse:collapse">
              <tr><td style="padding:5px 0;font-weight:700;color:#6b7280;width:110px">רכב</td><td>${carModel}</td></tr>
              <tr><td style="padding:5px 0;font-weight:700;color:#6b7280">כתובת איסוף</td><td>${pickupAddress}</td></tr>
              <tr><td style="padding:5px 0;font-weight:700;color:#16a34a;font-size:15px">המחיר שלך</td><td style="font-weight:900;color:#16a34a;font-size:16px">₪${price}</td></tr>
            </table>
          </div>
          <p style="color:#6b7280;font-size:12px;margin-top:24px">בהצלחה!<br/>צוות CarRelay</p>
        </div>
      </div>
    `,
  };
}

export function newRequestNotificationEmail({
  driverName,
  carModel,
  pickupAddress,
  pickupDatetime,
  requestId,
  appUrl,
}: {
  driverName: string;
  carModel: string;
  pickupAddress: string;
  pickupDatetime: Date;
  requestId: string;
  appUrl: string;
}) {
  const dateStr = new Intl.DateTimeFormat('he-IL', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Jerusalem',
  }).format(pickupDatetime);

  return {
    subject: '🚗 משרה חדשה זמינה באזורך – CarRelay',
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:#16a34a;padding:24px 32px">
          <h1 style="color:white;margin:0;font-size:22px;font-weight:900">CarRelay</h1>
          <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px">משרה חדשה ממתינה לך</p>
        </div>
        <div style="padding:28px 32px">
          <p style="font-size:16px;font-weight:700;color:#0a0a0a">שלום ${driverName},</p>
          <p style="color:#374151;font-size:14px;line-height:1.6">פורסמה בקשת שירות חדשה באזורך. היה הראשון להגיש הצעת מחיר!</p>
          <div style="background:#f0fdf4;border-radius:10px;padding:18px;margin:20px 0;border:1px solid #bbf7d0">
            <table style="width:100%;font-size:13px;color:#374151;border-collapse:collapse">
              <tr><td style="padding:5px 0;font-weight:700;color:#6b7280;width:110px">רכב</td><td>${carModel}</td></tr>
              <tr><td style="padding:5px 0;font-weight:700;color:#6b7280">כתובת איסוף</td><td>${pickupAddress}</td></tr>
              <tr><td style="padding:5px 0;font-weight:700;color:#6b7280">מועד איסוף</td><td>${dateStr}</td></tr>
            </table>
          </div>
          <a href="${appUrl}/driver/job/${requestId}" style="display:inline-block;background:#16a34a;color:white;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px;margin-top:4px">
            הגש הצעת מחיר ←
          </a>
          <p style="color:#6b7280;font-size:12px;margin-top:24px">צוות CarRelay</p>
        </div>
      </div>
    `,
  };
}
