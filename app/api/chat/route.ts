import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Build the system prompt once at module initialisation — avoids a
// synchronous file read + string allocation on every request.
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

const SYSTEM_PROMPT = buildSystemPrompt();

async function getRateLimitInfo(ip: string): Promise<RateLimitInfo> {
  const limit = 10;
  const windowSecs = 15 * 60;
  const key = `ratelimit:${ip}`;
  try {
    const count = await kv.incr(key);
    if (count === 1) await kv.expire(key, windowSecs);
    if (count > limit) return { allowed: false, remaining: 0 };
    return { allowed: true, remaining: limit - count };
  } catch {
    console.error('Rate limit KV error, allowing request');
    return { allowed: true, remaining: 1 };
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | ErrorResponse>> {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';

    // Check rate limit
    const rateLimit = await getRateLimitInfo(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again in 15 minutes.' }, { status: 429 });
    }

    // Parse request body
    const body = (await request.json()) as RequestBody;
    const { message } = body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required and must be a non-empty string' }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long. Please keep it under 500 characters.' }, { status: 400 });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found');
      return NextResponse.json({ error: 'AI service is not configured. Please try again later.' }, { status: 503 });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message.trim() },
      ],
      max_tokens: 300,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const response = completion.choices[0].message.content;
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Log for monitoring
    console.log(`Chat request - IP: ${ip}, Tokens: ${tokensUsed}, Message length: ${message.length}`);

    return NextResponse.json({
      response: response || 'Sorry, I could not generate a response. Please try again.',
      tokensUsed,
      rateLimit: {
        remaining: rateLimit.remaining,
      },
    });
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
