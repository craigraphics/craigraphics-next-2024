'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { SCENARIOS } from './scenarios';
import { Focus, Lang, PromiseSlot } from './types';
import { highlight } from './highlight';

const UI = {
  en: {
    step: 'Step',
    of: 'of',
    restart: 'Restart',
    back: 'Back',
    next: 'Next',
    play: 'Play',
    pause: 'Pause',
    thread: 'The thread',
    offThread: 'Off the thread',
    browser: 'browser territory',
    microtasks: 'Microtask queue',
    tasks: 'Task queue',
    first: 'drained first, completely',
    second: 'one per turn, after that',
    output: 'Console',
    promises: 'Promise objects',
    gateOpen: 'Gate open. The thread is idle, so the event loop may hand something over.',
    gateShut: 'Gate shut. The thread is busy, so every queue is frozen.',
    empty: 'empty',
    scrub: 'Scrub through the steps',
    hint: 'Click the panel, then use the arrow keys',
  },
  es: {
    step: 'Paso',
    of: 'de',
    restart: 'Reiniciar',
    back: 'Atrás',
    next: 'Siguiente',
    play: 'Reproducir',
    pause: 'Pausar',
    thread: 'El hilo',
    offThread: 'Fuera del hilo',
    browser: 'territorio del navegador',
    microtasks: 'Cola de microtareas',
    tasks: 'Cola de tareas',
    first: 'se vacía primero, entera',
    second: 'una por turno, después',
    output: 'Consola',
    promises: 'Objetos Promise',
    gateOpen: 'Puerta abierta. El hilo está libre, así que el event loop puede entregar algo.',
    gateShut: 'Puerta cerrada. El hilo está ocupado, así que las colas están congeladas.',
    empty: 'vacía',
    scrub: 'Recorre los pasos',
    hint: 'Haz clic en el panel y usa las flechas',
  },
} as const;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

const TONES = {
  stack: 'border-primary/40 bg-primary/10',
  api: 'border-muted-foreground/30 bg-muted/50',
  micro: 'border-accent/50 bg-accent/10',
  task: 'border-secondary/50 bg-secondary/10',
} as const;

function Chip({ tone, children }: { tone: keyof typeof TONES; children: React.ReactNode }) {
  return (
    <div className={cn('rounded border px-2 py-1 font-mono text-[11px] leading-snug text-foreground sm:text-xs', TONES[tone])}>
      {children}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded border border-dashed border-border px-2 py-1 font-mono text-[11px] italic text-muted-foreground/70">{label}</div>
  );
}

function Panel({
  label,
  aside,
  active,
  className,
  children,
}: {
  label: string;
  aside?: React.ReactNode;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'rounded-md border bg-background/70 transition-colors duration-300',
        active ? 'border-secondary shadow-[0_0_0_1px_hsl(var(--secondary)/0.35)]' : 'border-border',
        className
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-b border-dashed border-border px-3 py-1.5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
        {aside ? <span className="font-mono text-[10px] lowercase tracking-wide text-muted-foreground/80">{aside}</span> : null}
      </div>
      <div className="p-3">{children}</div>
    </section>
  );
}

const STATE_TONE: Record<PromiseSlot['state'], string> = {
  pending: 'text-muted-foreground',
  fulfilled: 'text-accent',
  rejected: 'text-destructive',
};

function Slot({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-2 border-b border-border/60 py-1 last:border-b-0">
      <span className="font-mono text-[10px] text-muted-foreground">{name}</span>
      <span className="font-mono text-[11px]">{children}</span>
    </div>
  );
}

