import { anonymousId, client, isRedisConfigured, withDeadline } from '@/lib/redis';

/** Storage for blog article like counts. See lib/redis.ts for the client itself. */

export const isLikesStoreConfigured = isRedisConfigured;

const countKey = (slug: string) => `likes:${slug}`;
const votersKey = (slug: string) => `likes:voters:${slug}`;

/** Non-reversible per-article id for a voter; the raw IP is never stored. */
export const voterId = (slug: string, ip: string) => anonymousId(`likes:${slug}`, ip);

/** Current like count for an article. Throws if the store is unreachable. */
export async function getLikes(slug: string): Promise<number> {
  const likes = await withDeadline('getLikes', client().get<number>(countKey(slug)));
  return likes ?? 0;
}

/**
 * Record a like, ignoring repeat votes from the same voter.
 *
 * `alreadyLiked` is true when this voter had already liked the article, in
 * which case the count is returned unchanged.
 */
export async function addLike(
  slug: string,
  voter: string
): Promise<{ likes: number; alreadyLiked: boolean }> {
  const isNewVoter = await withDeadline('addLike', client().sadd(votersKey(slug), voter));

  if (isNewVoter === 0) {
    return { likes: await getLikes(slug), alreadyLiked: true };
  }

  const likes = await withDeadline('addLike', client().incr(countKey(slug)));
  return { likes, alreadyLiked: false };
}

/** Whether this voter has already liked the article. */
export async function hasLiked(slug: string, voter: string): Promise<boolean> {
  const member = await withDeadline('hasLiked', client().sismember(votersKey(slug), voter));
  return member === 1;
}
