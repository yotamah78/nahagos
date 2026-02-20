import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { generateOtp, getOtpExpiry, isOtpValid } from '../../utils/otp';

export async function register(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { phone: data.phone }] },
  });

  if (existing) {
    if (existing.email === data.email) throw new Error('כתובת האימייל כבר רשומה במערכת');
    throw new Error('מספר הטלפון כבר רשום במערכת');
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: data.role,
    },
  });

  const payload = { userId: user.id, role: user.role, email: user.email };
  return {
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error('אימייל או סיסמה שגויים');
  if (user.isSuspended) throw new Error('החשבון הושעה. צור קשר עם התמיכה.');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('אימייל או סיסמה שגויים');

  const payload = { userId: user.id, role: user.role, email: user.email };
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      phoneVerified: user.phoneVerified,
    },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export async function sendOtp(phone: string) {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) throw new Error('מספר טלפון לא נמצא');

  const code = generateOtp();
  const expiresAt = getOtpExpiry();

  await prisma.user.update({
    where: { id: user.id },
    data: { otpCode: code, otpExpiresAt: expiresAt },
  });

  // In production: send SMS via Twilio/etc.
  console.log(`📱 OTP for ${phone}: ${code}`);

  return { message: 'קוד אימות נשלח לטלפון שלך', ...(process.env.NODE_ENV === 'development' ? { code } : {}) };
}

export async function verifyOtp(phone: string, code: string) {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) throw new Error('מספר טלפון לא נמצא');

  if (!isOtpValid(code, user.otpCode, user.otpExpiresAt)) {
    throw new Error('קוד אימות שגוי או פג תוקף');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { phoneVerified: true, otpCode: null, otpExpiresAt: null },
  });

  return { message: 'הטלפון אומת בהצלחה' };
}

export async function refreshTokens(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || user.isSuspended) throw new Error('משתמש לא נמצא');

  const newPayload = { userId: user.id, role: user.role, email: user.email };
  return {
    accessToken: signAccessToken(newPayload),
    refreshToken: signRefreshToken(newPayload),
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      phoneVerified: true,
      emailVerified: true,
      createdAt: true,
      driverProfile: {
        select: {
          verificationStatus: true,
          city: true,
          ratingAvg: true,
          totalJobs: true,
          photoUrl: true,
        },
      },
    },
  });

  if (!user) throw new Error('משתמש לא נמצא');
  return user;
}
