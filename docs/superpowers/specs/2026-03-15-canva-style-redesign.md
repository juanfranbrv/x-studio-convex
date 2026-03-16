# Rediseño Visual Canva-Style — X-Studio

**Fecha**: 2026-03-15
**Estado**: Aprobado
**Rama**: `canva-style` (main intacta como fallback)

## Objetivo

Transformar la identidad visual de X-Studio de una estética glassmorphism/aero genérica a un estilo limpio, sólido y profesional inspirado en Canva. La app debe sentirse humana, accesible y diseñada por un equipo de producto real — no generada por IA.

## Decisiones de Diseño

### Tipografía
- **Fuente global**: Google Sans Flex (ya implementada)
- `--font-sans` y `--font-heading` apuntan a `'Google Sans Flex', system-ui, -apple-system, sans-serif`
- La carga se mantiene via Google Fonts link en `layout.tsx`

### Sistema de Esquemas de Color

Cada esquema define **6 tokens**:

| Token | Propósito |
|-------|-----------|
| `primary` | Botones principales, enlaces activos, acentos fuertes |
| `primary-foreground` | Texto sobre primary |
| `accent` | Hover states, badges, chips, secondary actions |
| `surface` | Fondo de cards, paneles, sidebar |
| `surface-alt` | Fondo alternativo para contraste entre secciones |
| `muted` | Texto secundario, placeholders, bordes suaves |

**Background de la app**: `#FFFFFF` o `#FAFAFA` (blanco limpio).

**6 esquemas predefinidos:**

1. **Violeta Canva** — primary `#7B61FF`, accent `#00C4CC`
2. **Ocean** — primary `#0B8AE0`, accent `#14B8A6`
3. **Sunset** — primary `#F56040`, accent `#FCAF45`
4. **Forest** — primary `#22C55E`, accent `#84CC16`
5. **Berry** — primary `#A855F7`, accent `#EC4899`
6. **Slate Pro** — primary `#475569`, accent `#6366F1`

Opción **custom**: el usuario elige primary y accent; surface, surface-alt, muted y primary-foreground se derivan automáticamente.

### Eliminaciones

- **Dark mode**: eliminado completamente (variables `.dark`, ThemeToggle, botones light/dark en settings)
- **Glassmorphism**: todas las clases `.glass-*`, `.glass-panel`, `.glass-card`, `.controls-panel` con backdrop-filter
- **Mesh gradient**: `.bg-mesh`, animación `mesh-flow`, gradientes decorativos
- **Sombras aero**: `--shadow-aero`, `--shadow-aero-lg`, `--shadow-aero-glow`, `.glow-vibrant`
- **Blur decorativo**: div con `blur-[100px]` en layout.tsx

### Nuevo Sistema Visual

**Border radius:**
- `--radius`: `0.5rem` (8px) — base
- `--radius-sm`: 4px
- `--radius-md`: 6px
- `--radius-lg`: 8px
- `--radius-xl`: 12px

**Sombras (Canva-style):**
- `--shadow-sm`: `0 1px 3px rgba(0,0,0,0.06)` — cards en reposo
- `--shadow-md`: `0 2px 8px rgba(0,0,0,0.08)` — elevación sutil
- `--shadow-lg`: `0 4px 16px rgba(0,0,0,0.12)` — modales, dropdowns

**Bordes:**
- Default: `1px solid #E5E7EB`
- Input focus: border cambia a `primary` del esquema

### Componentes Actualizados

**Button:**
- Radius hereda `rounded-lg` (8px)
- Hover: `translateY(-1px)` + sombra sutil
- Variant `default` usa `primary` del esquema

**Card:**
- Fondo sólido `surface`
- Borde `1px solid` token `border`
- Sombra `--shadow-sm`
- `rounded-xl` = 12px

**Input / Textarea:**
- Fondo blanco sólido
- Borde `#D1D5DB` en reposo, `primary` en focus
- Focus ring: primary al 20% opacidad

**Sidebar:**
- Fondo sólido `surface` (#F8F8F8)
- Sin backdrop-blur
- Item activo: fondo `primary` + texto blanco
- Item hover: ligeramente más oscuro que surface

**Header:**
- Fondo sólido blanco
- Borde inferior `#E5E7EB`
- Sin backdrop-blur ni ThemeToggle

**Settings:**
- Botones light/dark eliminados
- Presets evolucionan a 6 esquemas completos
- Color picker custom: primary + accent

### Intocable

- Responsive (media queries text-layer-editor, canvas-panel, carousel-script-preview)
- i18n (todo el sistema de traducción)
- Funcionalidad — solo cambia la capa visual
- `fontFamily` inline en Brand DNA / BrandingConfigurator (contenido del usuario)
- `fontFamily="monospace"` en CanvasPanel / CarouselCanvasPanel (coordenadas)
- Animaciones funcionales: `feedback-action`, `canvas-success-flash`, `animate-flash-highlight`

## Plan de Ejecución (7 Fases)

| Fase | Descripción | Archivos principales |
|------|-------------|---------------------|
| F1 | Eliminar dark mode | `globals.css`, `Header.tsx`, `ThemeToggle.tsx`, `SettingsManagementSection.tsx`, `layout.tsx` |
| F2 | Eliminar glassmorphism | `globals.css`, `layout.tsx`, `DashboardLayout.tsx` |
| F3 | Nuevo radius + sombras | `globals.css` |
| F4 | Superficies sólidas en layout | `Sidebar.tsx`, `Header.tsx` |
| F5 | Componentes base actualizados | `button.tsx`, `card.tsx`, `input.tsx`, `textarea.tsx` |
| F6 | Nuevo sistema de esquemas de color | `theme-colors.ts`, `DynamicThemeProvider.tsx`, `SettingsManagementSection.tsx`, `globals.css` |
| F7 | Limpieza final + verificación | Varios |

Cada fase es un commit independiente. Verificación visual entre cada fase.
