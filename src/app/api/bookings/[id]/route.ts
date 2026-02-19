import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { bookings } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, params.id));

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        referenceNumber: booking.referenceNumber,
        customerId: booking.customerId,
        driverId: booking.driverId,
        pickupAddress: booking.pickupAddress,
        dropoffAddress: booking.dropoffAddress,
        status: booking.status,
        scheduledAt: booking.scheduledAt,
        quotePrice: booking.quotePrice,
        serviceType: booking.serviceType,
        notes: booking.notes,
        pickupFloorNumber: booking.pickupFloorNumber,
        pickupFlatUnit: booking.pickupFlatUnit,
        pickupHasLift: booking.pickupHasLift,
        pickupNotes: booking.pickupNotes,
        dropoffFloorNumber: booking.dropoffFloorNumber,
        dropoffFlatUnit: booking.dropoffFlatUnit,
        dropoffHasLift: booking.dropoffHasLift,
        dropoffNotes: booking.dropoffNotes,
        hasCustomizedItems: booking.hasCustomizedItems,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    // Update booking
    return NextResponse.json({ id: params.id, updated: true, ...body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  // Delete booking
  return NextResponse.json({ id: params.id, deleted: true });
}
