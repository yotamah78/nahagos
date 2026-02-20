import api from './api';

export async function submitReview(data: {
  requestId: string;
  rating: number;
  reviewText?: string;
}) {
  const res = await api.post('/reviews', data);
  return res.data.data;
}

export async function getDriverReviews(driverId: string) {
  const res = await api.get(`/reviews/driver/${driverId}`);
  return res.data.data;
}
