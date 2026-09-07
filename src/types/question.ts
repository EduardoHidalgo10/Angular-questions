/**
 * Representa si la pregunta admite una o varias respuestas correctas.
 */
export type QuestionType = "single" | "multiple";

/**
 * Representa el nivel de exigencia de la pregunta.
 */
export type Difficulty = "fundamental" | "intermediate" | "senior";

/**
 * Enumera las categorías oficiales del banco de preguntas.
 */
export const CATEGORIES = [
  "TypeScript, clases y orientación a objetos",
  "Arquitectura Angular, standalone, NgModules, librerías y build",
  "Componentes, comunicación y proyección de contenido",
  "Templates, bindings, clases CSS, directivas y pipes",
  "ViewChild, queries, lifecycle y DOM",
  "Dependency Injection, servicios y providers",
  "RxJS y prevención de memory leaks",
  "Signals e interoperabilidad con RxJS",
  "Change detection, zoneless, rendimiento, SSR e hidratación",
  "Formularios",
  "Router",
  "HttpClient e interceptores",
  "Gestión de estado y NgRx",
  "Seguridad, autenticación, autorización y roles",
  "Testing",
  "Microfrontends, Web Workers y CI/CD",
] as const;

/**
 * Representa una categoría del cuestionario.
 */
export type Category = (typeof CATEGORIES)[number];

/**
 * Describe una opción seleccionable.
 */
export interface QuestionOption {
  id: string;
  text: string;
}

/**
 * Describe una pregunta del banco de evaluación.
 */
export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  type: QuestionType;
  prompt: string;
  codeSnippet?: string;
  options: QuestionOption[];
  correctOptionIds: string[];
  explanation: string;
  interviewInsight?: string;
  sourceUrls: string[];
}

/**
 * Conserva el progreso persistido en localStorage.
 */
export interface PersistedQuiz {
  questionOrder: string[];
  optionOrders: Record<string, string[]>;
  currentIndex: number;
  selectedByQuestion: Record<string, string[]>;
  checkedByQuestion: Record<string, boolean>;
  correctByQuestion: Record<string, boolean>;
  screen: "start" | "quiz" | "results";
}
