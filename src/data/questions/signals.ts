import type { Question } from "../../types/question";

export const signalQuestions: Question[] = [
  {
    id: "ANG-040",
    category: "Signals e interoperabilidad con RxJS",
    difficulty: "fundamental",
    type: "single",
    prompt:
      "¿Qué roles cumplen signal, computed y effect?",
    codeSnippet: `const n = signal(1);
const doble = computed(() => n() * 2);
effect(() => console.log(doble()));`,
    options: [
      {
        id: "a",
        text: "signal guarda estado writable; computed deriva un valor memoizado de solo lectura; effect ejecuta un efecto secundario cuando cambian sus dependencias.",
      },
      {
        id: "b",
        text: "computed es writable y effect debe usarse para asignar otros signals de estado.",
      },
      {
        id: "c",
        text: "effect sustituye a computed porque también memoiza el valor de retorno.",
      },
      {
        id: "d",
        text: "signal() no notifica al template; hay que llamar markForCheck siempre.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Esa es la tríada básica. computed no tiene set. effect no está pensado para derivar estado (puede crear ciclos). Leer un signal en un template OnPush marca el componente automáticamente.",
    sourceUrls: ["https://angular.dev/guide/signals"],
  },
  {
    id: "ANG-041",
    category: "Signals e interoperabilidad con RxJS",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "¿Por qué untracked aparece en este effect?",
    codeSnippet: `effect(() => {
  const user = currentUser();
  untracked(() => this.logger.log(user, counter()));
});`,
    options: [
      {
        id: "a",
        text: "Evita que lecturas accidentales (logger o counter) se registren como dependencias; el effect solo debe reaccionar a currentUser.",
      },
      {
        id: "b",
        text: "untracked convierte el signal en un Observable frío.",
      },
      {
        id: "c",
        text: "Sin untracked el effect no se ejecuta la primera vez.",
      },
      {
        id: "d",
        text: "untracked es obligatorio en zoneless para cualquier effect.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "En un contexto reactivo, cada lectura se rastrea. untracked corta esa trazabilidad. El effect sí corre al crearse. No hay requisito extra de zoneless ni conversión a RxJS.",
    sourceUrls: ["https://angular.dev/guide/signals"],
  },
  {
    id: "ANG-042",
    category: "Signals e interoperabilidad con RxJS",
    difficulty: "intermediate",
    type: "multiple",
    prompt:
      "Sobre toSignal y toObservable, ¿qué es correcto?",
    options: [
      {
        id: "a",
        text: "toSignal suscribe un Observable y expone su valor como signal, con opciones como initialValue y requireSync.",
      },
      {
        id: "b",
        text: "toObservable emite cada vez que cambia el signal, útil para encadenar operadores RxJS existentes.",
      },
      {
        id: "c",
        text: "toSignal se desuscribe automáticamente con el DestroyRef del injection context.",
      },
      {
        id: "d",
        text: "toObservable convierte el signal en un BehaviorSubject global que hay que completar a mano en ngOnDestroy.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "La interop oficial gestiona la suscripción con el contexto de inyección. toObservable no te entrega un BehaviorSubject que debas completar manualmente como API pública.",
    sourceUrls: ["https://angular.dev/guide/signals/rxjs-interop"],
  },
  {
    id: "ANG-043",
    category: "Signals e interoperabilidad con RxJS",
    difficulty: "senior",
    type: "single",
    prompt:
      "El usuario elige un método de envío. Si cambia el catálogo, la selección puede quedar inválida. ¿Qué primitiva encaja?",
    codeSnippet: `selected = linkedSignal(() => shippingOptions()[0]);`,
    options: [
      {
        id: "a",
        text: "linkedSignal es un estado writable ligado a otro signal: se puede set, pero si la fuente cambia se recalcula (p. ej. al primer método válido).",
      },
      {
        id: "b",
        text: "computed permite selected.set cuando el catálogo cambia.",
      },
      {
        id: "c",
        text: "effect(() => selected.set(options()[0])) es la receta oficial para estado derivado writable.",
      },
      {
        id: "d",
        text: "resource() sustituye a linkedSignal para estado síncrono de UI.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "linkedSignal existe precisamente para estado local writable que debe resetearse o preservarse según otra fuente. computed no es writable. Usar effect para copiar estado es un anti-patrón (ciclos, timing). resource es para async.",
    interviewInsight:
      "Si te preguntan 'computed vs linkedSignal', responde: computed es derivado puro; linkedSignal es derivado con override del usuario.",
    sourceUrls: ["https://angular.dev/guide/signals/linked-signal"],
  },
  {
    id: "ANG-044",
    category: "Signals e interoperabilidad con RxJS",
    difficulty: "senior",
    type: "single",
    prompt:
      "¿Cuál es el error de este código y la corrección idiomática?",
    codeSnippet: `items = signal<Item[]>([]);
count = signal(0);
effect(() => this.count.set(this.items().length));`,
    options: [
      {
        id: "a",
        text: "Se usa effect para propagar estado; lo correcto es count = computed(() => items().length).",
      },
      {
        id: "b",
        text: "Falta untracked; con untracked el effect dejaría de ser un anti-patrón.",
      },
      {
        id: "c",
        text: "Hay que llamar allowSignalWrites o el código no compilará en ningún caso.",
      },
      {
        id: "d",
        text: "count debe ser un BehaviorSubject porque los signals no pueden derivarse.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Angular recomienda computed para derivar estado y limitar effect a I/O (logs, storage, DOM no reactivo). allowSignalWrites no convierte un mal diseño en uno bueno. Los signals sí se derivan, precisamente con computed.",
    sourceUrls: ["https://angular.dev/guide/signals"],
  },
  {
    id: "ANG-045",
    category: "Signals e interoperabilidad con RxJS",
    difficulty: "senior",
    type: "multiple",
    prompt:
      "Sobre resource y httpResource, ¿qué afirmaciones son válidas?",
    codeSnippet: [
      "userId = input.required<string>();",
      "user = httpResource(() => `/api/user/${this.userId()}`);",
    ].join("\n"),
    options: [
      {
        id: "a",
        text: "httpResource es un wrapper reactivo de HttpClient: si cambia userId, relanza y cancela el GET anterior.",
      },
      {
        id: "b",
        text: "A diferencia de HttpClient, httpResource dispara la petición de forma eager, no al suscribirse.",
      },
      {
        id: "c",
        text: "Conviene usarlo para GET/consulta; las mutaciones POST/PUT siguen siendo territorio de HttpClient.",
      },
      {
        id: "d",
        text: "user.value() es seguro de leer en estado de error; hasValue() es opcional.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "La guía indica que leer value en error lanza; hay que proteger con hasValue(). resource/rxResource cubren loaders async genéricos; httpResource es el atajo HTTP y sigue pasando por interceptores.",
    sourceUrls: [
      "https://angular.dev/guide/http/http-resource",
      "https://angular.dev/guide/signals/resource",
    ],
  },
  {
    id: "ANG-046",
    category: "Signals e interoperabilidad con RxJS",
    difficulty: "senior",
    type: "single",
    prompt:
      "¿Cuándo mezclar Signals y RxJS en lugar de elegir solo uno?",
    options: [
      {
        id: "a",
        text: "Signals para estado síncrono de vista e inputs; RxJS para eventos en el tiempo, combinaciones complejas y APIs que ya son Observables (Router, HttpClient clásico).",
      },
      {
        id: "b",
        text: "Hay que migrar todo a effect() y eliminar RxJS, incluido el Router.",
      },
      {
        id: "c",
        text: "Signal Forms obliga a dejar de usar HttpClient.",
      },
      {
        id: "d",
        text: "viewChild() signal no puede combinarse con computed; hay que volver a @ViewChild.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "La interop existe porque ambos modelos cubren problemas distintos. El Router y muchas libs siguen exponiendo Observables; toSignal/toObservable y httpResource son puentes. Signal queries sí se leen en computed. Signal Forms no elimina HTTP.",
    sourceUrls: ["https://angular.dev/guide/signals/rxjs-interop"],
  },
];
