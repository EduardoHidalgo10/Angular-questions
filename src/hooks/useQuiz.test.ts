import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { QUESTIONS } from "../data/questions";
import { useQuiz } from "../hooks/useQuiz";
import { clampQuestionCount, isExactMatch, percentFrom, weakestGroups } from "../utils/score";
import { clearQuiz, loadQuiz, saveQuiz, STORAGE_KEY } from "../utils/storage";

/**
 * Valida puntuación, persistencia y el flujo del custom hook.
 */
describe("puntuación y persistencia", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("considera correcta solo la coincidencia exacta del conjunto", () => {
    expect(isExactMatch(["a", "c"], ["c", "a"])).toBe(true);
    expect(isExactMatch(["a"], ["a", "b"])).toBe(false);
    expect(isExactMatch(["a", "b", "c"], ["a", "b"])).toBe(false);
  });

  it("calcula el porcentaje y las áreas débiles", () => {
    expect(percentFrom(3, 4)).toBe(75);
    const weak = weakestGroups(
      [
        { label: "Router", correct: 1, total: 4, percent: 25 },
        { label: "Signals", correct: 6, total: 7, percent: 86 },
        { label: "RxJS", correct: 2, total: 8, percent: 25 },
        { label: "Forms", correct: 0, total: 6, percent: 0 },
      ],
      3,
    );
    expect(weak.map((item) => item.label)).toEqual(["Forms", "RxJS", "Router"]);
  });

  it("persiste y recupera el progreso", () => {
    saveQuiz({
      questionOrder: ["ANG-001"],
      optionOrders: { "ANG-001": ["b", "a", "c", "d"] },
      currentIndex: 0,
      selectedByQuestion: { "ANG-001": ["a"] },
      checkedByQuestion: { "ANG-001": true },
      correctByQuestion: { "ANG-001": true },
      screen: "quiz",
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();
    const loaded = loadQuiz();
    expect(loaded?.questionOrder).toEqual(["ANG-001"]);
    expect(loaded?.correctByQuestion["ANG-001"]).toBe(true);
    clearQuiz();
    expect(loadQuiz()).toBeNull();
  });

  it("guarda comprobaciones y puntuación en el hook", () => {
    const { result } = renderHook(() => useQuiz(QUESTIONS));
    act(() => {
      result.current.start(8);
    });
    expect(result.current.state.questionOrder).toHaveLength(8);
    const firstId = result.current.state.questionOrder[0];
    expect(firstId).toBeDefined();
    const question = QUESTIONS.find((item) => item.id === firstId);
    expect(question).toBeDefined();
    act(() => {
      for (const optionId of question?.correctOptionIds ?? []) {
        result.current.toggleOption(optionId);
      }
      result.current.checkAnswer();
    });
    expect(result.current.state.checkedByQuestion[firstId ?? ""]).toBe(true);
    expect(result.current.state.correctByQuestion[firstId ?? ""]).toBe(true);
    const persisted = loadQuiz();
    expect(persisted?.checkedByQuestion[firstId ?? ""]).toBe(true);
    expect(persisted?.correctByQuestion[firstId ?? ""]).toBe(true);
  });

  it("limita la cantidad de preguntas al tamaño del banco", () => {
    expect(clampQuestionCount(10, 75)).toBe(10);
    expect(clampQuestionCount(0, 75)).toBe(1);
    expect(clampQuestionCount(200, 75)).toBe(75);
  });
});
