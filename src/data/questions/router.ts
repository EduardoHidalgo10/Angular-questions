import type { Question } from "../../types/question";

export const routerQuestions: Question[] = [
  {
    id: "ANG-059",
    category: "Router",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "Navegas de /users/1 a /users/2 reutilizando el mismo componente. ¿Por qué snapshot.paramMap puede fallar?",
    codeSnippet: `const id = this.route.snapshot.paramMap.get("id");`,
    options: [
      {
        id: "a",
        text: "snapshot se lee una vez; si el componente no se destruye, no verás el nuevo id. Hay que suscribirse a paramMap (o usar input binding de ruta).",
      },
      {
        id: "b",
        text: "snapshot se actualiza siempre; el bug está en que paramMap no existe en hijos.",
      },
      {
        id: "c",
        text: "queryParamMap y paramMap son aliases; da igual cuál uses.",
      },
      {
        id: "d",
        text: "El Router prohíbe reutilizar componentes; Angular destruye siempre la vista.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "El default es reutilizar el componente cuando solo cambian parámetros. snapshot queda obsoleto. paramMap es /users/:id; queryParamMap es ?tab=. withComponentInputBinding permite recibir id como input().",
    sourceUrls: ["https://angular.dev/guide/routing/elements-binding"],
  },
  {
    id: "ANG-060",
    category: "Router",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "¿Cómo cargas un feature standalone de forma perezosa incluyendo hijos?",
    codeSnippet: `{
  path: "admin",
  loadChildren: () => import("./admin/routes").then((m) => m.ADMIN_ROUTES),
}`,
    options: [
      {
        id: "a",
        text: "loadChildren puede devolver Routes; loadComponent carga una sola página. Ambos parten el bundle.",
      },
      {
        id: "b",
        text: "loadChildren exige un NgModule y no acepta un array de rutas standalone.",
      },
      {
        id: "c",
        text: "Lazy loading solo funciona con provideZoneChangeDetection.",
      },
      {
        id: "d",
        text: "Los guards de la ruta padre no se aplican a loadChildren.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Standalone permite lazy de rutas sin NgModule. Los canActivate del padre sí envuelven a los hijos (y canActivateChild cubre específicamente hijos). El lazy loading no depende de Zone.",
    sourceUrls: ["https://angular.dev/guide/routing/define-routes"],
  },
  {
    id: "ANG-061",
    category: "Router",
    difficulty: "senior",
    type: "multiple",
    prompt:
      "Sobre guards y resolvers funcionales, ¿qué es correcto?",
    options: [
      {
        id: "a",
        text: "CanActivateFn puede devolver boolean, UrlTree u Observable/Promise de ambos para redirigir al login.",
      },
      {
        id: "b",
        text: "Un resolver precarga datos antes de activar la ruta; si falla, la navegación no completa.",
      },
      {
        id: "c",
        text: "inject() es válido dentro del guard/resolver porque corren en injection context.",
      },
      {
        id: "d",
        text: "Los resolvers sustituyen a HttpClient y no deben usarse con signals.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "Los resolvers usan HttpClient u otras fuentes; no las reemplazan. Con httpResource y inputs de ruta, muchos equipos prefieren cargar en el componente, pero el resolver sigue siendo válido cuando la ruta no debe activarse sin datos.",
    sourceUrls: ["https://angular.dev/guide/routing/route-guards"],
  },
  {
    id: "ANG-062",
    category: "Router",
    difficulty: "senior",
    type: "single",
    prompt:
      "El padre /admin tiene canActivate de autenticación. ¿Para qué usarías canActivateChild?",
    options: [
      {
        id: "a",
        text: "Para aplicar autorización por rol a cada navegación hija sin repetir el guard en cada ruta, incluso cuando el padre ya está activo.",
      },
      {
        id: "b",
        text: "canActivateChild corre solo al refrescar el navegador, no al navegar entre hijos.",
      },
      {
        id: "c",
        text: "Es un alias de canDeactivate y pregunta si hay cambios sin guardar.",
      },
      {
        id: "d",
        text: "canActivateChild hidrata los hijos en SSR; canActivate no.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "canActivate del padre no se reejecuta al cambiar de hijo si el padre permanece. canActivateChild sí se evalúa en cada navegación descendiente. canDeactivate es otro hook. La hidratación no depende de estos guards.",
    sourceUrls: ["https://angular.dev/guide/routing/route-guards"],
  },
];
