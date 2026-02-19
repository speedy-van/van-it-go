import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * GET /api/admin/customers – list all customers (users with role customer)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- GET handler signature requires request
export async function GET(_req: NextRequest) {
  try {
    const list = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.role, 'customer'))
      .orderBy(desc(users.createdAt));

    return NextResponse.json({
      success: true,
      customers: list,
    });
  } catch (error) {
    console.error('Admin customers list failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
