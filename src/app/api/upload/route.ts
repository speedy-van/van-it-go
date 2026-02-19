import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await request.json();
    return NextResponse.json({ url: 'file-url' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 400 }
    );
  }
}
