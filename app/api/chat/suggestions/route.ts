import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';

  const suggestions = {
    en: [
      'What projects has William worked on?',
      'How does William build modern web apps?',
      'What sets William apart as a full-stack developer?',
      "What's an example of a challenge William solved?",
      'What industries has William worked in?',
      'How does William stay up to date with tech?',
      'What tech does William use and prefer?',
      'How does William work with teams?',
    ],
    es: [
      '¿En qué proyectos ha trabajado William?',
      '¿Cómo construye William aplicaciones web modernas?',
      '¿Qué distingue a William como desarrollador full-stack?',
      '¿Cuál es un ejemplo de desafío que William resolvió?',
      '¿En qué industrias ha trabajado William?',
      '¿Cómo se mantiene William actualizado con la tecnología?',
      '¿Qué tecnologías usa y prefiere William?',
      '¿Cómo trabaja William con equipos?',
    ],
  };

  return NextResponse.json({
    suggestions: suggestions[locale as 'en' | 'es'] || suggestions.en,
  });
}
