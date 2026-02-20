import { prisma } from '../../config/database';
import { sendEmail, newRequestNotificationEmail, bidSelectedEmail } from '../../utils/email';
import { env } from '../../config/env';

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
  const request = await prisma.serviceRequest.create({
    data: { customerId, ...data },
  });

  // Notify relevant verified drivers (non-blocking)
  notifyDriversOfNewRequest(request).catch(err =>
    console.error('Failed to notify drivers:', err)
  );

  return request;
}

async function notifyDriversOfNewRequest(request: {
  id: string;
  carModel: string;
  pickupAddress: string;
  pickupDatetime: Date;
}) {
  const drivers = await prisma.user.findMany({
    where: {
      role: 'DRIVER',
      driverProfile: { verificationStatus: 'VERIFIED' },
    },
    select: {
      email: true,
      name: true,
      driverProfile: { select: { city: true } },
    },
  });

  const pickupLower = request.pickupAddress.toLowerCase();
  const appUrl = env.CLIENT_URL;

  // Filter by city match; fall back to all verified drivers if no match
  const relevant = drivers.filter(d => {
    const city = d.driverProfile?.city?.toLowerCase() ?? '';
    return city && pickupLower.includes(city);
  });
  const targets = relevant.length > 0 ? relevant : drivers;

  for (const driver of targets) {
    const { subject, html } = newRequestNotificationEmail({
      driverName: driver.name,
      carModel: request.carModel,
      pickupAddress: request.pickupAddress,
      pickupDatetime: request.pickupDatetime,
      requestId: request.id,
      appUrl,
    });
    await sendEmail({ to: driver.email, subject, html }).catch(err =>
      console.error(`Email to ${driver.email} failed:`, err)
    );
  }
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

  // Notify selected driver (non-blocking)
  prisma.user.findUnique({ where: { id: selectedBid.driverId }, select: { email: true, name: true } })
    .then(driver => {
      if (!driver) return;
      const { subject, html } = bidSelectedEmail({
        driverName: driver.name,
        carModel: request.carModel,
        pickupAddress: request.pickupAddress,
        pickupDatetime: request.pickupDatetime,
        price: Number(selectedBid.price),
        requestId,
        appUrl: env.CLIENT_URL,
      });
      return sendEmail({ to: driver.email, subject, html });
    })
    .catch(err => console.error('bid selected email failed:', err));

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
