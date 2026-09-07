import { useEffect, useState } from "react";
import { applyTheme, loadTheme, saveTheme, type Theme } from "../utils/theme";

/**
 * Administra el tema claro u oscuro y lo persiste.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => loadTheme());

  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  /**
   * Alterna entre modo claro y modo oscuro.
   */
  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return { theme, toggleTheme };
}
