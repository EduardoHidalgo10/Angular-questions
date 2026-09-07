import type { Question } from "../../types/question";

export const formQuestions: Question[] = [
  {
    id: "ANG-053",
    category: "Formularios",
    difficulty: "fundamental",
    type: "single",
    prompt:
      "¿Cuál es la diferencia de diseño entre reactive forms y template-driven forms?",
    options: [
      {
        id: "a",
        text: "Reactive define el modelo en la clase (síncrono, más testeable); template-driven lo crea NgModel en la plantilla (flujo asíncrono, mejor para formularios simples).",
      },
      {
        id: "b",
        text: "Template-driven no usa FormControl internamente; reactive no valida.",
      },
      {
        id: "c",
        text: "Reactive solo funciona con NgModules y template-driven solo con standalone.",
      },
      {
        id: "d",
        text: "Ambos son asíncronos; la única diferencia es el color del borde de error.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Ambos se apoyan en FormControl/FormGroup, pero el origen de verdad y el timing cambian. Reactive es explícito y síncrono; template-driven abstrae y actualiza de forma asíncrona, lo que complica tests. No hay restricción standalone/NgModule.",
    sourceUrls: ["https://angular.dev/guide/forms"],
  },
  {
    id: "ANG-054",
    category: "Formularios",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "En un checkout con N teléfonos dinámicos, ¿qué estructura usas?",
    codeSnippet: `form = this.fb.group({
  telefonos: this.fb.array([this.telefono()]),
});`,
    options: [
      {
        id: "a",
        text: "FormArray (o un FormRecord) modela listas de controles; push/removeAt sincronizan la colección.",
      },
      {
        id: "b",
        text: "Varios FormGroup hermanos con el mismo nombre 'telefono' se fusionan solos.",
      },
      {
        id: "c",
        text: "Un FormControl<string[]> es suficiente para inputs independientes con validadores por fila.",
      },
      {
        id: "d",
        text: "FormArray solo existe en template-driven forms.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "FormArray es el control de colecciones. Un FormControl de array no da un control por fila ni errores por índice. Nombres duplicados no se fusionan. FormArray es de reactive forms.",
    sourceUrls: ["https://angular.dev/guide/forms/typed-forms"],
  },
  {
    id: "ANG-055",
    category: "Formularios",
    difficulty: "intermediate",
    type: "single",
    prompt:
      "Con typed reactive forms, ¿qué problema hay aquí?",
    codeSnippet: `const form = new FormGroup({
  edad: new FormControl<number | null>(null, { validators: [Validators.min(18)] }),
});
const edad: number = form.controls.edad.value;`,
    options: [
      {
        id: "a",
        text: "value puede ser null (control no required o reset); el tipo number solo no es seguro sin estrechar o nonNullable.",
      },
      {
        id: "b",
        text: "FormControl<number | null> prohíbe Validators.min.",
      },
      {
        id: "c",
        text: "form.controls no existe; hay que usar form.get('edad') sin tipos.",
      },
      {
        id: "d",
        text: "Los forms tipados eliminan null de todos los controles automáticamente.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Por defecto value incluye null. nonNullable: true o un initial value no nulo cambia el contrato. controls está tipado precisamente para evitar get() poco seguro. min sí es compatible.",
    sourceUrls: ["https://angular.dev/guide/forms/typed-forms"],
  },
  {
    id: "ANG-056",
    category: "Formularios",
    difficulty: "senior",
    type: "multiple",
    prompt:
      "Implementas un date-picker reutilizable. ¿Qué debe cumplir un ControlValueAccessor?",
    options: [
      {
        id: "a",
        text: "writeValue pinta el valor que llega desde el FormControl.",
      },
      {
        id: "b",
        text: "registerOnChange notifica al form cuando el usuario cambia el valor interno.",
      },
      {
        id: "c",
        text: "registerOnTouched y setDisabledState conectan touched y disabled del form con la UI.",
      },
      {
        id: "d",
        text: "Basta con emitir un output valueChange; Angular lo enlaza a FormControl sin CVA.",
      },
    ],
    correctOptionIds: ["a", "b", "c"],
    explanation:
      "Sin CVA, un custom control no participa en validación, status ni disable de reactive forms. Un output suelto no sustituye la interfaz. NG_VALUE_ACCESSOR registra el puente.",
    interviewInsight:
      "En una entrevista senior, menciona también que Signal Forms usa [field] y un modelo signal, pero CVA sigue siendo esencial en reactive forms legacy y en design systems.",
    sourceUrls: ["https://angular.dev/guide/forms/reactive-forms"],
  },
  {
    id: "ANG-057",
    category: "Formularios",
    difficulty: "senior",
    type: "single",
    prompt:
      "Necesitas un validador async que compruebe si el email existe. ¿Cuál es el diseño correcto?",
    codeSnippet: [
      "emailDisponible: ValidatorFn = (c) =>",
      "  this.http.get(`/emails/${c.value}`).pipe(map((ok) => (ok ? null : { taken: true })));",
    ].join("\n"),
    options: [
      {
        id: "a",
        text: "Debe ser AsyncValidatorFn y devolver Observable/Promise; un ValidatorFn síncrono no debe devolver un Observable de HTTP.",
      },
      {
        id: "b",
        text: "ValidatorFn puede devolver Observables si el control es nonNullable.",
      },
      {
        id: "c",
        text: "Los validadores async se registran en validators, nunca en asyncValidators.",
      },
      {
        id: "d",
        text: "Hay que suscribirse dentro del validador y devolver el boolean crudo.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "validators espera ValidationErrors | null de forma síncrona. HTTP va en asyncValidators, con debounce en valueChanges o en el propio validador, y cancelación natural al cambiar el valor. Suscribirse dentro y devolver boolean rompe el ciclo de status PENDING.",
    sourceUrls: ["https://angular.dev/guide/forms/form-validation"],
  },
  {
    id: "ANG-058",
    category: "Formularios",
    difficulty: "senior",
    type: "single",
    prompt:
      "¿Qué idea central distingue Signal Forms de reactive forms clásicos?",
    options: [
      {
        id: "a",
        text: "El modelo es un WritableSignal tuyo; form() deriva campos y validación, y [field] enlaza el control nativo sin que la librería posea una copia oculta del valor.",
      },
      {
        id: "b",
        text: "Signal Forms elimina la validación; solo sirve para demos.",
      },
      {
        id: "c",
        text: "form() exige NgModule FormsModule y no funciona con signals.",
      },
      {
        id: "d",
        text: "Signal Forms reemplaza HttpClient y los interceptores.",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "La documentación enfatiza que tú posees el modelo. Reactive forms guardan el valor en FormControl. Signal Forms encaja con zoneless porque el template lee signals. Siguen existiendo validadores, schema y un flujo de submit; no sustituyen HTTP.",
    sourceUrls: ["https://angular.dev/guide/forms/signals"],
  },
];
