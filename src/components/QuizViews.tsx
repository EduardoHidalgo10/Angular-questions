import { useMemo, useState } from "react";
import type { Question } from "../types/question";
import { clampQuestionCount } from "../utils/score";

interface StartScreenProps {
  bankSize: number;
  canContinue: boolean;
  onStart: (questionCount: number) => void;
  onContinue: () => void;
}

/**
 * Presenta la pantalla inicial, el tamaño del examen y las acciones para comenzar o continuar.
 */
export function StartScreen({
  bankSize,
  canContinue,
  onStart,
  onContinue,
}: StartScreenProps) {
  const [countInput, setCountInput] = useState(String(bankSize));
  const parsedCount = Number(countInput);
  const isValidCount =
    Number.isInteger(parsedCount) && parsedCount >= 1 && parsedCount <= bankSize;
  const selectedCount = isValidCount ? parsedCount : bankSize;
  const estimatedMinutes = useMemo(
    () => Math.max(1, Math.round(selectedCount * 1.5)),
    [selectedCount],
  );

  return (
    <section className="card" aria-labelledby="app-title">
      <h1 id="app-title">Angular Senior Interview Trainer</h1>
      <p>
        Evaluación teórica de Angular orientada a entrevistas senior. El banco cubre
        arquitectura, reactividad, rendimiento, seguridad y testing con preguntas
        originales basadas en la documentación oficial vigente.
      </p>
      <p className="muted">El banco contiene {bankSize} preguntas.</p>
      <div className="field">
        <label htmlFor="question-count">Cantidad de preguntas para este examen</label>
        <input
          id="question-count"
          type="number"
          min={1}
          max={bankSize}
          step={1}
          value={countInput}
          onChange={(event) => setCountInput(event.target.value)}
        />
        <p className="muted">
          {isValidCount
            ? `Esta evaluación usará ${selectedCount} preguntas. Tiempo estimado: ${estimatedMinutes} minutos.`
            : `Elige un número entero entre 1 y ${bankSize}.`}
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
          onClick={() => onStart(clampQuestionCount(parsedCount, bankSize))}
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
