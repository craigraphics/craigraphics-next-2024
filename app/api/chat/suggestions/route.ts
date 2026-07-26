import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';

  // Each of these maps onto a section the knowledge base actually covers, so a
  // suggested question never lands on something the assistant has to deflect.
  //
  // Order matters: WelcomeMessage renders only the first six, so the strongest
  // questions go at the top and the tail is effectively a reserve list.
  const suggestions = {
    en: [
      'What is William building at Disney?',
      'How does William work with LLMs and AI platforms?',
      'What sets William apart as an engineer?',
      "What's an example of a challenge William solved?",
      'What certifications does William have?',
      'What tech does William use and prefer?',
      'What industries has William worked in?',
      'How does William work with teams?',
    ],
    es: [
      '¿Qué está construyendo William en Disney?',
      '¿Cómo trabaja William con LLMs y plataformas de IA?',
      '¿Qué distingue a William como ingeniero?',
      '¿Cuál es un ejemplo de desafío que William resolvió?',
      '¿Qué certificaciones tiene William?',
      '¿Qué tecnologías usa y prefiere William?',
      '¿En qué industrias ha trabajado William?',
      '¿Cómo trabaja William con equipos?',
    ],
  };

  return NextResponse.json({
    suggestions: suggestions[locale as 'en' | 'es'] || suggestions.en,
  });
}
