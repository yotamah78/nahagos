import api from './api';
import type { ServiceRequest } from './requests.service';

export interface DriverProfile {
  id: string;
  userId: string;
  verificationStatus: 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
  licenseImageUrl?: string;
  selfieImageUrl?: string;
  photoUrl?: string;
  city: string;
  bio?: string;
  payoutMethod?: object;
  ratingAvg: number;
  totalJobs: number;
  rejectionReason?: string;
  user?: { name: string; email: string; phone: string };
}

export async function upsertProfile(data: {
  city: string;
  bio?: string;
  licenseImageUrl?: string;
  selfieImageUrl?: string;
  photoUrl?: string;
  payoutMethod?: object;
}) {
  const res = await api.post('/driver/profile', data);
  return res.data.data as DriverProfile;
}

export async function getMyProfile() {
  const res = await api.get('/driver/profile');
  return res.data.data as DriverProfile;
}

export async function getPublicProfile(driverId: string) {
  const res = await api.get(`/driver/profile/${driverId}`);
  return res.data.data;
}

export async function getAvailableJobs() {
  const res = await api.get('/driver/jobs');
  return res.data.data as ServiceRequest[];
}

export async function getMyJobs() {
  const res = await api.get('/driver/my-jobs');
  return res.data.data as ServiceRequest[];
}

export async function updateJobStatus(requestId: string, status: 'IN_PROGRESS' | 'COMPLETED') {
  const res = await api.patch(`/driver/job/${requestId}/status`, { status });
  return res.data.data as ServiceRequest;
}

export async function getEarnings() {
  const res = await api.get('/driver/earnings');
  return res.data.data as { total: number; payments: unknown[] };
}
