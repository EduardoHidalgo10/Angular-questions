import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "./App";

/**
 * Ejercita el flujo visible de inicio, respuesta y persistencia.
 */
describe("flujo de la aplicación", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("muestra la pantalla inicial y permite comprobar una pregunta", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole("heading", { name: "Angular Senior Interview Trainer" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Activar modo (oscuro|claro)/ })).toBeInTheDocument();
    expect(screen.getByText(/El banco contiene 75 preguntas/)).toBeInTheDocument();
    await user.clear(screen.getByLabelText("Cantidad de preguntas para este examen"));
    await user.type(screen.getByLabelText("Cantidad de preguntas para este examen"), "10");
    await user.click(screen.getByRole("button", { name: "Comenzar evaluación" }));
    expect(screen.getByText(/Pregunta 1 de 10/)).toBeInTheDocument();
    const options = screen.queryAllByRole("radio").concat(screen.queryAllByRole("checkbox"));
    expect(options.length).toBeGreaterThan(0);
    await user.click(options[0]!);
    await user.click(screen.getByRole("button", { name: "Comprobar respuesta" }));
    expect(screen.getByRole("status")).toHaveTextContent(/Correcto|Incorrecto/);
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeEnabled();
    expect(localStorage.getItem("angular-senior-interview-trainer")).toBeTruthy();
  });

  it("permite iniciar una evaluación filtrada por tema específico", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("radio", { name: "Seleccionar tema específico" }));
    await user.selectOptions(screen.getByLabelText("Tema específico"), "Router");
    expect(screen.getByLabelText("Cantidad de preguntas para este examen")).toHaveValue(4);
    await user.click(screen.getByRole("button", { name: "Comenzar evaluación" }));
    expect(screen.getByText(/Pregunta 1 de 4/)).toBeInTheDocument();
    expect(screen.getByText("Router")).toBeInTheDocument();
  });
});
