import type { Question } from "../../types/question";

export const architectureQuestions: Question[] = [
  {
    id: "ANG-005",
    category: "Arquitectura Angular, standalone, NgModules, librerías y build",
    difficulty: "fundamental",
    type: "single",
    prompt:
      "¿Qué afirma con precisión la arquitectura standalone frente a NgModules en Angular actual?",
    options: [
      {
        id: "a",
        text: "Un componente standalone declara sus propias dependencias en imports y puede arrancar la app con bootstrapApplication, sin NgModule raíz.",
      },
      {
        id: "b",
        text: "Standalone elimina el inyector de Angular, por eso ya no se usan providers.",
      },
      {
        id: "c",
        text: "Los NgModules son incompatibles con componentes standalone y deben borrarse antes de migrar.",
      },
      {
        id: "d",
        text: "Standalone solo funciona en desarrollo; producción sigue exigiendo un AppModule.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Standalone hace que componentes, directivas y pipes sean autosuficientes mediante imports. bootstrapApplication sustituye al NgModule raíz. b es falsa: DI sigue siendo central. c es falsa: hay compatibilidad progresiva, un standalone puede importar un NgModule. d inventa una limitación de build inexistente.",
    interviewInsight:
      "Menciona que standalone es el enfoque por defecto moderno, pero que en proyectos legacy conviven ambos y existe un schematic de migración.",
    sourceUrls: ["https://angular.dev/guide/components"],
  },
  {
    id: "ANG-006",
    category: "Arquitectura Angular, standalone, NgModules, librerías y build",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "En una ruta lazy, ¿qué enfoque es el recomendado con componentes standalone?",
    codeSnippet: `{
  path: "admin",
  loadComponent: () =>
    import("./admin/admin-page").then((m) => m.AdminPage),
}`,
    options: [
      {
        id: "a",
        text: "loadComponent descarga el componente standalone y sus imports al navegar, reduciendo el bundle inicial.",
      },
      {
        id: "b",
        text: "loadComponent solo funciona si el componente sigue declarado en un NgModule de feature.",
      },
      {
        id: "c",
        text: "El lazy loading standalone obliga a duplicar provideHttpClient en cada componente.",
      },
      {
        id: "d",
        text: "loadComponent hidrata SSR de forma automática; loadChildren queda obsoleto incluso para rutas hijas complejas.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "loadComponent es la API de lazy loading a nivel de componente. El chunk se obtiene al navegar. b es incorrecta: no hace falta NgModule. c confunde providers de aplicación con imports del componente. d mezcla hidratación con routing: loadChildren sigue siendo válido para árboles de rutas.",
    sourceUrls: ["https://angular.dev/guide/routing"],
  },
  {
    id: "ANG-007",
    category: "Arquitectura Angular, standalone, NgModules, librerías y build",
    difficulty: "senior",
    type: "multiple",
    prompt:
      "Publicas una librería interna y un widget reutilizable. ¿Qué afirmaciones son correctas?",
    options: [
      {
        id: "a",
        text: "Una librería Angular empaquetada con ng-packagr exporta una API pública (public-api) y declara Angular como peerDependency.",
      },
      {
        id: "b",
        text: "Angular Elements envuelve un componente en un custom element para usarlo fuera de una app Angular.",
      },
      {
        id: "c",
        text: "Standalone mejora el tree-shaking porque las dependencias se importan explícitamente en cada pieza.",
      },
      {
        id: "d",
        text: "Convertir toda la librería en Angular Element es siempre mejor, incluso si solo la consumen apps Angular del mismo monorepo.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "a describe el empaquetado estándar. b es el propósito de Angular Elements. c es una ventaja real de standalone e imports explícitos. d es un mal trade-off: los custom elements añaden overhead de zona, encapsulación y bundle; si el consumidor ya es Angular, una librería de componentes es más simple y tipada.",
    interviewInsight:
      "Distingue librería Angular (consumo Angular, tipado, DI) frente a Angular Element (interop con React, CMS o HTML plano).",
    sourceUrls: ["https://angular.dev/tools/libraries"],
  },
  {
    id: "ANG-008",
    category: "Arquitectura Angular, standalone, NgModules, librerías y build",
    difficulty: "senior",
    type: "single",
    prompt:
      "Un servicio de analytics debe ser singleton en toda la app standalone. ¿Qué registro es el más adecuado?",
    codeSnippet: `@Injectable({ providedIn: "root" })
export class AnalyticsService {}`,
    options: [
      {
        id: "a",
        text: "providedIn: 'root' registra el servicio en el inyector raíz, es tree-shakable y no requiere providers en el componente.",
      },
      {
        id: "b",
        text: "Hay que añadirlo también en providers del AppComponent, si no Angular crea una instancia por ruta lazy.",
      },
      {
        id: "c",
        text: "En standalone, providedIn: 'root' se ignora; solo funcionan providers de bootstrapApplication.",
      },
      {
        id: "d",
        text: "El singleton raíz se logra únicamente con providedIn: 'platform', obligatorio desde el modo zoneless.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "providedIn: 'root' sigue siendo la forma recomendada de singleton tree-shakable, también en aplicaciones standalone. b crearía el riesgo de instancias extra si se reprovee. c es un mito. d inventa un requisito de zoneless; platform es para compartir estado entre múltiples apps en la misma página.",
    sourceUrls: ["https://angular.dev/guide/di"],
  },
];
