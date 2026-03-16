# Right Panel Typography Pass Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unificar la jerarquía visual del panel derecho de imagen tomando la tarjeta de historial como referencia para cabeceras, tipografía base y desplegables.

**Architecture:** La pasada se concentra en `ControlsPanel` y en los subcomponentes que renderizan controles visibles dentro del rail derecho. Se evitarán cambios de comportamiento o lógica de negocio; solo se tocarán las capas de presentación reutilizables y los puntos donde la escala tipográfica sigue siendo demasiado pequeña.

**Tech Stack:** Next.js, React, Tailwind CSS, shadcn/ui, Vitest, Playwright

---

### Task 1: Definir el patrón visual reutilizable

**Files:**
- Modify: `src/components/studio/shared/SectionHeader.tsx`
- Modify: `src/components/studio/ControlsPanel.tsx`

- [ ] Añadir capacidad de personalizar icono y título en `SectionHeader` sin romper usos existentes.
- [ ] Aplicar en `ControlsPanel` un patrón premium consistente para cabeceras de tarjeta.
- [ ] Normalizar el `Select` de intención/diseño con la misma voz visual del selector de historial.

### Task 2: Subir el suelo tipográfico del panel derecho

**Files:**
- Modify: `src/components/studio/ControlsPanel.tsx`
- Modify: `src/components/studio/creation-flow/ContentImageCard.tsx`
- Modify: `src/components/studio/creation-flow/StyleImageCard.tsx`
- Modify: `src/components/studio/creation-flow/AuxiliaryLogosCard.tsx`

- [ ] Subir títulos, labels y helper text que hoy siguen en `10px`/`11px`.
- [ ] Hacer los botones compactos pero legibles en subtarjetas.
- [ ] Mantener densidad vertical razonable sin introducir microcopy comprimido.

### Task 3: Verificación

**Files:**
- Modify: `src/components/studio/__tests__/ControlsPanel.test.ts`

- [ ] Actualizar la regresión para fijar la nueva dirección visual base.
- [ ] Ejecutar `npx vitest run src/components/studio/__tests__/ControlsPanel.test.ts`.
- [ ] Ejecutar `rg -n "Ã|Â|�" src`.
- [ ] Revisar visualmente `/image` en navegador para confirmar jerarquía y consistencia.
