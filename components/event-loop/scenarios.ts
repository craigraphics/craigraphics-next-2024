import { Frame, Localized, PromiseSlot, Scenario } from './types';

type Step = Partial<Omit<Frame, 'note'>> & { note: Localized };

/**
 * Frames are authored as deltas and expanded into full snapshots, so a step only
 * lists what changed. Arrays are always replaced, never mutated, so sharing a
 * reference between frames is safe.
 */
function expand(steps: Step[]): Frame[] {
  let current: Frame = {
    line: 0,
    stack: [],
    webApis: [],
    microtasks: [],
    tasks: [],
    output: [],
    promises: [],
    note: { en: '', es: '' },
  };
  return steps.map((step) => {
    current = { ...current, focus: undefined, ...step };
    return current;
  });
}

function promise(id: string, over: Partial<PromiseSlot> = {}): PromiseSlot {
  return {
    id,
    state: 'pending',
    result: 'undefined',
    fulfillReactions: [],
    rejectReactions: [],
    isHandled: false,
    ...over,
  };
}

const queues: Scenario = {
  id: 'queues',
  title: { en: 'Three places a callback can wait', es: 'Tres lugares donde un callback puede esperar' },
  code: [
    "console.log('A');",
    "setTimeout(() => console.log('B'), 0);",
    "Promise.resolve().then(() => console.log('C'));",
    "console.log('D');",
  ],
  frames: expand([
    {
      tasks: ['run script'],
      note: {
        en: 'Nothing has run yet. Your entire file is a single job sitting in the task queue.',
        es: 'Todavía no se ha ejecutado nada. Tu archivo entero es un solo trabajo esperando en la cola de tareas.',
      },
      focus: 'tasks',
    },
    {
      stack: ['run script'],
      tasks: [],
      note: {
        en: 'The event loop hands the script to the thread. Nothing else moves until it returns.',
        es: 'El event loop entrega el script al hilo. Nada más se mueve hasta que el script termine.',
      },
      focus: 'stack',
    },
    {
      line: 1,
      stack: ['run script', "console.log('A')"],
      note: { en: 'Line 1 pushes a call onto the stack.', es: 'La línea 1 empuja una llamada a la pila.' },
    },
    {
      stack: ['run script'],
      output: ['A'],
      note: { en: 'It writes A and pops off.', es: 'Escribe A y sale de la pila.' },
      focus: 'output',
    },
    {
      line: 2,
      stack: ['run script', 'setTimeout(fn, 0)'],
      note: {
        en: 'setTimeout is not part of JavaScript. It is a function the browser lends you.',
        es: 'setTimeout no es parte de JavaScript. Es una función que te presta el navegador.',
      },
      focus: 'stack',
    },
    {
      stack: ['run script'],
      webApis: ['timer 0ms → () => log("B")'],
      note: {
        en: 'The browser takes the callback and runs the timer itself. setTimeout returns immediately.',
        es: 'El navegador se queda con el callback y cuenta el tiempo por su cuenta. setTimeout retorna de inmediato.',
      },
      focus: 'webapis',
    },
    {
      line: 3,
      stack: ['run script', 'Promise.resolve().then(fn)'],
      note: {
        en: 'This promise is already fulfilled, so .then has something to react to right away.',
        es: 'Esta promesa ya está cumplida, así que .then tiene algo a lo que reaccionar de inmediato.',
      },
    },
    {
      stack: ['run script'],
      microtasks: ['() => log("C")'],
      note: {
        en: 'The callback is queued as a microtask. Queued, not called. The thread is still busy.',
        es: 'El callback se encola como microtarea. Encolado, no llamado. El hilo sigue ocupado.',
      },
      focus: 'microtasks',
    },
    {
      webApis: [],
      tasks: ['() => log("B")'],
      note: {
        en: 'Meanwhile the 0ms timer expires. The browser drops its callback into the task queue. It still cannot run.',
        es: 'Mientras tanto el temporizador de 0ms vence. El navegador deja su callback en la cola de tareas. Aun así no puede ejecutarse.',
      },
      focus: 'tasks',
    },
    {
      line: 4,
      stack: ['run script', "console.log('D')"],
      note: { en: 'Back on the thread, line 4.', es: 'De vuelta en el hilo, línea 4.' },
    },
    {
      stack: ['run script'],
      output: ['A', 'D'],
      note: {
        en: 'D is written. Two callbacks are now waiting on a thread that has not finished its first job.',
        es: 'Se escribe D. Ahora hay dos callbacks esperando a un hilo que ni siquiera terminó su primer trabajo.',
      },
      focus: 'output',
    },
    {
      line: 0,
      stack: [],
      note: {
        en: 'The script returns. The stack is empty. Only now does the event loop get a turn.',
        es: 'El script retorna. La pila queda vacía. Solo ahora le toca el turno al event loop.',
      },
      focus: 'stack',
    },
    {
      stack: ['() => log("C")'],
      microtasks: [],
      note: {
        en: 'Microtasks go first. Always, and all of them, before a single task.',
        es: 'Las microtareas van primero. Siempre, y todas ellas, antes que una sola tarea.',
      },
      focus: 'microtasks',
    },
    {
      stack: [],
      output: ['A', 'D', 'C'],
      note: { en: 'C.', es: 'C.' },
      focus: 'output',
    },
    {
      stack: ['() => log("B")'],
      tasks: [],
      note: {
        en: 'The microtask queue is empty. Now one task may run.',
        es: 'La cola de microtareas está vacía. Ahora puede correr una tarea.',
      },
      focus: 'tasks',
    },
    {
      stack: [],
      output: ['A', 'D', 'C', 'B'],
      note: {
        en: 'A D C B. A timer set to zero milliseconds lost to a promise that was already settled.',
        es: 'A D C B. Un temporizador de cero milisegundos perdió contra una promesa que ya estaba resuelta.',
      },
      focus: 'output',
    },
  ]),
};

