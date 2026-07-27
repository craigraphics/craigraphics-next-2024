import { Localized } from './types';

export interface QuizOption {
  id: string;
  correct?: boolean;
  why: Localized;
}

export interface Quiz {
  id: string;
  code: string[];
  options: QuizOption[];
}

export const QUIZZES: Record<string, Quiz> = {
  challenge: {
    id: 'challenge',
    code: [
      'new Promise((resolve) => {',
      '  console.log(1);',
      '  resolve(2);',
      '}).then(result => console.log(result));',
      '',
      'console.log(3);',
    ],
    options: [
      {
        id: '1 3 2',
        correct: true,
        why: {
          en: 'resolve(2) settles the promise on line 3, but no handler exists until line 4, and a handler can only ever run as a microtask, after the script finishes.',
          es: 'resolve(2) resuelve la promesa en la línea 3, pero no existe ningún handler hasta la línea 4, y un handler solo puede correr como microtarea, después de que termine el script.',
        },
      },
      {
        id: '1 2 3',
        why: {
          en: 'This assumes resolve() calls your handler. It does not. resolve only writes two internal slots; running the handler is a separate trip through the microtask queue.',
          es: 'Esto asume que resolve() llama a tu handler. No lo hace. resolve solo escribe dos slots internos; ejecutar el handler es una vuelta aparte por la cola de microtareas.',
        },
      },
      {
        id: '3 1 2',
        why: {
          en: 'Nothing here defers the constructor. The executor runs synchronously, the instant new Promise is evaluated.',
          es: 'Aquí nada difiere el constructor. El executor corre de forma síncrona, en el instante en que se evalúa new Promise.',
        },
      },
      {
        id: '2 1 3',
        why: {
          en: 'A promise never runs anything before the line above it. There is no way for 2 to come first.',
          es: 'Una promesa nunca ejecuta nada antes de la línea que tiene encima. No hay forma de que el 2 salga primero.',
        },
      },
    ],
  },
  'between-tasks': {
    id: 'between-tasks',
    code: [
      'setTimeout(() => {',
      "  console.log('t1');",
      "  Promise.resolve().then(() => console.log('m1'));",
      '}, 0);',
      '',
      "setTimeout(() => console.log('t2'), 0);",
    ],
    options: [
      {
        id: 't1 m1 t2',
        correct: true,
        why: {
          en: 'The microtask queue is drained after every task, not only at the end of the script. The promise callback queued inside the first timer runs before the second timer gets a turn.',
          es: 'La cola de microtareas se vacía después de cada tarea, no solo al final del script. El callback de la promesa encolado dentro del primer timer corre antes de que el segundo timer tenga su turno.',
        },
      },
      {
        id: 't1 t2 m1',
        why: {
          en: 'The popular guess: both timers are already queued, so surely they run back to back. They do not. The loop empties the microtask queue between them.',
          es: 'La respuesta popular: ambos timers ya están encolados, así que seguro corren uno tras otro. No es así. El bucle vacía la cola de microtareas entre ellos.',
        },
      },
      {
        id: 'm1 t1 t2',
        why: {
          en: 'That promise does not exist when the script ends. It is created inside the first timer callback, so it cannot resolve before that callback runs.',
          es: 'Esa promesa no existe cuando termina el script. Se crea dentro del callback del primer timer, así que no puede resolverse antes de que ese callback corra.',
        },
      },
      {
        id: 't2 t1 m1',
        why: {
          en: 'Timers with the same delay fire in the order they were registered, so t1 cannot come second.',
          es: 'Los timers con el mismo retraso disparan en el orden en que se registraron, así que t1 no puede salir segundo.',
        },
      },
    ],
  },
};
