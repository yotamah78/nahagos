import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as adminService from './admin.service';
import { success } from '../../utils/apiResponse';

const verifySchema = z.object({
  approve: z.boolean(),
  rejectionReason: z.string().optional(),
});

const suspendSchema = z.object({ suspend: z.boolean() });

export async function getPendingDrivers(req: Request, res: Response, next: NextFunction) {
  try {
    const drivers = await adminService.getPendingDrivers();
    success(res, drivers);
  } catch (err) {
    next(err);
  }
}

export async function getDriverDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const driver = await adminService.getDriverDetail(req.params.id);
    success(res, driver);
  } catch (err) {
    next(err);
  }
}

export async function verifyDriver(req: Request, res: Response, next: NextFunction) {
  try {
    const { approve, rejectionReason } = verifySchema.parse(req.body);
    const result = await adminService.verifyDriver(req.params.id, approve, rejectionReason);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getAllRequests(req: Request, res: Response, next: NextFunction) {
  try {
    const status = req.query.status as string | undefined;
    const requests = await adminService.getAllRequests(status);
    success(res, requests);
  } catch (err) {
    next(err);
  }
}

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await adminService.getAllUsers();
    success(res, users);
  } catch (err) {
    next(err);
  }
}

export async function suspendUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { suspend } = suspendSchema.parse(req.body);
    const user = await adminService.suspendUser(req.params.id, suspend);
    success(res, user);
  } catch (err) {
    next(err);
  }
}

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getStats();
    success(res, stats);
  } catch (err) {
    next(err);
  }
}
