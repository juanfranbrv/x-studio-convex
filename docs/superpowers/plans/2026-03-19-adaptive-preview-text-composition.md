# Adaptive Preview Text Composition Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un motor de composición adaptativa para la preview de `image` que distribuya y presente los textos de forma aceptable y consistente en desktop y mobile según tamaño real del canvas y carga textual.

**Architecture:** La solución deja atrás el ajuste puramente CSS con `clamp()` y zonas fijas, y pasa a un sistema híbrido: medición real del canvas + análisis de carga de texto + resolución de un `layout mode` semántico (`compact`, `balanced`, `airy`). Los textos seguirán editándose con medición por espejo, pero la composición global se gobernará por un plan de layout calculado en JS y aplicado mediante variables CSS de zona, anchura y separación.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, CSS custom properties, Vitest.

---

## File Map

**Create:**
- `F:\_PROYECTOS\x-studio\src\components\studio\previewCompositionMetrics.ts`
  - calcula métricas del canvas y de la carga textual
- `F:\_PROYECTOS\x-studio\src\components\studio\previewCompositionPlan.ts`
  - traduce métricas a un plan de composición (`layout mode`, densidad, tokens)
- `F:\_PROYECTOS\x-studio\src\components\studio\usePreviewComposition.ts`
  - hook reactivo para observar el canvas y devolver el plan aplicable
- `F:\_PROYECTOS\x-studio\src\components\studio\__tests__\PreviewCompositionPlan.test.ts`
  - tests unitarios del motor de composición

**Modify:**
- `F:\_PROYECTOS\x-studio\src\components\studio\CanvasPanel.tsx`
  - exponer contenedor medible y pasar tamaño útil del canvas a la preview
- `F:\_PROYECTOS\x-studio\src\components\studio\TextLayersEditor.tsx`
  - consumir el plan de composición y dejar de codificar anchos/gaps “a ciegas”
- `F:\_PROYECTOS\x-studio\src\components\studio\PreviewEditableTextBlock.tsx`
  - aceptar tokens derivados del plan y respetar límites por zona
- `F:\_PROYECTOS\x-studio\src\components\studio\__tests__\PreviewTextLayout.test.ts`
  - adaptar expectativas al nuevo contrato
- `F:\_PROYECTOS\x-studio\src\app\globals.css`
  - reducir CSS a tokens base y variables consumidas por el plan
- `F:\_PROYECTOS\x-studio\docs\TECHNICAL_REFERENCE.md`
  - documentar el motor adaptativo y las reglas de mantenimiento

**Potentially inspect while implementing:**
- `F:\_PROYECTOS\x-studio\src\hooks\useCreationFlow.ts`
- `F:\_PROYECTOS\x-studio\src\components\studio\CanvasPanel.tsx`
- `F:\_PROYECTOS\x-studio\src\components\studio\previewTextLayout.ts`
- `F:\_PROYECTOS\x-studio\docs\UI_SYSTEM_RULES.md`

---

## Chunk 1: Composition Model

### Task 1: Definir las métricas de composición

**Files:**
- Create: `F:\_PROYECTOS\x-studio\src\components\studio\previewCompositionMetrics.ts`
- Test: `F:\_PROYECTOS\x-studio\src\components\studio\__tests__\PreviewCompositionPlan.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it('calcula presion textual y bucket de viewport a partir del canvas y los textos visibles', () => {
  const metrics = buildPreviewCompositionMetrics({
    canvasWidth: 420,
    canvasHeight: 560,
    supportCount: 4,
    metaCount: 2,
    headlineLength: 34,
    supportLengths: [24, 27, 26, 38],
    metaLengths: [11, 16],
    hasCta: true,
    hasUrl: true,
  })

  expect(metrics.viewportBucket).toBe('narrow')
  expect(metrics.textPressure).toBe('high')
  expect(metrics.totalVisibleBlocks).toBe(8)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/studio/__tests__/PreviewCompositionPlan.test.ts`
