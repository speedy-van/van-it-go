import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { bookings, users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/server/auth';
import { sendBookingAcceptedByAdminEmail } from '@/lib/email';

/**
 * POST /api/admin/bookings/[id]/accept – set booking status to 'accepted' and notify customer (admin only).
 */
export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session || role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookingId = params.id;

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot accept a cancelled booking' },
        { status: 400 }
      );
    }

    if (booking.status === 'accepted') {
      return NextResponse.json({
        success: true,
        booking,
        message: 'Already accepted',
      });
    }

    await db
      .update(bookings)
      .set({ status: 'accepted', updatedAt: new Date() })
      .where(eq(bookings.id, bookingId));

    const [customer] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, booking.customerId))
      .limit(1);

    if (customer?.email) {
      try {
        await sendBookingAcceptedByAdminEmail(
          customer.email,
          booking.referenceNumber ?? `VG-${bookingId.slice(0, 8)}`
        );
      } catch (emailErr) {
        console.warn('Booking accepted email failed:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      accepted: true,
      message: 'Booking accepted and customer notified',
    });
  } catch (error) {
    console.error('Accept booking failed:', error);
    return NextResponse.json(
      { error: 'Failed to accept booking' },
      { status: 500 }
    );
  }
}
