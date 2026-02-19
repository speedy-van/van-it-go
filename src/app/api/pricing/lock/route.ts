import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculatePriceLock } from '@/lib/pricing';

const priceLockSchema = z.object({
  quotePrice: z.number().positive(),
  lockDays: z.number().int().min(1).max(30).optional().default(7),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = priceLockSchema.parse(body);

    const priceLock = calculatePriceLock(
      validated.quotePrice,
      validated.lockDays
    );

    return NextResponse.json({
      success: true,
      ...priceLock,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Price lock failed:', error);
    return NextResponse.json(
      { error: 'Failed to lock price' },
      { status: 500 }
    );
  }
}