const promiseObject: Scenario = {
  id: 'promise-object',
  title: { en: 'What a promise actually is', es: 'Qué es realmente una promesa' },
  code: [
    'const p = new Promise((resolve) => {',
    "  setTimeout(() => resolve('done'), 100);",
    '});',
    '',
    'p.then(value => console.log(value));',
  ],
  frames: expand([
    {
      stack: ['run script'],
      note: {
        en: 'A promise is an object with internal slots your code can never touch. Here they are.',
        es: 'Una promesa es un objeto con slots internos que tu código nunca puede tocar. Aquí están.',
      },
    },
    {
      line: 1,
      stack: ['run script', 'new Promise(executor)'],
      promises: [promise('p')],
      note: {
        en: 'The constructor creates the object first: state pending, no result, no reactions.',
        es: 'El constructor crea el objeto primero: estado pending, sin resultado, sin reacciones.',
      },
      focus: 'promises',
    },
    {
      stack: ['run script', 'new Promise(executor)', 'executor(resolve, reject)'],
      note: {
        en: 'Then it calls your executor. Immediately, synchronously. Nothing about this part is asynchronous.',
        es: 'Después llama a tu executor. De inmediato y de forma síncrona. Nada de esta parte es asíncrono.',
      },
      focus: 'stack',
    },
    {
      line: 2,
      stack: ['run script', 'new Promise(executor)', 'executor(resolve, reject)', 'setTimeout(fn, 100)'],
      note: { en: 'Inside it, a browser timer.', es: 'Dentro de él, un temporizador del navegador.' },
    },
    {
      line: 3,
      stack: ['run script'],
      webApis: ['timer 100ms → resolve("done")'],
      note: {
        en: 'The executor returns. The promise is still pending, and your script keeps running.',
        es: 'El executor retorna. La promesa sigue pending, y tu script sigue corriendo.',
      },
      focus: 'webapis',
    },
    {
      line: 5,
      stack: ['run script', 'p.then(handler)'],
      note: {
        en: '.then does two things people rarely separate: it registers a reaction, and it returns a brand new promise.',
        es: '.then hace dos cosas que casi nadie separa: registra una reacción y retorna una promesa completamente nueva.',
      },
      focus: 'stack',
    },
    {
      stack: ['run script'],
      promises: [
        promise('p', {
          fulfillReactions: ['Reaction { handler: value => console.log(value) }'],
          isHandled: true,
        }),
      ],
      note: {
        en: 'The reaction is parked inside the promise object. Nothing is queued, because there is no result to hand it yet.',
        es: 'La reacción queda guardada dentro del objeto promesa. No se encola nada, porque todavía no hay un resultado que entregarle.',
      },
      focus: 'promises',
    },
    {
      line: 0,
      stack: [],
      note: {
        en: 'Script done. Thread empty. Both queues empty. The browser is still counting to 100.',
        es: 'Script terminado. Hilo vacío. Ambas colas vacías. El navegador sigue contando hasta 100.',
      },
    },
    {
      webApis: [],
      tasks: ['() => resolve("done")'],
      note: {
        en: 'The timer expires. Its callback becomes a task.',
        es: 'El temporizador vence. Su callback se convierte en una tarea.',
      },
      focus: 'tasks',
    },
    {
      stack: ['() => resolve("done")'],
      tasks: [],
      note: {
        en: 'The stack is empty, so the event loop lets it through.',
        es: 'La pila está vacía, así que el event loop lo deja pasar.',
      },
      focus: 'stack',
    },
    {
      promises: [
        promise('p', {
          state: 'fulfilled',
          result: '"done"',
          fulfillReactions: ['Reaction { handler: value => console.log(value) }'],
          isHandled: true,
        }),
      ],
      note: {
        en: 'resolve flips the state to fulfilled and stores the value.',
        es: 'resolve cambia el estado a fulfilled y guarda el valor.',
      },
      focus: 'promises',
    },
    {
      microtasks: ['handler("done")'],
      promises: [promise('p', { state: 'fulfilled', result: '"done"', isHandled: true })],
      note: {
        en: 'Only now does the parked reaction move to the microtask queue, with the value already attached to it.',
        es: 'Solo ahora la reacción guardada pasa a la cola de microtareas, ya con el valor pegado a ella.',
      },
      focus: 'microtasks',
    },
    {
      stack: [],
      note: { en: 'resolve returns and the task pops off.', es: 'resolve retorna y la tarea sale de la pila.' },
    },
    {
      stack: ['value => console.log(value)'],
      microtasks: [],
      note: { en: 'Microtask queue first.', es: 'Primero la cola de microtareas.' },
      focus: 'microtasks',
    },
    {
      stack: [],
      output: ['done'],
      note: {
        en: 'The gap between resolve() being called and your handler running is one full trip through the queue. It is never the same tick.',
        es: 'La distancia entre llamar a resolve() y que corra tu handler es una vuelta completa por la cola. Nunca es el mismo tick.',
      },
      focus: 'output',
    },
  ]),
};

