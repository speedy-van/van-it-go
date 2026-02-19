import { NextResponse } from 'next/server';

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Mark notification as read
    return NextResponse.json({ id: params.id, read: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
