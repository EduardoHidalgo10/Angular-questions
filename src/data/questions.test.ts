import { describe, expect, it } from "vitest";
import { QUESTIONS } from "../data/questions";
import { CATEGORIES } from "../types/question";
import { orderByIds, shuffle } from "../utils/shuffle";

const expectedCategoryCounts: Record<(typeof CATEGORIES)[number], number> = {
  "TypeScript, clases y orientación a objetos": 4,
  "Arquitectura Angular, standalone, NgModules, librerías y build": 4,
  "Componentes, comunicación y proyección de contenido": 6,
  "Templates, bindings, clases CSS, directivas y pipes": 6,
  "ViewChild, queries, lifecycle y DOM": 6,
  "Dependency Injection, servicios y providers": 5,
  "RxJS y prevención de memory leaks": 8,
  "Signals e interoperabilidad con RxJS": 7,
  "Change detection, zoneless, rendimiento, SSR e hidratación": 6,
  Formularios: 6,
  Router: 4,
  "HttpClient e interceptores": 4,
  "Gestión de estado y NgRx": 2,
  "Seguridad, autenticación, autorización y roles": 3,
  Testing: 3,
  "Microfrontends, Web Workers y CI/CD": 1,
};

/**
 * Valida el banco de 75 preguntas y sus invariantes de evaluación.
 */
describe("banco de preguntas", () => {
  it("contiene exactamente 75 preguntas", () => {
    expect(QUESTIONS).toHaveLength(75);
  });

  it("usa IDs únicos ANG-001 a ANG-075", () => {
    const ids = QUESTIONS.map((question) => question.id);
    expect(new Set(ids).size).toBe(75);
    expect(ids).toEqual(
      Array.from({ length: 75 }, (_, index) => `ANG-${String(index + 1).padStart(3, "0")}`),
    );
  });

  it("tiene 55 preguntas single y 20 multiple", () => {
    expect(QUESTIONS.filter((question) => question.type === "single")).toHaveLength(55);
    expect(QUESTIONS.filter((question) => question.type === "multiple")).toHaveLength(20);
  });

  it("cumple la distribución de dificultad", () => {
    expect(QUESTIONS.filter((question) => question.difficulty === "fundamental")).toHaveLength(10);
    expect(QUESTIONS.filter((question) => question.difficulty === "intermediate")).toHaveLength(25);
    expect(QUESTIONS.filter((question) => question.difficulty === "senior")).toHaveLength(40);
  });

  it("cumple la distribución por categorías", () => {
    for (const category of CATEGORIES) {
      const count = QUESTIONS.filter((question) => question.category === category).length;
      expect(count, category).toBe(expectedCategoryCounts[category]);
    }
  });

  it("exige cuatro opciones, respuestas válidas, explicación y fuente", () => {
    for (const question of QUESTIONS) {
      expect(question.options).toHaveLength(4);
      const optionIds = question.options.map((option) => option.id);
      expect(new Set(optionIds).size).toBe(4);
      expect(question.correctOptionIds.length).toBeGreaterThan(0);
      expect(question.correctOptionIds.every((id) => optionIds.includes(id))).toBe(true);
      if (question.type === "single") {
        expect(question.correctOptionIds).toHaveLength(1);
      } else {
        expect(question.correctOptionIds.length).toBeGreaterThanOrEqual(2);
        expect(question.correctOptionIds.length).toBeLessThanOrEqual(3);
      }
      expect(question.explanation.trim().length).toBeGreaterThan(20);
      expect(question.sourceUrls.length).toBeGreaterThan(0);
      expect(question.prompt.includes("Todas las anteriores")).toBe(false);
      expect(question.prompt.includes("Ninguna de las anteriores")).toBe(false);
    }
  });

  it("incluye al menos 30 preguntas con código o escenario", () => {
    const withScenario = QUESTIONS.filter(
      (question) =>
        Boolean(question.codeSnippet) ||
        /escenario|falla|diagnóstico|arquitectura|trade-off/i.test(question.prompt),
    );
    expect(withScenario.length).toBeGreaterThanOrEqual(30);
  });

  it("no pierde las respuestas correctas al mezclar opciones", () => {
    for (const question of QUESTIONS) {
      const shuffledIds = shuffle(question.options.map((option) => option.id));
      const ordered = orderByIds(question.options, shuffledIds);
      expect(ordered.map((option) => option.id)).toEqual(shuffledIds);
      const correctTexts = question.correctOptionIds
        .map((id) => question.options.find((option) => option.id === id)?.text)
        .sort();
      const afterShuffle = question.correctOptionIds
        .map((id) => ordered.find((option) => option.id === id)?.text)
        .sort();
      expect(afterShuffle).toEqual(correctTexts);
    }
  });
});
