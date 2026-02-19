import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { drivers, users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/admin/drivers/[id] – single driver with user info
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [row] = await db
      .select({
        id: drivers.id,
        userId: drivers.userId,
        licenseNumber: drivers.licenseNumber,
        licenseExpiry: drivers.licenseExpiry,
        insuranceExpiry: drivers.insuranceExpiry,
        rating: drivers.rating,
        completedJobs: drivers.completedJobs,
        isActive: drivers.isActive,
        createdAt: drivers.createdAt,
        updatedAt: drivers.updatedAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(drivers)
      .innerJoin(users, eq(drivers.userId, users.id))
      .where(eq(drivers.id, params.id));

    if (!row) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, driver: row });
  } catch (error) {
    console.error('Admin driver get failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/drivers/[id] – suspend or approve driver
 * Body: { isActive: boolean }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const isActive = body.isActive as boolean | undefined;
    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive (boolean) required' },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(drivers)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(drivers.id, params.id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      driver: updated,
      message: isActive ? 'Driver approved' : 'Driver suspended',
    });
  } catch (error) {
    console.error('Admin driver update failed:', error);
    return NextResponse.json(
      { error: 'Failed to update driver' },
      { status: 500 }
    );
  }
}
