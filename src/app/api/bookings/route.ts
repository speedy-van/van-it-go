import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { bookings, payments, users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { generateId } from '@/utils/helpers';
import { generateNextReferenceNumber } from '@/lib/booking';
import { sendBookingConfirmedEmail } from '@/lib/email';

/**
 * Resolve customerId to a users.id. If the given id is a known user, use it;
 * otherwise find or create a guest user by email and return their id.
 */
async function resolveCustomerId(
  customerId: string,
  email: string,
  name?: string
): Promise<string> {
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, customerId))
    .limit(1);
  if (existing.length > 0) return existing[0].id;

  const byEmail = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (byEmail.length > 0) return byEmail[0].id;

  const guestName =
    name?.trim() || email.split('@')[0] || 'Guest';
  const userId = generateId();
  await db.insert(users).values({
    id: userId,
    email,
    name: guestName.slice(0, 255),
    passwordHash: null,
    role: 'guest',
  });
  return userId;
}

const bookingSchema = z.object({
  customerId: z.string(),
  name: z.string().optional(),
  pickupAddress: z.string(),
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffAddress: z.string(),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  itemCount: z.number().positive(),
  volumeCubicMeters: z.number().positive(),
  serviceType: z.string().default('house_move'), // Allow any string from frontend
  scheduledDate: z.string().datetime(),
  notes: z.string().optional(),
  pickupFloorNumber: z.number().int().min(0).optional(),
  pickupFlatUnit: z.string().max(50).optional(),
  pickupHasLift: z.boolean().optional(),
  pickupNotes: z.string().optional(),
  dropoffFloorNumber: z.number().int().min(0).optional(),
  dropoffFlatUnit: z.string().max(50).optional(),
  dropoffHasLift: z.boolean().optional(),
  dropoffNotes: z.string().optional(),
  hasCustomizedItems: z.boolean().optional(),
  email: z.string().email(),
  phone: z.string(),
  quotePrice: z.number().positive(),
  distanceKm: z.number().positive().optional(),
  estimatedDuration: z.number().positive().optional(),
  requireHelper: z.boolean().default(false),
  insuranceNeeded: z.boolean().default(false),
  carbonOffset: z.boolean().default(false),
  stripeSessionId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = bookingSchema.parse(body);

    const bookingId = generateId();
    const referenceNumber = await generateNextReferenceNumber();

    const userId = await resolveCustomerId(
      validated.customerId,
      validated.email,
      validated.name
    );

    // Calculate total with add-ons
    let totalPrice = validated.quotePrice;
    if (validated.requireHelper) totalPrice += 50;
    if (validated.insuranceNeeded) totalPrice += 15;

    // Insert booking
    await db.insert(bookings).values({
      id: bookingId,
      referenceNumber,
      customerId: userId,
      pickupAddress: validated.pickupAddress,
      pickupLat: validated.pickupLat.toString(),
      pickupLng: validated.pickupLng.toString(),
      dropoffAddress: validated.dropoffAddress,
      dropoffLat: validated.dropoffLat.toString(),
      dropoffLng: validated.dropoffLng.toString(),
      itemCount: Math.round(validated.itemCount),
      estimatedDistance: (validated.distanceKm || 0).toString(),
      estimatedDuration: Math.round(validated.estimatedDuration ?? 0),
      serviceType: validated.serviceType,
      scheduledAt: new Date(validated.scheduledDate),
      quotePrice: validated.quotePrice.toString(),
      notes: validated.notes ?? null,
      pickupFloorNumber: validated.pickupFloorNumber ?? null,
      pickupFlatUnit: validated.pickupFlatUnit ?? null,
      pickupHasLift: validated.pickupHasLift ?? null,
      pickupNotes: validated.pickupNotes ?? null,
      dropoffFloorNumber: validated.dropoffFloorNumber ?? null,
      dropoffFlatUnit: validated.dropoffFlatUnit ?? null,
      dropoffHasLift: validated.dropoffHasLift ?? null,
      dropoffNotes: validated.dropoffNotes ?? null,
      hasCustomizedItems: validated.hasCustomizedItems ?? null,
      status: 'pending',
    });

    // Insert payment record
    const paymentId = generateId();
    await db.insert(payments).values({
      id: paymentId,
      bookingId,
      userId,
      amount: totalPrice.toString(),
      status: 'pending',
      stripePaymentIntentId: validated.stripeSessionId || '',
    });

    // Send confirmation email
    try {
      await sendBookingConfirmedEmail(validated.email, referenceNumber);
    } catch (emailError) {
      console.warn('Email send failed, but booking created:', emailError);
    }

    return NextResponse.json(
      {
        success: true,
        bookingId,
        referenceNumber,
        totalPrice,
        status: 'pending',
        customerId: userId,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Booking creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json(
        { error: 'customerId is required' },
        { status: 400 }
      );
    }

    const customerBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.customerId, customerId));

    return NextResponse.json({
      success: true,
      bookings: customerBookings,
    });
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
