import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const likes = (await kv.get<number>(`likes:${slug}`)) || 0;
  return NextResponse.json({ likes });
}

export async function POST(request: Request) {
  const { slug } = await request.json();

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const newLikes = await kv.incr(`likes:${slug}`);
  return NextResponse.json({ likes: newLikes });
}
