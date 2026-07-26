import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { anonymousId, client, isRedisConfigured, withDeadline } from '@/lib/redis';

// Type definitions
interface RequestBody {
  message: string;
}

interface ChatResponse {
  response: string;
  tokensUsed: number;
  rateLimit: {
    remaining: number;
  };
}

interface ErrorResponse {
  error: string;
}

interface RateLimitInfo {
  allowed: boolean;
  remaining: number;
  /** Seconds until the caller's window resets. Only meaningful when denied. */
  retryAfter: number;
}

interface OpenAIError {
  error?: {
    type?: string;
    message?: string;
  };
  message?: string;
}

// Vercel max function duration in seconds (requires Pro plan for >10s)
export const maxDuration = 30;

/**
 * Built on first use, never at module scope: `next build` collects page data by
 * importing route modules, and the SDK throws during construction when the key
 * is missing. Constructing here would turn an unset variable into a failed
 * build rather than a degraded endpoint. See the same pattern in lib/redis.ts.
 *
 * `undefined` means "not yet attempted"; `null` means "no usable key".
 */
let openai: OpenAI | null | undefined;

function openaiClient(): OpenAI | null {
  if (openai === undefined) {
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      // Logged once rather than per request, so a misconfigured environment is
      // visible without flooding the logs.
      console.error('[chat] OPENAI_API_KEY is not set; the endpoint will report itself unavailable');
    }

    openai = apiKey ? new OpenAI({ apiKey }) : null;
  }

  return openai;
}

function buildSystemPrompt(): string {
  let knowledge = 'Knowledge base temporarily unavailable.';
  try {
    const knowledgePath = path.join(process.cwd(), 'william-craig-knowledge.md');
    knowledge = fs.readFileSync(knowledgePath, 'utf8');
  } catch (error) {
    console.error('Error loading William Craig knowledge:', error);
  }
  return `You are an AI assistant representing William Craig, a Senior Software Engineer and Full Stack Developer. Your role is to answer questions about William's professional experience, skills, projects, and career.

IMPORTANT GUIDELINES:
- Only answer questions related to William Craig's professional background, experience, skills, and career
- Be conversational but professional in tone
- Keep responses concise but informative (aim for 1-3 paragraphs)
- If asked about something not covered in the knowledge base, politely suggest contacting William directly
- Don't make up information not in the knowledge base
- If asked personal questions unrelated to his career, redirect to professional topics
- Don't discuss other people's careers or provide general career advice

KNOWLEDGE BASE:
${knowledge}

Remember: You represent William professionally, so maintain a helpful and engaging tone while staying focused on his career and technical expertise.`;
}

let systemPrompt: string | undefined;

/**
 * Built once per instance — a synchronous file read and a large string
 * allocation on every request would be wasteful — but on first use rather than
 * at import, so the read doesn't run during `next build`.
 */
function getSystemPrompt(): string {
  if (systemPrompt === undefined) systemPrompt = buildSystemPrompt();
  return systemPrompt;
}

const LIMIT = 10;
const WINDOW_SECS = 15 * 60;

/**
 * Per-instance fallback for when the shared store can't answer. Fluid Compute
 * reuses instances, so this still throttles meaningfully; it resets on a cold
 * start and isn't shared between instances, which is why it's a fallback and
 * not the primary limiter.
 *
 * The alternative — allowing the request, as this route used to — left the
 * endpoint calling OpenAI unmetered whenever the store was unreachable, which
 * it silently was for a while.
 */
const localHits = new Map<string, { count: number; resetAt: number }>();

/** Bound on `localHits`, so a flood of distinct callers can't grow it forever. */
const MAX_LOCAL_KEYS = 5000;

function pruneLocalHits(now: number): void {
  for (const [key, entry] of localHits) {
    if (entry.resetAt <= now) localHits.delete(key);
  }

  // Still over budget means the window is genuinely full of live entries. Drop
  // the least recently created rather than letting the map grow without bound.
  const excess = localHits.size - MAX_LOCAL_KEYS;
  if (excess > 0) {
    for (const key of [...localHits.keys()].slice(0, excess)) localHits.delete(key);
  }
}

