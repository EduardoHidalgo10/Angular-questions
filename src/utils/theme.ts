export const THEME_KEY = "angular-senior-interview-trainer-theme";

export type Theme = "light" | "dark";

/**
 * Detecta si el sistema prefiere esquema oscuro.
 */
function prefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

/**
 * Lee el tema guardado o el preferido por el sistema.
 */
export function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") {
      return stored;
    }
  } catch {
    return "light";
  }
  return prefersDark() ? "dark" : "light";
}

/**
 * Guarda el tema elegido.
 */
export function saveTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Aplica el tema en el documento.
 */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}
