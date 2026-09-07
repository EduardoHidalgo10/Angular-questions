import type { Question } from "../../types/question";

export const diQuestions: Question[] = [
  {
    id: "ANG-027",
    category: "Dependency Injection, servicios y providers",
    difficulty: "fundamental",
    type: "single",
    prompt:
      "¿Qué significa proporcionar un servicio con providedIn: 'root'?",
    options: [
      {
        id: "a",
        text: "Angular registra una única instancia a nivel de aplicación, tree-shakable si nadie la inyecta.",
      },
      {
        id: "b",
        text: "Se crea una instancia por cada componente que lo declare en imports.",
      },
      {
        id: "c",
        text: "El servicio solo está disponible dentro del módulo donde se declaró.",
      },
      {
        id: "d",
        text: "providedIn: 'root' equivale a providedIn: 'any' y genera una instancia por lazy route.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "root es el singleton de aplicación. No se pone en imports de componentes. No queda limitado a un NgModule. providedIn: 'any' (histórico) no es lo mismo: creaba instancias por lazy boundary.",
    sourceUrls: ["https://angular.dev/guide/di"],
  },
  {
    id: "ANG-028",
    category: "Dependency Injection, servicios y providers",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "¿Dónde es legal llamar a inject()?",
    codeSnippet: `export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated();
};`,
    options: [
      {
        id: "a",
        text: "En un injection context: constructores, inicializadores de campo, factories, guards, interceptores funcionales y similares.",
      },
      {
        id: "b",
        text: "En cualquier callback asíncrono, por ejemplo dentro de setTimeout o en el then de una Promise.",
      },
      {
        id: "c",
        text: "Solo dentro de NgModules; en standalone está prohibido.",
      },
      {
        id: "d",
        text: "Únicamente si el servicio no usa providedIn: 'root'.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "inject() exige injection context. Un guard funcional lo tiene. Un then/setTimeout ya no, salvo que captures la dependencia antes o uses runInInjectionContext. b es el error típico. c y d son mitos.",
    sourceUrls: ["https://angular.dev/guide/di/dependency-injection-context"],
  },
  {
    id: "ANG-029",
    category: "Dependency Injection, servicios y providers",
    difficulty: "intermediate",
    type: "multiple",
    prompt:
      "Selecciona las correspondencias correctas de recetas de providers.",
    options: [
      {
        id: "a",
        text: "useClass instancia una clase distinta a la del token (útil para stubs o estrategias).",
      },
      {
        id: "b",
        text: "useValue entrega un objeto ya construido, por ejemplo configuración.",
      },
      {
        id: "c",
        text: "useFactory crea el valor con una función que puede inyectar dependencias.",
      },
      {
        id: "d",
        text: "useExisting crea siempre una copia profunda nueva del servicio original.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "useExisting es un alias al mismo objeto ya provisto por otro token; no clona. Las otras tres recetas coinciden con la documentación de DI.",
    sourceUrls: ["https://angular.dev/guide/di/dependency-injection-providers"],
  },
  {
    id: "ANG-030",
    category: "Dependency Injection, servicios y providers",
    difficulty: "senior",
    type: "single",
    prompt:
      "El mismo token Logger está en root y en providers del componente. ¿Qué instancia recibe el hijo?",
    codeSnippet: `@Component({
  providers: [{ provide: Logger, useClass: SilentLogger }],
})
export class Panel {}`,
    options: [
      {
        id: "a",
        text: "El inyector jerárquico resuelve el provider más cercano: Panel y sus descendientes reciben SilentLogger; el resto de la app, el de root.",
      },
      {
        id: "b",
        text: "Siempre gana providedIn: 'root'; los providers de componente se ignoran para tokens ya registrados.",
      },
      {
        id: "c",
        text: "Angular lanza error por token duplicado al arrancar.",
      },
      {
        id: "d",
        text: "El hijo recibe ambas instancias fusionadas en un array automático.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "La búsqueda recorre el árbol de inyectores hacia arriba. Un provider en el componente sombrea el de root para esa rama. No hay error ni fusión mágica (salvo multi: true, que no está en el código).",
    interviewInsight:
      "Dibuja el árbol: EnvironmentInjector (root/route) vs ElementInjector (componente). Es una pregunta muy de senior.",
    sourceUrls: ["https://angular.dev/guide/di/hierarchical-dependency-injection"],
  },
  {
    id: "ANG-031",
    category: "Dependency Injection, servicios y providers",
    difficulty: "senior",
    type: "single",
    prompt:
      "Quieres un Store de filtros que viva mientras la ruta /productos esté activa, no en toda la app ni por cada fila. ¿Dónde lo provees?",
    options: [
      {
        id: "a",
        text: "En providers de la ruta (o el EnvironmentInjector de esa ruta), para que se destruya al salir de /productos.",
      },
      {
        id: "b",
        text: "En providedIn: 'root', porque las rutas lazy no tienen inyector propio.",
      },
      {
        id: "c",
        text: "En providers de cada componente de fila, para compartir el mismo estado entre ellas.",
      },
      {
        id: "d",
        text: "Como useValue en el componente hoja, para que el padre también lo vea hacia arriba.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Los providers de ruta crean un alcance por navegación de ese árbol. root sobreviviría a otras pantallas. providers por fila crearían N stores. La resolución no sube al padre desde el hijo: el padre no ve providers de descendientes.",
    sourceUrls: ["https://angular.dev/guide/di/hierarchical-dependency-injection"],
  },
];
