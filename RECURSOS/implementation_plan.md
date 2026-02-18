# Cascade Interface: Refactor del Panel Derecho

## Objetivo
Transformar el panel derecho (`CampaignBriefPanel`) en un "Centro de Mando" autosuficiente con interfaz de configuraciÃ³n en cascada (progressive disclosure).

## User Review Required

> [!IMPORTANT]
> Este cambio **reemplaza completamente** `CampaignBriefPanel.tsx` con un nuevo sistema modular. El panel izquierdo (`BrandDNAPanel`) seguirÃ¡ existiendo pero ya no serÃ¡ necesario arrastrar elementos desde Ã©l.

## Arquitectura Propuesta

```mermaid
graph TD
    A[CreationFlowContext] --> B[CreationCommandPanel]
    B --> C[IntentSelector]
    C --> D{Â¿Requiere Imagen?}
    D -->|SÃ­| E[SmartImageDropzone]
    D -->|No| F[ThemeSelector]
    E --> G[StyleChipsSelector]
    F --> G
    G --> H[BrandingConfigurator]
    H --> I[GenerateButton]
    I --> J[constructFinalPrompt]
```

---

## Cambios Propuestos

### 1. Nuevos Tipos ([NEW] [creation-flow-types.ts](file:///f:/_PROYECTOS/x-studio/src/lib/creation-flow-types.ts))
Interfaces TypeScript para las 20 categorÃ­as, flujos de creaciÃ³n, anÃ¡lisis de visiÃ³n y estado global.

### 2. API de AnÃ¡lisis de VisiÃ³n ([NEW] [analyze-image/route.ts](file:///f:/_PROYECTOS/x-studio/src/app/api/analyze-image/route.ts))
Endpoint que usa `models/gemini-flash-lite-latest` con la misma API key de pago (`GEMINI_IMAGE_API_KEY`) para analizar imÃ¡genes subidas y devolver:
- Sujeto detectado (food, tech, fashion, etc.)
- IluminaciÃ³n
- Paleta de colores
- Palabras clave visuales

### 3. Hook Principal ([NEW] [useCreationFlow.ts](file:///f:/_PROYECTOS/x-studio/src/hooks/useCreationFlow.ts))
Hook de React que gestiona todo el estado del flujo de creaciÃ³n con funciones para:
- Seleccionar intenciÃ³n
- Subir imagen y llamar al endpoint de anÃ¡lisis
- Seleccionar estilos basados en el anÃ¡lisis real
- Construir el prompt final

### 4. Componentes de UI (Nuevos en `src/components/studio/creation-flow/`)

