import { Router } from 'express';
import express from 'express';
import * as paymentsController from './payments.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const router = Router();

// Stripe webhook - raw body needed
router.post('/webhook', express.raw({ type: 'application/json' }), paymentsController.webhook);

router.use(authenticate);

router.post('/create-intent', requireRole('CUSTOMER'), paymentsController.createPaymentIntent);
router.post('/capture', requireRole('CUSTOMER'), paymentsController.capturePayment);
router.get('/request/:requestId', paymentsController.getPaymentForRequest);

export default router;
