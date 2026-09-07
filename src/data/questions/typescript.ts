import type { Question } from "../../types/question";

export const typescriptQuestions: Question[] = [
  {
    id: "ANG-001",
    category: "TypeScript, clases y orientación a objetos",
    difficulty: "fundamental",
    type: "single",
    prompt:
      "En TypeScript, ¿cuál es la diferencia correcta entre extends e implements al trabajar con clases e interfaces?",
    options: [
      {
        id: "a",
        text: "extends crea una relación de herencia y puede reutilizar implementación; implements obliga a satisfacer un contrato sin heredar comportamiento.",
      },
      {
        id: "b",
        text: "implements hereda métodos concretos y extends solo sirve para interfaces.",
      },
      {
        id: "c",
        text: "Ambos copian el código fuente de la clase base; la diferencia es únicamente estética.",
      },
      {
        id: "d",
        text: "extends restringe el acceso a miembros private, mientras que implements los hace públicos.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "extends expresa herencia: una clase puede reutilizar y especializar implementación de otra clase, o una interfaz puede extender otra interfaz. implements expresa un contrato: la clase debe proveer los miembros declarados, pero no recibe implementación. La opción b invierte los roles. La c es falsa porque no hay copia de código fuente. La d confunde modificadores de acceso con herencia.",
    interviewInsight:
      "En entrevista, relaciona esto con el diseño de servicios Angular: una clase abstracta se extiende cuando hay comportamiento compartido; una interfaz se implementa cuando solo necesitas un contrato inyectable.",
    sourceUrls: ["https://www.typescriptlang.org/docs/handbook/2/classes.html"],
  },
  {
    id: "ANG-002",
    category: "TypeScript, clases y orientación a objetos",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "Con strictNullChecks activado, ¿qué declaración es segura y aprovecha genéricos más null safety?",
    codeSnippet: `function primero<T>(items: T[]): T | undefined {
  return items[0];
}

const nombres: string[] = [];
const valor = primero(nombres);
console.log(valor.toUpperCase());`,
    options: [
      {
        id: "a",
        text: "El código es seguro porque T se infiere como string y TypeScript garantiza que items[0] existe.",
      },
      {
        id: "b",
        text: "Hay un error: valor puede ser undefined, así que hay que estrechar el tipo antes de llamar toUpperCase.",
      },
      {
        id: "c",
        text: "Basta con cambiar el retorno a T, porque un arreglo de string nunca es vacío en runtime.",
      },
      {
        id: "d",
        text: "El genérico T elimina undefined automáticamente al inferirse desde string[].",
      },
    ],
    correctOptionIds: ["b"],
    explanation:
      "Con noUncheckedIndexedAccess o un retorno explícito T | undefined, acceder a items[0] no garantiza un valor. TypeScript no puede probar que el arreglo tenga elementos. a y d asumen una garantía inexistente. c empeora el contrato: devolver T mentiría al sistema de tipos y fallaría en runtime con un arreglo vacío.",
    sourceUrls: [
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
      "https://www.typescriptlang.org/tsconfig/#strictNullChecks",
    ],
  },
  {
    id: "ANG-003",
    category: "TypeScript, clases y orientación a objetos",
    difficulty: "senior",
    type: "multiple",
    prompt:
      "Diseñas un servicio de persistencia. ¿Qué decisiones de orientación a objetos son sólidas en un códigobase Angular senior?",
    codeSnippet: `abstract class Store<T> {
  abstract load(): Promise<T>;
  protected cache: T | null = null;
}

class UserStore extends Store<User> {
  constructor(private readonly api: UserApi) {
    super();
  }
  load() {
    return this.api.getMe();
  }
}`,
    options: [
      {
        id: "a",
        text: "Una clase abstracta es útil cuando hay un algoritmo o estado compartido y las subclases deben completar pasos concretos.",
      },
      {
        id: "b",
        text: "Prefiere composición (inyectar UserApi) frente a heredar de HttpClient para reutilizar HTTP.",
      },
      {
        id: "c",
        text: "Marcar api como private readonly impide reasignar la dependencia y oculta el detalle a consumidores externos.",
      },
      {
        id: "d",
        text: "Heredar UserStore de HttpClient es preferible porque así todas las peticiones quedan en la jerarquía de clases.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "a es el caso clásico de clases abstractas. b aplica composición sobre herencia: HttpClient se inyecta, no se extiende. c usa private y readonly para encapsular e inmutabilizar la referencia. d es un anti-patrón: heredar de HttpClient acopla el dominio a un detalle de infraestructura y dificulta testing y DI.",
    interviewInsight:
      "Un entrevistador senior busca que sepas cuándo NO heredar. En Angular, la respuesta esperada suele ser: hereda comportamiento de dominio; compón infraestructuras como HttpClient, Router o Store.",
    sourceUrls: ["https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members"],
  },
  {
    id: "ANG-004",
    category: "TypeScript, clases y orientación a objetos",
    difficulty: "senior",
    type: "single",
    prompt:
      "¿Cuál es el análisis correcto de este modelo de dominio respecto a public, protected, private y readonly?",
    codeSnippet: `class Pedido {
  readonly id: string;
  public estado: "borrador" | "pagado" = "borrador";
  protected items: Item[] = [];
  private total = 0;

  constructor(id: string) {
    this.id = id;
  }

  agregar(item: Item) {
    this.items.push(item);
    this.total += item.precio;
  }
}

class PedidoExportable extends Pedido {
  snapshot() {
    return { id: this.id, items: this.items, total: this.total };
  }
}`,
    options: [
      {
        id: "a",
        text: "Compila: las subclases acceden a protected y private, y readonly solo impide reasignar id fuera del constructor.",
      },
      {
        id: "b",
        text: "Falla: snapshot no puede leer total porque private no es visible en la subclase; items sí, por ser protected.",
      },
      {
        id: "c",
        text: "Falla porque readonly id no puede leerse desde la subclase.",
      },
      {
        id: "d",
        text: "Compila, pero items.push viola readonly ya que items es protected.",
      },
    ],
    correctOptionIds: ["b"],
    explanation:
      "private es privado a la clase que lo declara; las subclases no ven total. protected sí permite a PedidoExportable usar items. readonly en id impide reasignar la referencia, no la lectura. items no es readonly, así que push no es un error de readonly. Por eso el código no compila y el motivo preciso es el acceso a this.total.",
    sourceUrls: ["https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility"],
  },
];
