import { NextResponse } from 'next/server';
import { z } from 'zod';

const locationBodySchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { lat, lng } = locationBodySchema.parse(body);
    // In production: persist to DB and/or broadcast to tracking subscribers
    return NextResponse.json({
      driverId: params.id,
      locationUpdated: true,
      lat,
      lng,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid location', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
