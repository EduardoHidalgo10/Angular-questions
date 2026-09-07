/**
 * Determina si la selección coincide exactamente con las respuestas correctas.
 */
export function isExactMatch(
  selectedIds: readonly string[],
  correctIds: readonly string[],
): boolean {
  if (selectedIds.length !== correctIds.length) {
    return false;
  }
  const selected = new Set(selectedIds);
  return correctIds.every((id) => selected.has(id));
}

/**
 * Limita la cantidad de preguntas del examen al rango válido del banco.
 */
export function clampQuestionCount(count: number, max: number): number {
  if (!Number.isFinite(count) || max < 1) {
    return 1;
  }
  return Math.min(max, Math.max(1, Math.trunc(count)));
}

/**
 * Calcula un porcentaje entero a partir de aciertos y total.
 */
export function percentFrom(correct: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.round((correct / total) * 100);
}

export interface GroupScore {
  label: string;
  correct: number;
  total: number;
  percent: number;
}

/**
 * Agrupa aciertos por una clave y calcula el porcentaje de cada grupo.
 */
export function scoreByGroup(
  entries: ReadonlyArray<{ key: string; isCorrect: boolean }>,
): GroupScore[] {
  const totals = new Map<string, { correct: number; total: number }>();
  for (const entry of entries) {
    const current = totals.get(entry.key) ?? { correct: 0, total: 0 };
    current.total += 1;
    if (entry.isCorrect) {
      current.correct += 1;
    }
    totals.set(entry.key, current);
  }
  return [...totals.entries()]
    .map(([label, value]) => ({
      label,
      correct: value.correct,
      total: value.total,
      percent: percentFrom(value.correct, value.total),
    }))
    .sort((left, right) => left.label.localeCompare(right.label, "es"));
}

/**
 * Identifica las tres áreas con menor porcentaje de acierto.
 */
export function weakestGroups(groups: readonly GroupScore[], limit = 3): GroupScore[] {
  return [...groups]
    .filter((group) => group.total > 0)
    .sort((left, right) => {
      if (left.percent !== right.percent) {
        return left.percent - right.percent;
      }
      return right.total - left.total;
    })
    .slice(0, limit);
}
