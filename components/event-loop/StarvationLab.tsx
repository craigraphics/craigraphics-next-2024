'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Lang } from './types';

const BUDGET_MS = 1200;
const MAX_ITERATIONS = 5_000_000;

type Mode = 'micro' | 'task';
type Result = { iterations: number; frames: number; elapsed: number };

const UI = {
  en: {
    kicker: 'Live, in this page',
    title: 'Same loop, two queues, opposite outcomes',
    microBtn: 'Run a microtask chain',
    taskBtn: 'Run a task chain',
    running: 'Running…',
    iterations: 'callbacks run',
    frames: 'frames painted',
    elapsed: 'elapsed',
    microName: 'queueMicrotask',
    taskName: 'setTimeout(fn, 0)',
    idle: 'not run yet',
    verdictMicro: (frames: number) =>
      `${frames} frame${frames === 1 ? '' : 's'} painted. Rendering is a step in the event loop, and that step does not come until the microtask queue is empty. This loop kept refilling it.`,
    verdictTask: (frames: number) =>
      `${frames} frame${frames === 1 ? '' : 's'} painted. Each turn is a separate task, so the browser got to render between them.`,
    footnote:
      'Both runs are capped at 1.2 seconds. Notice the callback counts too: the task version is far slower per callback, because browsers clamp nested setTimeout to about 4ms after a few levels.',
  },
  es: {
    kicker: 'En vivo, en esta página',
    title: 'El mismo bucle, dos colas, resultados opuestos',
    microBtn: 'Correr una cadena de microtareas',
    taskBtn: 'Correr una cadena de tareas',
    running: 'Corriendo…',
    iterations: 'callbacks ejecutados',
    frames: 'cuadros pintados',
    elapsed: 'tiempo',
    microName: 'queueMicrotask',
    taskName: 'setTimeout(fn, 0)',
    idle: 'sin ejecutar',
    verdictMicro: (frames: number) =>
      `${frames} cuadro${frames === 1 ? '' : 's'} pintado${frames === 1 ? '' : 's'}. Renderizar es un paso del event loop, y ese paso no llega hasta que la cola de microtareas esté vacía. Este bucle la seguía rellenando.`,
    verdictTask: (frames: number) =>
      `${frames} cuadro${frames === 1 ? '' : 's'} pintado${frames === 1 ? '' : 's'}. Cada vuelta es una tarea distinta, así que el navegador pudo renderizar entre una y otra.`,
    footnote:
      'Ambas corridas están limitadas a 1.2 segundos. Fíjate también en la cantidad de callbacks: la versión con tareas es muchísimo más lenta por callback, porque los navegadores limitan los setTimeout anidados a unos 4ms después de algunos niveles.',
  },
} as const;

export default function StarvationLab({ lang = 'en' }: { lang?: Lang }) {
  const t = UI[lang] ?? UI.en;
  const [running, setRunning] = useState<Mode | null>(null);
  const [results, setResults] = useState<Partial<Record<Mode, Result>>>({});
  const framesRef = useRef(0);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      framesRef.current += 1;
      const phase = (now % 3200) / 3200;
      const progress = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
      if (pulseRef.current) pulseRef.current.style.transform = `translateX(${progress * 733}%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const run = (mode: Mode) => {
    setRunning(mode);
    setResults((prev) => ({ ...prev, [mode]: undefined }));

    // Yield first so the "running" label paints before the loop starts.
    window.setTimeout(() => {
      const framesBefore = framesRef.current;
      const started = performance.now();
      let iterations = 0;

      const finish = () => {
        setResults((prev) => ({
          ...prev,
          [mode]: { iterations, frames: framesRef.current - framesBefore, elapsed: Math.round(performance.now() - started) },
        }));
        setRunning(null);
      };

      const step = () => {
        iterations += 1;
        if (performance.now() - started < BUDGET_MS && iterations < MAX_ITERATIONS) {
          if (mode === 'micro') queueMicrotask(step);
          else window.setTimeout(step, 0);
          return;
        }
        finish();
      };

      if (mode === 'micro') queueMicrotask(step);
      else window.setTimeout(step, 0);
    }, 0);
  };

  const cards: { mode: Mode; name: string; label: string; tone: string }[] = [
    { mode: 'micro', name: t.microName, label: t.microBtn, tone: 'accent' },
    { mode: 'task', name: t.taskName, label: t.taskBtn, tone: 'secondary' },
  ];

  return (
    <div className="not-prose my-10 overflow-hidden rounded-lg border border-border bg-card/60 shadow-sm">
      <header className="border-b border-border bg-muted/40 px-4 py-2.5">
        <p className="m-0 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-secondary">{t.kicker}</p>
        <h4 className="m-0 mt-0.5 text-sm font-bold text-primary">{t.title}</h4>
      </header>

      <div className="space-y-4 p-4">
        <div className="h-2 overflow-hidden rounded-full border border-border bg-muted/50">
          <div ref={pulseRef} className="h-full w-[12%] rounded-full bg-primary will-change-transform" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {cards.map(({ mode, name, label, tone }) => {
            const result = results[mode];
            const isRunning = running === mode;
            return (
              <div
                key={mode}
                className={cn('rounded-md border bg-background/70 p-3', tone === 'accent' ? 'border-accent/50' : 'border-secondary/50')}
              >
                <p className={cn('m-0 font-mono text-xs font-bold', tone === 'accent' ? 'text-accent' : 'text-secondary')}>{name}</p>

                <dl className="my-3 space-y-1">
                  {[
                    [t.iterations, result ? result.iterations.toLocaleString() : '—'],
                    [t.frames, result ? String(result.frames) : '—'],
                    [t.elapsed, result ? `${result.elapsed} ms` : '—'],
                  ].map(([term, value]) => (
                    <div key={term} className="flex items-baseline justify-between gap-2 border-b border-border/60 pb-1 last:border-b-0">
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{term}</dt>
                      <dd className="m-0 font-mono text-sm font-bold tabular-nums text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>

                <button
                  type="button"
                  onClick={() => run(mode)}
                  disabled={running !== null}
                  className={cn(
                    'w-full rounded border px-2.5 py-1.5 font-mono text-[11px] font-bold transition-colors disabled:opacity-60',
                    tone === 'accent'
                      ? 'border-accent bg-accent/15 text-accent hover:bg-accent/25'
                      : 'border-secondary bg-secondary/15 text-secondary hover:bg-secondary/25'
                  )}
                >
                  {isRunning ? t.running : `▶ ${label}`}
                </button>

                <p className="m-0 mt-2 min-h-[2.5rem] text-[12px] leading-relaxed text-muted-foreground">
                  {result ? (mode === 'micro' ? t.verdictMicro(result.frames) : t.verdictTask(result.frames)) : t.idle}
                </p>
              </div>
            );
          })}
        </div>

        <p className="m-0 border-t border-dashed border-border pt-3 text-[13px] leading-relaxed text-muted-foreground">{t.footnote}</p>
      </div>
    </div>
  );
}
