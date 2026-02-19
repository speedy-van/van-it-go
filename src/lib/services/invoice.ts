import { db } from '@/server/db';
import { payments, bookings, users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import type { InvoiceEmailData } from '@/lib/email';

export type InvoiceDataForEmail = InvoiceEmailData & { customerEmail: string };

/**
 * Fetches invoice data for a booking (payment + booking + customer) for email.
 * Returns null if no payment found for the booking.
 */
export async function getInvoiceDataByBookingId(
  bookingId: string
): Promise<InvoiceDataForEmail | null> {
  const [row] = await db
    .select({
      paymentId: payments.id,
      amount: payments.amount,
      referenceNumber: bookings.referenceNumber,
      pickupAddress: bookings.pickupAddress,
      dropoffAddress: bookings.dropoffAddress,
      serviceType: bookings.serviceType,
      scheduledAt: bookings.scheduledAt,
      customerName: users.name,
      customerEmail: users.email,
    })
    .from(payments)
    .innerJoin(bookings, eq(payments.bookingId, bookings.id))
    .innerJoin(users, eq(payments.userId, users.id))
    .where(eq(payments.bookingId, bookingId))
    .limit(1);

  if (!row || !row.customerEmail) return null;

  return {
    referenceNumber: row.referenceNumber ?? `VG-${bookingId.slice(0, 8)}`,
    customerName: row.customerName ?? 'Customer',
    amount: row.amount ?? '0',
    serviceType: row.serviceType ?? 'Moving',
    pickupAddress: row.pickupAddress ?? '—',
    dropoffAddress: row.dropoffAddress ?? '—',
    scheduledAt: row.scheduledAt
      ? new Date(row.scheduledAt).toLocaleString()
      : '—',
    paymentId: row.paymentId,
    customerEmail: row.customerEmail,
  };
}
