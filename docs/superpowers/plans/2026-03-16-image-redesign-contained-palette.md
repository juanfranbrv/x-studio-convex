# Plan de rediseño contenido para `/image`

Fecha: 2026-03-16
Estado: en progreso
Ambito: solo `/image`

## Objetivo

Llevar `/image` a una estetica SaaS creativa mas cercana a la direccion marcada por Juanfran:

- luminosa
- limpia
- con sensacion de herramienta visual seria
- con una paleta contenida, pero algo mas rica que `primary` + `secondary`

El objetivo no es rediseñar todo el producto ni tocar `/studio`. La mision es mejorar la percepcion de producto de `/image` manteniendo intacta la logica de generacion, sesiones, referencias, edicion y guardado.

## Decisiones ya fijadas

1. El tema es global y se gestiona solo desde `/admin`.
2. `/settings` ya no debe controlar colores.
3. La paleta debe seguir siendo contenida.
4. La ampliacion correcta de paleta no es abrir colores arbitrarios por pantalla, sino derivar tokens semanticos desde `theme_primary` y `theme_secondary`.

## Estado actual util

Ya esta implementado:

- gobernanza del tema desde Admin
- eliminacion de overrides de color por usuario
- derivacion base de tokens semanticos en `src/lib/theme-colors.ts`
- primera mejora del shell global: `DashboardLayout`, `Sidebar`, `Header`
- algunos ajustes visuales en auth
- recuperacion del scroll del panel central y del panel derecho de `/image`
- refuerzo estructural en `DashboardLayout`, `src/app/image/page.tsx` y el shell de controles

No esta cerrado todavia:

- rediseño visual especifico de `/image`
- validacion visual completa del modulo autenticado
- normalizacion visual de paneles y canvas de `/image`

## Restricciones duras

No tocar:

- logica de generacion de imagen
- flujo de sesiones
- referencias de Brand Kit
- debug prompt
- comportamiento funcional de edicion
- `/studio` como superficie general

Solo se puede tocar:

- shell visual
- jerarquia de superficies
- composicion y espaciado
- acabados visuales
- microinteracciones suaves
- uso consistente de tokens semanticos

## Riesgo principal detectado

El scroll en `/image` es critico.

Regla operativa:

- comprobar scroll vertical del panel central
- comprobar scroll vertical del panel derecho
- revisar siempre `overflow-hidden`, `min-h-0`, `flex-1` y contenedores intermedios
- validar desktop y mobile antes de cerrar una iteracion visual

## Progreso real de esta sesion

Completado:

- scroll recuperado segun validacion manual de Juanfran
- compilacion TypeScript correcta
- base visual segura aplicada en superficies compartidas:
  - `panelStyles`
  - `SectionHeader`
  - `ThumbnailHistory`
  - barra de accion inferior de `/image`
  - contenedor principal de `CanvasPanel`
  - controles flotantes del canvas
- primera correccion de ritmo vertical en `src/app/image/page.tsx`:
  - gap entre header y workspace
  - gap entre preview y `Session Variations`
  - compactacion de la barra inferior
- correccion de jerarquia visual en `CanvasPanel`:
  - mas aire entre la cabecera flotante y el lienzo
  - reduccion del efecto tarjeta dentro de tarjeta en preview

Pendiente inmediato:

- refinar el canvas central sin reintroducir regresiones de overflow
- validar visualmente `/image` autenticado con navegador automatizado cuando la capa de Chrome deje de bloquear la sesion
- decidir si conviene una pasada ligera sobre `ControlsPanel` o dejar la densidad interna para el final

## Direccion visual recomendada para `/image`

### 1. Shell general

Convertir `/image` en un workspace con tres sensaciones claras:

- panel de control refinado
- lienzo central protagonista
- barra de accion inferior integrada

No debe sentirse como dashboard con widgets, sino como laboratorio creativo.

### 2. Paleta

Usar solo tokens semanticos derivados:

- `primary`
- `secondary`
- `accent`
- `surface`
- `surfaceAlt`
- `muted`
- `border`
- `input`
- `ring`

