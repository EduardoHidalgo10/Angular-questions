/**
 * Mezcla una copia del arreglo con el algoritmo Fisher-Yates.
 */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = copy[index];
    const swapped = copy[swapIndex];
    if (current === undefined || swapped === undefined) {
      continue;
    }
    copy[index] = swapped;
    copy[swapIndex] = current;
  }
  return copy;
}

/**
 * Ordena opciones según una lista de IDs sin alterar las respuestas correctas.
 */
export function orderByIds<T extends { id: string }>(
  items: readonly T[],
  orderedIds: readonly string[],
): T[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  return orderedIds.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}
