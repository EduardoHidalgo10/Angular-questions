interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

/**
 * Dibuja el icono del sol para el modo claro.
 */
function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

/**
 * Dibuja el icono de la luna para el modo oscuro.
 */
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z" />
    </svg>
  );
}

/**
 * Muestra el control para activar o desactivar el modo oscuro.
 */
export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";
  const label = isDark ? "Activar modo claro" : "Activar modo oscuro";

  return (
    <div className="toolbar">
      <button
        type="button"
        className={`theme-toggle${isDark ? " is-dark" : ""}`}
        onClick={onToggle}
        aria-pressed={isDark}
        aria-label={label}
        title={label}
      >
        <span className="theme-toggle-track">
          <span className="theme-toggle-icon sun">
            <SunIcon />
          </span>
          <span className="theme-toggle-icon moon">
            <MoonIcon />
          </span>
          <span className="theme-toggle-thumb" />
        </span>
      </button>
    </div>
  );
}
