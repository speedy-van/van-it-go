import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { payments, bookings, users } from '@/server/db/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';

/**
 * GET /api/admin/invoices – list payments (invoices) with booking and customer info
 * Query: fromDate, toDate (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    const dateFilter =
      fromDate && toDate
        ? and(
            gte(payments.createdAt, new Date(fromDate)),
            lte(payments.createdAt, new Date(toDate))
          )
        : undefined;

    const list = await db
      .select({
        id: payments.id,
        bookingId: payments.bookingId,
        userId: payments.userId,
        amount: payments.amount,
        status: payments.status,
        createdAt: payments.createdAt,
        referenceNumber: bookings.referenceNumber,
        pickupAddress: bookings.pickupAddress,
        dropoffAddress: bookings.dropoffAddress,
        serviceType: bookings.serviceType,
        customerName: users.name,
        customerEmail: users.email,
      })
      .from(payments)
      .innerJoin(bookings, eq(payments.bookingId, bookings.id))
      .innerJoin(users, eq(payments.userId, users.id))
      .where(dateFilter)
      .orderBy(desc(payments.createdAt));

    return NextResponse.json({
      success: true,
      invoices: list,
    });
  } catch (error) {
    console.error('Admin invoices list failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
