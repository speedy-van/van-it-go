import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDistanceAndDuration } from '@/lib/distance';

const distanceRequestSchema = z.object({
  from: z.object({ lat: z.number(), lng: z.number() }),
  to: z.object({ lat: z.number(), lng: z.number() }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from, to } = distanceRequestSchema.parse(body);

    const result = await getDistanceAndDuration(from, to);

    return NextResponse.json({
      success: true,
      distance: result.distanceKm,
      duration: result.durationMinutes,
      geometry: result.geometry,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Distance calculation failed:', error);
    return NextResponse.json(
      { error: 'Failed to calculate distance' },
      { status: 500 }
    );
  }
}

