import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { payments, bookings, users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/admin/invoices/[id] – single payment (invoice) with full details
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [row] = await db
      .select({
        id: payments.id,
        bookingId: payments.bookingId,
        amount: payments.amount,
        status: payments.status,
        createdAt: payments.createdAt,
        referenceNumber: bookings.referenceNumber,
        pickupAddress: bookings.pickupAddress,
        dropoffAddress: bookings.dropoffAddress,
        serviceType: bookings.serviceType,
        scheduledAt: bookings.scheduledAt,
        quotePrice: bookings.quotePrice,
        customerName: users.name,
        customerEmail: users.email,
      })
      .from(payments)
      .innerJoin(bookings, eq(payments.bookingId, bookings.id))
      .innerJoin(users, eq(payments.userId, users.id))
      .where(eq(payments.id, params.id));

    if (!row) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, invoice: row });
  } catch (error) {
    console.error('Admin invoice get failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}
