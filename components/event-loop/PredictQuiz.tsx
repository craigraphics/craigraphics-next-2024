'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { QUIZZES } from './quizzes';
import { Lang } from './types';
import { highlight } from './highlight';

const UI = {
  en: {
    kicker: 'Guess first',
    prompt: 'What order do these log in?',
    reveal: 'Answer',
    right: 'Correct',
    wrong: 'Not quite',
    correctIs: 'The answer is',
    again: 'Try again',
  },
  es: {
    kicker: 'Adivina primero',
    prompt: '¿En qué orden se imprimen?',
    reveal: 'Respuesta',
    right: 'Correcto',
    wrong: 'Casi',
    correctIs: 'La respuesta es',
    again: 'Intentar de nuevo',
  },
} as const;

export default function PredictQuiz({ quiz, lang = 'en' }: { quiz: string; lang?: Lang }) {
  const t = UI[lang] ?? UI.en;
  const data = QUIZZES[quiz];
  const [picked, setPicked] = useState<string | null>(null);

  if (!data) return null;

  const answer = data.options.find((option) => option.correct);
  const chosen = data.options.find((option) => option.id === picked);
  const isRight = Boolean(chosen?.correct);

  return (
    <div className="not-prose my-10 overflow-hidden rounded-lg border border-border bg-card/60 shadow-sm">
      <header className="border-b border-border bg-muted/40 px-4 py-2.5">
        <p className="m-0 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-secondary">{t.kicker}</p>
        <h4 className="m-0 mt-0.5 text-sm font-bold text-primary">{t.prompt}</h4>
      </header>

      <div className="space-y-4 p-4">
        <div className="overflow-x-auto rounded-md border border-border bg-background/70 py-2">
          {data.code.map((line, i) => (
            <div key={i} className="flex gap-3 whitespace-pre px-3 py-[3px] font-mono text-[11px] leading-relaxed sm:text-xs">
              <span className="select-none tabular-nums text-muted-foreground/50">{String(i + 1).padStart(2, ' ')}</span>
              <span>{highlight(line)}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {data.options.map((option) => {
            const isPicked = option.id === picked;
            const showState = picked !== null;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setPicked(option.id)}
                disabled={picked !== null}
                className={cn(
                  'rounded border px-3 py-2 text-left font-mono text-xs transition-colors disabled:cursor-default',
                  !showState && 'border-border bg-background hover:border-secondary hover:text-secondary',
                  showState && option.correct && 'border-accent bg-accent/15 text-accent',
                  showState && !option.correct && isPicked && 'border-destructive bg-destructive/15 text-destructive dark:text-red-300',
                  showState && !option.correct && !isPicked && 'border-border bg-background opacity-50'
                )}
              >
                {option.id}
              </button>
            );
          })}
        </div>

        {picked !== null && chosen && (
          <div
            className={cn(
              'rounded-md border border-dashed px-3 py-2.5',
              isRight ? 'border-accent/60 bg-accent/5' : 'border-destructive/50 bg-destructive/5'
            )}
          >
            <p className={cn('m-0 font-mono text-[10px] font-bold uppercase tracking-[0.16em]', isRight ? 'text-accent' : 'text-destructive dark:text-red-300')}>
              {isRight ? t.right : t.wrong}
            </p>
            <p className="m-0 mt-1.5 text-[13px] leading-relaxed text-foreground sm:text-sm">{chosen.why[lang]}</p>
            {!isRight && answer && (
              <p className="m-0 mt-2 text-[13px] leading-relaxed text-foreground sm:text-sm">
                <span className="font-mono text-xs font-bold text-accent">
                  {t.correctIs} {answer.id}.
                </span>{' '}
                {answer.why[lang]}
              </p>
            )}
            <button
              type="button"
              onClick={() => setPicked(null)}
              className="mt-3 rounded border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-secondary hover:text-secondary"
            >
              ↺ {t.again}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
