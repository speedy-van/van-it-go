import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { quotes } from '@/server/db/schema';
import { getDistanceEstimate, calculateQuote, defaultPricingConfig } from '@/lib/pricing';
import { geocodePostcode, kmToMiles } from '@/lib/geocode';
import { generateId } from '@/utils/helpers';

const widgetSchema = z.object({
  fromPostcode: z.string().min(2).max(20).transform((s) => s.trim().toUpperCase()),
  toPostcode: z.string().min(2).max(20).transform((s) => s.trim().toUpperCase()),
  moveSize: z.enum(['small', 'medium', 'large']),
});

const moveSizeToVolume: Record<'small' | 'medium' | 'large', number> = {
  small: 5,
  medium: 10,
  large: 20,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromPostcode, toPostcode, moveSize } = widgetSchema.parse(body);

    const [fromGeo, toGeo] = await Promise.all([
      geocodePostcode(fromPostcode),
      geocodePostcode(toPostcode),
    ]);

    const distanceData = await getDistanceEstimate(
      { lat: fromGeo.lat, lng: fromGeo.lng },
      { lat: toGeo.lat, lng: toGeo.lng }
    );

    const volumeCubicMeters = moveSizeToVolume[moveSize];
    const quoteRequest = {
      distanceKm: distanceData.distanceKm,
      volumeCubicMeters,
      serviceType: 'house_move',
      itemCount: 5,
    };

    const quote = calculateQuote(quoteRequest, defaultPricingConfig);
    const priceGBP = Math.round(quote.totalPrice * 100) / 100;
    const distanceMiles = kmToMiles(distanceData.distanceKm);
    const etaMinutes = quote.estimatedDurationMinutes;

    const quoteId = generateId();
    await db.insert(quotes).values({
      id: quoteId,
      fromPostcode,
      toPostcode,
      moveSize,
      fromAddress: fromGeo.address ?? null,
      toAddress: toGeo.address ?? null,
      pickupLat: String(fromGeo.lat),
      pickupLng: String(fromGeo.lng),
      dropoffLat: String(toGeo.lat),
      dropoffLng: String(toGeo.lng),
      priceGbp: String(priceGBP),
      distanceMiles: String(distanceMiles),
      etaMinutes,
      volumeCubicMeters: String(volumeCubicMeters),
    });

    return NextResponse.json({
      success: true,
      quoteId,
      priceGBP,
      distanceMiles,
      etaMinutes,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid postcodes or move size', details: error.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Failed to get quote';
    if (message.includes('not found') || message.includes('Address not found')) {
      return NextResponse.json(
        { success: false, error: 'One or both postcodes could not be found. Please use valid UK postcodes.' },
        { status: 404 }
      );
    }
    console.error('Quote widget failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate quote. Please try again.' },
      { status: 500 }
    );
  }
}
