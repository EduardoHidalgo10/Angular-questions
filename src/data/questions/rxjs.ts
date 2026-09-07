import type { Question } from "../../types/question";

export const rxjsQuestions: Question[] = [
  {
    id: "ANG-032",
    category: "RxJS y prevención de memory leaks",
    difficulty: "fundamental",
    type: "single",
    prompt:
      "¿Cuál es la diferencia práctica entre un Observable y una Promise en Angular?",
    options: [
      {
        id: "a",
        text: "Una Promise es eager y de un solo valor; un Observable es lazy (frío por defecto), puede emitir muchos valores y se cancela al desuscribirse.",
      },
      {
        id: "b",
        text: "HttpClient devuelve Promise; los signals son Observables calientes.",
      },
      {
        id: "c",
        text: "Los Observables siempre se ejecutan aunque nadie se suscriba, igual que Promise.",
      },
      {
        id: "d",
        text: "Promise se puede reintentar con retry; Observable no admite cancelación.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "HttpClient devuelve Observables fríos: cada subscribe dispara el HTTP y unsubscribe cancela. Promise empieza al crearse, no es cancelable de forma nativa y resuelve una vez. b invierte las APIs. c describe Observables calientes o Promises, no el caso frío. d atribuye retry a Promise.",
    sourceUrls: ["https://rxjs.dev/guide/observable"],
  },
  {
    id: "ANG-033",
    category: "RxJS y prevención de memory leaks",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "Para un buscador con debounce, ¿qué operador de aplanamiento eliges y por qué?",
    codeSnippet: `this.termino.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  /* ??? */ (term) => this.api.buscar(term),
);`,
    options: [
      {
        id: "a",
        text: "switchMap: cancela la petición anterior cuando llega un término nuevo y evita respuestas fuera de orden.",
      },
      {
        id: "b",
        text: "concatMap: lanza todas las búsquedas en paralelo para máxima velocidad.",
      },
      {
        id: "c",
        text: "mergeMap: cancela automáticamente el HTTP previo, igual que switchMap.",
      },
      {
        id: "d",
        text: "exhaustMap: encola cada tecla y espera a completarlas en orden.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "switchMap es el estándar de autocomplete: al cambiar el término, abandona el request viejo. concatMap serializa (cola). mergeMap paraleliza sin cancelar (race). exhaustMap ignora nuevos valores mientras hay uno en vuelo, útil en submits, no en cada tecla.",
    sourceUrls: ["https://rxjs.dev/api/operators/switchMap"],
  },
  {
    id: "ANG-034",
    category: "RxJS y prevención de memory leaks",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "¿Qué Subject usarías para representar 'el usuario autenticado actual' que llega tarde a la suscripción?",
    options: [
      {
        id: "a",
        text: "BehaviorSubject: exige valor inicial y reemite el último estado a quien se suscriba después.",
      },
      {
        id: "b",
        text: "Subject: los suscriptores tardíos reciben el historial completo de logins.",
      },
      {
        id: "c",
        text: "AsyncSubject: emite cada cambio de usuario en tiempo real sin completar.",
      },
      {
        id: "d",
        text: "ReplaySubject(0) equivale a un Observable frío de HttpClient.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "BehaviorSubject modela estado actual. Subject pierde el último valor para late subscribers. AsyncSubject emite solo el último valor al complete. ReplaySubject(n) reproduce n valores; no convierte el stream en HTTP frío.",
    sourceUrls: ["https://rxjs.dev/guide/subject"],
  },
  {
    id: "ANG-035",
    category: "RxJS y prevención de memory leaks",
    difficulty: "intermediate",
    type: "multiple",
    prompt:
      "Elige las parejas correctas de operadores de aplanamiento y caso de uso.",
    options: [
      {
        id: "a",
        text: "concatMap: guardar pasos de un wizard en orden, esperando cada HTTP.",
      },
      {
        id: "b",
        text: "mergeMap: subir N archivos independientes en paralelo.",
      },
      {
        id: "c",
        text: "exhaustMap: ignorar clics extra de 'Pagar' mientras la primera petición sigue viva.",
      },
      {
        id: "d",
        text: "switchMap: procesar una cola de escrituras donde ninguna puede cancelarse.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "d describe concatMap, no switchMap. switchMap cancelaría escrituras en vuelo y podría dejar el backend inconsistente.",
    sourceUrls: ["https://rxjs.dev/api/index/function/mergeMap"],
  },
  {
    id: "ANG-036",
    category: "RxJS y prevención de memory leaks",
    difficulty: "senior",
    type: "single",
    prompt:
      "¿Cuándo forkJoin es preferible a combineLatest?",
    codeSnippet: `forkJoin({ user: api.user(), roles: api.roles() })
combineLatest([filtro$, pagina$])`,
    options: [
      {
        id: "a",
        text: "forkJoin espera a que todos completen y emite un único lote; combineLatest emite cada vez que cualquiera cambia, con el último valor de cada fuente.",
      },
      {
        id: "b",
        text: "combineLatest no emite hasta que todos completen, por eso sustituye a forkJoin en HTTP.",
      },
      {
        id: "c",
        text: "forkJoin se actualiza si user$ es un stream vivo de WebSocket.",
      },
      {
        id: "d",
        text: "Son aliases: Angular los trata igual en interceptores.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "HTTP puntuales que completan: forkJoin (análogo a Promise.all). Streams vivos de UI: combineLatest. Si una fuente HTTP no completa, forkJoin se queda colgado. combineLatest emite en caliente y no espera complete.",
    sourceUrls: ["https://rxjs.dev/api/index/function/forkJoin"],
  },
  {
    id: "ANG-037",
    category: "RxJS y prevención de memory leaks",
    difficulty: "senior",
    type: "multiple",
    prompt:
      "¿Qué técnicas evitan memory leaks por suscripciones en un componente?",
    options: [
      {
        id: "a",
        text: "AsyncPipe se suscribe y se desuscribe con el ciclo de vida de la vista.",
      },
      {
        id: "b",
        text: "takeUntilDestroyed / DestroyRef cierran el stream al destruir el componente sin un Subject manual.",
      },
      {
        id: "c",
        text: "Suscribirse en el constructor a un Subject de un servicio root sin complete ni takeUntil, porque root vive menos que el componente.",
      },
      {
        id: "d",
        text: "take(1) o first() completan tras el primer valor y liberan la suscripción HTTP puntual.",
      },
    ],
    correctOptionIds: ["a", "b", "d"],
    explanation:
      "c es exactamente el leak: el servicio singleton sobrevive y retiene el subscriber del componente destruido. a, b y d son patrones recomendados. take(1) no basta en streams infinitos si necesitas más de un valor.",
    interviewInsight:
      "takeUntilDestroyed es la respuesta moderna; AsyncPipe sigue siendo la más limpia cuando el valor solo se muestra en template.",
    sourceUrls: [
      "https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed",
      "https://angular.dev/guide/templates/pipes#the-async-pipe",
    ],
  },
  {
    id: "ANG-038",
    category: "RxJS y prevención de memory leaks",
    difficulty: "senior",
    type: "single",
    prompt:
      "Este stream HTTP se usa en tres componentes. ¿Qué problema hay y cómo se corrige?",
    codeSnippet: `users$ = this.http.get<User[]>("/api/users").pipe(
  retry(2),
  catchError((err) => {
    this.toast.error(err);
    return throwError(() => err);
  }),
  finalize(() => this.loading.set(false)),
);`,
    options: [
      {
        id: "a",
        text: "Al ser frío, cada subscribe dispara otro GET; shareReplay({ bufferSize: 1, refCount: true }) comparte la petición y el último valor.",
      },
      {
        id: "b",
        text: "retry duplica interceptores; hay que quitar catchError siempre que exista finalize.",
      },
      {
        id: "c",
        text: "finalize cancela el retry; por eso el código no compila.",
      },
      {
        id: "d",
        text: "catchError convierte el Observable en caliente y ya no hace falta shareReplay.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "HttpClient es frío. Tres AsyncPipe o tres subscribe = tres GET. shareReplay comparte. catchError, retry y finalize no cambian esa semántica. Cuidado: shareReplay sin refCount puede retener la suscripción y ser otro tipo de leak.",
    sourceUrls: ["https://rxjs.dev/api/operators/shareReplay"],
  },
  {
    id: "ANG-039",
    category: "RxJS y prevención de memory leaks",
    difficulty: "senior",
    type: "multiple",
    prompt:
      "Un usuario cambia rápido de /users/1 a /users/2. La respuesta de 1 llega después y pinta datos viejos. ¿Qué mitiga la race condition?",
    options: [
      {
        id: "a",
        text: "switchMap desde paramMap al GET, para cancelar la solicitud anterior al cambiar el id.",
      },
      {
        id: "b",
        text: "Comparar el id de la respuesta con el id actual de la ruta antes de hacer set del estado.",
      },
      {
        id: "c",
        text: "Usar mergeMap al GET para maximizar el throughput de ambas respuestas.",
      },
      {
        id: "d",
        text: "Abortar vía unsubscribe / DestroyRef al salir de la vista, para no aplicar resultados de un componente ya destruido.",
      },
    ],
    correctOptionIds: ["a", "b", "d"],
    explanation:
      "switchMap cancela XHR previo. Un guardado defensivo del id evita pintar si algo no se canceló. Unsubscribe evita leaks y updates tardíos. mergeMap empeora la race: ambas respuestas compiten.",
    sourceUrls: ["https://angular.dev/guide/http"],
  },
];
