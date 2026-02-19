import { NextResponse } from 'next/server';
import {
  defaultPricingConfig,
  pricingConfigSchema,
} from '@/lib/pricing';

/**
 * GET /api/admin/pricing-rules – return current pricing configuration.
 * Used by admin pricing page. Quote API uses the same config from lib/pricing.
 */
export async function GET() {
  try {
    const config = defaultPricingConfig;
    const validated = pricingConfigSchema.safeParse(config);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid pricing config', details: validated.error.flatten() },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      config: validated.data,
    });
  } catch (error) {
    console.error('Admin pricing-rules GET failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing rules' },
      { status: 500 }
    );
  }
}
