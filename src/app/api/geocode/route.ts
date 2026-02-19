import { NextResponse } from 'next/server';
import { z } from 'zod';

const geocodeRequestSchema = z.object({
  address: z.string().min(3),
  limit: z.number().int().min(1).max(5).optional().default(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, limit } = geocodeRequestSchema.parse(body);

    // Call Mapbox Geocoding API
    const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&country=gb&limit=${limit}`;

    const mapboxResponse = await fetch(mapboxUrl);

    if (!mapboxResponse.ok) {
      throw new Error('Mapbox API failed');
    }

    const data = await mapboxResponse.json();

    if (!data.features || data.features.length === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    const results = data.features.map(
      (feature: {
        place_name: string;
        geometry: { coordinates: [number, number] };
        text: string;
      }) => ({
        address: feature.place_name,
        text: feature.text,
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
      })
    );

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Geocoding failed:', error);
    return NextResponse.json(
      { error: 'Failed to geocode address' },
      { status: 500 }
    );
  }
}