const chaining: Scenario = {
  id: 'chaining',
  title: { en: 'What a chain costs', es: 'Lo que cuesta una cadena' },
  code: ['Promise.resolve(1)', '  .then(n => n * 2)', '  .then(n => n * 2)', '  .then(n => console.log(n));'],
  frames: expand([
    {
      line: 1,
      stack: ['run script'],
      promises: [promise('P1', { state: 'fulfilled', result: '1' })],
      note: {
        en: 'Promise.resolve(1) hands back a promise that is already fulfilled with 1.',
        es: 'Promise.resolve(1) devuelve una promesa que ya está cumplida con 1.',
      },
      focus: 'promises',
    },
    {
      line: 2,
      stack: ['run script', '.then(double)'],
      note: { en: 'First .then, called on P1.', es: 'El primer .then, llamado sobre P1.' },
    },
    {
      stack: ['run script'],
      microtasks: ['double(1) → resolves P2'],
      promises: [promise('P1', { state: 'fulfilled', result: '1', isHandled: true }), promise('P2')],
      note: {
        en: 'P1 already has a value, so the reaction is queued straight away. .then also returns P2, still pending.',
        es: 'P1 ya tiene un valor, así que la reacción se encola de inmediato. .then también retorna P2, todavía pending.',
      },
      focus: 'promises',
    },
    {
      line: 3,
      stack: ['run script', '.then(double)'],
      note: { en: 'The second .then is called on P2, which is pending.', es: 'El segundo .then se llama sobre P2, que está pending.' },
    },
    {
      stack: ['run script'],
      promises: [
        promise('P1', { state: 'fulfilled', result: '1', isHandled: true }),
        promise('P2', { fulfillReactions: ['Reaction { double → P3 }'], isHandled: true }),
        promise('P3'),
      ],
      note: {
        en: 'So this reaction is parked inside P2. It cannot be queued: P2 has no value to give it.',
        es: 'Así que esta reacción se guarda dentro de P2. No puede encolarse: P2 no tiene ningún valor que darle.',
      },
      focus: 'promises',
    },
    {
      line: 4,
      stack: ['run script', '.then(log)'],
      note: { en: 'Same again, on P3.', es: 'Lo mismo otra vez, sobre P3.' },
    },
    {
      stack: ['run script'],
      promises: [
        promise('P1', { state: 'fulfilled', result: '1', isHandled: true }),
        promise('P2', { fulfillReactions: ['Reaction { double → P3 }'], isHandled: true }),
        promise('P3', { fulfillReactions: ['Reaction { log → P4 }'], isHandled: true }),
        promise('P4'),
      ],
      note: {
        en: 'Parked inside P3. Four promise objects exist and exactly one of them has a value.',
        es: 'Guardada dentro de P3. Existen cuatro objetos promesa y exactamente uno tiene valor.',
      },
      focus: 'promises',
    },
    {
      line: 0,
      stack: [],
      note: { en: 'Script over. One microtask is waiting.', es: 'El script terminó. Una microtarea espera.' },
    },
    {
      stack: ['double(1)'],
      microtasks: [],
      note: { en: 'Trip one.', es: 'Vuelta uno.' },
      focus: 'microtasks',
    },
    {
      stack: [],
      microtasks: ['double(2) → resolves P3'],
      promises: [
        promise('P1', { state: 'fulfilled', result: '1', isHandled: true }),
        promise('P2', { state: 'fulfilled', result: '2', isHandled: true }),
        promise('P3', { fulfillReactions: ['Reaction { log → P4 }'], isHandled: true }),
        promise('P4'),
      ],
      note: {
        en: 'It returns 2, which resolves P2. P2 hands its parked reaction to the microtask queue.',
        es: 'Retorna 2, lo que resuelve P2. P2 entrega su reacción guardada a la cola de microtareas.',
      },
      focus: 'promises',
    },
    {
      stack: ['double(2)'],
      microtasks: [],
      note: { en: 'Trip two.', es: 'Vuelta dos.' },
      focus: 'microtasks',
    },
    {
      stack: [],
      microtasks: ['log(4) → resolves P4'],
      promises: [
        promise('P1', { state: 'fulfilled', result: '1', isHandled: true }),
        promise('P2', { state: 'fulfilled', result: '2', isHandled: true }),
        promise('P3', { state: 'fulfilled', result: '4', isHandled: true }),
        promise('P4'),
      ],
      note: { en: '4 resolves P3, and P3 queues its reaction.', es: '4 resuelve P3, y P3 encola su reacción.' },
      focus: 'promises',
    },
    {
      stack: ['log(4)'],
      microtasks: [],
      note: { en: 'Trip three.', es: 'Vuelta tres.' },
      focus: 'microtasks',
    },
    {
      stack: [],
      output: ['4'],
      promises: [
        promise('P1', { state: 'fulfilled', result: '1', isHandled: true }),
        promise('P2', { state: 'fulfilled', result: '2', isHandled: true }),
        promise('P3', { state: 'fulfilled', result: '4', isHandled: true }),
        promise('P4', { state: 'fulfilled', result: 'undefined' }),
      ],
      note: {
        en: 'Three links, three separate trips through the microtask queue. Chaining is not free. It is just very cheap.',
        es: 'Tres eslabones, tres vueltas distintas por la cola de microtareas. Encadenar no es gratis. Solo es muy barato.',
      },
      focus: 'output',
    },
  ]),
};

