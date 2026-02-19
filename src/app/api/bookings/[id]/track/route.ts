import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Real-time booking tracking
    return NextResponse.json({
      id: params.id,
      location: { lat: 0, lng: 0 },
      status: 'en_route',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
