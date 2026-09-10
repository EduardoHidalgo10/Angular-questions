import { useMemo, useState, type ReactNode } from "react";
import { ResultsScreen } from "./components/ResultsScreen";
import { ThemeToggle } from "./components/ThemeToggle";
import { QuizScreen, StartScreen } from "./components/QuizViews";
import { QUESTIONS } from "./data/questions";
import { useQuiz } from "./hooks/useQuiz";
import { useTheme } from "./hooks/useTheme";
import { orderByIds } from "./utils/shuffle";

/**
 * Orquesta las pantallas de inicio, cuestionario y resultados.
 */
export default function App() {
  const quiz = useQuiz(QUESTIONS);
  const { theme, toggleTheme } = useTheme();
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

  /**
   * Envuelve cada pantalla con el control de tema.
   */
  function renderShell(content: ReactNode) {
    return (
      <main className="app-shell">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        {content}
      </main>
    );
  }

  if (showWelcome || quiz.state.screen === "start") {
    return renderShell(
      <StartScreen
        questions={QUESTIONS}
        canContinue={quiz.state.questionOrder.length > 0}
        onStart={(questionCount, category) => {
          quiz.start(questionCount, category);
          setShowWelcome(false);
        }}
        onContinue={() => {
          quiz.continueQuiz();
          setShowWelcome(false);
        }}
      />,
    );
  }

  if (quiz.state.screen === "results") {
    return renderShell(
      <ResultsScreen
        state={quiz.state}
        onRetryIncorrect={() => quiz.retryIncorrect()}
        onRestart={() => {
          quiz.reset();
          setShowWelcome(true);
        }}
      />,
    );
  }

  if (!current) {
    return renderShell(
      <section className="card">
        <p>No hay una pregunta activa. Vuelve a comenzar la evaluación.</p>
      </section>,
    );
  }

  const selectedIds = quiz.state.selectedByQuestion[current.id] ?? [];
  const checked = Boolean(quiz.state.checkedByQuestion[current.id]);

  return renderShell(
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
    />,
  );
}
