import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { bookings } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * POST /api/bookings/[id]/cancel – set booking status to cancelled
 */
export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [existing] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, params.id));

    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (existing.status === 'cancelled') {
      return NextResponse.json(
        { success: true, booking: existing, message: 'Already cancelled' }
      );
    }

    const [updated] = await db
      .update(bookings)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, params.id))
      .returning();

    return NextResponse.json({
      success: true,
      cancelled: true,
      booking: updated,
    });
  } catch (error) {
    console.error('Cancel booking failed:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
