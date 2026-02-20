import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as authService from './auth.service';
import { success, error } from '../../utils/apiResponse';

const registerSchema = z.object({
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  email: z.string().email('אימייל לא תקין'),
  phone: z.string().regex(/^05\d{8}$/, 'מספר טלפון ישראלי לא תקין (05XXXXXXXX)'),
  password: z.string().min(8, 'סיסמה חייבת להכיל לפחות 8 תווים'),
  role: z.enum(['CUSTOMER', 'DRIVER']),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const phoneSchema = z.object({
  phone: z.string().regex(/^05\d{8}$/),
});

const verifyOtpSchema = z.object({
  phone: z.string().regex(/^05\d{8}$/),
  code: z.string().length(6),
});

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    success(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function sendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone } = phoneSchema.parse(req.body);
    const result = await authService.sendOtp(phone);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, code } = verifyOtpSchema.parse(req.body);
    const result = await authService.verifyOtp(phone, code);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = z.object({ refreshToken: z.string() }).parse(req.body);
    const result = await authService.refreshTokens(refreshToken);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.userId);
    success(res, user);
  } catch (err) {
    next(err);
  }
}
