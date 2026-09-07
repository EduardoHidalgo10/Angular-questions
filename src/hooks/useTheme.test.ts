import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useTheme } from "./useTheme";
import { THEME_KEY } from "../utils/theme";

/**
 * Valida el cambio y la persistencia del tema.
 */
describe("tema", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.style.colorScheme = "";
  });

  it("activa modo oscuro y lo persiste", () => {
    localStorage.setItem(THEME_KEY, "light");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  });

  it("vuelve a modo claro al alternar otra vez", () => {
    localStorage.setItem(THEME_KEY, "dark");
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
