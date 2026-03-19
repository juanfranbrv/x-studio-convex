# Preview Fluid Text Zones Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rehacer la preview desktop para que la tipografía y las cajas de texto se gobiernen por zonas semánticas fluidas basadas en el tamaño real del canvas.

**Architecture:** La lógica de clasificación de textos se mueve a una utilidad dedicada para separar roles semánticos del JSX. `TextLayersEditor` pasa de una pila vertical genérica a un layout por zonas (`headline`, `support`, `meta`, `cta`) y la escala deja de depender de breakpoints globales rígidos para apoyarse en tokens fluidos con unidades de contenedor y anchos máximos por rol.

**Tech Stack:** React 19, TypeScript, Tailwind, CSS global con variables, Vitest.

---

## Chunk 1: Contrato de layout

### Task 1: Congelar el contrato visual del nuevo sistema

**Files:**
- Create: `src/components/studio/__tests__/PreviewTextLayout.test.ts`
- Modify: `src/components/studio/TextLayersEditor.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement the new semantic-zone contract**
- [ ] **Step 4: Run test to verify it passes**

## Chunk 2: Modelo semántico

### Task 2: Extraer la lógica de zonas y clasificación

**Files:**
- Create: `src/components/studio/previewTextLayout.ts`
- Modify: `src/components/studio/TextLayersEditor.tsx`
- Test: `src/components/studio/__tests__/PreviewTextLayout.test.ts`

- [ ] **Step 1: Write the failing test for classification**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `buildPreviewTextLayout` and role heuristics**
- [ ] **Step 4: Run test to verify it passes**

## Chunk 3: Integración y documentación

### Task 3: Integrar la nueva preview desktop y documentar la decisión

**Files:**
- Modify: `src/components/studio/TextLayersEditor.tsx`
- Modify: `src/app/globals.css`
- Modify: `docs/TECHNICAL_REFERENCE.md`

- [ ] **Step 1: Conectar `TextLayersEditor` al modelo de zonas**
- [ ] **Step 2: Sustituir breakpoints rígidos por tokens fluidos de contenedor**
- [ ] **Step 3: Documentar la decisión técnica en la referencia viva**
- [ ] **Step 4: Ejecutar verificación final**
