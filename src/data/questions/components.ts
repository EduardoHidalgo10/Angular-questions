import type { Question } from "../../types/question";

export const componentQuestions: Question[] = [
  {
    id: "ANG-009",
    category: "Componentes, comunicación y proyección de contenido",
    difficulty: "fundamental",
    type: "single",
    prompt:
      "¿Cuál es el flujo correcto de comunicación padre-hijo con la API tradicional de Angular?",
    options: [
      {
        id: "a",
        text: "El padre pasa datos al hijo con @Input (property binding) y el hijo notifica al padre con @Output y EventEmitter.",
      },
      {
        id: "b",
        text: "El hijo pasa datos al padre con @Input y el padre responde con @Output.",
      },
      {
        id: "c",
        text: "@Input y @Output solo funcionan entre componentes hermanos.",
      },
      {
        id: "d",
        text: "@Output sustituye a los servicios compartidos y debe usarse para estado global.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "La API clásica es unidireccional: datos hacia abajo por inputs, eventos hacia arriba por outputs. b invierte el flujo. c: hermanos no tienen Input/Output directo. d: outputs no son estado global; para no relacionados se usa un servicio.",
    sourceUrls: ["https://angular.dev/guide/components/inputs"],
  },
  {
    id: "ANG-010",
    category: "Componentes, comunicación y proyección de contenido",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "Respecto a input(), output() y model(), ¿qué afirmación es correcta?",
    codeSnippet: `export class Precio {
  valor = input.required<number>();
  valorChange = output<number>();
  abierto = model(false);
}`,
    options: [
      {
        id: "a",
        text: "input() crea un input signal de solo lectura; output() emite eventos; model() ofrece two-way binding writable hacia el padre.",
      },
      {
        id: "b",
        text: "model() es un alias de input() y no puede escribirse desde el hijo.",
      },
      {
        id: "c",
        text: "output() devuelve un signal que el padre debe leer con ().",
      },
      {
        id: "d",
        text: "input.required hace el input opcional y le asigna undefined por defecto.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "input() produce un Signal de entrada. output() es un emisor de eventos, no un signal. model() sincroniza un valor en ambos sentidos, equivalente moderno de [(value)]. b niega la escritura de model. c confunde output con signals. d: required hace obligatorio el input.",
    sourceUrls: [
      "https://angular.dev/guide/components/inputs",
      "https://angular.dev/guide/components/outputs",
      "https://angular.dev/guide/components/models",
    ],
  },
  {
    id: "ANG-011",
    category: "Componentes, comunicación y proyección de contenido",
    difficulty: "intermediate",
    type: "multiple",
    prompt:
      "¿En qué escenarios un servicio compartido es más adecuado que una cadena de @Input/@Output?",
    options: [
      {
        id: "a",
        text: "Cuando dos componentes no tienen relación padre-hijo y necesitan el mismo estado (por ejemplo, un carrito).",
      },
      {
        id: "b",
        text: "Cuando el estado debe sobrevivir a la destrucción de un componente concreto y vivir como singleton.",
      },
      {
        id: "c",
        text: "Cuando un formulario hijo solo debe notificar un submit al padre inmediato.",
      },
      {
        id: "d",
        text: "Cuando varios features leen y actualizan un mismo origen de verdad sin prop drilling.",
      },
    ],
    correctOptionIds: ["a", "b", "d"],
    explanation:
      "Servicios (con signals o RxJS) resuelven comunicación entre no relacionados, estado de aplicación y evitan prop drilling. c es el caso canónico de @Output: un evento local al padre inmediato. Meter ese submit en un singleton global empeora el acoplamiento.",
    sourceUrls: ["https://angular.dev/guide/di"],
  },
  {
    id: "ANG-012",
    category: "Componentes, comunicación y proyección de contenido",
    difficulty: "senior",
    type: "single",
    prompt:
      "Construyes una tabla genérica. ¿Cuándo es preferible ng-template + ngTemplateOutlet frente a ng-content?",
    codeSnippet: `<app-tabla [columns]="cols" [rowTemplate]="fila" [data]="rows" />
<ng-template #fila let-row>
  <strong>{{ row.nombre }}</strong>
</ng-template>`,
    options: [
      {
        id: "a",
        text: "Cuando el padre debe definir cómo se renderiza cada ítem y recibir contexto ($implicit / let-row) por fila.",
      },
      {
        id: "b",
        text: "ng-content es siempre superior porque proyecta DOM y además inyecta el contexto de cada fila automáticamente.",
      },
      {
        id: "c",
        text: "ng-template se renderiza al declarar el #fila, así que no sirve para listas virtuales.",
      },
      {
        id: "d",
        text: "Solo ng-content puede usarse junto a @for; ngTemplateOutlet es incompatible con control flow.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "ng-content proyecta contenido estático del consumidor, sin repetir contexto por ítem. Para una celda/fila parametrizada, el padre pasa un TemplateRef y el hijo lo instancia con ngTemplateOutlet y un context. b es falsa: ng-content no crea contexto por fila. c: ng-template no se renderiza hasta instanciarse. d: @for e ngTemplateOutlet se combinan habitualmente.",
    interviewInsight:
      "Esta distinción (proyección simple vs plantilla con contexto) es una pregunta clásica de senior para componentes de diseño system.",
    sourceUrls: ["https://angular.dev/guide/templates"],
  },
  {
    id: "ANG-013",
    category: "Componentes, comunicación y proyección de contenido",
    difficulty: "senior",
    type: "multiple",
    prompt:
      "Analiza esta proyección de contenido. ¿Qué afirmaciones son correctas?",
    codeSnippet: `<!-- card.html -->
<header><ng-content select="[card-header]" /></header>
<section><ng-content /></section>
<footer><ng-content select="[card-footer]" /></footer>`,
    options: [
      {
        id: "a",
        text: "select permite múltiples slots; el ng-content sin select recibe el contenido que no coincidió con otros selectores.",
      },
      {
        id: "b",
        text: "@ContentChild / contentChild() consultan el contenido proyectado, no los elementos del template interno de la card.",
      },
      {
        id: "c",
        text: "Los nodos proyectados siguen perteneciendo al template del padre, por eso las queries de la card no atraviesan la frontera del hijo interno.",
      },
      {
        id: "d",
        text: "Un único ng-content sin select duplica el DOM en header, section y footer si hay varios slots.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "a describe el comportamiento de slots. b: content queries miran contenido proyectado. c: las queries no perforan componentes. d es falsa: cada nodo se proyecta a un solo outlet; no se duplica el DOM por tener varios ng-content.",
    sourceUrls: [
      "https://angular.dev/guide/components/content-projection",
      "https://angular.dev/guide/components/queries",
    ],
  },
  {
    id: "ANG-014",
    category: "Componentes, comunicación y proyección de contenido",
    difficulty: "senior",
    type: "single",
    prompt:
      "Necesitas crear un componente de diálogo en runtime. ¿Qué API es la adecuada?",
    codeSnippet: `const ref = this.vcr.createComponent(ConfirmDialog);
ref.setInput("mensaje", texto);`,
    options: [
      {
        id: "a",
        text: "ViewContainerRef.createComponent instancia el componente dinámicamente; TemplateRef se usa para vistas embebidas, no para clases de componente.",
      },
      {
        id: "b",
        text: "TemplateRef.createComponent es la API oficial para diálogos; ViewContainerRef solo inserta texto.",
      },
      {
        id: "c",
        text: "ng-container crea componentes dinámicos por sí mismo al declararlo en el template.",
      },
      {
        id: "d",
        text: "Hay que usar document.createElement con el selector del componente para conservar DI.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "ViewContainerRef ancla la creación dinámica y participa en DI y change detection. TemplateRef crea embedded views a partir de ng-template. ng-container es un agrupador sin DOM. createElement bypasea Angular y pierde DI, inputs y ciclo de vida.",
    sourceUrls: ["https://angular.dev/guide/components/programmatic-rendering"],
  },
];
