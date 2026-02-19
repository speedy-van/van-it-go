import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/utils/helpers';
import { sendWelcomeEmail } from '@/lib/email';

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255).trim(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, name, password } = parsed.data;

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await bcryptjs.hash(password, 12);
    const userId = generateId();

    await db.insert(users).values({
      id: userId,
      email,
      name: name.slice(0, 255),
      passwordHash,
      role: 'customer',
      emailVerified: false,
    });

    try {
      await sendWelcomeEmail(email, name);
    } catch (emailErr) {
      console.warn('Welcome email failed:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Account created. Check your email for a welcome message.',
    });
  } catch (error) {
    console.error('Register failed:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
