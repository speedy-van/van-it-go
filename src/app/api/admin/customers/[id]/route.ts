import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { users, bookings } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * GET /api/admin/customers/[id] – customer with their bookings
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, params.id));

    if (!user || user.role !== 'customer') {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const customerBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.customerId, params.id))
      .orderBy(desc(bookings.createdAt));

    return NextResponse.json({
      success: true,
      customer: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      bookings: customerBookings,
    });
  } catch (error) {
    console.error('Admin customer get failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}
