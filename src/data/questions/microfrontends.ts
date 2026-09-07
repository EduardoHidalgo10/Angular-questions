import type { Question } from "../../types/question";

export const microfrontendQuestions: Question[] = [
  {
    id: "ANG-075",
    category: "Microfrontends, Web Workers y CI/CD",
    difficulty: "senior",
    type: "single",
    prompt:
      "El shell tarda 8s en interactividad, el parseo de un CSV de 40MB congela la UI y cada squad quiere desplegar su dominio. ¿Qué arquitectura encaja y qué no?",
    codeSnippet: `new Worker(new URL("./parse.worker", import.meta.url));
// host: Module Federation remotes + shared singleton de @angular/core`,
    options: [
      {
        id: "a",
        text: "Module Federation (o equivalentes) permite deploys independientes del remote; el CSV va a un Web Worker (sin DOM); el pipeline hace install → test → build → deploy con hashes para cache-busting. Compartir Angular como singleton evita dos runtimes.",
      },
      {
        id: "b",
        text: "El Web Worker debe manipular el DOM del grid para ser más rápido, y cada remote debe empaquetar su propia copia de @angular/core.",
      },
      {
        id: "c",
        text: "CI/CD no aplica a SPAs: basta con copiar src/ a producción sin ng build.",
      },
      {
        id: "d",
        text: "Microfrontends eliminan la necesidad de contratos de versiones; Worker y Federation son lo mismo.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Son tres palancas distintas: federación para límites de equipo y deploy, workers para CPU off-main-thread (postMessage, sin window/DOM), CI/CD para artefactos reproducibles y environments. Duplicar Angular infla y rompe DI. Subir TypeScript crudo a prod no es un build. Federation no es un worker.",
    interviewInsight:
      "Un senior nombra costes: version mismatch, testing e2e del shell, contratos de eventos, y cuándo un monorepo con librerías basta frente a microfrontends.",
    sourceUrls: [
      "https://angular.dev/tools/cli/deployment",
      "https://angular.dev/guide/performance",
    ],
  },
];
