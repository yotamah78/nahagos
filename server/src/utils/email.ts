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

export function bidReceivedEmail({
  customerName,
  driverName,
  carModel,
  price,
  requestId,
  appUrl,
}: {
  customerName: string;
  driverName: string;
  carModel: string;
  price: number;
  requestId: string;
  appUrl: string;
}) {
  return {
    subject: '💬 קיבלת הצעת מחיר חדשה – CarRelay',
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:#16a34a;padding:24px 32px">
          <h1 style="color:white;margin:0;font-size:22px;font-weight:900">CarRelay</h1>
          <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px">הצעת מחיר חדשה</p>
        </div>
        <div style="padding:28px 32px">
          <p style="font-size:16px;font-weight:700;color:#0a0a0a">שלום ${customerName},</p>
          <p style="color:#374151;font-size:14px;line-height:1.6">נהג הגיש הצעת מחיר עבור הרכב שלך.</p>
          <div style="background:#f0fdf4;border-radius:10px;padding:18px;margin:20px 0;border:1px solid #bbf7d0">
            <table style="width:100%;font-size:13px;color:#374151;border-collapse:collapse">
              <tr><td style="padding:5px 0;font-weight:700;color:#6b7280;width:110px">נהג</td><td>${driverName}</td></tr>
              <tr><td style="padding:5px 0;font-weight:700;color:#6b7280">רכב</td><td>${carModel}</td></tr>
              <tr><td style="padding:5px 0;font-weight:700;color:#16a34a;font-size:15px">מחיר</td><td style="font-weight:900;color:#16a34a;font-size:16px">₪${price}</td></tr>
            </table>
          </div>
          <a href="${appUrl}/requests/${requestId}" style="display:inline-block;background:#16a34a;color:white;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px;margin-top:4px">
            צפה בהצעות ←
          </a>
          <p style="color:#6b7280;font-size:12px;margin-top:24px">צוות CarRelay</p>
        </div>
      </div>
    `,
  };
}

export function bidSelectedEmail({
  driverName,
  carModel,
  pickupAddress,
  pickupDatetime,
  price,
  requestId,
  appUrl,
}: {
  driverName: string;
  carModel: string;
  pickupAddress: string;
  pickupDatetime: Date;
  price: number;
  requestId: string;
  appUrl: string;
}) {
  const dateStr = new Intl.DateTimeFormat('he-IL', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Jerusalem',
  }).format(pickupDatetime);

  return {
    subject: '🎉 הצעתך נבחרה! – CarRelay',
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:#16a34a;padding:24px 32px">
          <h1 style="color:white;margin:0;font-size:22px;font-weight:900">CarRelay</h1>
          <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px">הצעתך נבחרה!</p>
        </div>
        <div style="padding:28px 32px">
          <p style="font-size:16px;font-weight:700;color:#0a0a0a">שלום ${driverName},</p>
          <p style="color:#374151;font-size:14px;line-height:1.6">מזל טוב! הלקוח בחר בהצעת המחיר שלך. אנא הגע לכתובת האיסוף בזמן.</p>
          <div style="background:#f0fdf4;border-radius:10px;padding:18px;margin:20px 0;border:1px solid #bbf7d0">
            <table style="width:100%;font-size:13px;color:#374151;border-collapse:collapse">
              <tr><td style="padding:5px 0;font-weight:700;color:#6b7280;width:110px">רכב</td><td>${carModel}</td></tr>
              <tr><td style="padding:5px 0;font-weight:700;color:#6b7280">כתובת איסוף</td><td>${pickupAddress}</td></tr>
              <tr><td style="padding:5px 0;font-weight:700;color:#6b7280">מועד איסוף</td><td>${dateStr}</td></tr>
              <tr><td style="padding:5px 0;font-weight:700;color:#16a34a;font-size:15px">שכרך</td><td style="font-weight:900;color:#16a34a;font-size:16px">₪${price}</td></tr>
            </table>
          </div>
          <a href="${appUrl}/driver/job/${requestId}" style="display:inline-block;background:#16a34a;color:white;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px;margin-top:4px">
            פתח את המשרה ←
          </a>
          <p style="color:#6b7280;font-size:12px;margin-top:24px">צוות CarRelay</p>
        </div>
      </div>
    `,
  };
}

