import { prisma } from '../../config/database';

export async function createRequest(customerId: string, data: {
  pickupAddress: string;
  returnAddress: string;
  destinationAddress: string;
  pickupDatetime: Date;
  maxReturnDatetime?: Date;
  notes?: string;
  carModel: string;
  carPlateNumber: string;
}) {
  return prisma.serviceRequest.create({
    data: { customerId, ...data },
  });
}

export async function getMyRequests(customerId: string) {
  return prisma.serviceRequest.findMany({
    where: { customerId },
    include: {
      _count: { select: { bids: true } },
      payment: { select: { status: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getRequestById(requestId: string, userId: string, role: string) {
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: {
      customer: { select: { id: true, name: true, phone: true } },
      bids: {
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
                },
              },
            },
          },
        },
        orderBy: { price: 'asc' },
      },
      payment: true,
      review: true,
    },
  });

  if (!request) throw new Error('בקשה לא נמצאה');

  // Customers can only see their own requests; drivers can see open/bidding ones
  if (role === 'CUSTOMER' && request.customerId !== userId) {
    throw new Error('אין לך הרשאה לצפות בבקשה זו');
  }

  return request;
}

export async function cancelRequest(customerId: string, requestId: string) {
  const request = await prisma.serviceRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error('בקשה לא נמצאה');
  if (request.customerId !== customerId) throw new Error('אין לך הרשאה לבטל בקשה זו');
  if (!['OPEN', 'BIDDING'].includes(request.status)) {
    throw new Error('ניתן לבטל רק בקשות פתוחות');
  }

  return prisma.serviceRequest.update({
    where: { id: requestId },
    data: { status: 'CANCELLED' },
  });
}

export async function selectDriver(customerId: string, requestId: string, bidId: string) {
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { bids: { where: { id: bidId } } },
  });

  if (!request) throw new Error('בקשה לא נמצאה');
  if (request.customerId !== customerId) throw new Error('אין לך הרשאה');
  if (request.status !== 'BIDDING' && request.status !== 'OPEN') {
    throw new Error('לא ניתן לבחור נהג בשלב זה');
  }
  if (request.bids.length === 0) throw new Error('הצעת מחיר לא נמצאה');

  const selectedBid = request.bids[0];

  // Atomic transaction: select bid + update request
  await prisma.$transaction([
    prisma.bid.update({
      where: { id: bidId },
      data: { isSelected: true },
    }),
    prisma.serviceRequest.update({
      where: { id: requestId },
      data: { selectedDriverId: selectedBid.driverId, status: 'DRIVER_SELECTED' },
    }),
  ]);

  return { message: 'נהג נבחר בהצלחה', driverId: selectedBid.driverId, price: selectedBid.price };
}

export async function completeRequest(customerId: string, requestId: string) {
  const request = await prisma.serviceRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error('בקשה לא נמצאה');
  if (request.customerId !== customerId) throw new Error('אין לך הרשאה');
  if (request.status !== 'IN_PROGRESS') throw new Error('הרכב טרם נלקח לדרך');

  return prisma.serviceRequest.update({
    where: { id: requestId },
    data: { status: 'COMPLETED' },
  });
}
