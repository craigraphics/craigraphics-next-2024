'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Lang } from './types';

const UI = {
  en: {
    kicker: 'Live, in this page',
    title: 'Freeze the thread and watch what dies',
    rafLabel: 'requestAnimationFrame',
    rafSub: 'driven by your JavaScript',
    cssLabel: 'CSS transform',
    cssSub: 'driven by the compositor',
    frames: 'frames drawn',
    typeHere: 'Type in here while it is blocked',
    duration: 'Block for',
    run: 'Block the thread',
    running: 'Blocked…',
    result: 'Result',
    resultText: (ms: number, frames: number) =>
      `Blocked for ${ms} ms. Your JavaScript drew ${frames} frame${frames === 1 ? '' : 's'} in that time. Anything you typed appeared all at once, at the end.`,
    warn: 'This really does lock the page. Scrolling, clicking and typing all stop until the loop is done.',
    note: 'The CSS bar usually keeps sliding, because most browsers run transform animations on a separate compositor thread. That is the same reason a janky page can still look like it is animating while none of your code can run.',
  },
  es: {
    kicker: 'En vivo, en esta página',
    title: 'Congela el hilo y mira qué se muere',
    rafLabel: 'requestAnimationFrame',
    rafSub: 'movido por tu JavaScript',
    cssLabel: 'transform de CSS',
    cssSub: 'movido por el compositor',
    frames: 'cuadros dibujados',
    typeHere: 'Escribe aquí mientras está bloqueado',
    duration: 'Bloquear por',
    run: 'Bloquear el hilo',
    running: 'Bloqueado…',
    result: 'Resultado',
    resultText: (ms: number, frames: number) =>
      `Bloqueado ${ms} ms. Tu JavaScript dibujó ${frames} cuadro${frames === 1 ? '' : 's'} en ese tiempo. Todo lo que escribiste apareció de golpe, al final.`,
    warn: 'Esto bloquea la página de verdad. El scroll, los clics y el teclado se detienen hasta que termina el bucle.',
    note: 'La barra de CSS normalmente sigue moviéndose, porque casi todos los navegadores corren las animaciones de transform en un hilo compositor aparte. Es la misma razón por la que una página trabada puede seguir pareciendo animada mientras nada de tu código puede correr.',
  },
} as const;

const DURATIONS = [500, 2000, 5000];

export default function ThreadProof({ lang = 'en' }: { lang?: Lang }) {
  const t = UI[lang] ?? UI.en;
  const [ms, setMs] = useState(2000);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ ms: number; frames: number } | null>(null);

  const markerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const framesRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      framesRef.current += 1;
      // Triangle wave over 4.8s so it mirrors the CSS bar's 2.4s alternate cycle.
      const phase = ((now - start) % 4800) / 4800;
      const progress = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
      if (markerRef.current) markerRef.current.style.transform = `translateX(${progress * 614}%)`;
      if (counterRef.current) counterRef.current.textContent = String(framesRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const block = () => {
    setRunning(true);
    setResult(null);
    // Yield once so the "blocked" state actually paints before we hog the thread.
    window.setTimeout(() => {
      const framesBefore = framesRef.current;
      const end = performance.now() + ms;
      let sink = 0;
      while (performance.now() < end) sink += Math.sqrt(sink + 1);
      if (sink < 0) return;
      setRunning(false);
      setResult({ ms, frames: framesRef.current - framesBefore });
    }, 0);
  };

  return (
    <div className="not-prose my-10 overflow-hidden rounded-lg border border-border bg-card/60 shadow-sm">
      <header className="border-b border-border bg-muted/40 px-4 py-2.5">
        <p className="m-0 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-secondary">{t.kicker}</p>
        <h4 className="m-0 mt-0.5 text-sm font-bold text-primary">{t.title}</h4>
      </header>

      <div className="space-y-4 p-4">
        <div className="space-y-3">
          <div>
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="font-mono text-[11px] font-bold text-foreground">
                {t.rafLabel} <span className="font-normal text-muted-foreground">· {t.rafSub}</span>
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                <span ref={counterRef} className="tabular-nums text-accent">
                  0
                </span>{' '}
                {t.frames}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full border border-border bg-muted/50">
              <div ref={markerRef} className="h-full w-[14%] rounded-full bg-accent will-change-transform" />
            </div>
          </div>

          <div>
            <div className="mb-1.5 font-mono text-[11px] font-bold text-foreground">
              {t.cssLabel} <span className="font-normal text-muted-foreground">· {t.cssSub}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full border border-border bg-muted/50">
              <div className="el-slide h-full w-[14%] rounded-full bg-secondary" />
            </div>
          </div>
        </div>

        <input
          type="text"
          placeholder={t.typeHere}
          className="w-full rounded border border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-secondary focus:outline-none"
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{t.duration}</span>
          {DURATIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMs(value)}
              aria-pressed={ms === value}
              className={cn(
                'rounded border px-2 py-1 font-mono text-[11px] transition-colors',
                ms === value ? 'border-secondary bg-secondary/15 text-secondary' : 'border-border bg-background text-muted-foreground hover:text-foreground'
              )}
            >
              {value / 1000}s
            </button>
          ))}
          <button
            type="button"
            onClick={block}
            disabled={running}
            className="ml-auto rounded border border-destructive bg-destructive/15 px-3 py-1.5 font-mono text-[11px] font-bold text-destructive transition-colors hover:bg-destructive/25 disabled:opacity-60 dark:text-red-300"
          >
            {running ? t.running : `■ ${t.run}`}
          </button>
        </div>

        <p className="m-0 font-mono text-[10px] leading-relaxed text-muted-foreground">{t.warn}</p>

        {result && (
          <div className="rounded-md border border-dashed border-accent/60 bg-accent/5 px-3 py-2">
            <p className="m-0 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-accent">{t.result}</p>
            <p className="m-0 mt-1 text-[13px] leading-relaxed text-foreground">{t.resultText(result.ms, result.frames)}</p>
          </div>
        )}

        <p className="m-0 border-t border-dashed border-border pt-3 text-[13px] leading-relaxed text-muted-foreground">{t.note}</p>
      </div>
    </div>
  );
}
