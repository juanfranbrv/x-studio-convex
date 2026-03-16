# Header Typography Restyle Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recalibrar la jerarquía tipográfica de la cabecera para que se sienta más Canva/moderno SaaS, con tamaños fluidos pero con un mínimo legible en desktop en todos los breakpoints existentes.

**Architecture:** El cambio se limita a la cabecera y sus piezas inmediatas para validar la nueva escala sin contaminar todavía el resto de la app. La estrategia es subir el suelo tipográfico, aplicar `clamp()` solo donde aporta continuidad real entre breakpoints y preservar densidad funcional en desktop sin inflar la UI.

**Tech Stack:** Next.js, React 19, Tailwind CSS v4, shadcn/ui, i18next, Vitest

---

## Chunk 1: Definir la escala tipográfica objetivo de la cabecera

### Task 1: Mapear piezas y fijar mínimos legibles

**Files:**
- Modify: `F:/_PROYECTOS/x-studio/src/components/layout/Header.tsx`
- Modify: `F:/_PROYECTOS/x-studio/src/components/layout/CreditsBadge.tsx`
- Modify: `F:/_PROYECTOS/x-studio/src/components/layout/LanguageSwitcher.tsx`
- Reference: `F:/_PROYECTOS/x-studio/src/components/layout/MobileMenu.tsx`

- [ ] **Step 1: Identificar los textos de cabecera que hoy se sienten demasiado pequeños**

Checklist:
- nombre de producto
- nombre de marca activa
- inicial/favicon fallback
- CTA de nueva brand kit
- badge de créditos
- selector de idioma
- icon button de admin si necesita acompañamiento óptico

- [ ] **Step 2: Definir la escala base que se quiere validar solo en cabecera**

Objetivo de escala:
- `header-title`: entre `1.125rem` y `1.5rem`
- `header-control-label`: entre `0.95rem` y `1rem`
- `header-meta`: no bajar de `0.875rem`
- `header-micro`: reservarlo solo para datos no críticos; no usarlo como patrón principal

- [ ] **Step 3: Anotar qué textos NO deben crecer todavía**

Mantener contenidos discretos:
- porcentajes de completitud dentro del dropdown
- labels auxiliares muy secundarios del menú
- tooltips y metadata no visible por defecto

## Chunk 2: Aplicar la escala a la cabecera principal

### Task 2: Ajustar `Header.tsx` con tipografía fluida y jerarquía más clara

**Files:**
- Modify: `F:/_PROYECTOS/x-studio/src/components/layout/Header.tsx`
- Test: `F:/_PROYECTOS/x-studio/src/components/layout/__tests__/HeaderTypography.test.ts`

- [ ] **Step 1: Escribir el test de regresión para la escala de la cabecera**

```ts
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const source = fs.readFileSync(
  path.resolve(__dirname, '../Header.tsx'),
  'utf8'
)

describe('Header typography scale', () => {
  it('usa tamaños fluidos y evita labels demasiado pequeños en la cabecera visible', () => {
    expect(source).toContain('text-[clamp(')
    expect(source).not.toContain('text-xs font-medium leading-tight md:text-[0.95rem]')
  })
})
```

- [ ] **Step 2: Ejecutar el test para confirmar que falla**

Run: `npx vitest run src/components/layout/__tests__/HeaderTypography.test.ts`
Expected: FAIL porque la cabecera aún usa clases pequeñas no recalibradas.

- [ ] **Step 3: Subir la jerarquía visible en `Header.tsx`**

Cambios esperados:
- nombre del producto con `clamp()` y más presencia
- nombre de la marca activa con tamaño base superior
- fallback de inicial con mejor lectura
- CTA “new brand kit” con label un punto mayor
- revisar alturas de controles para que el aumento de texto no rompa alineación

- [ ] **Step 4: Ejecutar el test para validar que pasa**

Run: `npx vitest run src/components/layout/__tests__/HeaderTypography.test.ts`
Expected: PASS

- [ ] **Step 5: Verificar visualmente el equilibrio en desktop**

Run:
- `npm run dev:debug-browser`
- revisar la cabecera en breakpoints desktop configurados

Expected:
- la cabecera se ve más premium y legible
- ningún texto principal se siente microscópico
- no aparecen saltos raros entre `md`, `lg`, `xl`

## Chunk 3: Ajustar piezas accesorias de la cabecera

### Task 3: Reescalar badge de créditos y selector de idioma

**Files:**
- Modify: `F:/_PROYECTOS/x-studio/src/components/layout/CreditsBadge.tsx`
- Modify: `F:/_PROYECTOS/x-studio/src/components/layout/LanguageSwitcher.tsx`
- Test: `F:/_PROYECTOS/x-studio/src/components/layout/__tests__/HeaderTypography.test.ts`

- [ ] **Step 1: Ampliar el test con expectativas sobre elementos accesorios**

Añadir comprobaciones para evitar:
- `text-xs` como default visible en selector de idioma
- badge de créditos con lectura demasiado pequeña

- [ ] **Step 2: Hacer el ajuste mínimo en `CreditsBadge.tsx`**

Subir:
- número visible
- label de estados (`waitlist`, `suspended`, placeholder)
- mantener la densidad del badge sin volverlo tosco

- [ ] **Step 3: Hacer el ajuste mínimo en `LanguageSwitcher.tsx`**

Subir:
- código de idioma visible
- ajustar padding/altura si el nuevo tamaño lo pide

- [ ] **Step 4: Ejecutar el test y confirmar verde**

Run: `npx vitest run src/components/layout/__tests__/HeaderTypography.test.ts`
Expected: PASS

## Chunk 4: Verificación responsive de desktop

### Task 4: Validar que la nueva escala sigue siendo funcional en todos los breakpoints desktop

**Files:**
- Verify: `F:/_PROYECTOS/x-studio/src/components/layout/Header.tsx`
- Verify: `F:/_PROYECTOS/x-studio/src/components/layout/CreditsBadge.tsx`
- Verify: `F:/_PROYECTOS/x-studio/src/components/layout/LanguageSwitcher.tsx`

- [ ] **Step 1: Levantar entorno local**

Run: `npm run dev:debug-browser`
Expected: app local y navegador de debug listos.

- [ ] **Step 2: Revisar breakpoints desktop relevantes**

Viewport objetivo:
- `1280px`
- `1440px`
- `1536px`
- `1728px` si cabe en la revisión manual

- [ ] **Step 3: Confirmar criterios de aceptación**

Checklist:
- nombre de producto con suficiente autoridad visual
- marca activa legible sin parecer caption
- badge de créditos visible de un vistazo
- selector de idioma no parece micro-control
- cabecera sigue cabiendo sin romper layout ni truncados absurdos

- [ ] **Step 4: Ejecutar comprobación anti-mojibake si hubo cambios de copy**

Run: `rg -n "Ã|Â|�" src`
Expected: sin coincidencias nuevas relacionadas con el cambio

- [ ] **Step 5: Commit local del tramo de cabecera**

```bash
git add src/components/layout/Header.tsx src/components/layout/CreditsBadge.tsx src/components/layout/LanguageSwitcher.tsx src/components/layout/__tests__/HeaderTypography.test.ts docs/superpowers/plans/2026-03-16-header-typography-restyle.md
git commit -m "feat: recalibrate header typography scale"
```
