import { NextResponse } from 'next/server';
import { z } from 'zod';

const geocodeRequestSchema = z.object({
  address: z.string().trim().min(3),
  limit: z.number().int().min(1).max(8).optional().default(5),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, limit } = geocodeRequestSchema.parse(body);

    const token =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.MAPBOX_ACCESS_TOKEN;
    if (!token || token.trim() === '') {
      return NextResponse.json(
        {
          error:
            'Geocoding provider is not configured. Set NEXT_PUBLIC_MAPBOX_TOKEN or MAPBOX_ACCESS_TOKEN.',
        },
        { status: 503 }
      );
    }

    // Call Mapbox Geocoding API (UK-only)
    // https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json
    const mapboxUrl =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json` +
      `?access_token=${token}` +
      `&autocomplete=true` +
      `&countries=gb` +
      `&types=address,postcode` +
      `&limit=${limit}` +
      `&language=en`;

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

    const results = (data.features as Array<{
      place_name: string;
      geometry: { coordinates: [number, number] };
      text: string;
      context?: Array<{ id: string; short_code?: string }>;
    }>)
      .map((feature) => {
        const countryShortCode =
          feature.context?.find((c) => c.id?.startsWith('country'))?.short_code ??
          null;
        const countryCode = countryShortCode?.toUpperCase() === 'GB' ? 'GB' : null;

        return {
          address: feature.place_name,
          text: feature.text,
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
          countryCode,
        };
      })
      .filter((r) => r.countryCode === 'GB');

    if (results.length === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

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

