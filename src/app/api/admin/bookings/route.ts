import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { bookings } from '@/server/db/schema';
import { desc, and, gte, lte } from 'drizzle-orm';

/**
 * GET /api/admin/bookings – list all bookings (admin). Optional fromDate, toDate (ISO).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    const dateFilter =
      fromDate && toDate
        ? and(
            gte(bookings.createdAt, new Date(fromDate)),
            lte(bookings.createdAt, new Date(toDate))
          )
        : undefined;

    const allBookings = await db
      .select()
      .from(bookings)
      .where(dateFilter)
      .orderBy(desc(bookings.createdAt));

    return NextResponse.json({
      success: true,
      bookings: allBookings,
    });
  } catch (error) {
    console.error('Admin bookings list failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
