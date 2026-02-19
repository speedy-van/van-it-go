import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

function getStripeClient(): Stripe {
  if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.trim() === '') {
    throw new Error(
      'Stripe is not configured. Add STRIPE_SECRET_KEY to your .env.local file.'
    );
  }
  return new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
}

/** Lazy-initialized Stripe client. Throws if STRIPE_SECRET_KEY is missing. */
export function getStripe(): Stripe {
  return getStripeClient();
}

export async function createPaymentIntent(
  amount: number,
  currency: string = 'gbp'
) {
  const stripe = getStripe();
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    payment_method_types: ['card'],
  });
}

export async function confirmPayment(paymentIntentId: string) {
  return getStripe().paymentIntents.retrieve(paymentIntentId);
}

export async function refundPayment(
  paymentIntentId: string,
  amount?: number
) {
  return getStripe().refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
  });
}
