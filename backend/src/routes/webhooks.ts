import express from 'express';
import Stripe from 'stripe';
import { prisma } from '../server';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/errors';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Stripe webhook endpoint
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res, next): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err);
    res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    return;
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook processing error:', error);
    next(error);
  }
});

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId }
  });

  if (!user) {
    logger.error(`User not found for Stripe customer: ${customerId}`);
    return;
  }

  // Determine subscription tier based on price ID
  let subscriptionTier = 'FREE';
  if (subscription.items.data.length > 0) {
    const priceId = subscription.items.data[0].price.id;

    // Map price IDs to subscription tiers (you'll need to set these up in Stripe)
    const tierMapping: Record<string, string> = {
      'price_basic': 'BASIC',
      'price_pro': 'PRO',
      'price_unlimited': 'UNLIMITED',
    };

    subscriptionTier = tierMapping[priceId] || 'FREE';
  }

  // Update user subscription
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionTier: subscriptionTier as any,
      creditsRemaining: getCreditsForTier(subscriptionTier)
    }
  });

  // Update or create subscription record
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    },
    create: {
      userId: user.id,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    }
  });

  logger.info(`Subscription updated for user ${user.id}: ${subscriptionTier}`);
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId }
  });

  if (!user) {
    logger.error(`User not found for Stripe customer: ${customerId}`);
    return;
  }

  // Downgrade to free tier
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionTier: 'FREE',
      creditsRemaining: 3 // Free tier credits
    }
  });

  // Update subscription record
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      cancelAtPeriodEnd: true
    }
  });

  logger.info(`Subscription cancelled for user ${user.id}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  logger.info(`Payment succeeded for invoice: ${invoice.id}`);
  // Add any additional logic for successful payments
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  logger.error(`Payment failed for invoice: ${invoice.id}`);
  // Add logic to handle failed payments (e.g., send notification email)
}

function getCreditsForTier(tier: string): number {
  const creditMapping: Record<string, number> = {
    'FREE': 3,
    'BASIC': 15,
    'PRO': 50,
    'UNLIMITED': 999999
  };

  return creditMapping[tier] || 3;
}

export { router as webhookRouter };
