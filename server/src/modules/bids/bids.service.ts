import { prisma } from '../../config/database';

export async function submitBid(driverId: string, data: {
  requestId: string;
  price: number;
  estimatedReturnTime: Date;
  message?: string;
}) {
  // Check request is open for bidding
  const request = await prisma.serviceRequest.findUnique({ where: { id: data.requestId } });
  if (!request) throw new Error('בקשה לא נמצאה');
  if (!['OPEN', 'BIDDING'].includes(request.status)) {
    throw new Error('לא ניתן להגיש הצעה לבקשה זו');
  }

  // Create bid
  const bid = await prisma.bid.create({
    data: {
      requestId: data.requestId,
      driverId,
      price: data.price,
      estimatedReturnTime: data.estimatedReturnTime,
      message: data.message,
    },
  });

  // Move request to BIDDING status
  await prisma.serviceRequest.update({
    where: { id: data.requestId, status: 'OPEN' },
    data: { status: 'BIDDING' },
  }).catch(() => { /* Already in BIDDING - OK */ });

  return bid;
}

export async function getBidsForRequest(requestId: string) {
  return prisma.bid.findMany({
    where: { requestId },
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          driverProfile: {
            select: {
              ratingAvg: true,
              totalJobs: true,
              photoUrl: true,
              verificationStatus: true,
              city: true,
            },
          },
        },
      },
    },
    orderBy: { price: 'asc' },
  });
}

export async function updateBid(driverId: string, bidId: string, data: {
  price?: number;
  estimatedReturnTime?: Date;
  message?: string;
}) {
  const bid = await prisma.bid.findUnique({ where: { id: bidId } });
  if (!bid) throw new Error('הצעה לא נמצאה');
  if (bid.driverId !== driverId) throw new Error('אין לך הרשאה לעדכן הצעה זו');
  if (bid.isSelected) throw new Error('לא ניתן לעדכן הצעה שנבחרה');

  return prisma.bid.update({ where: { id: bidId }, data });
}

export async function withdrawBid(driverId: string, bidId: string) {
  const bid = await prisma.bid.findUnique({ where: { id: bidId } });
  if (!bid) throw new Error('הצעה לא נמצאה');
  if (bid.driverId !== driverId) throw new Error('אין לך הרשאה');
  if (bid.isSelected) throw new Error('לא ניתן למשוך הצעה שנבחרה');

  return prisma.bid.delete({ where: { id: bidId } });
}