export function driverApprovedEmail({ driverName, appUrl }: { driverName: string; appUrl: string }) {
  return {
    subject: '✅ חשבונך אושר – CarRelay',
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:#16a34a;padding:24px 32px">
          <h1 style="color:white;margin:0;font-size:22px;font-weight:900">CarRelay</h1>
          <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px">חשבון נהג אושר</p>
        </div>
        <div style="padding:28px 32px">
          <p style="font-size:16px;font-weight:700;color:#0a0a0a">שלום ${driverName},</p>
          <p style="color:#374151;font-size:14px;line-height:1.6">חשבונך כנהג ב-CarRelay אושר בהצלחה! תוכל כעת לצפות במשרות זמינות ולהגיש הצעות מחיר.</p>
          <a href="${appUrl}/driver/dashboard" style="display:inline-block;background:#16a34a;color:white;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px;margin-top:16px">
            התחל לעבוד ←
          </a>
          <p style="color:#6b7280;font-size:12px;margin-top:24px">ברוך הבא לצוות!<br/>CarRelay</p>
        </div>
      </div>
    `,
  };
}

export function driverRejectedEmail({
  driverName,
  reason,
}: {
  driverName: string;
  reason?: string;
}) {
  return {
    subject: 'עדכון על בקשת ההצטרפות שלך – CarRelay',
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:#111827;padding:24px 32px">
          <h1 style="color:white;margin:0;font-size:22px;font-weight:900">CarRelay</h1>
          <p style="color:#9ca3af;margin:4px 0 0;font-size:13px">עדכון בקשת הצטרפות</p>
        </div>
        <div style="padding:28px 32px">
          <p style="font-size:16px;font-weight:700;color:#0a0a0a">שלום ${driverName},</p>
          <p style="color:#374151;font-size:14px;line-height:1.6">לאחר בדיקה, בקשת ההצטרפות שלך כנהג לא אושרה בשלב זה.</p>
          ${reason ? `<div style="background:#fef2f2;border-radius:10px;padding:14px 18px;margin:16px 0;border:1px solid #fecaca"><p style="color:#991b1b;font-size:13px;margin:0;font-weight:600">סיבה: ${reason}</p></div>` : ''}
          <p style="color:#374151;font-size:14px;line-height:1.6">ניתן לעדכן את הפרטים ולשלוח בקשה מחדש.</p>
          <p style="color:#6b7280;font-size:12px;margin-top:24px">צוות CarRelay</p>
        </div>
      </div>
    `,
  };
}

export function jobStatusEmail({
  customerName,
  status,
  carModel,
  driverName,
  requestId,
  appUrl,
}: {
  customerName: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  carModel: string;
  driverName: string;
  requestId: string;
  appUrl: string;
}) {
  const isCompleted = status === 'COMPLETED';
  return {
    subject: isCompleted ? '✅ הרכב חזר – CarRelay' : '🚗 הנהג בדרך אליך – CarRelay',
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:#16a34a;padding:24px 32px">
          <h1 style="color:white;margin:0;font-size:22px;font-weight:900">CarRelay</h1>
          <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px">${isCompleted ? 'המשרה הושלמה' : 'עדכון סטטוס'}</p>
        </div>
        <div style="padding:28px 32px">
          <p style="font-size:16px;font-weight:700;color:#0a0a0a">שלום ${customerName},</p>
          <p style="color:#374151;font-size:14px;line-height:1.6">
            ${isCompleted
              ? `הנהג <strong>${driverName}</strong> השלים את המשרה והרכב <strong>${carModel}</strong> בדרך אליך בחזרה.`
              : `הנהג <strong>${driverName}</strong> אסף את הרכב <strong>${carModel}</strong> ובדרך לביצוע השירות.`}
          </p>
          <a href="${appUrl}/requests/${requestId}" style="display:inline-block;background:#16a34a;color:white;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px;margin-top:16px">
            ${isCompleted ? 'כתוב ביקורת ←' : 'עקוב אחר הבקשה ←'}
          </a>
          <p style="color:#6b7280;font-size:12px;margin-top:24px">צוות CarRelay</p>
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
