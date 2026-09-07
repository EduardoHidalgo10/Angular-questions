import type { Question } from "../../types/question";

export const queryQuestions: Question[] = [
  {
    id: "ANG-021",
    category: "ViewChild, queries, lifecycle y DOM",
    difficulty: "fundamental",
    type: "single",
    prompt:
      "¿Por qué un @ViewChild de un input del propio template no está disponible de forma fiable en ngOnInit?",
    codeSnippet: `@ViewChild("campo") campo!: ElementRef<HTMLInputElement>;
ngOnInit() {
  this.campo.nativeElement.focus();
}`,
    options: [
      {
        id: "a",
        text: "Las view queries se resuelven cuando la vista del componente ya se inicializó; ese momento es ngAfterViewInit.",
      },
      {
        id: "b",
        text: "ngOnInit corre después de ngAfterViewInit, así que el fallo es un bug de Angular.",
      },
      {
        id: "c",
        text: "ElementRef nunca está listo; hay que usar document.getElementById.",
      },
      {
        id: "d",
        text: "focus() solo funciona desde ngOnDestroy.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "El orden de inicialización coloca ngOnInit antes de crear la vista hija. ngAfterViewInit es el hook clásico para leer @ViewChild. b invierte el ciclo. c y d son incorrectos y peores para SSR y testing.",
    sourceUrls: [
      "https://angular.dev/guide/components/queries",
      "https://angular.dev/guide/components/lifecycle",
    ],
  },
  {
    id: "ANG-022",
    category: "ViewChild, queries, lifecycle y DOM",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "¿Qué implica { static: true } en @ViewChild / @ContentChild?",
    codeSnippet: `@ViewChild("header", { static: true }) header!: ElementRef;`,
    options: [
      {
        id: "a",
        text: "Garantizas que el destino existe siempre y no es condicional; el resultado está disponible en ngOnInit y no se actualiza después.",
      },
      {
        id: "b",
        text: "Hace la query más rápida en zoneless y permite consultar elementos dentro de @if.",
      },
      {
        id: "c",
        text: "static: true es el valor por defecto actual y se recomienda para listas @for.",
      },
      {
        id: "d",
        text: "Convierte la query en un signal equivalente a viewChild().",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "static: true adelanta la resolución a ngOnInit a cambio de no soportar destinos condicionales ni actualizaciones posteriores. No es el default moderno (static: false). No equivale a las signal queries, que sí se mantienen al día incluso con @if.",
    sourceUrls: ["https://angular.dev/guide/components/queries"],
  },
  {
    id: "ANG-023",
    category: "ViewChild, queries, lifecycle y DOM",
    difficulty: "intermediate",
    type: "multiple",
    prompt:
      "¿Qué diferencias clave hay entre view queries y content queries?",
    options: [
      {
        id: "a",
        text: "viewChild / @ViewChild buscan en el template del propio componente.",
      },
      {
        id: "b",
        text: "contentChild / @ContentChild buscan en el contenido proyectado por el padre (ng-content).",
      },
      {
        id: "c",
        text: "Las queries no atraviesan la frontera de otro componente para entrar a su template interno.",
      },
      {
        id: "d",
        text: "@ViewChildren puede localizar un componente usado como contenido proyectado dentro de ng-content.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "View = template propio. Content = nodos proyectados. Ninguna query perfora componentes. d es falsa: lo proyectado se consulta con content queries, no con ViewChildren.",
    sourceUrls: ["https://angular.dev/guide/components/queries"],
  },
  {
    id: "ANG-024",
    category: "ViewChild, queries, lifecycle y DOM",
    difficulty: "senior",
    type: "single",
    prompt:
      "El input está dentro de @if. ¿Qué API refleja mejor su presencia de forma reactiva?",
    codeSnippet: `@if (visible()) {
  <input #campo />
}`,
    options: [
      {
        id: "a",
        text: "campo = viewChild<ElementRef>('campo') devuelve un signal que pasa a undefined cuando @if destruye el nodo.",
      },
      {
        id: "b",
        text: "@ViewChild({ static: true }) sigue encontrando el input aunque @if sea falso.",
      },
      {
        id: "c",
        text: "contentChild() es obligatorio porque @if proyecta contenido.",
      },
      {
        id: "d",
        text: "QueryList no existe en Angular moderno y viewChild lanza si el elemento falta.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Las signal queries se actualizan con el control flow. Si el destino no está, viewChild() vale undefined (salvo .required, que erroréa). static: true no sirve para destinos condicionales. @if en el propio template es view, no content. QueryList sigue existiendo en @ViewChildren.",
    interviewInsight:
      "En entrevistas actuales, diferencia decorator queries (ngAfterViewInit, QueryList) de signal queries (legibles en computed/effect y alineadas con @if).",
    sourceUrls: ["https://angular.dev/guide/components/queries"],
  },
  {
    id: "ANG-025",
    category: "ViewChild, queries, lifecycle y DOM",
    difficulty: "senior",
    type: "multiple",
    prompt:
      "Sobre read, QueryList y queries múltiples, ¿qué es cierto?",
    codeSnippet: `@ViewChildren(ListItem, { read: ElementRef }) items!: QueryList<ElementRef>;
acciones = viewChildren(ListItem);`,
    options: [
      {
        id: "a",
        text: "read permite obtener ElementRef o TemplateRef del nodo localizado por otro locator (componente/directiva).",
      },
      {
        id: "b",
        text: "@ViewChildren entrega un QueryList con changes; viewChildren() entrega un signal de Array.",
      },
      {
        id: "c",
        text: "viewChild.required elimina undefined del tipo y reporta error si el hijo falta.",
      },
      {
        id: "d",
        text: "contentChildren recorre descendientes por defecto, igual que contentChild; no hace falta descendants.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "a, b y c coinciden con la guía de queries. d es al revés: contentChildren solo mira hijos directos salvo descendants: true; contentChild sí atraviesa descendientes del mismo template.",
    sourceUrls: ["https://angular.dev/guide/components/queries"],
  },
  {
    id: "ANG-026",
    category: "ViewChild, queries, lifecycle y DOM",
    difficulty: "senior",
    type: "single",
    prompt:
      "Debes medir getBoundingClientRect después de pintar. ¿Qué eliges y por qué?",
    codeSnippet: `constructor() {
  afterNextRender({
    write: () => { /* mutar layout */ },
    read: () => { /* medir */ },
  });
}`,
    options: [
      {
        id: "a",
        text: "afterNextRender corre tras el render a DOM (no en SSR); sus fases write/read evitan layout thrashing, a diferencia de ngAfterViewInit que aún es parte del CD del componente.",
      },
      {
        id: "b",
        text: "ngOnInit es el único sitio seguro para medir layout porque el navegador ya pintó.",
      },
      {
        id: "c",
        text: "afterEveryRender se ejecuta en el servidor y por eso es mejor para SEO de medidas.",
      },
      {
        id: "d",
        text: "ngAfterViewChecked sustituye a afterEveryRender y se recomienda para lecturas de layout continuas.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Los render hooks son application-wide, post-DOM, y no corren en SSR. Permiten separar writes y reads. ngOnInit es demasiado pronto. afterEveryRender tampoco corre en servidor. ngAfterViewChecked se dispara muy a menudo y mutar/medir ahí es una fuente clásica de jank y ExpressionChanged.",
    sourceUrls: ["https://angular.dev/guide/components/lifecycle"],
  },
];
