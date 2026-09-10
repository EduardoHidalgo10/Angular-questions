import { useCallback, useReducer } from "react";
import { questionsById } from "../data/questions";
import type { Category, PersistedQuiz, Question } from "../types/question";
import { clampQuestionCount, isExactMatch } from "../utils/score";
import { shuffle } from "../utils/shuffle";
import { clearQuiz, loadQuiz, saveQuiz } from "../utils/storage";

/**
 * Describe el estado interno del cuestionario.
 */
export interface QuizState extends PersistedQuiz {
  questions: Question[];
}

type QuizAction =
  | { type: "hydrate"; payload: QuizState }
  | { type: "toggle"; optionId: string }
  | { type: "check" }
  | { type: "next" }
  | { type: "reset" };

/**
 * Serializa únicamente los campos persistibles.
 */
function toPersisted(state: QuizState): PersistedQuiz {
  return {
    questionOrder: state.questionOrder,
    optionOrders: state.optionOrders,
    currentIndex: state.currentIndex,
    selectedByQuestion: state.selectedByQuestion,
    checkedByQuestion: state.checkedByQuestion,
    correctByQuestion: state.correctByQuestion,
    screen: state.screen,
  };
}

/**
 * Construye el estado a partir de un banco de preguntas y un progreso opcional.
 */
function createState(
  bank: Question[],
  persisted: PersistedQuiz | null,
): QuizState {
  if (!persisted) {
    return {
      questions: bank,
      questionOrder: [],
      optionOrders: {},
      currentIndex: 0,
      selectedByQuestion: {},
      checkedByQuestion: {},
      correctByQuestion: {},
      screen: "start",
    };
  }
  return {
    ...persisted,
    questions: bank,
  };
}

/**
 * Crea un intento nuevo mezclando preguntas y opciones.
 */
function startAttempt(bank: Question[], subsetIds?: string[], questionCount?: number): QuizState {
  const pool = subsetIds
    ? subsetIds.flatMap((id) => {
        const question = questionsById.get(id);
        return question ? [question] : [];
      })
    : bank;
  const limitedCount = clampQuestionCount(questionCount ?? pool.length, pool.length);
  const ordered = shuffle(pool).slice(0, limitedCount);
  const optionOrders: Record<string, string[]> = {};
  for (const question of ordered) {
    optionOrders[question.id] = shuffle(question.options.map((option) => option.id));
  }
  return {
    questions: bank,
    questionOrder: ordered.map((question) => question.id),
    optionOrders,
    currentIndex: 0,
    selectedByQuestion: {},
    checkedByQuestion: {},
    correctByQuestion: {},
    screen: "quiz",
  };
}

/**
 * Reduce las acciones del cuestionario y persiste los cambios relevantes.
 */
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "reset":
      clearQuiz();
      return createState(state.questions, null);
    case "toggle": {
      const questionId = state.questionOrder[state.currentIndex];
      if (!questionId || state.checkedByQuestion[questionId]) {
        return state;
      }
      const question = questionsById.get(questionId);
      if (!question) {
        return state;
      }
      const current = state.selectedByQuestion[questionId] ?? [];
      const selected =
        question.type === "single"
          ? [action.optionId]
          : current.includes(action.optionId)
            ? current.filter((id) => id !== action.optionId)
            : [...current, action.optionId];
      const next = {
        ...state,
        selectedByQuestion: {
          ...state.selectedByQuestion,
          [questionId]: selected,
        },
      };
      saveQuiz(toPersisted(next));
      return next;
    }
    case "check": {
      const questionId = state.questionOrder[state.currentIndex];
      if (!questionId || state.checkedByQuestion[questionId]) {
        return state;
      }
      const question = questionsById.get(questionId);
      if (!question) {
        return state;
      }
      const selected = state.selectedByQuestion[questionId] ?? [];
      if (selected.length === 0) {
        return state;
      }
      const next = {
        ...state,
        checkedByQuestion: { ...state.checkedByQuestion, [questionId]: true },
        correctByQuestion: {
          ...state.correctByQuestion,
          [questionId]: isExactMatch(selected, question.correctOptionIds),
        },
      };
      saveQuiz(toPersisted(next));
      return next;
    }
    case "next": {
      const questionId = state.questionOrder[state.currentIndex];
      if (!questionId || !state.checkedByQuestion[questionId]) {
        return state;
      }
      const isLast = state.currentIndex >= state.questionOrder.length - 1;
      const next: QuizState = isLast
        ? { ...state, screen: "results" }
        : { ...state, currentIndex: state.currentIndex + 1 };
      saveQuiz(toPersisted(next));
      return next;
    }
    default:
      return state;
  }
}

/**
 * Administra el flujo del cuestionario, la puntuación y la persistencia.
 */
export function useQuiz(bank: Question[]) {
  const [state, dispatch] = useReducer(
    quizReducer,
    bank,
    (questions) => createState(questions, loadQuiz()),
  );

  const start = useCallback(
    (questionCount = bank.length, category?: Category) => {
      const subsetIds = category
        ? bank.filter((question) => question.category === category).map((question) => question.id)
        : undefined;
      const next = startAttempt(bank, subsetIds, questionCount);
      saveQuiz(toPersisted(next));
      dispatch({ type: "hydrate", payload: next });
    },
    [bank],
  );

  const continueQuiz = useCallback(() => {
    if (state.questionOrder.length === 0) {
      return;
    }
    const next: QuizState = {
      ...state,
      screen: state.screen === "start" ? "quiz" : state.screen,
    };
    saveQuiz(toPersisted(next));
    dispatch({ type: "hydrate", payload: next });
  }, [state]);

  const retryIncorrect = useCallback(() => {
    const incorrectIds = state.questionOrder.filter(
      (id) => state.correctByQuestion[id] === false,
    );
    if (incorrectIds.length === 0) {
      return;
    }
    const next = startAttempt(bank, incorrectIds);
    saveQuiz(toPersisted(next));
    dispatch({ type: "hydrate", payload: next });
  }, [bank, state.correctByQuestion, state.questionOrder]);

  const reset = useCallback(() => {
    clearQuiz();
    dispatch({ type: "reset" });
  }, []);

  const currentId = state.questionOrder[state.currentIndex];
  const currentQuestion = currentId ? questionsById.get(currentId) : undefined;

  return {
    state,
    currentQuestion,
    hasSavedProgress: state.questionOrder.length > 0 && state.screen !== "start",
    canContinue:
      state.questionOrder.length > 0 &&
      (state.screen === "quiz" || state.screen === "results" || Object.keys(state.checkedByQuestion).length > 0),
    start,
    continueQuiz,
    retryIncorrect,
    reset,
    toggleOption: (optionId: string) => dispatch({ type: "toggle", optionId }),
    checkAnswer: () => dispatch({ type: "check" }),
    goNext: () => dispatch({ type: "next" }),
  };
}
