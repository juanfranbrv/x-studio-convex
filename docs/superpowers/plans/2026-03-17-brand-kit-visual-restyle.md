# Brand Kit Visual Restyle Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Alinear visualmente `/brand-kit` con el lenguaje establecido en `image` y `carousel`, sin tocar la lógica funcional del módulo.

**Architecture:** El restyle se apoya en una capa ligera de estilos compartidos específicos de Brand Kit y en la sustitución sistemática de patrones heredados (`glass-panel`, microcards, divisores duros, CTAs débiles) por superficies limpias, jerarquía tipográfica fuerte y familias de controles compatibles con el estudio creativo.

**Tech Stack:** Next.js, React, Tailwind, shadcn/ui, componentes existentes de `brand-dna`, utilidades visuales compartidas del estudio.

---

## Chunk 1: Base visual compartida de Brand Kit

### Task 1: Crear tokens visuales locales para Brand Kit

**Files:**
- Create: `F:/_PROYECTOS/x-studio/src/components/brand-dna/brandKitStyles.ts`
- Modify: `F:/_PROYECTOS/x-studio/src/components/brand-dna/BrandDNABoard.tsx`

- [ ] Definir constantes reutilizables para:
  - superficie principal
  - superficie secundaria
  - cabecera de seccion
  - boton secundario `M`
  - accion ligera
  - bloques de ayuda/estado
- [ ] Sustituir clases repetidas del shell principal para que el board deje de depender de `glass-panel` como patron dominante.

### Task 2: Reordenar la jerarquia superior del board

**Files:**
- Modify: `F:/_PROYECTOS/x-studio/src/components/brand-dna/BrandDNABoard.tsx`
- Modify: `F:/_PROYECTOS/x-studio/src/components/brand-dna/BrandKitProgress.tsx`

- [ ] Convertir el bloque superior en una sola superficie limpia, con:
  - progreso premium y mas sobrio
  - acciones superiores con una familia coherente
  - inputs/preview de kit con mejor aire y menos look de formulario tecnico
- [ ] Eliminar sensacion de “tarjeta dentro de tarjeta” en la cabecera.

## Chunk 2: Superficies principales del contenido

### Task 3: Restyle de activos visuales

**Files:**
- Modify: `F:/_PROYECTOS/x-studio/src/components/brand-dna/VisualAssetComponents.tsx`
- Modify: `F:/_PROYECTOS/x-studio/src/components/brand-dna/ColorPalette.tsx`

- [ ] Rehacer `LogoCard`, `FaviconCard`, `ScreenshotCard` e `ImageGallery` para que compartan:
  - mismas superficies
  - iconografia y cabeceras mas limpias
  - estados activos/inactivos por color/fondo/borde
  - controles `x` coherentes con el resto de la app
- [ ] Rehacer `ColorPalette` para quitar look de herramienta interna antigua y acercarla a una pieza premium de configuracion visual.

### Task 4: Restyle de contenido editorial/configuracion

**Files:**
- Modify: `F:/_PROYECTOS/x-studio/src/components/brand-dna/TextAssetsSection.tsx`
- Modify: `F:/_PROYECTOS/x-studio/src/components/brand-dna/TypographySection.tsx`
- Modify: `F:/_PROYECTOS/x-studio/src/components/brand-dna/BrandContextCard.tsx`
- Modify: `F:/_PROYECTOS/x-studio/src/components/brand-dna/ContactSocialCard.tsx`
- Modify: `F:/_PROYECTOS/x-studio/src/components/brand-dna/TargetAudienceCard.tsx`

- [ ] Subir jerarquia tipografica y simplificar bordes/containers.
- [ ] Quitar “micro-backoffice feel” y alinear acciones, pills y helpers con el resto del estudio.
- [ ] Mantener funcionalidad intacta.

## Chunk 3: Coherencia final y documentacion

### Task 5: Pasada de consistencia fina

**Files:**
- Modify: `F:/_PROYECTOS/x-studio/src/components/brand-dna/BrandDNABoard.tsx`
- Modify: `F:/_PROYECTOS/x-studio/docs/UI_SYSTEM_RULES.md`
- Modify: `F:/_PROYECTOS/x-studio/docs/TECHNICAL_REFERENCE.md`

- [ ] Revisar estados activos/inactivos, radios, alturas de botones, tono de labels, divisores y modales auxiliares.
- [ ] Documentar cualquier regla nueva de sistema que haya aparecido en Brand Kit.

### Task 6: Verificacion autonoma

**Files:**
- No code changes required

- [ ] Ejecutar verificacion tecnica:
  - `npx tsc --noEmit --pretty false`
  - `npx vitest run src/components/studio/__tests__/ControlsPanel.test.ts`
  - `rg -n "Ã|Â|�" src docs`
- [ ] Ejecutar verificacion visual con `Chrome CDP` sobre `http://localhost:3000/brand-kit`
- [ ] Iterar si sigue quedando algun bloque ajeno al lenguaje visual de `image` y `carousel`
