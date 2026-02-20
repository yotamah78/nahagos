import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as bidsService from './bids.service';
import { success } from '../../utils/apiResponse';

const submitSchema = z.object({
  requestId: z.string(),
  price: z.number().positive('מחיר חייב להיות חיובי'),
  estimatedReturnTime: z.string().datetime().transform(v => new Date(v)),
  message: z.string().max(500).optional(),
});

const updateSchema = z.object({
  price: z.number().positive().optional(),
  estimatedReturnTime: z.string().datetime().optional().transform(v => v ? new Date(v) : undefined),
  message: z.string().max(500).optional(),
});

export async function submitBid(req: Request, res: Response, next: NextFunction) {
  try {
    const data = submitSchema.parse(req.body);
    const bid = await bidsService.submitBid(req.user!.userId, data);
    success(res, bid, 201);
  } catch (err) {
    next(err);
  }
}

export async function getBidsForRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const bids = await bidsService.getBidsForRequest(req.params.requestId);
    success(res, bids);
  } catch (err) {
    next(err);
  }
}

export async function updateBid(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateSchema.parse(req.body);
    const bid = await bidsService.updateBid(req.user!.userId, req.params.id, data);
    success(res, bid);
  } catch (err) {
    next(err);
  }
}

export async function withdrawBid(req: Request, res: Response, next: NextFunction) {
  try {
    await bidsService.withdrawBid(req.user!.userId, req.params.id);
    success(res, { message: 'הצעה בוטלה בהצלחה' });
  } catch (err) {
    next(err);
  }
}
