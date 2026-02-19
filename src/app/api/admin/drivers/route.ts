import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { drivers, users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/admin/drivers – list all drivers with user info
 */
export async function GET() {
  try {
    const list = await db
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
      .innerJoin(users, eq(drivers.userId, users.id));

    return NextResponse.json({
      success: true,
      drivers: list,
    });
  } catch (error) {
    console.error('Admin drivers list failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}
