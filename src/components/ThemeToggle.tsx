interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

/**
 * Muestra el control para activar o desactivar el modo oscuro.
 */
export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";
  return (
    <div className="toolbar">
      <button
        type="button"
        className="btn secondary"
        onClick={onToggle}
        aria-pressed={isDark}
      >
        {isDark ? "Activar modo claro" : "Activar modo oscuro"}
      </button>
    </div>
  );
}
