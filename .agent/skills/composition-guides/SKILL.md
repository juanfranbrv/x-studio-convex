---
name: composition-guides
description: Guía para la creación de esquemas compositivos flexibles para IA generativa de imágenes. Proporciona instrucciones sobre cómo definir áreas de interés, pesos visuales y estructuras espaciales sin restringir el estilo artístico o la paleta de colores.
---

# Composition Guides (Guías de Composición)

Este skill traduce la intención comunicativa del usuario (el propósito o intent de la publicación) en un sistema de diseño visual coherente. No se limita a organizar elementos; define la atmósfera, la jerarquía y la psicología visual necesaria para que el mensaje cumpla su función.

## Cuándo usar este skill

- Cuando se necesita que una imagen tenga una estructura específica (ej. "sujeto a la izquierda, espacio negativo a la derecha").
- Al planificar layouts complejos para web, posters o arte conceptual.
- Para evitar que la IA genere composiciones genéricas o centradas por defecto.
- Cuando se desea iterar sobre una misma estructura con diferentes estilos visuales.

## Principios de Composición Flexible

En lugar de dictar objetos exactos, utiliza descriptores de **Áreas** y **Vectores de Atención**:

1.  **Regla de los Tercios Descriptiva**: Divide el lienzo mentalmente y asigna importancia a las intersecciones.
2.  **Pesos Visuales**: Define zonas de "alta densidad" (donde ocurre la acción) y zonas de "reposo" (espacio negativo).
3.  **Líneas de Guía**: Sugiere flujos visuales (curvas en S, diagonales, triángulos) para dirigir la mirada del espectador.
4.  **Enmarcado (Framing)**: Define elementos periféricos que encierren el área de interés central.

## Cómo aplicar este skill

Para generar una guía de composición, sigue estos pasos:

1.  **Identificar el Layout principal**: Consulta `references/composition-principles.md` para elegir un esquema (ej. Triángulo Dorado, Espiral de Fibonacci).
2.  **Describir las Zonas**: Utiliza coordenadas relativas (superior-derecha, tercio inferior) para situar los elementos clave.
3.  **Definir la Intención Narrativa**: Explica *por qué* los elementos están ahí (ej. "el vacío a la izquierda crea sensación de soledad").
4.  **Generar el Prompt de Estructura**: Crea una descripción técnica de la composición para ser integrada en el prompt final de la imagen.

## Referencias Disponibles

- `references/composition-principles.md`: Catálogo de esquemas compositivos clásicos y modernos.
- `references/prompt-templates.md`: Plantillas para traducir layouts en lenguaje que las IAs generativas entienden mejor.
- `references/layout-instagram-quote.md`: Estructura específica para citas y frases destacadas.
- `references/layout-official-announcement.md`: Estructura rígida para comunicados y noticias oficiales.
