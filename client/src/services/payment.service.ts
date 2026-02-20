import api from './api';

export async function createPaymentIntent(requestId: string) {
  const res = await api.post('/payments/create-intent', { requestId });
  return res.data.data as { clientSecret: string; paymentIntentId: string };
}

export async function capturePayment(requestId: string) {
  const res = await api.post('/payments/capture', { requestId });
  return res.data.data;
}

export async function getPaymentForRequest(requestId: string) {
  const res = await api.get(`/payments/request/${requestId}`);
  return res.data.data;
}
