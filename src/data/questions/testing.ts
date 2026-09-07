import type { Question } from "../../types/question";

export const testingQuestions: Question[] = [
  {
    id: "ANG-072",
    category: "Testing",
    difficulty: "fundamental",
    type: "single",
    prompt:
      "En un test de UsuarioService, ¿cómo verificas un GET sin pegarle a la red?",
    codeSnippet: `const req = httpMock.expectOne("/api/usuarios");
req.flush([{ id: 1 }]);`,
    options: [
      {
        id: "a",
        text: "HttpTestingController intercepta HttpClient: expectOne afirma la URL y flush emite la respuesta ficticia.",
      },
      {
        id: "b",
        text: "flush dispara un XHR real; expectOne solo sirve en e2e.",
      },
      {
        id: "c",
        text: "Hay que usar window.fetch mockeado porque HttpClient no es testeable.",
      },
      {
        id: "d",
        text: "TestBed prohíbe HttpClient en unit tests; solo Cypress puede cubrir servicios.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "provideHttpClientTesting + HttpTestingController es el patrón oficial. El servicio se prueba de forma síncrona y determinista. Cypress/Playwright cubren e2e, no sustituyen este nivel.",
    sourceUrls: ["https://angular.dev/guide/http/testing"],
  },
  {
    id: "ANG-073",
    category: "Testing",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "Un proyecto legacy usa Jasmine/Karma y el nuevo usa Vitest. ¿Qué visión es realista?",
    options: [
      {
        id: "a",
        text: "Jasmine aporta la API describe/it; Karma corre tests en un navegador. Jest/Vitest son runners más rápidos en Node; Angular CLI soporta la migración. El conocimiento de TestBed se transfiere.",
      },
      {
        id: "b",
        text: "Vitest no puede testear componentes Angular porque usa JSX.",
      },
      {
        id: "c",
        text: "Karma es obligatorio en Angular 21+ y Vitest solo vale para React.",
      },
      {
        id: "d",
        text: "Al migrar a Vitest hay que reescribir TestBed a Enzyme.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "El equipo de Angular ha movido el default de testing hacia runners modernos (Vitest). Jasmine+Karma sigue en muchos repos. TestBed, fixtures y HttpTestingController siguen siendo el modelo mental, independientemente del runner.",
    sourceUrls: ["https://angular.dev/guide/testing"],
  },
  {
    id: "ANG-074",
    category: "Testing",
    difficulty: "senior",
    type: "single",
    prompt:
      "Testeas un componente OnPush zoneless que navega con Router. ¿Qué práctica evita falsos verdes?",
    options: [
      {
        id: "a",
        text: "Usa RouterTestingHarness o provideRouter; espera whenStable en vez de detectChanges forzado si quieres validar notificaciones reales; no asignes campos del componente sin marcar CD.",
      },
      {
        id: "b",
        text: "Llama fixture.detectChanges() en un bucle infinito hasta que el DOM coincida.",
      },
      {
        id: "c",
        text: "Mockea Location.href = y evita TestBed porque el Router no se testea.",
      },
      {
        id: "d",
        text: "En zoneless, TestBed está deprecado y los tests deben ser solo e2e.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "La guía zoneless pide que los tests se parezcan a producción: notificaciones + whenStable. detectChanges sigue existiendo y es común en suites viejas, pero oculta componentes que no avisan a Angular. El Router se testea con harness/testing module, no con recargas reales.",
    sourceUrls: [
      "https://angular.dev/guide/testing",
      "https://angular.dev/guide/zoneless",
      "https://angular.dev/guide/routing/testing",
    ],
  },
];
