import { env } from '../config/env';

export function generateOtp(): string {
  if (env.OTP_MOCK_MODE) return env.OTP_MOCK_CODE;
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10);
  return expiry;
}

export function isOtpValid(code: string, storedCode: string | null, expiresAt: Date | null): boolean {
  if (!storedCode || !expiresAt) return false;
  if (new Date() > expiresAt) return false;
  return code === storedCode;
}
