import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  calculateQuote,
  getDistanceEstimate,
  defaultPricingConfig,
} from '@/lib/pricing';
import { getQuoteFromGroq } from '@/lib/groq';

const quoteRequestSchema = z.object({
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  volumeCubicMeters: z.number().min(0.5).max(50),
  serviceType: z.string(),
  itemCount: z.number().int().min(1),
  pickupFloorNumber: z.number().int().min(0).optional(),
  pickupHasLift: z.boolean().optional(),
  dropoffFloorNumber: z.number().int().min(0).optional(),
  dropoffHasLift: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = quoteRequestSchema.parse(body);

    const distanceData = await getDistanceEstimate(
      { lat: validated.pickupLat, lng: validated.pickupLng },
      { lat: validated.dropoffLat, lng: validated.dropoffLng }
    );

    const quoteRequest = {
      distanceKm: distanceData.distanceKm,
      volumeCubicMeters: validated.volumeCubicMeters,
      serviceType: validated.serviceType,
      itemCount: validated.itemCount,
      pickupFloorNumber: validated.pickupFloorNumber,
      pickupHasLift: validated.pickupHasLift,
      dropoffFloorNumber: validated.dropoffFloorNumber,
      dropoffHasLift: validated.dropoffHasLift,
    };

    let quote;
    if (process.env.GROQ_API_KEY) {
      try {
        quote = await getQuoteFromGroq(quoteRequest);
      } catch (groqError) {
        console.warn('Groq pricing failed, using fallback:', groqError);
        quote = calculateQuote(quoteRequest, defaultPricingConfig);
      }
    } else {
      quote = calculateQuote(quoteRequest, defaultPricingConfig);
    }

    return NextResponse.json({
      success: true,
      quote,
      distance: distanceData.distanceKm,
      estimatedDuration: quote.estimatedDurationMinutes,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Quote calculation failed:', error);
    return NextResponse.json(
      { error: 'Failed to calculate quote' },
      { status: 500 }
    );
  }
}

