import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { quotes } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Quote ID required' }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, id))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    const q = rows[0];
    return NextResponse.json({
      success: true,
      quote: {
        quoteId: q.id,
        fromPostcode: q.fromPostcode,
        toPostcode: q.toPostcode,
        moveSize: q.moveSize,
        fromAddress: q.fromAddress,
        toAddress: q.toAddress,
        pickupLat: Number(q.pickupLat),
        pickupLng: Number(q.pickupLng),
        dropoffLat: Number(q.dropoffLat),
        dropoffLng: Number(q.dropoffLng),
        priceGBP: Number(q.priceGbp),
        distanceMiles: Number(q.distanceMiles),
        etaMinutes: q.etaMinutes,
        volumeCubicMeters: Number(q.volumeCubicMeters),
      },
    });
  } catch (error) {
    console.error('Quote fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to load quote' },
      { status: 500 }
    );
  }
}
