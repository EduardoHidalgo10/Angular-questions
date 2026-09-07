import type { Question } from "../../types/question";

export const ngrxQuestions: Question[] = [
  {
    id: "ANG-067",
    category: "Gestión de estado y NgRx",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "¿Cuál es el flujo unidireccional correcto en NgRx?",
    codeSnippet: `this.store.dispatch(cargarUsuarios());
usuarios$ = this.store.select(selectUsuarios);`,
    options: [
      {
        id: "a",
        text: "El componente despacha una action; el reducer produce un nuevo estado puro; los effects ejecutan side-effects y despachan otras actions; los selectors leen slices memoizados.",
      },
      {
        id: "b",
        text: "El reducer hace HTTP y el effect actualiza el store mutando el state.",
      },
      {
        id: "c",
        text: "Los selectors despachan actions; los components no deben usar dispatch.",
      },
      {
        id: "d",
        text: "createEffect sustituye a createReducer en aplicaciones zoneless.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Reducers puros e inmutables. Effects para HTTP, navegación, toasts. Selectors para derivar vistas. Invertir esas responsabilidades es el anti-patrón más preguntado.",
    sourceUrls: ["https://ngrx.io/guide/store"],
  },
  {
    id: "ANG-068",
    category: "Gestión de estado y NgRx",
    difficulty: "senior",
    type: "single",
    prompt:
      "¿Cuándo justificarías NgRx frente a servicios con signals?",
    options: [
      {
        id: "a",
        text: "Cuando hay estado cruzado entre muchos features, time-travel/devtools, effects complejos y varios equipos necesitan un contrato de actions explícito.",
      },
      {
        id: "b",
        text: "Siempre: un CRUD de un formulario local ya requiere store, actions y effects.",
      },
      {
        id: "c",
        text: "Nunca: Signals deprecó NgRx y no puede interoperar.",
      },
      {
        id: "d",
        text: "Solo cuando no puedes usar HttpClient.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "NgRx tiene coste cognitivo. Para estado local o un servicio de feature, signals (o un store ligero) bastan. @ngrx/signals existe precisamente para acortar esa brecha. No hay deprecación ni incompatibilidad con HttpClient.",
    interviewInsight:
      "Una respuesta senior nombra el coste: boilerplate, onboarding, y cuándo el event log de actions sí aporta trazabilidad.",
    sourceUrls: ["https://ngrx.io/guide/store/why"],
  },
];
