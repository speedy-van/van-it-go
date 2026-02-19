import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { bookings } from '@/server/db/schema';
import { eq, or, desc } from 'drizzle-orm';

/**
 * GET /api/drivers/[id]/jobs – bookings for this driver (assigned) or pending.
 * Includes referenceNumber for display in Driver section.
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const driverId = params.id;

    const driverBookings = await db
      .select()
      .from(bookings)
      .where(
        or(
          eq(bookings.driverId, driverId),
          eq(bookings.status, 'pending')
        )
      )
      .orderBy(desc(bookings.createdAt));

    return NextResponse.json({
      success: true,
      jobs: driverBookings,
    });
  } catch (error) {
    console.error('Driver jobs fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
