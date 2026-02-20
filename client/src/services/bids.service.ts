import api from './api';
import type { Bid } from './requests.service';

export async function submitBid(data: {
  requestId: string;
  price: number;
  estimatedReturnTime: string;
  message?: string;
}) {
  const res = await api.post('/bids', data);
  return res.data.data as Bid;
}

export async function getBidsForRequest(requestId: string) {
  const res = await api.get(`/bids/request/${requestId}`);
  return res.data.data as Bid[];
}

export async function withdrawBid(bidId: string) {
  const res = await api.delete(`/bids/${bidId}`);
  return res.data.data;
}
