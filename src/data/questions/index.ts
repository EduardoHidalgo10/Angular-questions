import type { Question } from "../../types/question";
import { architectureQuestions } from "./architecture";
import { changeDetectionQuestions } from "./change-detection";
import { componentQuestions } from "./components";
import { diQuestions } from "./di";
import { formQuestions } from "./forms";
import { httpQuestions } from "./http";
import { microfrontendQuestions } from "./microfrontends";
import { ngrxQuestions } from "./ngrx";
import { queryQuestions } from "./queries";
import { routerQuestions } from "./router";
import { rxjsQuestions } from "./rxjs";
import { securityQuestions } from "./security";
import { signalQuestions } from "./signals";
import { templateQuestions } from "./templates";
import { testingQuestions } from "./testing";
import { typescriptQuestions } from "./typescript";

/**
 * Reúne el banco completo de preguntas en el orden canónico de IDs.
 */
export const QUESTIONS: Question[] = [
  ...typescriptQuestions,
  ...architectureQuestions,
  ...componentQuestions,
  ...templateQuestions,
  ...queryQuestions,
  ...diQuestions,
  ...rxjsQuestions,
  ...signalQuestions,
  ...changeDetectionQuestions,
  ...formQuestions,
  ...routerQuestions,
  ...httpQuestions,
  ...ngrxQuestions,
  ...securityQuestions,
  ...testingQuestions,
  ...microfrontendQuestions,
];

/**
 * Indexa las preguntas por ID para consultas O(1) durante el cuestionario.
 */
export const questionsById = new Map(QUESTIONS.map((question) => [question.id, question]));
