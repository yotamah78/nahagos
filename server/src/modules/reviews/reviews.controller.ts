import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as reviewsService from './reviews.service';
import { success } from '../../utils/apiResponse';

const submitSchema = z.object({
  requestId: z.string(),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().max(1000).optional(),
});

export async function submitReview(req: Request, res: Response, next: NextFunction) {
  try {
    const data = submitSchema.parse(req.body);
    const review = await reviewsService.submitReview(req.user!.userId, data);
    success(res, review, 201);
  } catch (err) {
    next(err);
  }
}

export async function getDriverReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const reviews = await reviewsService.getDriverReviews(req.params.driverId);
    success(res, reviews);
  } catch (err) {
    next(err);
  }
}

export async function getRequestReview(req: Request, res: Response, next: NextFunction) {
  try {
    const review = await reviewsService.getRequestReview(req.params.requestId);
    success(res, review);
  } catch (err) {
    next(err);
  }
}