Expected: FAIL because the module does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Implement:
- tipo `PreviewCompositionMetricsInput`
- función `buildPreviewCompositionMetrics(input)`
- reglas iniciales:
  - `viewportBucket`: `narrow | medium | wide`
  - `textPressure`: `low | medium | high`
  - `totalVisibleBlocks`
  - `totalCharacters`

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/studio/__tests__/PreviewCompositionPlan.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```powershell
git add src/components/studio/previewCompositionMetrics.ts src/components/studio/__tests__/PreviewCompositionPlan.test.ts
git commit -m "feat: add preview composition metrics"
```

### Task 2: Definir el plan adaptativo de layout

**Files:**
- Create: `F:\_PROYECTOS\x-studio\src\components\studio\previewCompositionPlan.ts`
- Test: `F:\_PROYECTOS\x-studio\src\components\studio\__tests__\PreviewCompositionPlan.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it('resuelve layout compact para canvas estrecho con alta carga textual', () => {
  const plan = buildPreviewCompositionPlan({
    viewportBucket: 'narrow',
    textPressure: 'high',
    totalVisibleBlocks: 8,
    canvasWidth: 420,
    canvasHeight: 560,
  })

  expect(plan.mode).toBe('compact')
  expect(plan.zoneSupportMaxCh).toBeGreaterThan(plan.zoneMetaMaxCh)
  expect(plan.stackGap).toBeLessThan(plan.desktopBalanced.stackGap)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/studio/__tests__/PreviewCompositionPlan.test.ts`
Expected: FAIL because `buildPreviewCompositionPlan` does not exist.

- [ ] **Step 3: Write minimal implementation**

Implement:
- tipo `PreviewCompositionPlan`
- modos: `compact`, `balanced`, `airy`
- tokens por plan:
  - `zoneHeadlineMaxCh`
  - `zoneSupportMaxCh`
  - `zoneMetaMaxCh`
  - `headlineMaxLines`
  - `supportMaxLines`
  - `metaMaxLines`
  - `stackGap`
  - `supportGap`
  - `metaGap`
  - `headlineScale`
  - `supportScale`
  - `metaScale`

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/studio/__tests__/PreviewCompositionPlan.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```powershell
git add src/components/studio/previewCompositionPlan.ts src/components/studio/__tests__/PreviewCompositionPlan.test.ts
git commit -m "feat: add adaptive preview composition plan"
```

---

## Chunk 2: Reactive Canvas Measurement

### Task 3: Crear el hook que observe el canvas

**Files:**
- Create: `F:\_PROYECTOS\x-studio\src\components\studio\usePreviewComposition.ts`
- Modify: `F:\_PROYECTOS\x-studio\src\components\studio\CanvasPanel.tsx`
- Test: `F:\_PROYECTOS\x-studio\src\components\studio\__tests__\PreviewCompositionPlan.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it('usa el tamano real del canvas para devolver un plan reactivo', () => {
  const result = resolvePreviewCompositionForCanvas({
    canvasWidth: 320,
    canvasHeight: 520,
    headline: 'Reto: Programa tu propio Semaforo',
    support: ['A', 'B', 'C'],
    meta: ['96 149 39 01'],
    hasCta: true,
    hasUrl: false,
  })

  expect(result.mode).toBe('compact')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/studio/__tests__/PreviewCompositionPlan.test.ts`
Expected: FAIL because the resolver/hook helpers do not exist.

- [ ] **Step 3: Write minimal implementation**

Implement:
- helper puro `resolvePreviewCompositionForCanvas(...)`
- hook `usePreviewComposition(ref, textLayoutLike)`
- `ResizeObserver` del canvas contenedor
- degradación segura si `ResizeObserver` no existe

- [ ] **Step 4: Wire into CanvasPanel**

Expose a stable preview container ref in `CanvasPanel.tsx` and pass the data needed by `TextLayersEditor`.

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/components/studio/__tests__/PreviewCompositionPlan.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```powershell
git add src/components/studio/usePreviewComposition.ts src/components/studio/CanvasPanel.tsx src/components/studio/__tests__/PreviewCompositionPlan.test.ts
git commit -m "feat: observe preview canvas for adaptive composition"
```

