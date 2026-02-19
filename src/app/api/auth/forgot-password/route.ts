import { NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { db } from '@/server/db';
import { users, passwordResetTokens } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/utils/helpers';
import { sendPasswordResetEmail } from '@/lib/email';

const RESET_EXPIRY_MINUTES = 60;

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const [user] = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists for this email, you will receive a reset link.',
      });
    }

    if (!user.id) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const expiresAt = new Date(Date.now() + RESET_EXPIRY_MINUTES * 60 * 1000);
    const token = nanoid(48);
    const id = generateId();

    await db.insert(passwordResetTokens).values({
      id,
      userId: user.id,
      token,
      expiresAt,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;

    try {
      await sendPasswordResetEmail(email, resetLink, RESET_EXPIRY_MINUTES);
    } catch (emailErr) {
      console.error('Forgot password email failed:', emailErr);
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, id));
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists for this email, you will receive a reset link.',
    });
  } catch (error) {
    console.error('Forgot password failed:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
