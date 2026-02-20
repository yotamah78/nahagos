import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as driverService from './driver.service';
import { success } from '../../utils/apiResponse';

const profileSchema = z.object({
  city: z.string().min(1, 'עיר חובה'),
  bio: z.string().optional(),
  licenseImageUrl: z.string().url().optional(),
  selfieImageUrl: z.string().url().optional(),
  photoUrl: z.string().url().optional(),
  payoutMethod: z.object({
    type: z.enum(['bank', 'paypal']),
    details: z.record(z.string()),
  }).optional(),
});

const statusSchema = z.object({
  status: z.enum(['IN_PROGRESS', 'COMPLETED']),
});

export async function upsertProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const data = profileSchema.parse(req.body);
    const profile = await driverService.upsertProfile(req.user!.userId, data);
    success(res, profile, 201);
  } catch (err) {
    next(err);
  }
}

export async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await driverService.getMyProfile(req.user!.userId);
    success(res, profile);
  } catch (err) {
    next(err);
  }
}

export async function getPublicProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await driverService.getPublicProfile(req.params.driverId);
    success(res, profile);
  } catch (err) {
    next(err);
  }
}

export async function getAvailableJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const jobs = await driverService.getAvailableJobs(req.user!.userId);
    success(res, jobs);
  } catch (err) {
    next(err);
  }
}

export async function getMyJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const jobs = await driverService.getMyJobs(req.user!.userId);
    success(res, jobs);
  } catch (err) {
    next(err);
  }
}

export async function updateJobStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = statusSchema.parse(req.body);
    const job = await driverService.updateJobStatus(req.user!.userId, req.params.requestId, status);
    success(res, job);
  } catch (err) {
    next(err);
  }
}

export async function getEarnings(req: Request, res: Response, next: NextFunction) {
  try {
    const earnings = await driverService.getEarnings(req.user!.userId);
    success(res, earnings);
  } catch (err) {
    next(err);
  }
}
