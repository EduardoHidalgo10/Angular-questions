# Angular Senior Interview Trainer

Aplicación web para practicar entrevistas técnicas de Angular a nivel senior. La interfaz está hecha con **React**; Angular es únicamente el tema evaluado.

El banco incluye **75 preguntas originales en español**, basadas en la documentación oficial de [angular.dev](https://angular.dev) y contrastadas con una guía de entrevista. El resultado mide preparación teórica y no determina por sí solo el seniority profesional.

## Requisitos

- Node.js 20 o superior
- [pnpm](https://pnpm.io/) 11

## Scripts

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
pnpm preview
```

| Script | Qué hace |
| --- | --- |
| `pnpm dev` | Arranca Vite en modo desarrollo |
| `pnpm test` | Ejecuta las pruebas de Vitest una vez |
| `pnpm test:watch` | Ejecuta Vitest en modo watch |
| `pnpm build` | Compila TypeScript y genera el bundle de producción |
| `pnpm preview` | Sirve el build de producción |

Por defecto, el servidor de desarrollo queda en `http://localhost:5173`.

## Cómo funciona

1. En la pantalla inicial eliges **cuántas preguntas** entra el examen (de 1 a 75).
2. El cuestionario mezcla el orden de las preguntas y de las opciones.
3. Cada pregunta se responde y se comprueba antes de pasar a la siguiente.
4. Las preguntas de selección múltiple solo cuentan como correctas si el conjunto elegido es exacto.
5. Al terminar ves el porcentaje, el desglose por categoría y dificultad, las áreas más débiles y la revisión de respuestas.
6. Puedes filtrar las incorrectas, reintentarlas o empezar de nuevo.

El progreso (pregunta actual, respuestas, puntuación y preguntas ya comprobadas) se guarda en `localStorage` bajo la clave `angular-senior-interview-trainer`. Si recargas la página, aparece **Continuar evaluación**.

## Banco de preguntas

Las preguntas viven en `src/data/questions/`, separadas por categoría, con IDs `ANG-001` … `ANG-075`.

| Tipo | Cantidad |
| --- | ---: |
| Una sola respuesta | 55 |
| Varias respuestas correctas | 20 |
| Fundamentales | 10 |
| Intermedias | 25 |
| Senior | 40 |
| **Total** | **75** |

Categorías cubiertas: TypeScript, arquitectura Angular, componentes, templates, queries y lifecycle, DI, RxJS, Signals, change detection y zoneless, formularios, router, HttpClient, NgRx, seguridad, testing, y microfrontends / Web Workers / CI/CD.

Cada pregunta incluye explicación, por qué fallan los distractores, consejo de entrevista cuando aplica, y al menos un enlace a documentación oficial.

## Stack

- React 19 y TypeScript estricto
- Vite
- Componentes funcionales y hooks (`useQuiz` + `useReducer`)
- CSS propio (sin Tailwind ni librerías de UI)
- Vitest, Testing Library y jsdom
- pnpm

No hay backend, autenticación, base de datos ni gestores de estado externos.

## Estructura

```text
src/
  components/     Pantallas de inicio, cuestionario y resultados
  data/questions/ Banco de 75 preguntas por categoría
  hooks/          Lógica del examen y persistencia
  types/          Modelo de pregunta y progreso
  utils/          Mezcla, puntuación y localStorage
```

## Pruebas

Las pruebas comprueban, entre otras cosas:

- que existen exactamente 75 preguntas con IDs únicos
- la distribución de tipos, dificultades y categorías
- que cada pregunta tiene 4 opciones y respuestas válidas
- que mezclar opciones no altera las respuestas correctas
- el cálculo de puntuación y la persistencia
- que un examen de N preguntas usa N en el flujo y en el resultado
