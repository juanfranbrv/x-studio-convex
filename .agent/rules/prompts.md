# Regla de Oro: Prompts Externalizados

⚠️ **PROHIBICIÓN TOTAL**: **NUNCA, BAJO NINGUNA CIRCUNSTANCIA**, los prompts deben estar "hardcodeados" (escritos directamente) dentro de las funciones de lógica o componentes.

### Reglas a seguir:
1. **Ficheros de Plantilla**: Cada prompt o fragmento de prompt debe residir en su propio fichero `.ts` o `.md` dentro de `src/lib/prompts/`.
2. **Exportar Constantes**: El fichero de plantilla debe exportar constantes de tipo string (ej. `export const MY_PROMPT_TEMPLATE = ...`).
3. **Inyección de Variables**: Las funciones constructoras de prompts (ej. `buildPrompt()`) solo deben encargarse de importar estas constantes e inyectar las variables dinámicas necesarias.
4. **Revisión y Edición**: Este enfoque permite que cualquier persona (o IA) pueda revisar y editar el comportamiento de los modelos sin riesgo de romper la lógica del código TypeScript.

*Esta regla es fundamental para la mantenibilidad y la transparencia del sistema de IA del Studio.*