function PromiseCard({ slot }: { slot: PromiseSlot }) {
  return (
    <div className="min-w-[190px] max-w-[340px] flex-1 rounded border border-border bg-background/70 p-2.5">
      <div className="mb-1 flex items-center gap-1.5">
        <span aria-hidden className={cn('text-[9px] leading-none', STATE_TONE[slot.state])}>
          {slot.state === 'pending' ? '○' : '●'}
        </span>
        <span className="font-mono text-xs font-bold text-primary">{slot.id}</span>
      </div>
      <Slot name="[[PromiseState]]">
        <span className={STATE_TONE[slot.state]}>{slot.state}</span>
      </Slot>
      <Slot name="[[PromiseResult]]">
        <span className={slot.result === 'undefined' ? 'text-muted-foreground' : 'text-secondary'}>{slot.result}</span>
      </Slot>
      <Slot name="[[PromiseIsHandled]]">
        <span className={slot.isHandled ? 'text-accent' : 'text-muted-foreground'}>{String(slot.isHandled)}</span>
      </Slot>
      <div className="pt-1.5">
        <div className="font-mono text-[10px] text-muted-foreground">[[PromiseFulfillReactions]]</div>
        <div className="mt-1 space-y-1">
          {slot.fulfillReactions.length ? (
            slot.fulfillReactions.map((reaction) => (
              <div key={reaction} className="rounded border border-accent/40 bg-accent/10 px-1.5 py-1 font-mono text-[10px] leading-snug">
                {reaction}
              </div>
            ))
          ) : (
            <div className="font-mono text-[10px] italic text-muted-foreground/60">&#91;&#93;</div>
          )}
        </div>
      </div>
    </div>
  );
}

interface Props {
  scenario: string;
  lang?: Lang;
}

