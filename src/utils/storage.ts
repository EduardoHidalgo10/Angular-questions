import type { PersistedQuiz } from "../types/question";

export const STORAGE_KEY = "angular-senior-interview-trainer";

/**
 * Lee el progreso guardado. Devuelve null si no existe o está corrupto.
 */
export function loadQuiz(): PersistedQuiz | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as PersistedQuiz;
    if (!Array.isArray(parsed.questionOrder) || parsed.questionOrder.length === 0) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Guarda el progreso actual en localStorage.
 */
export function saveQuiz(state: PersistedQuiz): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Elimina el progreso persistido.
 */
export function clearQuiz(): void {
  localStorage.removeItem(STORAGE_KEY);
}
