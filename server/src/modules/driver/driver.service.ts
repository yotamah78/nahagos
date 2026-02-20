import { prisma } from '../../config/database';

export async function upsertProfile(userId: string, data: {
  city: string;
  bio?: string;
  licenseImageUrl?: string;
  selfieImageUrl?: string;
  photoUrl?: string;
  payoutMethod?: object;
}) {
  const payoutMethodStr = data.payoutMethod ? JSON.stringify(data.payoutMethod) : undefined;
  const profile = await prisma.driverProfile.upsert({
    where: { userId },
    update: {
      city: data.city,
      bio: data.bio,
      licenseImageUrl: data.licenseImageUrl,
      selfieImageUrl: data.selfieImageUrl,
      photoUrl: data.photoUrl,
      payoutMethod: payoutMethodStr,
      verificationStatus: 'PENDING_VERIFICATION',
    },
    create: {
      userId,
      city: data.city,
      bio: data.bio,
      licenseImageUrl: data.licenseImageUrl,
      selfieImageUrl: data.selfieImageUrl,
      photoUrl: data.photoUrl,
      payoutMethod: payoutMethodStr,
    },
  });
  return profile;
}

export async function getMyProfile(userId: string) {
  const profile = await prisma.driverProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { name: true, email: true, phone: true } },
    },
  });
  if (!profile) throw new Error('פרופיל נהג לא נמצא');
  return profile;
}

export async function getPublicProfile(driverId: string) {
  const user = await prisma.user.findUnique({
    where: { id: driverId },
    select: {
      id: true,
      name: true,
      driverProfile: {
        select: {
          verificationStatus: true,
          city: true,
          ratingAvg: true,
          totalJobs: true,
          photoUrl: true,
          bio: true,
        },
      },
    },
  });
  if (!user || !user.driverProfile) throw new Error('נהג לא נמצא');
  return user;
}

export async function getAvailableJobs(userId: string) {
  const profile = await prisma.driverProfile.findUnique({ where: { userId } });
  if (!profile || profile.verificationStatus !== 'VERIFIED') {
    throw new Error('נדרש פרופיל נהג מאומת');
  }

  const jobs = await prisma.serviceRequest.findMany({
    where: {
      status: { in: ['OPEN', 'BIDDING'] },
      selectedDriverId: null,
      // Filter by city - in MVP we compare destination/pickup city loosely
    },
    include: {
      customer: { select: { name: true } },
      bids: { where: { driverId: userId }, select: { id: true } },
      _count: { select: { bids: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return jobs;
}

export async function getMyJobs(userId: string) {
  const jobs = await prisma.serviceRequest.findMany({
    where: { selectedDriverId: userId },
    include: {
      customer: { select: { name: true, phone: true } },
      payment: { select: { driverAmount: true, status: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });
  return jobs;
}

export async function updateJobStatus(driverId: string, requestId: string, status: 'IN_PROGRESS' | 'COMPLETED') {
  const request = await prisma.serviceRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error('משרה לא נמצאה');
  if (request.selectedDriverId !== driverId) throw new Error('אין לך הרשאה לעדכן משרה זו');

  const validTransitions: Record<string, string> = {
    IN_PROGRESS: 'DRIVER_SELECTED',
    COMPLETED: 'IN_PROGRESS',
  };

  if (validTransitions[status] !== request.status) {
    throw new Error(`לא ניתן לעדכן לסטטוס ${status} מסטטוס ${request.status}`);
  }

  const updated = await prisma.serviceRequest.update({
    where: { id: requestId },
    data: { status },
  });

  return updated;
}

export async function getEarnings(userId: string) {
  const payments = await prisma.payment.findMany({
    where: {
      request: { selectedDriverId: userId },
      status: 'CAPTURED',
    },
    include: {
      request: {
        select: {
          carModel: true,
          destinationAddress: true,
          pickupDatetime: true,
          customer: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const total = payments.reduce((sum, p) => sum + Number(p.driverAmount), 0);
  return { total, payments };
}
