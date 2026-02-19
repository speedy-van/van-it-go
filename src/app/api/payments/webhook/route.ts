import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { db } from '@/server/db';
import { payments } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { getInvoiceDataByBookingId } from '@/lib/services/invoice';
import { sendPaymentConfirmationWithInvoiceEmail } from '@/lib/email';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!webhookSecret?.trim()) {
    console.warn('STRIPE_WEBHOOK_SECRET not set; webhook not processed');
    return NextResponse.json({ received: true });
  }

  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
    }

    const stripe = getStripe();
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid signature';
      console.error('Stripe webhook signature verification failed:', message);
      return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentStatus = session.payment_status;
      const meta = session.metadata as { bookingId?: string } | null;
      const linkedBookingId = meta?.bookingId;

      if (paymentStatus === 'paid' && linkedBookingId) {
        const paymentIntentId =
          typeof session.payment_intent === 'object' && session.payment_intent?.id
            ? session.payment_intent.id
            : typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.id;

        await db
          .update(payments)
          .set({
            stripePaymentIntentId: paymentIntentId ?? '',
            status: 'completed',
            updatedAt: new Date(),
          })
          .where(eq(payments.bookingId, linkedBookingId));

        const invoiceData = await getInvoiceDataByBookingId(linkedBookingId);
        if (invoiceData) {
          try {
            const { customerEmail, ...data } = invoiceData;
            await sendPaymentConfirmationWithInvoiceEmail(customerEmail, data);
          } catch (emailErr) {
            console.warn('Payment confirmation email (webhook) failed:', emailErr);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook failed:', error);
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 500 }
    );
  }
}
