import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Seed database with test data
    return NextResponse.json({ seeded: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Seed failed' },
      { status: 400 }
    );
  }
}
