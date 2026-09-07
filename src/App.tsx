import { useMemo, useState } from "react";
import { ResultsScreen } from "./components/ResultsScreen";
import { QuizScreen, StartScreen } from "./components/QuizViews";
import { QUESTIONS } from "./data/questions";
import { useQuiz } from "./hooks/useQuiz";
import { orderByIds } from "./utils/shuffle";

/**
 * Orquesta las pantallas de inicio, cuestionario y resultados.
 */
export default function App() {
  const quiz = useQuiz(QUESTIONS);
  const [showWelcome, setShowWelcome] = useState(true);
  const current = quiz.currentQuestion;
  const orderedOptionIds = useMemo(() => {
    if (!current) {
      return [];
    }
    const stored = quiz.state.optionOrders[current.id];
    if (stored) {
      return stored;
    }
    return current.options.map((option) => option.id);
  }, [current, quiz.state.optionOrders]);

  if (showWelcome || quiz.state.screen === "start") {
    return (
      <main className="app-shell">
        <StartScreen
          bankSize={QUESTIONS.length}
          canContinue={quiz.state.questionOrder.length > 0}
          onStart={(questionCount) => {
            quiz.start(questionCount);
            setShowWelcome(false);
          }}
          onContinue={() => {
            quiz.continueQuiz();
            setShowWelcome(false);
          }}
        />
      </main>
    );
  }

  if (quiz.state.screen === "results") {
    return (
      <main className="app-shell">
        <ResultsScreen
          state={quiz.state}
          onRetryIncorrect={() => quiz.retryIncorrect()}
          onRestart={() => {
            quiz.reset();
            setShowWelcome(true);
          }}
        />
      </main>
    );
  }

  if (!current) {
    return (
      <main className="app-shell">
        <section className="card">
          <p>No hay una pregunta activa. Vuelve a comenzar la evaluación.</p>
        </section>
      </main>
    );
  }

  const selectedIds = quiz.state.selectedByQuestion[current.id] ?? [];
  const checked = Boolean(quiz.state.checkedByQuestion[current.id]);

  return (
    <main className="app-shell">
      <QuizScreen
        question={{
          ...current,
          options: orderByIds(current.options, orderedOptionIds),
        }}
        index={quiz.state.currentIndex}
        total={quiz.state.questionOrder.length}
        orderedOptionIds={orderedOptionIds}
        selectedIds={selectedIds}
        checked={checked}
        isCorrect={quiz.state.correctByQuestion[current.id]}
        onToggle={quiz.toggleOption}
        onCheck={quiz.checkAnswer}
        onNext={quiz.goNext}
      />
    </main>
  );
}
