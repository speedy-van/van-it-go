import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    // Assign driver to booking
    // body should contain { bookingId: string }
    return NextResponse.json({ driverId: params.id, assigned: true, ...body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