Evitar nuevos hex hardcodeados para UI estructural.

### 3. Controles

El panel derecho debe sentirse mas editorial y menos tecnico:

- cards mas suaves
- headers de seccion mas claros
- mejor ritmo vertical
- menos sensacion de bloque apilado sin jerarquia

### 4. Canvas

El panel central debe parecer el heroe del modulo:

- marco mas limpio
- controles flotantes mejor integrados
- empty states mas pulidos
- referencias y overlays mas coherentes con la paleta

### 5. Historial y accion

- historial de miniaturas con mejor tacto visual
- barra inferior de edicion/generacion mas premium
- CTA fuerte, pero no griton

## Fases de implementacion

### Fase 1. Recuperar fiabilidad visual

Objetivo: asegurar que el rediseño no rompe scroll ni layout.

Tareas:

1. auditar la cadena de contenedores de `/image`
2. confirmar que elemento debe scrollear en panel central
3. confirmar que elemento debe scrollear en panel derecho
4. estabilizar `min-h-0`, `overflow-y-auto` y `overflow-hidden`
5. validar desktop y mobile

Estado:

- completada a nivel estructural
- scroll recuperado segun validacion manual
- validacion automatica en navegador aun bloqueada por sesion persistente de Chrome/Playwright

### Fase 2. Mejorar shell de `/image`

Objetivo: elevar el modulo sin tocar logica.

Tareas:

1. refinar `src/app/image/page.tsx`
2. mejorar barra de accion inferior
3. mejorar estado sin Brand Kit
4. ajustar separacion entre preview y controles

Estado:

- en progreso
- barra de accion inferior retocada
- estado sin Brand Kit mejorado ligeramente
- ritmo vertical principal corregido en la composicion de la pagina
- jerarquia del preview simplificada para evitar doble contenedor visual

### Fase 3. Panel derecho

Objetivo: hacer que el panel de control parezca producto creativo pulido.

Archivos candidatos:

- `src/components/studio/shared/panelStyles.ts`
- `src/components/studio/shared/SectionHeader.tsx`
- `src/components/studio/ControlsPanel.tsx`

Tareas:

1. rehacer superficie base de cards
2. mejorar icon badges de encabezados
3. refinar densidad y espaciado
4. mantener accesibilidad y legibilidad

Estado:

- en progreso
- base de cards y encabezados ya retocada
- densidad interna de `ControlsPanel` aun pendiente

### Fase 4. Canvas central

Objetivo: que el canvas tenga presencia sin convertirse en carnaval.

Archivos candidatos:

- `src/components/studio/CanvasPanel.tsx`
- `src/components/studio/ThumbnailHistory.tsx`

Tareas:

1. mejorar fondo y contenedor del canvas
2. integrar mejor los controles flotantes
3. mejorar empty state
4. mejorar historial de variaciones
5. revisar overlays de referencias para que sigan funcionando sin parecer pegotes

Estado:

- iniciado parcialmente con el historial, el contenedor principal y los botones flotantes
- tocar con cuidado porque es la zona con mas riesgo de regresion de scroll y overflow

### Fase 5. Verificacion

Obligatorio antes de cerrar:

1. `npx tsc --noEmit`
2. validacion visual en navegador
3. comprobar scroll central
4. comprobar scroll derecho
5. comprobar estado con imagen generada
6. comprobar estado sin imagen generada
7. comprobar mobile drawer
8. ejecutar anti-mojibake:
   `rg -n "Ã|Â|�" src`

## Criterios de exito

El rediseño de `/image` se considerara bueno si:

1. se percibe mas cercano a un SaaS creativo premium
2. mantiene una paleta contenida y coherente
3. no introduce colores hardcodeados innecesarios
4. no rompe scroll
5. no rompe sesiones, generacion ni edicion
6. no invade `/studio`

## Siguiente paso recomendado

Retomar por Fase 4 con una pasada pequena y controlada sobre `CanvasPanel`, no con una reescritura grande.
