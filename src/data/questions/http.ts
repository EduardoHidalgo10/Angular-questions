import type { Question } from "../../types/question";

export const httpQuestions: Question[] = [
  {
    id: "ANG-063",
    category: "HttpClient e interceptores",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "¿Cómo se registra un interceptor funcional moderno?",
    codeSnippet: `export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthStore).token();
  return next(token ? req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } }) : req);
};`,
    options: [
      {
        id: "a",
        text: "provideHttpClient(withInterceptors([authInterceptor])) en el bootstrap; inject() es legal en el interceptor.",
      },
      {
        id: "b",
        text: "Hay que declararlo en imports del componente raíz.",
      },
      {
        id: "c",
        text: "Los interceptores funcionales no pueden clonar la request.",
      },
      {
        id: "d",
        text: "withInterceptors sustituye a HttpClient; ya no se inyecta HttpClient.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "La cadena funcional es el estándar actual. Las clases HttpInterceptor siguen existiendo (withInterceptorsFromDi) pero no son el default. clone es la forma inmutable de añadir headers. HttpClient se sigue inyectando.",
    sourceUrls: ["https://angular.dev/guide/http/interceptors"],
  },
  {
    id: "ANG-064",
    category: "HttpClient e interceptores",
    difficulty: "senior",
    type: "single",
    prompt:
      "Diseña el refresh token ante un 401. ¿Qué evita loops y peticiones duplicadas?",
    options: [
      {
        id: "a",
        text: "Excluir /refresh y /login del retry; serializar el refresh con un único in-flight (share/subject) y fallar a login si el refresh también es 401.",
      },
      {
        id: "b",
        text: "Reintentar indefinidamente cualquier 401, incluido el del propio refresh.",
      },
      {
        id: "c",
        text: "Lanzar un refresh por cada request 401 en paralelo, sin compartir el resultado.",
      },
      {
        id: "d",
        text: "Guardar el refresh token en un interceptor distinto que se registre dos veces para mayor redundancia.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Si el interceptor no ignora el endpoint de refresh, un 401 de refresh se vuelve a interceptar y entra en loop. Varios 401 simultáneos deben esperar el mismo refresh; si no, duplicas tokens y carreras. Tras fallar el refresh, redirige y corta la cadena.",
    interviewInsight:
      "Explica el mutex: BehaviorSubject<boolean> o un Observable compartido de refresh$.pipe(shareReplay(1)) mientras dura la renovación.",
    sourceUrls: ["https://angular.dev/guide/http/interceptors"],
  },
  {
    id: "ANG-065",
    category: "HttpClient e interceptores",
    difficulty: "senior",
    type: "multiple",
    prompt:
      "Sobre el orden de interceptores y exclusiones, ¿qué es cierto?",
    options: [
      {
        id: "a",
        text: "El orden de withInterceptors es el de ejecución en la ida; en la respuesta se recorren al revés.",
      },
      {
        id: "b",
        text: "Puedes saltarte Authorization si req.url incluye /login o si un contexto HttpContextToken lo indica.",
      },
      {
        id: "c",
        text: "Un interceptor de loading global no debe marcar loading=false en finalize si quiere dejar spinners huérfanos.",
      },
      {
        id: "d",
        text: "Los interceptores ven también las llamadas de httpResource porque se apoya en HttpClient.",
      },
    ],
    correctOptionIds: ["a", "b", "d"],
    explanation:
      "c está invertida: finalize es precisamente el sitio para apagar el loading tanto en success como en error/cancel. HttpContext es la forma limpia de optar out por request. httpResource reutiliza interceptores y XSRF.",
    sourceUrls: [
      "https://angular.dev/guide/http/interceptors",
      "https://angular.dev/guide/http/http-resource",
    ],
  },
  {
    id: "ANG-066",
    category: "HttpClient e interceptores",
    difficulty: "senior",
    type: "single",
    prompt:
      "¿Por qué no usarías httpResource para un POST de crear pedido?",
    options: [
      {
        id: "a",
        text: "httpResource está pensado para lecturas reactivas eager; las mutaciones deben ser explícitas con HttpClient para controlar cuándo se disparan y cómo se maneja el error.",
      },
      {
        id: "b",
        text: "httpResource no pasa por interceptores, así que el POST iría sin CSRF.",
      },
      {
        id: "c",
        text: "HttpClient no puede hacer POST si existe httpResource en el proyecto.",
      },
      {
        id: "d",
        text: "POST es imposible en Angular zoneless.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "La guía lo dice con claridad: evita httpResource para POST/PUT. Es eager y se relanza al cambiar señales, algo peligroso en mutaciones. Sí usa HttpClient por debajo, así que interceptores y XSRF aplicarían, que es otra razón más para no dispararlo sin querer.",
    sourceUrls: ["https://angular.dev/guide/http/http-resource"],
  },
];
