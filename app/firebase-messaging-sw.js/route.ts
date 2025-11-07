import { NextResponse } from 'next/server';

export async function GET() {
  // Return 404 for firebase-messaging-sw.js requests
  // This prevents it from being matched by the [locale] route
  return new NextResponse(null, { status: 404 });
}

