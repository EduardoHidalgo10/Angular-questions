import type { Question } from "../../types/question";

export const templateQuestions: Question[] = [
  {
    id: "ANG-015",
    category: "Templates, bindings, clases CSS, directivas y pipes",
    difficulty: "fundamental",
    type: "single",
    prompt:
      "¿Qué diferencia hay entre property binding, attribute binding y event binding?",
    codeSnippet: `<button [disabled]="cargando" [attr.aria-busy]="cargando" (click)="guardar()">
  Guardar
</button>`,
    options: [
      {
        id: "a",
        text: "[disabled] enlaza una propiedad DOM, [attr.aria-busy] escribe un atributo HTML y (click) escucha un evento.",
      },
      {
        id: "b",
        text: "[disabled] y [attr.aria-busy] son equivalentes; Angular los normaliza siempre a atributos.",
      },
      {
        id: "c",
        text: "(click) es two-way binding y [disabled] es un evento invertido.",
      },
      {
        id: "d",
        text: "attr.aria-busy solo funciona con Renderer2; en el template se ignora.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Property binding actualiza la propiedad del nodo (disabled es boolean). Algunos valores de accesibilidad no existen como propiedad y requieren attr. Event binding escucha. b ignora esa distinción. c confunde con [(ngModel)]. d es falsa.",
    sourceUrls: ["https://angular.dev/guide/templates/binding"],
  },
  {
    id: "ANG-016",
    category: "Templates, bindings, clases CSS, directivas y pipes",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "Hay varias formas de aplicar clases. ¿Cuál describe el comportamiento real?",
    codeSnippet: `<div
  class="card"
  [class]="tema"
  [class.active]="seleccionado"
  [ngClass]="{ disabled: !puedeEditar }">
</div>`,
    options: [
      {
        id: "a",
        text: "class fija clases estáticas; [class] puede reemplazar el conjunto; [class.active] conmuta una clase; ngClass acepta objetos, arrays o strings.",
      },
      {
        id: "b",
        text: "[class.active] borra la clase card porque [class] tiene precedencia total y elimina cualquier otra clase.",
      },
      {
        id: "c",
        text: "ngClass es impuro y se evalúa solo cuando cambia la referencia de tema.",
      },
      {
        id: "d",
        text: "En control flow moderno, ngClass está prohibido y [class.active] no admite booleanos.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Las cuatro APIs coexisten y se combinan. [class.active] no elimina card. ngClass no es un pipe y no se rige por pureza de pipes. ngClass sigue siendo válido junto a @if/@for.",
    sourceUrls: ["https://angular.dev/guide/templates/binding#css-class-and-style-bindings"],
  },
  {
    id: "ANG-017",
    category: "Templates, bindings, clases CSS, directivas y pipes",
    difficulty: "intermediate",
    type: "multiple",
    prompt:
      "Sobre el control flow de plantillas (@if, @for, @switch, @empty, track, @let, @defer), ¿qué es correcto?",
    codeSnippet: `@let total = items().length;
@if (total > 0) {
  @for (item of items(); track item.id) {
    <p>{{ item.nombre }}</p>
  } @empty {
    <p>Sin filas visibles</p>
  }
} @else {
  <p>Lista no cargada</p>
}`,
    options: [
      {
        id: "a",
        text: "track identifica filas para reutilizar DOM; sin una identidad estable, Angular recrea nodos innecesariamente.",
      },
      {
        id: "b",
        text: "@empty se muestra cuando la colección iterada está vacía, no cuando el @if es falso.",
      },
      {
        id: "c",
        text: "@let declara una variable de template reutilizable en ese bloque.",
      },
      {
        id: "d",
        text: "@defer sustituye a @for para listas grandes y no requiere track.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "a, b y c describen el control flow actual. d mezcla conceptos: @defer retrasa la carga de un bloque/chunk; no itera listas. Para listas, @for + track (y virtual scroll si aplica) es la herramienta.",
    sourceUrls: ["https://angular.dev/guide/templates/control-flow"],
  },
  {
    id: "ANG-018",
    category: "Templates, bindings, clases CSS, directivas y pipes",
    difficulty: "senior",
    type: "single",
    prompt:
      "Un pipe de filtrado sobre un array mutable no actualiza la vista. ¿Cuál es el diagnóstico correcto?",
    codeSnippet: `@Pipe({ name: "activos", standalone: true })
export class ActivosPipe implements PipeTransform {
  transform(items: Item[]) {
    return items.filter((i) => i.activo);
  }
}
// el componente hace this.items.push(nuevo);`,
    options: [
      {
        id: "a",
        text: "El pipe es puro por defecto y no se reevalúa si la referencia del array no cambia; mutar con push no invalida el resultado memoizado.",
      },
      {
        id: "b",
        text: "Todos los pipes se reevalúan en cada CD, así que el bug está en @for.",
      },
      {
        id: "c",
        text: "AsyncPipe es puro y por eso tampoco vería el push.",
      },
      {
        id: "d",
        text: "Hay que marcar el pipe como standalone: false para que detecte mutaciones.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Los pipes puros se ejecutan solo cuando cambia la referencia de entrada. push muta in-place. Soluciones: reasignar el array, usar signals/inmutabilidad, o (con coste) un pipe impuro. b niega la memoización. c: AsyncPipe es impuro y gestiona suscripciones. d: standalone no afecta la pureza.",
    interviewInsight:
      "Explica por qué un método en el template se comporta como un pipe impuro: se ejecuta en cada CD. Un pipe puro es más predecible y barato.",
    sourceUrls: ["https://angular.dev/guide/templates/pipes"],
  },
  {
    id: "ANG-019",
    category: "Templates, bindings, clases CSS, directivas y pipes",
    difficulty: "senior",
    type: "multiple",
    prompt:
      "En una directiva de atributo, ¿qué prácticas son correctas para manipular el host?",
    codeSnippet: `@Directive({ selector: "[appResaltar]", standalone: true })
export class ResaltarDirective {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
}`,
    options: [
      {
        id: "a",
        text: "HostListener escucha eventos del host; HostBinding enlaza clase, estilo o propiedad del host a un valor de la directiva.",
      },
      {
        id: "b",
        text: "Renderer2 es preferible a tocar nativeElement.style si el código debe correr también en SSR.",
      },
      {
        id: "c",
        text: "ElementRef da acceso al nodo nativo, pero manipularlo directo rompe encapsulación y es frágil fuera del navegador.",
      },
      {
        id: "d",
        text: "Una directiva estructural y una de atributo son idénticas: ambas siempre crean un ng-template implícito.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "a, b y c son el estándar de directivas de atributo y DOM seguro. d es falsa: las estructurales (como @if o una directiva con *) trabajan con TemplateRef/ViewContainerRef; las de atributo no crean una plantilla implícita por sí solas.",
    sourceUrls: ["https://angular.dev/guide/directives"],
  },
  {
    id: "ANG-020",
    category: "Templates, bindings, clases CSS, directivas y pipes",
    difficulty: "senior",
    type: "single",
    prompt:
      "¿Qué combinación describe mejor two-way binding moderno y carga diferida de UI pesada?",
    codeSnippet: `<app-filtro [(rango)]="rango" />
@defer (on viewport) {
  <app-grafico-pesado />
} @placeholder {
  <p>Cargando gráfico</p>
}`,
    options: [
      {
        id: "a",
        text: "[(rango)] equivale a [rango] + (rangoChange) o a un model(); @defer parte el bundle y retrasa el trabajo hasta una condición como viewport.",
      },
      {
        id: "b",
        text: "@defer ejecuta el gráfico en un Web Worker y por eso no necesita placeholder.",
      },
      {
        id: "c",
        text: "[(rango)] solo existe en template-driven forms y no puede usarse en un componente propio.",
      },
      {
        id: "d",
        text: "@placeholder hidrata SSR; @defer solo funciona en NgModules.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "La banana box es azúcar de input + output con sufijo Change, o model(). @defer es una frontera de carga perezosa en el template, no un Web Worker. Funciona en standalone y no sustituye la hidratación de SSR, aunque se integra con Incremental Hydration.",
    sourceUrls: [
      "https://angular.dev/guide/templates/binding#two-way-binding",
      "https://angular.dev/guide/templates/defer",
    ],
  },
];
