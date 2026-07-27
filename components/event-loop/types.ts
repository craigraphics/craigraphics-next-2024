export type Lang = 'en' | 'es';

export type Localized = { en: string; es: string };

export type PromiseState = 'pending' | 'fulfilled' | 'rejected';

export interface PromiseSlot {
  /** Short label shown on the card, e.g. "P1" or "p". */
  id: string;
  state: PromiseState;
  /** Display string for [[PromiseResult]], e.g. `undefined` or `"done"`. */
  result: string;
  fulfillReactions: string[];
  rejectReactions: string[];
  isHandled: boolean;
}

export type Focus = 'stack' | 'webapis' | 'microtasks' | 'tasks' | 'output' | 'promises';

export interface Frame {
  /** 1-indexed source line to highlight. 0 means "no line, we are between jobs". */
  line: number;
  /** Bottom of the stack first. */
  stack: string[];
  webApis: string[];
  microtasks: string[];
  tasks: string[];
  output: string[];
  promises: PromiseSlot[];
  note: Localized;
  focus?: Focus;
}

export interface Scenario {
  id: string;
  title: Localized;
  code: string[];
  frames: Frame[];
}
