import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import {
  bookings,
  payments,
  drivers,
} from '@/server/db/schema';
import {
  count,
  sum,
  eq,
  and,
  gte,
  lte,
} from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/stats
 * Query: fromDate (ISO), toDate (ISO) – optional date range for bookings/revenue
 * Returns: totalBookings, revenue, activeDrivers, suspendedDrivers (pending review = inactive)
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

    const bookingCountResult = await db
      .select({ total: count() })
      .from(bookings)
      .where(dateFilter);

    const totalBookings = Number(bookingCountResult[0]?.total ?? 0);

    const revenueDateFilter =
      fromDate && toDate
        ? and(
            eq(payments.status, 'completed'),
            gte(payments.createdAt, new Date(fromDate)),
            lte(payments.createdAt, new Date(toDate))
          )
        : eq(payments.status, 'completed');

    const revenueResult = await db
      .select({
        total: sum(payments.amount),
      })
      .from(payments)
      .where(revenueDateFilter);

    const revenueRow = revenueResult[0];
    const revenue = revenueRow?.total
      ? Number(revenueRow.total)
      : 0;

    const activeDriversResult = await db
      .select({ total: count() })
      .from(drivers)
      .where(eq(drivers.isActive, true));

    const suspendedDriversResult = await db
      .select({ total: count() })
      .from(drivers)
      .where(eq(drivers.isActive, false));

    const activeDrivers = Number(activeDriversResult[0]?.total ?? 0);
    const suspendedDrivers = Number(suspendedDriversResult[0]?.total ?? 0);

    return NextResponse.json({
      totalBookings,
      revenue,
      activeDrivers,
      suspendedDrivers,
      pendingReviews: suspendedDrivers,
    });
  } catch (error) {
    console.error('Admin stats failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
