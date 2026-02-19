import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- required by Next.js middleware signature
export async function middleware(_request: NextRequest) {
  // Temporarily disabled for testing
  // TODO: Fix NextAuth v5 integration
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/driver/:path*',
    '/admin/:path*',
    '/book/:path*',
  ],
};
