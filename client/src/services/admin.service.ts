import api from './api';

export async function getPendingDrivers() {
  const res = await api.get('/admin/drivers/pending');
  return res.data.data;
}

export async function getDriverDetail(id: string) {
  const res = await api.get(`/admin/drivers/${id}`);
  return res.data.data;
}

export async function verifyDriver(id: string, approve: boolean, rejectionReason?: string) {
  const res = await api.patch(`/admin/drivers/${id}/verify`, { approve, rejectionReason });
  return res.data.data;
}

export async function getAllRequests(status?: string) {
  const res = await api.get('/admin/requests', { params: status ? { status } : {} });
  return res.data.data;
}

export async function getAllUsers() {
  const res = await api.get('/admin/users');
  return res.data.data;
}

export async function suspendUser(id: string, suspend: boolean) {
  const res = await api.patch(`/admin/users/${id}/suspend`, { suspend });
  return res.data.data;
}

export async function getStats() {
  const res = await api.get('/admin/stats');
  return res.data.data;
}
