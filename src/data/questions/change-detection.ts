import type { Question } from "../../types/question";

export const changeDetectionQuestions: Question[] = [
  {
    id: "ANG-047",
    category: "Change detection, zoneless, rendimiento, SSR e hidratación",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "En un componente OnPush, mutas this.user.name = 'Ana' sobre el mismo objeto de @Input. ¿Por qué no se refresca la vista?",
    options: [
      {
        id: "a",
        text: "OnPush compara referencias de inputs; una mutación in-place no notifica. Hace falta un nuevo objeto, un signal leído en template, un evento o markForCheck.",
      },
      {
        id: "b",
        text: "OnPush desactiva el template; hay que usar innerHTML.",
      },
      {
        id: "c",
        text: "OnPush solo funciona con NgModules.",
      },
      {
        id: "d",
        text: "El nombre Ana está reservado y Angular ignora el binding.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "OnPush asume inmutabilidad o notificaciones explícitas (signals, AsyncPipe/markForCheck, eventos). Mutar el mismo objeto es el bug más común. En Angular reciente OnPush puede ser el default, lo que hace este tema aún más crítico.",
    sourceUrls: ["https://angular.dev/best-practices/skipping-subtrees"],
  },
  {
    id: "ANG-048",
    category: "Change detection, zoneless, rendimiento, SSR e hidratación",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "Una lista de 2.000 filas parpadea al recibir un array nuevo con los mismos ids. ¿Qué falta?",
    codeSnippet: `@for (user of users(); track $index) {
  <app-fila [user]="user" />
}`,
    options: [
      {
        id: "a",
        text: "track $index identifica por posición; al reordenar o recargar, Angular destruye y recrea filas. track user.id preserva el DOM.",
      },
      {
        id: "b",
        text: "track solo existe en *ngFor; @for no necesita identidad.",
      },
      {
        id: "c",
        text: "Hay que quitar OnPush de app-fila para que track funcione.",
      },
      {
        id: "d",
        text: "El parpadeo se evita poniendo el @for dentro de ngOnDoCheck.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "@for exige track. $index es peor cuando la lista se reordena o se recarga. Una identidad de dominio (id) permite reutilizar nodos y, con OnPush, saltar filas intactas. También puedes complementar con virtual scroll del CDK.",
    sourceUrls: ["https://angular.dev/guide/templates/control-flow"],
  },
  {
    id: "ANG-049",
    category: "Change detection, zoneless, rendimiento, SSR e hidratación",
    difficulty: "senior",
    type: "multiple",
    prompt:
      "En una app zoneless, ¿qué notifica a Angular para refrescar vistas?",
    options: [
      {
        id: "a",
        text: "Actualizar un signal leído en el template.",
      },
      {
        id: "b",
        text: "Callbacks de listeners de template/host y AsyncPipe (markForCheck).",
      },
      {
        id: "c",
        text: "ComponentRef.setInput y adjuntar una vista ya marcada como dirty.",
      },
      {
        id: "d",
        text: "Cualquier setTimeout de una librería third-party, porque zoneless parchea timers igual que Zone.js.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "Zoneless elimina el parcheo de APIs asíncronas. Un setTimeout que mute estado sin signal/markForCheck no programa CD. Por eso OnPush-compatible y signals son el camino. En v21+ zoneless es el default; en v20 se habilita con provideZonelessChangeDetection().",
    interviewInsight:
      "No cites provideExperimentalZonelessChangeDetection: esa API experimental quedó atrás. Habla de notificaciones, no de 'quitar zone y ya'.",
    sourceUrls: ["https://angular.dev/guide/zoneless"],
  },
  {
    id: "ANG-050",
    category: "Change detection, zoneless, rendimiento, SSR e hidratación",
    difficulty: "senior",
    type: "single",
    prompt:
      "¿En qué se diferencian markForCheck() y detectChanges()?",
    options: [
      {
        id: "a",
        text: "markForCheck marca el componente (y ancestros) para el próximo ciclo; detectChanges dispara CD inmediatamente sobre esa vista.",
      },
      {
        id: "b",
        text: "Son equivalentes; detectChanges solo existe en tests.",
      },
      {
        id: "c",
        text: "markForCheck recorre todo el árbol desde la raíz ahora mismo.",
      },
      {
        id: "d",
        text: "detectChanges es zoneless-only y markForCheck no funciona con signals.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "markForCheck es perezoso y cooperativo (AsyncPipe lo usa). detectChanges es síncrono y local: útil en puntos muy controlados, peligroso si se abusa (estados inconsistentes, loops). Los signals suelen eliminar la necesidad de ambos en código de aplicación.",
    sourceUrls: ["https://angular.dev/api/core/ChangeDetectorRef"],
  },
  {
    id: "ANG-051",
    category: "Change detection, zoneless, rendimiento, SSR e hidratación",
    difficulty: "senior",
    type: "multiple",
    prompt:
      "Sobre SSR, SSG e hidratación, ¿qué es correcto?",
    options: [
      {
        id: "a",
        text: "SSR genera HTML en el servidor por request; SSG lo pre-renderiza en build; la hidratación reutiliza ese DOM en el cliente en lugar de recrearlo.",
      },
      {
        id: "b",
        text: "afterNextRender / afterEveryRender no se ejecutan durante SSR ni pre-render.",
      },
      {
        id: "c",
        text: "En zoneless + SSR, tareas async que deben retrasar la serialización se registran con PendingTasks.",
      },
      {
        id: "d",
        text: "La hidratación permite leer window en el constructor del componente porque el servidor ya ejecutó ese código.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "d es un clásico fallo de Universal: el constructor corre también en servidor, donde no hay window. Hay que proteger DOM APIs o usar afterNextRender. Incremental hydration puede diferir islas hasta que interactúen.",
    sourceUrls: [
      "https://angular.dev/guide/ssr",
      "https://angular.dev/guide/hydration",
      "https://angular.dev/guide/zoneless",
    ],
  },
  {
    id: "ANG-052",
    category: "Change detection, zoneless, rendimiento, SSR e hidratación",
    difficulty: "senior",
    type: "single",
    prompt:
      "Un formulario reactivo en zoneless actualiza el FormControl pero la vista no. ¿Cuál es la causa más precisa?",
    options: [
      {
        id: "a",
        text: "setValue/patchValue emiten observables del form pero no programan CD; hay que conectar valueChanges a markForCheck o proyectar el valor en signals de template.",
      },
      {
        id: "b",
        text: "Los reactive forms están prohibidos en zoneless.",
      },
      {
        id: "c",
        text: "Hay que envolver cada FormControl en NgZone.onStable.",
      },
      {
        id: "d",
        text: "El problema es CSS; Angular no actualiza inputs nativos nunca.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "La guía zoneless documenta este pie: el modelo de reactive forms no notifica por sí solo. NgZone.onStable no emite en zoneless. Signal Forms ataca precisamente este desajuste estado-vista.",
    sourceUrls: ["https://angular.dev/guide/zoneless"],
  },
];
