import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { error } from '../utils/apiResponse';

export async function requireVerifiedDriver(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    error(res, 'נדרשת הזדהות', 401);
    return;
  }

  const profile = await prisma.driverProfile.findUnique({
    where: { userId: req.user.userId },
    select: { verificationStatus: true },
  });

  if (!profile || profile.verificationStatus !== 'VERIFIED') {
    error(res, 'פרופיל הנהג טרם אושר. יש להמתין לאישור מנהל.', 403);
    return;
  }

  next();
}
