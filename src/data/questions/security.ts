import type { Question } from "../../types/question";

export const securityQuestions: Question[] = [
  {
    id: "ANG-069",
    category: "Seguridad, autenticación, autorización y roles",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "En una app basada en roles, ¿qué diferencia autenticación de autorización?",
    options: [
      {
        id: "a",
        text: "Autenticación verifica identidad (login, token válido); autorización decide si ese principal puede ejecutar una acción o ver una ruta.",
      },
      {
        id: "b",
        text: "Son sinónimos; un canActivate cubre ambos sin el backend.",
      },
      {
        id: "c",
        text: "Autorización ocurre solo en el interceptor; autenticación solo en el pipe.",
      },
      {
        id: "d",
        text: "Los roles se resuelven exclusivamente con CSS hidden.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Guards + interceptor + UI por rol son capas de UX. La autorización real se revalida en el API. Ocultar un botón no es seguridad.",
    sourceUrls: ["https://angular.dev/guide/routing/route-guards"],
  },
  {
    id: "ANG-070",
    category: "Seguridad, autenticación, autorización y roles",
    difficulty: "senior",
    type: "multiple",
    prompt:
      "Sobre XSS, CSRF, sanitización y tokens, ¿qué es correcto en Angular?",
    options: [
      {
        id: "a",
        text: "Angular sanitiza por defecto bindings HTML/URL/style; bypassSecurityTrust* debe ser excepcional y sobre datos ya confiables.",
      },
      {
        id: "b",
        text: "localStorage es vulnerable a XSS: cualquier script inyectado lee el token. Cookies HttpOnly no son accesibles desde JS, pero exigen defensa CSRF.",
      },
      {
        id: "c",
        text: "HttpClient incluye soporte XSRF leyendo una cookie y enviándola en un header (p. ej. X-XSRF-TOKEN) en peticiones mutadoras same-origin.",
      },
      {
        id: "d",
        text: "innerHTML con datos de usuario es seguro porque OnPush desactiva XSS.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "OnPush no es un control de seguridad. innerHTML y bypass son superficies de XSS. El trade-off token en storage vs cookie HttpOnly+CSRF es exactamente lo que un senior debe articular. Nunca pongas secretos de API en el bundle.",
    interviewInsight:
      "Explica el intercambio: XSS vs CSRF. No existe almacenamiento perfecto en el navegador; se mitiga en profundidad (CSP, sanitización, tokens cortos, backend).",
    sourceUrls: ["https://angular.dev/best-practices/security"],
  },
  {
    id: "ANG-071",
    category: "Seguridad, autenticación, autorización y roles",
    difficulty: "senior",
    type: "single",
    prompt:
      "El menú oculta 'Eliminar' a editores, pero un editor llama DELETE /api/users/1 a mano. ¿Qué conclusión es correcta?",
    options: [
      {
        id: "a",
        text: "La UI y el guard son convenciencia; el backend debe rechazar 403. El frontend nunca es la única línea de autorización.",
      },
      {
        id: "b",
        text: "Si el botón no existe en el DOM, el API no puede ser invocado y el riesgo es cero.",
      },
      {
        id: "c",
        text: "Un pipe de roles en el cliente firma criptográficamente la request y el servidor debe confiarla.",
      },
      {
        id: "d",
        text: "canActivateChild cifra el payload; por eso no hace falta autorización server-side.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Cualquier request se puede forjar. Roles en frontend mejoran UX y evitan rutas erróneas, pero el servidor valida JWT, scopes y recurso. Firmar en el cliente no es confianza: el atacante controla el cliente.",
    sourceUrls: ["https://angular.dev/best-practices/security"],
  },
];