---

## Chunk 3: Desktop Composition Migration

### Task 4: Aplicar el plan al headline, support y meta

**Files:**
- Modify: `F:\_PROYECTOS\x-studio\src\components\studio\TextLayersEditor.tsx`
- Modify: `F:\_PROYECTOS\x-studio\src\components\studio\PreviewEditableTextBlock.tsx`
- Test: `F:\_PROYECTOS\x-studio\src\components\studio\__tests__\PreviewTextLayout.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it('consume tokens del plan adaptativo en lugar de maximos internos hardcodeados', () => {
  expect(textLayersEditorSource).toContain('usePreviewComposition')
  expect(textLayersEditorSource).not.toContain('maxWidthCh={52}')
  expect(textLayersEditorSource).not.toContain('maxWidthCh={74}')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/studio/__tests__/PreviewTextLayout.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement minimal code**

Change `TextLayersEditor.tsx` to:
- recibir o calcular `compositionPlan`
- pasar límites y escalas desde el plan
- aplicar `data-layout-mode`
- dejar de usar números de anchura internos por zona

Update `PreviewEditableTextBlock.tsx` to:
- aceptar `minWidthCh` / `maxWidthCh` / `maxLines`
- soportar `data-layout-mode`

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/components/studio/__tests__/PreviewTextLayout.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```powershell
git add src/components/studio/TextLayersEditor.tsx src/components/studio/PreviewEditableTextBlock.tsx src/components/studio/__tests__/PreviewTextLayout.test.ts
git commit -m "feat: drive preview text zones from adaptive plan"
```

### Task 5: Reducir globals.css a tokens base

**Files:**
- Modify: `F:\_PROYECTOS\x-studio\src\app\globals.css`
- Test: `F:\_PROYECTOS\x-studio\src\components\studio\__tests__\PreviewTextLayout.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it('mantiene solo tokens base y deja la decision de layout al plan adaptativo', () => {
  expect(globalsSource).toContain('--tl-head-size: clamp(')
  expect(globalsSource).not.toContain('--tl-zone-support-max: min(90cqi, 74ch);')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/studio/__tests__/PreviewTextLayout.test.ts`
Expected: FAIL

- [ ] **Step 3: Minimal implementation**

In `globals.css`:
- conservar tokens base fluidos
- eliminar “presupuestos finales” hardcodeados de zona
- mover el detalle de composición al plan JS aplicado como CSS vars inline

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/components/studio/__tests__/PreviewTextLayout.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```powershell
git add src/app/globals.css src/components/studio/__tests__/PreviewTextLayout.test.ts
git commit -m "refactor: keep preview css tokens base-only"
```

---

## Chunk 4: Mobile Strategy

### Task 6: Añadir heurística mobile-first de composición

**Files:**
- Modify: `F:\_PROYECTOS\x-studio\src\components\studio\previewCompositionMetrics.ts`
- Modify: `F:\_PROYECTOS\x-studio\src\components\studio\previewCompositionPlan.ts`
- Test: `F:\_PROYECTOS\x-studio\src\components\studio\__tests__\PreviewCompositionPlan.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it('prioriza compactacion controlada en mobile sin caer en microtipografia', () => {
  const plan = buildPreviewCompositionPlan({
    viewportBucket: 'narrow',
    textPressure: 'medium',
    totalVisibleBlocks: 6,
    canvasWidth: 320,
    canvasHeight: 568,
  })

  expect(plan.mode).toBe('compact')
  expect(plan.supportScale).toBeGreaterThanOrEqual(0.92)
  expect(plan.stackGap).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/studio/__tests__/PreviewCompositionPlan.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement mobile rules**

Rules:
- mobile no baja de mínimos legibles
- compacta por orden:
  1. gaps
  2. top offsets
  3. anchura de zona
  4. escalado menor de `support/meta`
- `headline` mantiene prioridad sobre `meta`
- `brand chip` y `cta` se preservan como anclas estables

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/components/studio/__tests__/PreviewCompositionPlan.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```powershell
git add src/components/studio/previewCompositionMetrics.ts src/components/studio/previewCompositionPlan.ts src/components/studio/__tests__/PreviewCompositionPlan.test.ts
git commit -m "feat: add mobile adaptive composition rules"
```

### Task 7: Validación visual de mobile

**Files:**
- Modify: `F:\_PROYECTOS\x-studio\src\components\studio\TextLayersEditor.tsx`
- Modify: `F:\_PROYECTOS\x-studio\src\components\studio\CanvasPanel.tsx`

- [ ] **Step 1: Manual/browser verification script**

Check at least:
- 320x568
- 375x812
- 390x844
- 430x932

Cases:
- poco texto
- carga media
- carga alta
- con URL
- sin URL

- [ ] **Step 2: Fix only issues found in validation**

Expected acceptable outcomes:
- no overlap
- no line breaks absurdos
- CTA visible
- acciones tocables
- jerarquía legible

- [ ] **Step 3: Commit**

```powershell
git add src/components/studio/TextLayersEditor.tsx src/components/studio/CanvasPanel.tsx
git commit -m "fix: polish mobile preview composition"
```

---

## Chunk 5: Session Safety and Documentation

### Task 8: Blindar estado de sesión frente a preferencias de kit

**Files:**
- Modify: `F:\_PROYECTOS\x-studio\src\components\studio\ControlsPanel.tsx`
- Modify: `F:\_PROYECTOS\x-studio\src\hooks\useCreationFlow.ts`
- Test: targeted or existing test file if available

- [ ] **Step 1: Write failing test or regression assertion**

Create a regression assertion for:
- toggling `ctaUrlEnabled` in current session must not immediately revert

- [ ] **Step 2: Run to verify failure**

Use the smallest available test harness or add a pure helper for the state transition.

- [ ] **Step 3: Implement minimal fix**

Rules:
- preview/session state wins immediately
- brand kit persistence must not rehydrate over an active user interaction

- [ ] **Step 4: Run tests**

Run:
- `npx vitest run src/components/studio/__tests__/PreviewTextLayout.test.ts`
- any new targeted regression test

- [ ] **Step 5: Commit**

```powershell
git add src/components/studio/ControlsPanel.tsx src/hooks/useCreationFlow.ts
git commit -m "fix: decouple preview session text state from brand kit rehydration"
```

### Task 9: Document the adaptive system

**Files:**
- Modify: `F:\_PROYECTOS\x-studio\docs\TECHNICAL_REFERENCE.md`

- [ ] **Step 1: Update technical reference**

Document:
- composition metrics
- layout modes
- desktop/mobile rules
- maintenance rule: no local hardcoded width patches without touching the plan engine

- [ ] **Step 2: Sanity-check docs**

Run:
`rg -n "adaptive composition|layout mode|preview" docs/TECHNICAL_REFERENCE.md`

- [ ] **Step 3: Commit**

```powershell
git add docs/TECHNICAL_REFERENCE.md
git commit -m "docs: document adaptive preview composition system"
```

---

## Execution Notes

- No depender solo de breakpoints del viewport.
- El motor debe decidir usando:
  - ancho real del canvas
  - alto real del canvas
  - cantidad de bloques
  - longitud de los textos
  - presencia de CTA/URL
- El sistema debe ser aceptable en todos los tamaños, no “perfecto” en uno y roto en otro.
- Mobile debe compartir el mismo modelo de composición que desktop; solo cambian los presupuestos y prioridades.
- No volver a introducir ajustes locales en `ch` o `cqi` sin pasar por el plan adaptativo.

## Verification Checklist

- `npx vitest run src/components/studio/__tests__/PreviewCompositionPlan.test.ts`
- `npx vitest run src/components/studio/__tests__/PreviewTextLayout.test.ts`
- `npx tsc --noEmit --pretty false`
- `rg -n "Ã|Â|�" src`
- Validación visual en navegador:
  - desktop estrecho
  - desktop amplio
  - mobile 320/375/390/430
  - con y sin URL
  - baja / media / alta carga textual