function localRateLimit(id: string): RateLimitInfo {
  const now = Date.now();
  const existing = localHits.get(id);
  const entry = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + WINDOW_SECS * 1000 };

  entry.count += 1;
  localHits.set(id, entry);

  if (localHits.size > MAX_LOCAL_KEYS) pruneLocalHits(now);

  return {
    allowed: entry.count <= LIMIT,
    remaining: Math.max(0, LIMIT - entry.count),
    retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

async function redisRateLimit(id: string): Promise<RateLimitInfo> {
  const key = `ratelimit:${id}`;

  const count = await withDeadline('rate limit', client().incr(key));
  if (count === 1) await withDeadline('rate limit', client().expire(key, WINDOW_SECS));

  if (count <= LIMIT) return { allowed: true, remaining: LIMIT - count, retryAfter: 0 };

  // Only on the deny path: an accurate Retry-After is worth one extra round
  // trip for a caller who is already being turned away, and denials are rare.
  let retryAfter = WINDOW_SECS;
  try {
    const ttl = await withDeadline('rate limit ttl', client().ttl(key));
    if (typeof ttl === 'number' && ttl > 0) retryAfter = ttl;
  } catch (error) {
    console.error('[chat] could not read the rate limit TTL, reporting the full window:', error);
  }

  return { allowed: false, remaining: 0, retryAfter };
}

let warnedAboutStore = false;

/**
 * Throttles on the shared store when it can answer, and on the per-instance
 * limiter when it can't. Never allows an unmetered request: this endpoint calls
 * OpenAI, so "fail open" is a billing decision, not just an availability one.
 */
async function getRateLimitInfo(id: string): Promise<RateLimitInfo> {
  if (!isRedisConfigured) {
    if (!warnedAboutStore) {
      warnedAboutStore = true;
      console.error('[chat] rate limit store is not configured; using the per-instance limiter');
    }
    return localRateLimit(id);
  }

  try {
    return await redisRateLimit(id);
  } catch (error) {
    // Loud on every occurrence: the fallback keeps chat working, and that must
    // not make a dead store look healthy.
    console.error('[chat] rate limit store unavailable, using the per-instance limiter:', error);
    return localRateLimit(id);
  }
}

function rateLimitHeaders(info: RateLimitInfo): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(LIMIT),
    'X-RateLimit-Remaining': String(info.remaining),
  };
}

/**
 * Best-effort client address. Vercel sets x-forwarded-for; the fallback keeps
 * local development working, where every request looks like the same caller.
 */
function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | ErrorResponse>> {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { message } = (body ?? {}) as Partial<RequestBody>;

    // Validated before the rate limit is touched, so a malformed body doesn't
    // burn one of the caller's requests. Nothing billable is reachable from
    // here — these paths call neither the store nor OpenAI.
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required and must be a non-empty string' }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long. Please keep it under 500 characters.' }, { status: 400 });
    }

    // Checked before the rate limit for the same reason: an unconfigured
    // endpoint can't spend anything, so it shouldn't spend the caller's quota.
    const ai = openaiClient();
    if (!ai) {
      return NextResponse.json({ error: 'AI service is not configured. Please try again later.' }, { status: 503 });
    }

    // The raw address is never stored or logged — only a salted digest, the
    // same treatment article likes give it (see lib/likes-store.ts).
    const id = await anonymousId('chat', clientIp(request));
    const rateLimit = await getRateLimitInfo(id);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in 15 minutes.' },
        {
          status: 429,
          headers: { ...rateLimitHeaders(rateLimit), 'Retry-After': String(rateLimit.retryAfter) },
        }
      );
    }

    // Call OpenAI API
    const completion = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: getSystemPrompt() },
        { role: 'user', content: message.trim() },
      ],
      max_tokens: 300,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const response = completion.choices[0]?.message?.content;
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Logged at warn, not log: `removeConsole` in next.config.mjs strips
    // console.log from production builds, so this monitoring line was compiled
    // out of the only environment anyone reads it in. `warn` and `error` are
    // the levels that survive.
    console.warn(`[chat] request from ${id} - tokens: ${tokensUsed}, message length: ${message.length}`);

    return NextResponse.json(
      {
        response: response || 'Sorry, I could not generate a response. Please try again.',
        tokensUsed,
        rateLimit: {
          remaining: rateLimit.remaining,
        },
      },
      { headers: rateLimitHeaders(rateLimit) }
    );
  } catch (error) {
    console.error('Chat API error:', error);

    const typedError = error as OpenAIError;

    // Handle specific OpenAI errors
    if (typedError?.error?.type === 'invalid_api_key') {
      return NextResponse.json({ error: 'AI service configuration error' }, { status: 503 });
    }

    if (typedError?.error?.type === 'insufficient_quota') {
      return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 503 });
    }

    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'healthy',
    service: 'William Craig Chatbot API',
    timestamp: new Date().toISOString(),
    endpoints: {
      chat: 'POST /api/chat',
      suggestions: 'GET /api/chat/suggestions',
    },
  });
}
