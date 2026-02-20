import { stripe } from '../../config/stripe';
import { prisma } from '../../config/database';
import { env } from '../../config/env';

export async function createPaymentIntent(customerId: string, requestId: string) {
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { bids: { where: { isSelected: true } } },
  });

  if (!request) throw new Error('בקשה לא נמצאה');
  if (request.customerId !== customerId) throw new Error('אין לך הרשאה');
  if (request.bids.length === 0) throw new Error('לא נבחרה הצעת מחיר');

  const selectedBid = request.bids[0];
  const amount = Math.round(Number(selectedBid.price) * 100); // Convert to agorot
  const commission = Math.round(amount * env.STRIPE_COMMISSION_PERCENT / 100);
  const driverAmount = amount - commission;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'ils',
    capture_method: 'manual',
    metadata: { requestId, customerId, driverId: selectedBid.driverId },
  });

  await prisma.payment.create({
    data: {
      requestId,
      stripePaymentIntentId: paymentIntent.id,
      amount: selectedBid.price,
      commissionAmount: commission / 100,
      driverAmount: driverAmount / 100,
      status: 'PENDING',
    },
  });

  return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
}

export async function capturePayment(customerId: string, requestId: string) {
  const payment = await prisma.payment.findUnique({
    where: { requestId },
    include: { request: true },
  });

  if (!payment) throw new Error('תשלום לא נמצא');
  if (payment.request.customerId !== customerId) throw new Error('אין לך הרשאה');

  await stripe.paymentIntents.capture(payment.stripePaymentIntentId);

  const updated = await prisma.payment.update({
    where: { requestId },
    data: { status: 'CAPTURED' },
  });

  // Update driver stats
  if (payment.request.selectedDriverId) {
    const profile = await prisma.driverProfile.findUnique({
      where: { userId: payment.request.selectedDriverId },
    });
    if (profile) {
      await prisma.driverProfile.update({
        where: { userId: payment.request.selectedDriverId },
        data: { totalJobs: { increment: 1 } },
      });
    }
  }

  return updated;
}

export async function handleWebhook(rawBody: Buffer, signature: string) {
  const event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object;
    await prisma.payment.update({
      where: { stripePaymentIntentId: pi.id },
      data: { status: 'FAILED' },
    });
  }

  return { received: true };
}

export async function getPaymentForRequest(requestId: string) {
  return prisma.payment.findUnique({ where: { requestId } });
}
