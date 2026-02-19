import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ id: params.id });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await request.json();
    return NextResponse.json({ id: params.id, updated: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
