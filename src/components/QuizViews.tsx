import { useMemo, useState } from "react";
import { CATEGORIES, type Category, type Question } from "../types/question";
import { clampQuestionCount } from "../utils/score";

/**
 * Representa si el examen cubre todo el banco o una sola categoría.
 */
type TopicMode = "all" | "specific";

interface StartScreenProps {
  questions: Question[];
  canContinue: boolean;
  onStart: (questionCount: number, category?: Category) => void;
  onContinue: () => void;
}

/**
 * Calcula cuántas preguntas hay en cada categoría del banco.
 */
function countByCategory(questions: readonly Question[]): Map<Category, number> {
  const counts = new Map<Category, number>();
  for (const question of questions) {
    counts.set(question.category, (counts.get(question.category) ?? 0) + 1);
  }
  return counts;
}

/**
 * Presenta la pantalla inicial, el tamaño del examen y las acciones para comenzar o continuar.
 */
export function StartScreen({
  questions,
  canContinue,
  onStart,
  onContinue,
}: StartScreenProps) {
  const bankSize = questions.length;
  const defaultCategory = CATEGORIES[0] ?? "TypeScript, clases y orientación a objetos";
  const [topicMode, setTopicMode] = useState<TopicMode>("all");
  const [selectedCategory, setSelectedCategory] = useState<Category>(defaultCategory);
  const [countInput, setCountInput] = useState(String(bankSize));
  const categoryCounts = useMemo(() => countByCategory(questions), [questions]);
  const poolSize =
    topicMode === "all" ? bankSize : (categoryCounts.get(selectedCategory) ?? 0);
  const parsedCount = Number(countInput);
  const isValidCount =
    Number.isInteger(parsedCount) && parsedCount >= 1 && parsedCount <= poolSize;
  const selectedCount = isValidCount ? parsedCount : poolSize;
  const estimatedMinutes = useMemo(
    () => Math.max(1, Math.round(selectedCount * 1.5)),
    [selectedCount],
  );

  /**
   * Actualiza el modo de tema y ajusta la cantidad de preguntas al nuevo pool.
   */
  function applyTopicMode(nextMode: TopicMode, nextCategory = selectedCategory) {
    setTopicMode(nextMode);
    setSelectedCategory(nextCategory);
    const nextPoolSize =
      nextMode === "all" ? bankSize : (categoryCounts.get(nextCategory) ?? 0);
    setCountInput(String(nextPoolSize));
  }

  return (
    <section className="card" aria-labelledby="app-title">
      <h1 id="app-title">Angular Senior Interview Trainer</h1>
      <p>
        Evaluación teórica de Angular orientada a entrevistas senior. El banco cubre
        arquitectura, reactividad, rendimiento, seguridad y testing con preguntas
        originales basadas en la documentación oficial vigente.
      </p>
      <p className="muted">El banco contiene {bankSize} preguntas.</p>
      <fieldset className="field">
        <legend>Tema a practicar</legend>
        <div className="choice-list">
          <label className="choice">
            <input
              type="radio"
              name="topic-mode"
              value="all"
              checked={topicMode === "all"}
              onChange={() => applyTopicMode("all")}
            />
            <span>Todos los temas ({bankSize} preguntas)</span>
          </label>
          <label className="choice">
            <input
              type="radio"
              name="topic-mode"
              value="specific"
              checked={topicMode === "specific"}
              onChange={() => applyTopicMode("specific")}
            />
            <span>Seleccionar tema específico</span>
          </label>
        </div>
        {topicMode === "specific" ? (
          <div className="field nested-field">
            <label htmlFor="topic-category">Tema específico</label>
            <select
              id="topic-category"
              value={selectedCategory}
              onChange={(event) => {
                const nextCategory = CATEGORIES.find((category) => category === event.target.value);
                if (nextCategory) {
                  applyTopicMode("specific", nextCategory);
                }
              }}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category} ({categoryCounts.get(category) ?? 0})
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </fieldset>
      <div className="field">
        <label htmlFor="question-count">Cantidad de preguntas para este examen</label>
        <input
          id="question-count"
          type="number"
          min={1}
          max={poolSize}
          step={1}
          value={countInput}
          onChange={(event) => setCountInput(event.target.value)}
        />
        <p className="muted">
          {isValidCount
            ? `Esta evaluación usará ${selectedCount} preguntas. Tiempo estimado: ${estimatedMinutes} minutos.`
            : `Elige un número entero entre 1 y ${poolSize}.`}
        </p>
      </div>
      <p className="muted">
        El resultado mide preparación teórica sobre las preguntas seleccionadas y no
        determina por sí solo el seniority profesional.
      </p>
      <div className="actions">
        <button
          type="button"
          className="btn"
          disabled={!isValidCount}
          onClick={() =>
            onStart(
              clampQuestionCount(parsedCount, poolSize),
              topicMode === "specific" ? selectedCategory : undefined,
            )
          }
        >
          Comenzar evaluación
        </button>
        {canContinue ? (
          <button type="button" className="btn secondary" onClick={onContinue}>
            Continuar evaluación
          </button>
        ) : null}
      </div>
    </section>
  );
}

interface CodeBlockProps {
  code: string;
}

/**
 * Muestra un fragmento de código en un bloque oscuro monoespaciado.
 */
export function CodeBlock({ code }: CodeBlockProps) {
  return (
    <pre className="code-block">
      <code>{code}</code>
    </pre>
  );
}

interface QuizScreenProps {
  question: Question;
  index: number;
  total: number;
  orderedOptionIds: string[];
  selectedIds: string[];
  checked: boolean;
  isCorrect: boolean | undefined;
  onToggle: (optionId: string) => void;
  onCheck: () => void;
  onNext: () => void;
}

/**
 * Renderiza una pregunta, sus opciones y el feedback posterior a comprobar.
 */
export function QuizScreen({
  question,
  index,
  total,
  orderedOptionIds,
  selectedIds,
  checked,
  isCorrect,
  onToggle,
  onCheck,
  onNext,
}: QuizScreenProps) {
  const orderedOptions = orderedOptionIds.flatMap((id) => {
    const option = question.options.find((item) => item.id === id);
    return option ? [option] : [];
  });
  const progress = Math.round(((index + 1) / total) * 100);
  const inputType = question.type === "single" ? "radio" : "checkbox";
  const correctSet = new Set(question.correctOptionIds);
  const selectedSet = new Set(selectedIds);

  return (
    <section className="card" aria-labelledby="question-prompt">
      <div className="meta-row">
        <span className="badge accent">
          Pregunta {index + 1} de {total}
        </span>
        <span className="badge">{question.category}</span>
        <span className="badge">
          {question.difficulty === "fundamental"
            ? "Fundamental"
            : question.difficulty === "intermediate"
              ? "Intermedia"
              : "Senior"}
        </span>
      </div>
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <h2 id="question-prompt" className="prompt">
        {question.prompt}
      </h2>
      {question.codeSnippet ? <CodeBlock code={question.codeSnippet} /> : null}
      {question.type === "multiple" ? (
        <p className="muted">Selecciona todas las respuestas correctas.</p>
      ) : null}
      <div className="options" role={question.type === "single" ? "radiogroup" : "group"}>
        {orderedOptions.map((option) => {
          const selected = selectedSet.has(option.id);
          const correct = correctSet.has(option.id);
          let extraClass = "";
          if (checked && correct) extraClass = "correct";
          if (checked && selected && !correct) extraClass = "incorrect";
          return (
            <label key={option.id} className={`option ${checked ? "disabled" : ""} ${extraClass}`.trim()}>
              <input
                type={inputType}
                name={question.id}
                value={option.id}
                checked={selected}
                disabled={checked}
                onChange={() => onToggle(option.id)}
              />
              <span>
                {option.text}
                {checked && correct ? <strong> · Respuesta correcta</strong> : null}
                {checked && selected && !correct ? <strong> · Selección incorrecta</strong> : null}
              </span>
            </label>
          );
        })}
      </div>
      {checked ? (
        <div className={`feedback ${isCorrect ? "ok" : "bad"}`} role="status">
          <p>
            <strong>{isCorrect ? "Correcto." : "Incorrecto."}</strong>{" "}
            {isCorrect
              ? "Tu selección coincide con el conjunto exacto de respuestas válidas."
              : "La respuesta comprobada no coincide exactamente con las opciones correctas."}
          </p>
          <p>{question.explanation}</p>
          {question.interviewInsight ? <p>{question.interviewInsight}</p> : null}
          <p>
            Documentación:{" "}
            {question.sourceUrls.map((url) => (
              <span key={url}>
                <a href={url} target="_blank" rel="noreferrer">
                  {url}
                </a>{" "}
              </span>
            ))}
          </p>
        </div>
      ) : null}
      <div className="actions">
        <button type="button" className="btn" onClick={onCheck} disabled={checked || selectedIds.length === 0}>
          Comprobar respuesta
        </button>
        <button type="button" className="btn secondary" onClick={onNext} disabled={!checked}>
          Siguiente
        </button>
      </div>
    </section>
  );
}
