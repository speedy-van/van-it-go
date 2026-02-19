import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateCO2 } from '@/utils/helpers';

const carbonEstimateSchema = z.object({
  distanceKm: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { distanceKm } = carbonEstimateSchema.parse(body);

    // Calculate CO2 based on distance (0.229 kg CO2 per km for medium van)
    const co2Grams = calculateCO2(distanceKm);

    // Ecologi offset pricing (approximate: £0.005 per kg CO2)
    const offsetAmount = Number((co2Grams * 0.000005).toFixed(2));

    return NextResponse.json({
      success: true,
      distanceKm,
      estimatedCO2g: co2Grams,
      offsetAmount,
      currency: 'GBP',
      provider: 'ecologi',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Carbon estimation failed:', error);
    return NextResponse.json(
      { error: 'Failed to estimate carbon' },
      { status: 500 }
    );
  }
}

