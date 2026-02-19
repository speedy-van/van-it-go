import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';

const checkoutSchema = z.object({
  amount: z.number().positive(),
  bookingId: z.string().min(1),
  referenceNumber: z.string().optional(),
  bookingData: z.object({
    email: z.string().email(),
    phone: z.string(),
    pickupAddress: z.string(),
    dropoffAddress: z.string(),
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, bookingId, referenceNumber, bookingData } = checkoutSchema.parse(body);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'VanItGo Moving Service',
              description: referenceNumber
                ? `Booking ${referenceNumber} – ${bookingData.pickupAddress} → ${bookingData.dropoffAddress}`
                : `From: ${bookingData.pickupAddress} To: ${bookingData.dropoffAddress}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: bookingData.email,
      client_reference_id: bookingId,
      success_url: `${baseUrl}/book/confirmation/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/book`,
      metadata: {
        bookingId,
        email: bookingData.email,
        phone: bookingData.phone,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      redirectUrl: session.url,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Stripe is not configured')) {
      return NextResponse.json(
        { error: 'Payment provider is not configured. Please try again later.' },
        { status: 503 }
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Checkout creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

