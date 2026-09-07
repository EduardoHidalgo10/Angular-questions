import { useMemo, useState } from "react";
import type { Question } from "../types/question";
import { questionsById } from "../data/questions";
import { percentFrom, scoreByGroup, weakestGroups } from "../utils/score";
import { orderByIds } from "../utils/shuffle";
import { CodeBlock } from "./QuizViews";
import type { QuizState } from "../hooks/useQuiz";

interface ResultsScreenProps {
  state: QuizState;
  onRetryIncorrect: () => void;
  onRestart: () => void;
}

const difficultyLabel: Record<Question["difficulty"], string> = {
  fundamental: "Fundamental",
  intermediate: "Intermedia",
  senior: "Senior",
};

/**
 * Presenta puntuación, desgloses, áreas débiles y la revisión de respuestas.
 */
export function ResultsScreen({ state, onRetryIncorrect, onRestart }: ResultsScreenProps) {
  const [onlyIncorrect, setOnlyIncorrect] = useState(false);
  const answered = state.questionOrder;
  const correctCount = answered.filter((id) => state.correctByQuestion[id]).length;
  const incorrectCount = answered.length - correctCount;
  const percent = percentFrom(correctCount, answered.length);

  const reviewQuestions = useMemo(
    () =>
      answered.flatMap((id) => {
        const question = questionsById.get(id);
        return question ? [question] : [];
      }),
    [answered],
  );

  const categoryScores = scoreByGroup(
    reviewQuestions.map((question) => ({
      key: question.category,
      isCorrect: Boolean(state.correctByQuestion[question.id]),
    })),
  );
  const difficultyScores = scoreByGroup(
    reviewQuestions.map((question) => ({
      key: difficultyLabel[question.difficulty],
      isCorrect: Boolean(state.correctByQuestion[question.id]),
    })),
  );
  const weak = weakestGroups(categoryScores, 3);
  const visible = onlyIncorrect
    ? reviewQuestions.filter((question) => state.correctByQuestion[question.id] === false)
    : reviewQuestions;

  return (
    <section className="card" aria-labelledby="results-title">
      <h1 id="results-title">Resultados</h1>
      <p>
        Obtuviste <strong>{percent}%</strong>: {correctCount} correctas y {incorrectCount}{" "}
        incorrectas de {answered.length} preguntas.
      </p>
      <p className="muted">
        Este resultado se calcula sobre las {answered.length} preguntas de esta evaluación y no
        determina por sí solo el seniority profesional.
      </p>
      <div className="stats">
        <div className="stat">
          <h2>Porcentaje</h2>
          <p>{percent}%</p>
        </div>
        <div className="stat">
          <h2>Correctas</h2>
          <p>{correctCount}</p>
        </div>
        <div className="stat">
          <h2>Incorrectas</h2>
          <p>{incorrectCount}</p>
        </div>
      </div>
      <h2>Resultado por categoría</h2>
      <div className="score-grid">
        {categoryScores.map((group) => (
          <div className="stat" key={group.label}>
            <h3>{group.label}</h3>
            <p>
              {group.percent}% · {group.correct}/{group.total}
            </p>
          </div>
        ))}
      </div>
      <h2>Resultado por dificultad</h2>
      <div className="score-grid">
        {difficultyScores.map((group) => (
          <div className="stat" key={group.label}>
            <h3>{group.label}</h3>
            <p>
              {group.percent}% · {group.correct}/{group.total}
            </p>
          </div>
        ))}
      </div>
      <h2>Tres áreas que necesitan mayor estudio</h2>
      <ul>
        {weak.map((group) => (
          <li key={group.label}>
            {group.label}: {group.percent}% ({group.correct}/{group.total})
          </li>
        ))}
      </ul>
      <div className="actions">
        <button type="button" className="btn" onClick={onRetryIncorrect} disabled={incorrectCount === 0}>
          Reintentar preguntas incorrectas
        </button>
        <button type="button" className="btn secondary" onClick={onRestart}>
          Comenzar de nuevo
        </button>
      </div>
      <div className="review">
        <div className="review-head">
          <h2>Revisión de respuestas</h2>
          <label>
            <input
              type="checkbox"
              checked={onlyIncorrect}
              onChange={(event) => setOnlyIncorrect(event.target.checked)}
            />{" "}
            Mostrar solamente las incorrectas
          </label>
        </div>
        {visible.map((question, index) => {
          const selected = state.selectedByQuestion[question.id] ?? [];
          const ok = Boolean(state.correctByQuestion[question.id]);
          const options = orderByIds(question.options, state.optionOrders[question.id] ?? []);
          return (
            <article className="review-item" key={question.id}>
              <div className="meta-row">
                <span className="badge">{index + 1}</span>
                <span className="badge">{question.category}</span>
                <span className={`badge ${ok ? "" : "accent"}`}>
                  {ok ? "Correcta" : "Incorrecta"}
                </span>
              </div>
              <p>
                <strong>{question.prompt}</strong>
              </p>
              {question.codeSnippet ? <CodeBlock code={question.codeSnippet} /> : null}
              <ul>
                {options.map((option) => (
                  <li key={option.id}>
                    {option.text}
                    {question.correctOptionIds.includes(option.id) ? " · correcta" : ""}
                    {selected.includes(option.id) ? " · tu selección" : ""}
                  </li>
                ))}
              </ul>
              <p>{question.explanation}</p>
              <p>
                {question.sourceUrls.map((url) => (
                  <a key={url} href={url} target="_blank" rel="noreferrer">
                    {url}
                  </a>
                ))}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
