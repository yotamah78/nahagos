import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as requestsService from './requests.service';
import { success } from '../../utils/apiResponse';

const createSchema = z.object({
  pickupAddress: z.string().min(5, 'כתובת איסוף חובה'),
  returnAddress: z.string().min(5, 'כתובת החזרה חובה'),
  destinationAddress: z.string().min(5, 'כתובת יעד חובה'),
  pickupDatetime: z.string().datetime().transform(v => new Date(v)),
  maxReturnDatetime: z.string().datetime().optional().transform(v => v ? new Date(v) : undefined),
  notes: z.string().optional(),
  carModel: z.string().min(1, 'דגם רכב חובה'),
  carPlateNumber: z.string().min(5, 'מספר רישוי חובה'),
});

const selectDriverSchema = z.object({ bidId: z.string() });

export async function createRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const request = await requestsService.createRequest(req.user!.userId, data);
    success(res, request, 201);
  } catch (err) {
    next(err);
  }
}

export async function getMyRequests(req: Request, res: Response, next: NextFunction) {
  try {
    const requests = await requestsService.getMyRequests(req.user!.userId);
    success(res, requests);
  } catch (err) {
    next(err);
  }
}

export async function getRequestById(req: Request, res: Response, next: NextFunction) {
  try {
    const request = await requestsService.getRequestById(
      req.params.id,
      req.user!.userId,
      req.user!.role
    );
    success(res, request);
  } catch (err) {
    next(err);
  }
}

export async function cancelRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const request = await requestsService.cancelRequest(req.user!.userId, req.params.id);
    success(res, request);
  } catch (err) {
    next(err);
  }
}

export async function selectDriver(req: Request, res: Response, next: NextFunction) {
  try {
    const { bidId } = selectDriverSchema.parse(req.body);
    const result = await requestsService.selectDriver(req.user!.userId, req.params.id, bidId);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function completeRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const request = await requestsService.completeRequest(req.user!.userId, req.params.id);
    success(res, request);
  } catch (err) {
    next(err);
  }
}
