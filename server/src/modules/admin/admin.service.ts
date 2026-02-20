import { prisma } from '../../config/database';

export async function getPendingDrivers() {
  return prisma.driverProfile.findMany({
    where: { verificationStatus: 'PENDING_VERIFICATION' },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getDriverDetail(driverId: string) {
  return prisma.driverProfile.findUnique({
    where: { userId: driverId },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
    },
  });
}

export async function verifyDriver(driverId: string, approve: boolean, rejectionReason?: string) {
  return prisma.driverProfile.update({
    where: { userId: driverId },
    data: {
      verificationStatus: approve ? 'VERIFIED' : 'REJECTED',
      rejectionReason: approve ? null : rejectionReason,
    },
  });
}

export async function getAllRequests(status?: string) {
  return prisma.serviceRequest.findMany({
    where: status ? { status: status as never } : {},
    include: {
      customer: { select: { name: true, phone: true } },
      _count: { select: { bids: true } },
      payment: { select: { status: true, amount: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isSuspended: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function suspendUser(userId: string, suspend: boolean) {
  return prisma.user.update({
    where: { id: userId },
    data: { isSuspended: suspend },
  });
}

export async function getStats() {
  const [
    totalUsers,
    totalDrivers,
    pendingVerifications,
    activeJobs,
    completedJobs,
    totalRevenue,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'DRIVER' } }),
    prisma.driverProfile.count({ where: { verificationStatus: 'PENDING_VERIFICATION' } }),
    prisma.serviceRequest.count({ where: { status: { in: ['DRIVER_SELECTED', 'IN_PROGRESS'] } } }),
    prisma.serviceRequest.count({ where: { status: 'COMPLETED' } }),
    prisma.payment.aggregate({
      where: { status: 'CAPTURED' },
      _sum: { commissionAmount: true },
    }),
  ]);

  return {
    totalUsers,
    totalDrivers,
    pendingVerifications,
    activeJobs,
    completedJobs,
    totalRevenue: totalRevenue._sum.commissionAmount ?? 0,
  };
}
