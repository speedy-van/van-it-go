import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';
import { db } from '@/server/db';
import { payments } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

const createIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('gbp'),
  bookingId: z.string(),
  email: z.string().email(),
  description: z.string(),
  card: z.object({
    number: z.string().regex(/^\d{16}$/),
    exp_month: z.number().min(1).max(12),
    exp_year: z.number().min(2024).max(2100),
    cvc: z.string().regex(/^\d{3}$/),
    name: z.string(),
  }),
  billing: z.object({
    address: z.string(),
    zip: z.string(),
  }),
  saveCard: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount,
      currency,
      bookingId,
      email,
      description,
      card,
      billing,
    } = createIntentSchema.parse(body);

    const stripe = getStripe();

    // Create a payment token from card details
    const token = await stripe.tokens.create({
      card: {
        number: card.number,
        exp_month: card.exp_month.toString(),
        exp_year: card.exp_year.toString(),
        cvc: card.cvc,
      } as Stripe.TokenCreateParams.Card,
    });

    // Create a charge with the token
    const charge = await stripe.charges.create({
      amount: amount,
      currency: currency,
      source: token.id,
      description: description,
      receipt_email: email,
      metadata: {
        bookingId,
        email,
        cardholderName: card.name,
        billingAddress: billing.address,
        billingZip: billing.zip,
      },
      statement_descriptor: 'VanItGo Moving',
    });

    if (charge.paid) {
      // Persist Stripe charge id and mark payment completed
      await db
        .update(payments)
        .set({
          stripePaymentIntentId: charge.id,
          status: 'completed',
          updatedAt: new Date(),
        })
        .where(eq(payments.bookingId, bookingId));

      return NextResponse.json(
        {
          success: true,
          chargeId: charge.id,
          status: 'succeeded',
          amount: charge.amount,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: charge.failure_message || 'Payment was not processed',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment error:', error);

    if (error instanceof Error && error.message.includes('Stripe is not configured')) {
      return NextResponse.json(
        { success: false, error: 'Payment provider is not configured. Please try again later.' },
        { status: 503 }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payment details: ' + error.errors[0].message,
        },
        { status: 400 }
      );
    }

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Payment processing failed',
      },
      { status: 500 }
    );
  }
}
