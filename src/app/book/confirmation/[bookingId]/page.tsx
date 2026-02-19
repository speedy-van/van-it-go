import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { getStripe } from '@/lib/stripe';
import { db } from '@/server/db';
import { payments } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { getInvoiceDataByBookingId } from '@/lib/services/invoice';
import { sendPaymentConfirmationWithInvoiceEmail } from '@/lib/email';

async function getBooking(bookingId: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const res = await fetch(`${base}/api/bookings/${bookingId}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.booking ?? null;
}

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  // Stripe Checkout return: segment is session id (cs_xxx)
  if (bookingId.startsWith('cs_')) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(bookingId, {
        expand: ['payment_intent'],
      });
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
            stripePaymentIntentId: paymentIntentId,
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
            console.warn('Payment confirmation email failed:', emailErr);
          }
        }

        redirect(`/book/confirmation/${linkedBookingId}`);
      }
    } catch (e) {
      console.error('Stripe session retrieval failed:', e);
    }
    redirect('/book');
  }

  const booking = await getBooking(bookingId);
  const referenceNumber = booking?.referenceNumber ?? 'VG-····';

  return (
    <Container maxW="md" py={12}>
      <VStack spacing={6} align="stretch" textAlign="center">
        <Heading size="lg" color="#FFB800">
          Booking Confirmation
        </Heading>
        <Box
          p={6}
          bg="#0F0F2A"
          borderRadius="10px"
          borderLeft="4px solid #7B2FFF"
        >
          <Text fontSize="sm" color="#EBF1FF" mb={2}>
            Reference number
          </Text>
          <Text fontSize="2xl" fontWeight="bold" fontFamily="monospace">
            {referenceNumber}
          </Text>
        </Box>
        <Text color="#EBF1FF">
          {booking
            ? 'Your booking has been confirmed. You can track your move from your dashboard.'
            : 'If you just completed payment, your booking is being confirmed.'}
        </Text>
        <Link href="/dashboard/bookings">
          <Button bg="#FFB800" color="#06061A">
            View my bookings
          </Button>
        </Link>
      </VStack>
    </Container>
  );
}
