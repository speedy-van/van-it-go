import { z } from 'zod';
import { getDistanceAndDuration } from '@/lib/distance';

export const pricingConfigSchema = z.object({
  basePrice: z.number().positive(),
  pricePerKm: z.number().positive(),
  pricePerCubicMeter: z.number().positive(),
  minPrice: z.number().positive(),
  serviceMultipliers: z.record(z.string(), z.number().positive()),
  bulkDiscount: z.object({
    volumeThreshold: z.number().positive(),
    discountPercent: z.number().min(0).max(100),
  }),
});

export type PricingConfig = z.infer<typeof pricingConfigSchema>;

// Default pricing configuration
export const defaultPricingConfig: PricingConfig = {
  basePrice: 35, // £35 base fee
  pricePerKm: 1.5, // £1.50 per km
  pricePerCubicMeter: 15, // £15 per cubic meter
  minPrice: 60, // Minimum £60
  serviceMultipliers: {
    house_move: 1.0,
    office_move: 1.2,
    single_item: 0.8,
    student_move: 0.9,
    ebay_delivery: 0.7,
  },
  bulkDiscount: {
    volumeThreshold: 20, // 20+ cubic meters
    discountPercent: 10, // 10% discount
  },
};

export interface QuoteRequest {
  distanceKm: number;
  volumeCubicMeters: number;
  serviceType: string;
  itemCount: number;
  pickupPostcode?: string;
  dropoffPostcode?: string;
  /** Floor number (0 = ground). No lift = stairs surcharge. */
  pickupFloorNumber?: number;
  pickupHasLift?: boolean;
  dropoffFloorNumber?: number;
  dropoffHasLift?: boolean;
}

export interface QuoteResponse {
  basePrice: number;
  distancePrice: number;
  volumePrice: number;
  subtotal: number;
  discount: number;
  totalPrice: number;
  estimatedDurationMinutes: number;
  currency: string;
  validUntil: Date;
  breakdown: {
    base: number;
    distance: number;
    volume: number;
    serviceMultiplier: number;
  };
}

export function calculateQuote(
  request: QuoteRequest,
  config: PricingConfig = defaultPricingConfig
): QuoteResponse {
  // Get service multiplier
  const multiplier = config.serviceMultipliers[request.serviceType] || 1.0;

  // Calculate components
  const basePrice = config.basePrice;
  const distancePrice = request.distanceKm * config.pricePerKm;
  const volumePrice = request.volumeCubicMeters * config.pricePerCubicMeter;

  // Floor/stairs surcharge: £5 per floor when no lift (pickup + dropoff)
  let floorSurcharge = 0;
  const floorFeePerLevel = 5;
  if ((request.pickupFloorNumber ?? 0) > 0 && !request.pickupHasLift) {
    floorSurcharge += (request.pickupFloorNumber ?? 0) * floorFeePerLevel;
  }
  if ((request.dropoffFloorNumber ?? 0) > 0 && !request.dropoffHasLift) {
    floorSurcharge += (request.dropoffFloorNumber ?? 0) * floorFeePerLevel;
  }

  // Apply service multiplier to all components
  const subtotal =
    (basePrice + distancePrice + volumePrice + floorSurcharge) * multiplier;

  // Calculate bulk discount
  let discount = 0;
  if (
    request.volumeCubicMeters >= config.bulkDiscount.volumeThreshold
  ) {
    discount = subtotal * (config.bulkDiscount.discountPercent / 100);
  }

  let totalPrice = subtotal - discount;

  // Apply minimum price
  totalPrice = Math.max(totalPrice, config.minPrice);

  // Estimate duration: 30 min base + 5 min per km + 3 min per cubic meter
  const estimatedDurationMinutes =
    30 + request.distanceKm * 5 + request.volumeCubicMeters * 3;

  // Validity: quote valid for 24 hours
  const validUntil = new Date();
  validUntil.setHours(validUntil.getHours() + 24);

  return {
    basePrice,
    distancePrice,
    volumePrice,
    subtotal,
    discount,
    totalPrice: Math.round(totalPrice * 100) / 100,
    estimatedDurationMinutes,
    currency: 'GBP',
    validUntil,
    breakdown: {
      base: basePrice,
      distance: distancePrice,
      volume: volumePrice,
      serviceMultiplier: multiplier,
    },
  };
}

export function calculatePriceLock(
  quotePrice: number,
  lockDays: number = 7
): {
  lockFee: number;
  lockedPrice: number;
  expiresAt: Date;
} {
  // Price lock fee: 2% of quote price, minimum £5, maximum £25
  const lockFee = Math.min(
    25,
    Math.max(5, quotePrice * 0.02)
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + lockDays);

  return {
    lockFee: Math.round(lockFee * 100) / 100,
    lockedPrice: Math.round((quotePrice + lockFee) * 100) / 100,
    expiresAt,
  };
}

// Estimate distance and duration via Mapbox. Use from server only (e.g. API routes).
export async function getDistanceEstimate(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): Promise<{ distanceKm: number; durationMinutes: number }> {
  try {
    const result = await getDistanceAndDuration(from, to);
    return {
      distanceKm: result.distanceKm,
      durationMinutes: result.durationMinutes,
    };
  } catch (error) {
    console.error('Distance estimation failed:', error);
    return { distanceKm: 0, durationMinutes: 0 };
  }
}
