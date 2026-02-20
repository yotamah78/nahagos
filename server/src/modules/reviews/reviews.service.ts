import { prisma } from '../../config/database';

export async function submitReview(customerId: string, data: {
  requestId: string;
  rating: number;
  reviewText?: string;
}) {
  const request = await prisma.serviceRequest.findUnique({
    where: { id: data.requestId },
    include: { review: true },
  });

  if (!request) throw new Error('בקשה לא נמצאה');
  if (request.customerId !== customerId) throw new Error('אין לך הרשאה');
  if (request.status !== 'COMPLETED') throw new Error('ניתן לדרג רק לאחר השלמת השירות');
  if (request.review) throw new Error('כבר דירגת עסקה זו');
  if (!request.selectedDriverId) throw new Error('לא נמצא נהג לבקשה');

  const review = await prisma.review.create({
    data: {
      requestId: data.requestId,
      customerId,
      driverId: request.selectedDriverId,
      rating: data.rating,
      reviewText: data.reviewText,
    },
  });

  // Recalculate driver's average rating
  const allReviews = await prisma.review.aggregate({
    where: { driverId: request.selectedDriverId },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.driverProfile.update({
    where: { userId: request.selectedDriverId },
    data: { ratingAvg: allReviews._avg.rating ?? 0 },
  });

  return review;
}

export async function getDriverReviews(driverId: string) {
  return prisma.review.findMany({
    where: { driverId },
    include: {
      customer: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getRequestReview(requestId: string) {
  return prisma.review.findUnique({ where: { requestId } });
}
