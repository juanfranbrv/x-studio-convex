# Referencia Técnica

Documento vivo de referencia técnica para Juanfran y cualquier IA que trabaje en `x-studio`.

## Detección de idioma con Detect Language API

### Propósito

Se usa para mejorar la detección de idioma en prompts cortos o ambiguos, especialmente en español, catalán y portugués.

No sustituye por completo la heurística local:

- en cliente se mantiene detección local síncrona
- en servidor se usa Detect Language API con fallback local

Esto evita exponer la clave y mantiene la app funcional si la API falla.

### Configuración

- Variable de entorno: `DETECT_LANGUAGE_API_KEY`
- Endpoint: `POST https://ws.detectlanguage.com/0.2/detect`
- Autenticación: `Authorization: Bearer <API_KEY>`

### Implementación compartida

Archivo base:

- [src/lib/language-detection.ts](F:/_PROYECTOS/x-studio/src/lib/language-detection.ts)

Funciones principales:

- `detectLanguage(text)`: heurística local síncrona
- `detectLanguageFromParts(parts, fallback)`: heurística local para varias entradas
- `detectLanguageWithApi(text, fallback)`: detección en servidor con API + fallback local
- `detectLanguageFromPartsWithApi(parts, fallback)`: variante agregada para varias entradas

### Dónde se usa

Acciones de servidor conectadas a la API:

- [src/app/actions/generate-social-post.ts](F:/_PROYECTOS/x-studio/src/app/actions/generate-social-post.ts)
- [src/app/actions/generate-carousel.ts](F:/_PROYECTOS/x-studio/src/app/actions/generate-carousel.ts)
- [src/app/actions/parse-intent.ts](F:/_PROYECTOS/x-studio/src/app/actions/parse-intent.ts)
- [src/app/actions/analyze-brand-dna.ts](F:/_PROYECTOS/x-studio/src/app/actions/analyze-brand-dna.ts)

Uso local síncrono en cliente o utilidades que no deben depender de red:

- hooks del flujo de creación
- lógica de apoyo en imagen/carrusel
- constructores de prompt que necesitan respuesta inmediata

### Regla de decisión

El sistema sigue esta prioridad:

1. heurística local
2. consulta a Detect Language API en servidor
3. si la API es fiable, se acepta su idioma
4. si falla, no hay clave o la respuesta es dudosa, se conserva el resultado local

### Notas de mantenimiento

- No mover la llamada a la API a cliente.
- No usar esta integración para bloquear flujos críticos.
- Si aparece una regresión en detección, ajustar primero [src/lib/language-detection.ts](F:/_PROYECTOS/x-studio/src/lib/language-detection.ts), no parchear cada módulo por separado.