const challenge: Scenario = {
  id: 'challenge',
  title: { en: 'The one that catches people', es: 'El que engaña a todo el mundo' },
  code: [
    'new Promise((resolve) => {',
    '  console.log(1);',
    '  resolve(2);',
    '}).then(result => console.log(result));',
    '',
    'console.log(3);',
  ],
  frames: expand([
    {
      line: 1,
      stack: ['run script', 'new Promise(executor)'],
      promises: [promise('p')],
      note: { en: 'Object created, state pending.', es: 'Objeto creado, estado pending.' },
      focus: 'promises',
    },
    {
      stack: ['run script', 'new Promise(executor)', 'executor(resolve)'],
      note: { en: 'The executor runs synchronously.', es: 'El executor corre de forma síncrona.' },
      focus: 'stack',
    },
    {
      line: 2,
      stack: ['run script', 'new Promise(executor)', 'executor(resolve)', 'console.log(1)'],
      note: { en: 'Plain synchronous code that happens to live inside a constructor.', es: 'Código síncrono común que casualmente vive dentro de un constructor.' },
    },
    {
      stack: ['run script', 'new Promise(executor)', 'executor(resolve)'],
      output: ['1'],
      note: { en: '1 is written first, before anything else on the page.', es: 'El 1 se escribe primero, antes que cualquier otra cosa.' },
      focus: 'output',
    },
    {
      line: 3,
      stack: ['run script', 'new Promise(executor)', 'executor(resolve)', 'resolve(2)'],
      note: { en: 'And here is the trap.', es: 'Y aquí está la trampa.' },
    },
    {
      stack: ['run script', 'new Promise(executor)', 'executor(resolve)'],
      promises: [promise('p', { state: 'fulfilled', result: '2' })],
      note: {
        en: 'State fulfilled, result 2. There are no reactions to schedule: .then has not been called yet.',
        es: 'Estado fulfilled, resultado 2. No hay reacciones que agendar: .then todavía no se ha llamado.',
      },
      focus: 'promises',
    },
    {
      line: 4,
      stack: ['run script', '.then(handler)'],
      note: {
        en: 'Now .then runs, on a promise that is already settled.',
        es: 'Ahora corre .then, sobre una promesa que ya está resuelta.',
      },
    },
    {
      stack: ['run script'],
      microtasks: ['handler(2)'],
      promises: [promise('p', { state: 'fulfilled', result: '2', isHandled: true })],
      note: {
        en: 'The handler goes straight to the microtask queue. Queued. Not called. This is the whole trick.',
        es: 'El handler va directo a la cola de microtareas. Encolado. No llamado. Ese es todo el truco.',
      },
      focus: 'microtasks',
    },
    {
      line: 6,
      stack: ['run script', 'console.log(3)'],
      note: { en: 'The script is not finished, so the thread keeps going.', es: 'El script no ha terminado, así que el hilo sigue.' },
    },
    {
      stack: ['run script'],
      output: ['1', '3'],
      note: { en: '3.', es: '3.' },
      focus: 'output',
    },
    {
      line: 0,
      stack: [],
      note: { en: 'Now the script ends and the gate opens.', es: 'Ahora el script termina y la puerta se abre.' },
    },
    {
      stack: ['result => console.log(result)'],
      microtasks: [],
      note: { en: 'The handler finally runs.', es: 'Por fin corre el handler.' },
      focus: 'microtasks',
    },
    {
      stack: [],
      output: ['1', '3', '2'],
      note: {
        en: '1, 3, 2. resolve(2) ran on line 3 and its log still came last.',
        es: '1, 3, 2. resolve(2) corrió en la línea 3 y su log igual salió al final.',
      },
      focus: 'output',
    },
  ]),
};

export const SCENARIOS: Record<string, Scenario> = {
  queues,
  'promise-object': promiseObject,
  chaining,
  challenge,
};