| Componente | DescripciÃ³n |
|------------|-------------|
| [CreationCommandPanel.tsx](file:///f:/_PROYECTOS/x-studio/src/components/studio/creation-flow/CreationCommandPanel.tsx) | Panel contenedor principal |
| [IntentSelector.tsx](file:///f:/_PROYECTOS/x-studio/src/components/studio/creation-flow/IntentSelector.tsx) | Grid de grupos + subcategorÃ­as |
| [SmartImageDropzone.tsx](file:///f:/_PROYECTOS/x-studio/src/components/studio/creation-flow/SmartImageDropzone.tsx) | Dropzone con anÃ¡lisis Gemini Vision |
| [ThemeSelector.tsx](file:///f:/_PROYECTOS/x-studio/src/components/studio/creation-flow/ThemeSelector.tsx) | Selector de temas (Navidad, Verano...) |
| [StyleChipsSelector.tsx](file:///f:/_PROYECTOS/x-studio/src/components/studio/creation-flow/StyleChipsSelector.tsx) | Chips contextuales segÃºn anÃ¡lisis |
| [LayoutSelector.tsx](file:///f:/_PROYECTOS/x-studio/src/components/studio/creation-flow/LayoutSelector.tsx) | **Wireframes en miniatura** filtrados por Intent |
| [BrandingConfigurator.tsx](file:///f:/_PROYECTOS/x-studio/src/components/studio/creation-flow/BrandingConfigurator.tsx) | Logo selector + inputs pre-rellenados |
| [GenerateButton.tsx](file:///f:/_PROYECTOS/x-studio/src/components/studio/creation-flow/GenerateButton.tsx) | BotÃ³n con construcciÃ³n de prompt |

### 5. LayoutSelector: LÃ³gica de Filtrado

> [!IMPORTANT]
> Los layouts se filtran dinÃ¡micamente segÃºn la `IntentCategory` seleccionada.

| Intent | Layouts Disponibles |
|--------|--------------------|
| `comparativa` | Split Vertical, Split Horizontal, Antes/DespuÃ©s |
| `cita` / `pregunta` | Texto Centro, Texto Pie, Marco |
| `oferta` | Burst Sticker, Banda Inferior, Hero Text |
| `escaparate` | Hero Producto, Grid 2x2, Lifestyle |
| `evento` | Save the Date, Cartel Vertical, Banner |

**VisualizaciÃ³n**: Iconos SVG tipo "wireframe" que muestran dÃ³nde irÃ¡ el texto y la imagen.

### 6. Prompt con Instrucciones de ComposiciÃ³n

La funciÃ³n `constructFinalPrompt()` incluirÃ¡ instrucciones de layout:
```
"Composition: Leave empty space at [top-left] for text overlay. 
Text placement zone: 20% from top, centered horizontally."
```

### 4. IntegraciÃ³n ([MODIFY] [page.tsx](file:///f:/_PROYECTOS/x-studio/src/app/studio/page.tsx))
Reemplazar `<CampaignBriefPanel>` por `<CreationCommandPanel>`.

---

## Las 20 CategorÃ­as Maestras

````carousel
### Grupo A: Venta y Producto
| ID | Nombre | Requiere Imagen |
|----|--------|-----------------|
| `oferta` | La Oferta (Discount) | SÃ­ |
| `escaparate` | El Escaparate | SÃ­ (Studio/Lifestyle/Servicio) |
| `catalogo` | El CatÃ¡logo | SÃ­ |
| `lanzamiento` | El Lanzamiento | Opcional |
| `servicio` | El Servicio | No |
<!-- slide -->
### Grupo B: InformaciÃ³n
| ID | Nombre | Requiere Imagen |
|----|--------|-----------------|
| `comunicado` | El Comunicado | No |
| `evento` | El Evento | No |
| `lista` | La Lista | No |
| `comparativa` | La Comparativa | SÃ­ (Antes/DespuÃ©s) |
| `efemeride` | La EfemÃ©ride | No (Tema) |
<!-- slide -->
### Grupo C: Marca y Personas
| ID | Nombre | Requiere Imagen |
|----|--------|-----------------|
| `equipo` | El Equipo | SÃ­ |
| `cita` | La Cita | No |
| `talento` | El Talento | No |
| `logro` | El Logro | Opcional |
| `bts` | Behind the Scenes | SÃ­ |
<!-- slide -->
### Grupo D: EducaciÃ³n
| ID | Nombre | Requiere Imagen |
|----|--------|-----------------|
| `dato` | El Dato | No |
| `pasos` | El Paso a Paso | No |
| `definicion` | La DefiniciÃ³n | No |
<!-- slide -->
### Grupo E: Engagement
| ID | Nombre | Requiere Imagen |
|----|--------|-----------------|
| `pregunta` | La Pregunta | No |
| `reto` | El Reto/Juego | No |
````

---

## VerificaciÃ³n

### Demo Interactiva
1. Abrir el Studio y ver el nuevo panel derecho
2. Seleccionar un grupo (ej: "Vender") y subcategorÃ­a ("Escaparate")
3. Subir imagen â†’ ver etiquetas auto-detectadas
4. Elegir chips de estilo
5. Verificar que el Logo Selector muestre los logos del Brand Kit activo
6. Pulsar "Generar" â†’ ver el prompt estructurado en consola

