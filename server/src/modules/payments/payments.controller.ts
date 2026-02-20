import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as paymentsService from './payments.service';
import { success, error } from '../../utils/apiResponse';
import { env } from '../../config/env';

export async function createPaymentIntent(req: Request, res: Response, next: NextFunction) {
  try {
    const { requestId } = z.object({ requestId: z.string() }).parse(req.body);
    const result = await paymentsService.createPaymentIntent(req.user!.userId, requestId);
    success(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function capturePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { requestId } = z.object({ requestId: z.string() }).parse(req.body);
    const result = await paymentsService.capturePayment(req.user!.userId, requestId);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function webhook(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      error(res, 'Missing Stripe signature', 400);
      return;
    }

    if (env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      // Mock mode - skip webhook verification
      success(res, { received: true });
      return;
    }

    const result = await paymentsService.handleWebhook(
      req.body as Buffer,
      signature as string
    );
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getPaymentForRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const payment = await paymentsService.getPaymentForRequest(req.params.requestId);
    success(res, payment);
  } catch (err) {
    next(err);
  }
}
