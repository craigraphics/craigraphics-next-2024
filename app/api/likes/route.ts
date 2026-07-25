import { NextResponse } from 'next/server';
import { addLike, getLikes, hasLiked, isLikesStoreConfigured, voterId } from '@/lib/likes-store';

const UNAVAILABLE = { error: 'Like counts are temporarily unavailable' } as const;

/**
 * Best-effort client address. Vercel sets x-forwarded-for; the fallback keeps
 * local development working, where every request looks like the same voter.
 */
function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  if (!isLikesStoreConfigured) {
    return NextResponse.json(UNAVAILABLE, { status: 503 });
  }

  try {
    const voter = await voterId(slug, clientIp(request));
    const [likes, liked] = await Promise.all([getLikes(slug), hasLiked(slug, voter)]);

    return NextResponse.json({ likes, liked });
  } catch (error) {
    // Reported rather than swallowed: returning 0 here made a dead store look
    // like an article nobody had liked.
    console.error(`[likes] GET failed for "${slug}":`, error);
    return NextResponse.json(UNAVAILABLE, { status: 503 });
  }
}

export async function POST(request: Request) {
  let slug: unknown;

  try {
    ({ slug } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof slug !== 'string' || !slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  if (!isLikesStoreConfigured) {
    return NextResponse.json(UNAVAILABLE, { status: 503 });
  }

  try {
    const voter = await voterId(slug, clientIp(request));
    const { likes, alreadyLiked } = await addLike(slug, voter);

    return NextResponse.json({ likes, liked: true, alreadyLiked });
  } catch (error) {
    console.error(`[likes] POST failed for "${slug}":`, error);
    return NextResponse.json(UNAVAILABLE, { status: 503 });
  }
}
