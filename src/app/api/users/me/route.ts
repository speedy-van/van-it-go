import { NextResponse } from 'next/server';

export async function GET() {
  // Get current user info
  return NextResponse.json({ id: 'me' });
}
