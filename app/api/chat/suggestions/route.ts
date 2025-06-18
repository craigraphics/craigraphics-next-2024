import { NextResponse } from 'next/server';

export async function GET() {
  const suggestions = [
    'What projects has William worked on?',
    'How does William build modern web apps?',
    'What sets William apart as a full-stack developer?',
    'What’s an example of a challenge William solved?',
    'What industries has William worked in?',
    'How does William stay up to date with tech?',
    'What tech does William use and prefer?',
    'How does William work with teams?',
  ];

  return NextResponse.json({ suggestions });
}
