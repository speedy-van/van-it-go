import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await request.json();
    // Process refund
    return NextResponse.json({ refunded: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Refund failed' },
      { status: 400 }
    );
  }
}
