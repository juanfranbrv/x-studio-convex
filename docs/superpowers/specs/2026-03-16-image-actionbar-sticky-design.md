# Especificacion de microajustes Image (action bar sticky y scrollbars)

## Contexto
Juanfran pide microajustes en el modulo Image:
- Barra de scroll pegada al borde derecho en panel central y panel derecho.
- Remate limpio del panel central.
- Action bar (textarea + boton Generar) dentro del panel derecho y fijo (sticky) siempre.
- Preparar un componente compartido para reutilizar en Carrusel, sin conectarlo aun.

## Objetivos
1. Replicar el comportamiento del action bar de Carrusel en Image (sticky en panel derecho).
2. Eliminar el margen de 1-2px entre scrollbar y borde de los paneles.
3. Limpiar el remate inferior del panel central (sin action bar en esa tarjeta).
4. Dejar un componente compartido listo para reusar en Carrusel.

## Enfoque
### Componente compartido
Crear `StudioActionBar` en `src/components/studio/shared/StudioActionBar.tsx` con:
- Layout vertical (textarea + boton).
- Estilos compatibles con el panel derecho.
- Props para estados de generacion, handlers y placeholders.

### Integracion en Image
- Panel derecho:
  - ControlsPanel arriba con scroll interno.
  - `StudioActionBar` en footer sticky, siempre visible.
- Panel central:
  - Solo preview.
  - Eliminar action bar inferior.
- Scrollbars:
  - Quitar padding derecho del contenedor con `thin-scrollbar`.
  - Aplicar padding al wrapper interno para no separar la scrollbar del borde.

## Alcance y no alcance
- En alcance: solo modulo Image.
- No en alcance: conectar el componente en Carrusel (solo preparado).

## Riesgos
- Ajustes de layout en desktop pueden afectar el ancho del panel derecho si se aplica padding incorrecto.
- El action bar debe mantener estados (generando/cancelando) sin romper la altura sticky.

## Validacion
- Revisar visualmente en desktop que:
  - Scrollbars queden pegadas al borde.
  - Action bar permanezca fijo abajo en el panel derecho.
  - Panel central no tenga action bar ni borde extra.
- Verificar que mobile mantiene comportamiento actual.
