import { Redis } from '@upstash/redis';

/**
 * Shared Redis client for the app's small pieces of server state (article
 * like counts, chat rate limiting).
 *
 * Everything provider-specific lives here, so moving to another host — a
 * self-hosted Valkey behind an HTTP proxy, say — is a change to this file
 * and the environment variables, nothing else.
 */

/** Per-request timeout for a single HTTP call to Redis. */
const REQUEST_TIMEOUT_MS = 2500;

/** Hard ceiling for one logical operation, including retries. */
const OPERATION_DEADLINE_MS = 5000;

/**
 * Upstash rejects a URL without a scheme, and some integrations supply a bare
 * hostname. Returns null for anything unusable so callers degrade to "not
 * configured" rather than throwing.
 */
function normalizeUrl(raw: string | undefined): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  // A non-HTTP scheme means the wrong variable was supplied (KV_URL holds a
  // redis:// connection string, which the REST client can't use).
  const scheme = trimmed.match(/^([a-z][a-z0-9+.-]*):\/\//i)?.[1].toLowerCase();
  if (scheme && scheme !== 'http' && scheme !== 'https') return null;

  const withScheme = scheme ? trimmed : `https://${trimmed}`;
  try {
    new URL(withScheme);
    return withScheme;
  } catch {
    return null;
  }
}

// The legacy KV_* names are what the old Vercel KV integration injected; they
// stay as a fallback so an older deployment keeps working mid-migration.
const url = normalizeUrl(process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL);
const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();

/** False when no usable credentials are present, so callers can degrade instead of hanging. */
export const isRedisConfigured = Boolean(url && token);

// Built on first use, never at module scope: `next build` collects page data by
// importing routes, so constructing the client here would turn a bad
// environment variable into a failed build instead of a degraded endpoint.
// `undefined` means "not yet attempted"; `null` means "attempted and failed".
let redis: Redis | null | undefined;

function buildClient(): Redis | null {
  if (!url || !token) return null;

  try {
    return new Redis({
      url,
      token,
      // The default is 5 retries with exponential backoff, which is how an
      // unreachable store turned into FUNCTION_INVOCATION_TIMEOUT rather than
      // a fast, visible failure.
      retry: { retries: 1, backoff: () => 100 },
      signal: () => AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    console.error('[redis] client construction failed:', error);
    return null;
  }
}

export class RedisUnavailableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'RedisUnavailableError';
  }
}

export function client(): Redis {
  if (redis === undefined) redis = buildClient();

  if (!redis) {
    throw new RedisUnavailableError('Redis is not configured (missing or invalid UPSTASH_REDIS_REST_URL / _TOKEN)');
  }
  return redis;
}

/** Runs a Redis call under a hard deadline, normalising every failure mode. */
export async function withDeadline<T>(operation: string, work: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new RedisUnavailableError(`Redis timed out during ${operation}`)),
      OPERATION_DEADLINE_MS
    );
  });

  try {
    return await Promise.race([work, deadline]);
  } catch (cause) {
    if (cause instanceof RedisUnavailableError) throw cause;
    throw new RedisUnavailableError(`Redis failed during ${operation}`, { cause });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Stable, non-reversible id derived from a client address. We never store the
 * raw IP — only a salted digest scoped to `namespace`, so keys from different
 * features can't be cross-referenced to trace one visitor.
 */
export async function anonymousId(namespace: string, ip: string): Promise<string> {
  const salt = process.env.REDIS_ID_SALT ?? 'craigraphics';
  const data = new TextEncoder().encode(`${salt}:${namespace}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(digest))
    .slice(0, 8)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}
