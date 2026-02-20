import rateLimit from 'express-rate-limit';

export const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    error: { message: 'יותר מדי ניסיונות. נסה שוב בעוד 15 דקות.' },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