export default function RuntimeMachine({ scenario, lang = 'en' }: Props) {
  const t = UI[lang] ?? UI.en;
  const data = SCENARIOS[scenario];
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const total = data ? data.frames.length : 0;
  const frame = data ? data.frames[Math.min(index, total - 1)] : null;

  // Functional form so a burst of clicks in one tick still advances one step each.
  const go = useCallback(
    (next: number | ((current: number) => number)) => {
      setIndex((current) => {
        const target = typeof next === 'function' ? next(current) : next;
        return Math.max(0, Math.min(total - 1, target));
      });
    },
    [total]
  );

  useEffect(() => {
    if (!playing) return;
    if (index >= total - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setIndex((i) => Math.min(total - 1, i + 1)), 1600);
    return () => window.clearTimeout(id);
  }, [playing, index, total]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setPlaying(false);
      go((i) => i + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setPlaying(false);
      go((i) => i - 1);
    }
  };

  const enter = reduced ? '' : 'animate-in fade-in slide-in-from-bottom-1 duration-300';
  const hasPromises = useMemo(() => (data ? data.frames.some((f) => f.promises.length > 0) : false), [data]);

  if (!data || !frame) return null;

  const idle = frame.stack.length === 0;
  const focused = (name: Focus) => frame.focus === name;

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={data.title[lang]}
      className="not-prose my-10 overflow-hidden rounded-lg border border-border bg-card/60 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border bg-muted/40 px-4 py-2.5">
        <h4 className="m-0 font-mono text-xs font-bold uppercase tracking-[0.12em] text-primary">{data.title[lang]}</h4>
        <span className="font-mono text-[11px] text-muted-foreground">
          {t.step} {index + 1} {t.of} {total}
        </span>
      </header>

      <div className="space-y-3 p-3 sm:p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="overflow-x-auto rounded-md border border-border bg-background/70 py-2">
            {data.code.map((line, i) => {
              const active = frame.line === i + 1;
              return (
                <div
                  key={i}
                  className={cn(
                    'flex gap-3 whitespace-pre px-3 py-[3px] font-mono text-[11px] leading-relaxed transition-colors duration-200 sm:text-xs',
                    active ? 'bg-secondary/15' : ''
                  )}
                >
                  <span className={cn('select-none tabular-nums', active ? 'text-secondary' : 'text-muted-foreground/50')}>
                    {active ? '▸' : ' '}
                    {String(i + 1).padStart(2, ' ')}
                  </span>
                  <span className={active ? '' : 'opacity-60'}>{highlight(line)}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            <p
              aria-live="polite"
              className="m-0 min-h-[3.5rem] rounded-md border border-dashed border-secondary/60 bg-secondary/5 px-3 py-2 text-[13px] leading-relaxed text-foreground sm:text-sm"
            >
              {frame.note[lang]}
            </p>
            <Panel label={t.output} active={focused('output')} className="flex-1">
              <div className="flex min-h-[1.75rem] flex-wrap items-start gap-1.5">
                {frame.output.length ? (
                  frame.output.map((line, i) => (
                    <span
                      key={`${i}-${line}`}
                      className={cn('rounded bg-foreground/90 px-2 py-0.5 font-mono text-[11px] text-background', i === frame.output.length - 1 ? enter : '')}
                    >
                      {line}
                    </span>
                  ))
                ) : (
                  <Empty label={t.empty} />
                )}
              </div>
            </Panel>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Panel label={t.thread} aside={idle ? undefined : 'busy'} active={focused('stack')}>
            <div className="flex min-h-[112px] flex-col-reverse justify-start gap-1">
              {frame.stack.map((call, i) => (
                <div key={`${i}-${call}`} className={i === frame.stack.length - 1 ? enter : ''}>
                  <Chip tone="stack">{call}</Chip>
                </div>
              ))}
              {!frame.stack.length && <Empty label={t.empty} />}
            </div>
            <div className="mt-2 border-t-2 border-dashed border-border" />
          </Panel>

          <Panel label={t.offThread} aside={t.browser} active={focused('webapis')}>
            <div className="flex min-h-[112px] flex-col gap-1">
              {frame.webApis.length ? (
                frame.webApis.map((api, i) => (
                  <div key={`${i}-${api}`} className={enter}>
                    <Chip tone="api">{api}</Chip>
                  </div>
                ))
              ) : (
                <Empty label={t.empty} />
              )}
            </div>
          </Panel>
        </div>

        <div
          className={cn(
            'flex items-center gap-2 rounded-md border px-3 py-2 text-[12px] leading-snug transition-colors duration-300 sm:text-[13px]',
            idle ? 'border-accent/50 bg-accent/10 text-foreground' : 'border-border bg-muted/30 text-muted-foreground'
          )}
        >
          <span aria-hidden className={cn('font-mono text-sm', idle ? 'text-accent' : 'text-muted-foreground')}>
            {idle ? '◇' : '◆'}
          </span>
          {idle ? t.gateOpen : t.gateShut}
        </div>

        <div className="grid gap-3">
          <Panel label={t.microtasks} aside={t.first} active={focused('microtasks')}>
            <div className="flex min-h-[2.25rem] flex-wrap items-start gap-1.5">
              {frame.microtasks.length ? (
                frame.microtasks.map((job, i) => (
                  <div key={`${i}-${job}`} className={enter}>
                    <Chip tone="micro">{job}</Chip>
                  </div>
                ))
              ) : (
                <Empty label={t.empty} />
              )}
            </div>
          </Panel>

          <Panel label={t.tasks} aside={t.second} active={focused('tasks')}>
            <div className="flex min-h-[2.25rem] flex-wrap items-start gap-1.5">
              {frame.tasks.length ? (
                frame.tasks.map((job, i) => (
                  <div key={`${i}-${job}`} className={enter}>
                    <Chip tone="task">{job}</Chip>
                  </div>
                ))
              ) : (
                <Empty label={t.empty} />
              )}
            </div>
          </Panel>
        </div>

        {hasPromises && (
          <Panel label={t.promises} active={focused('promises')}>
            <div className="flex min-h-[4rem] flex-wrap gap-3">
              {frame.promises.length ? frame.promises.map((slot) => <PromiseCard key={slot.id} slot={slot} />) : <Empty label={t.empty} />}
            </div>
          </Panel>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/40 px-3 py-2.5 sm:px-4">
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            go(0);
          }}
          className="rounded border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-foreground transition-colors hover:border-secondary hover:text-secondary"
        >
          ↺ {t.restart}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            go((i) => i - 1);
          }}
          disabled={index === 0}
          className="rounded border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-foreground transition-colors hover:border-secondary hover:text-secondary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
        >
          ← {t.back}
        </button>
        <button
          type="button"
          onClick={() => (index >= total - 1 ? (go(0), setPlaying(true)) : setPlaying((p) => !p))}
          className="rounded border border-secondary bg-secondary/15 px-2.5 py-1 font-mono text-[11px] font-bold text-secondary transition-colors hover:bg-secondary/25"
        >
          {playing ? `❚❚ ${t.pause}` : `▶ ${t.play}`}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            go((i) => i + 1);
          }}
          disabled={index >= total - 1}
          className="rounded border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-foreground transition-colors hover:border-secondary hover:text-secondary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
        >
          {t.next} →
        </button>
        <input
          type="range"
          min={0}
          max={total - 1}
          value={index}
          aria-label={t.scrub}
          onChange={(event) => {
            setPlaying(false);
            go(Number(event.target.value));
          }}
          className="ml-auto h-1 w-full min-w-[120px] cursor-pointer accent-secondary sm:w-40"
        />
        <span className="hidden font-mono text-[10px] text-muted-foreground/70 lg:inline">{t.hint}</span>
      </div>
    </div>
  );
}
