import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
  phoneVerified: boolean;
  emailVerified?: boolean;
  driverProfile?: {
    verificationStatus: string;
    city: string;
    ratingAvg: number;
    totalJobs: number;
    photoUrl?: string;
  } | null;
}

export async function register(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'CUSTOMER' | 'DRIVER';
}) {
  const res = await api.post('/auth/register', data);
  return res.data.data as { user: User; accessToken: string; refreshToken: string };
}

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data.data as { user: User; accessToken: string; refreshToken: string };
}

export async function sendOtp(phone: string) {
  const res = await api.post('/auth/send-otp', { phone });
  return res.data.data as { message: string; code?: string };
}

export async function verifyOtp(phone: string, code: string) {
  const res = await api.post('/auth/verify-otp', { phone, code });
  return res.data.data as { message: string };
}

export async function getMe(): Promise<User> {
  const res = await api.get('/auth/me');
  return res.data.data;
}
