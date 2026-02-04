# Construccion del prompt del carrusel (vista modular)

## Introduccion para otra IA (contexto + problema)

Hola. Tengo una aplicacion que genera carruseles de imagenes a partir de un prompt del usuario. El flujo separa la parte de guion (texto y estructura narrativa) de la parte de render (imagenes por slide). El usuario elige numero de diapositivas, escribe el tema, y puede aportar imagen de referencia, colores de marca y logo. El sistema construye un prompt final por slide y envia ese prompt al generador de imagenes junto con las referencias visuales adjuntas.

El problema actual: la transferencia de estilo desde la imagen de referencia no se mantiene de forma consistente en todas las diapositivas. En algunas, el estilo se respeta; en otras, el modelo deriva a otra estetica. Necesito que revises el flujo modular para detectar donde puede diluirse el estilo (por ejemplo: conflicto con composicion, narrativa, paleta de marca, o reglas de consistencia). A continuacion tienes el desglose modular del proceso.

Pista clave: en la ultima diapositiva SIEMPRE se consigue trasladar el estilo correctamente. En las demas, a veces si y a veces no. Esto sugiere que la solucion podria estar en lo que cambia especificamente en la ultima diapositiva (reglas, bloques o ajustes de prompt exclusivos del cierre/CTA).

Este documento explica, a nivel de modulos, como se construye el prompt final para el generador de imagenes del carrusel. No incluye nombres de funciones ni codigo. La idea es que otra IA entienda el flujo completo y donde puede romperse la transferencia de estilo desde la imagen de referencia.

## 1) Mapa general (capas)

1. Entrada del usuario
2. Idioma y tono
3. Contexto de marca (Brand DNA)
4. Estructura narrativa
5. Composicion (layout base)
6. Guion por slide
7. Direccion visual / estilo
8. Reglas de consistencia
9. Paleta y contraste
10. Logos
11. Ensamblaje final
12. Referencias visuales adjuntas

## 2) Diagrama de flujo (texto)

[Usuario]
  -> (Prompt + numero de slides + formato + estilo + referencia + colores + logo)
     -> [Modulo Idioma/Tono]
        -> [Modulo Brand DNA]
           -> [Modulo Estructura Narrativa]
              -> [Modulo Composicion]
                 -> [Modulo Guion por Slide]
                    -> [Modulo Direccion Visual]
                       -> [Modulo Reglas de Consistencia]
                          -> [Modulo Paleta/Contraste]
                             -> [Modulo Logo]
                                -> [Ensamblaje Prompt Final por Slide]
                                   + [Adjuntos Visuales]
                                      -> (Generador de Imagenes)

## 3) Que aporta cada modulo

### 1. Entrada del usuario
- Define el tema, el numero de slides, el formato, y el estilo general.
- Determina si hay imagen de referencia y si hay logo.

### 2. Idioma y tono
- Fija el idioma en el que se redacta el contenido.
- Evita que la IA cambie de idioma en mitad del carrusel.

### 3. Contexto de marca (Brand DNA)
- Traduce el Brand Kit en directrices de tono, publico y personalidad.
- Afecta a la redaccion y al estilo visual (sensacion de marca).

### 4. Estructura narrativa
- Decide el rol de cada slide (gancho, contenido, cierre/CTA).
- Marca el ritmo: que slide atrae, cual desarrolla, cual cierra.

### 5. Composicion (layout base)
- Establece la estructura de bloques (textos, imagen, balance espacial).
- Fija el esqueleto visual que se mantiene entre slides.

### 6. Guion por slide
- Genera titulo, descripcion y una escena visual por slide.
- Aporta la parte semantica de cada diapositiva.

### 7. Direccion visual / estilo
- Si hay referencia visual, extrae rasgos de estilo: iluminacion, textura, medio, mood.
- Construye una guia creativa para que todo el carrusel pertenezca al mismo universo estetico.

### 8. Reglas de consistencia
- Refuerza continuidad: misma jerarquia tipografica, mismo tratamiento visual, misma estructura.
- Permite pequenas variaciones solo en hook y CTA, sin romper el sistema.

### 9. Paleta y contraste
- Aplica colores autorizados del Brand Kit con roles claros.
- Garantiza legibilidad y coherencia cromatica.

### 10. Logos
- Define posicion fija, tamano y reglas de no alteracion.
- Mantiene el logo intacto y consistente en todas las slides.

### 11. Ensamblaje final
- Combina todos los bloques anteriores en un prompt final por slide.
- Resultado: un prompt completo y consistente para cada diapositiva.

### 12. Referencias visuales adjuntas
- Se adjuntan imagenes como input real al modelo (logo y/o referencia).
- Afectan a la generacion mas alla del texto.

## 4) Flujo desde "Analizar" hasta "Generar"

1. Analizar: se produce el guion por slide y la estructura narrativa.
2. Se elige una composicion base.
3. Se aplica direccion visual derivada de la referencia (si existe).
4. Se crea el prompt final por slide.
5. Generar: se envia ese prompt + referencias visuales adjuntas al modelo de imagen.

## 5) Puntos criticos para la transferencia de estilo

Posibles causas si el estilo no se transfiere:
- La composicion fuerza una estructura visual incompatible con la referencia.
- La paleta de marca contradice la paleta natural de la referencia.
- La referencia no se adjunta realmente como imagen (solo texto).
- La guia de estilo es ambigua y se diluye frente a reglas mas fuertes.
- El prompt de la escena describe un contenido que empuja otro estilo.

## 6) Como diagnosticar rapido

- Verificar que la referencia visual aparece adjunta al modelo en cada slide.
- Comparar si el prompt contiene reglas de estilo claras y repetidas.
- Probar una generacion con paleta reducida o neutral para ver si la referencia domina.
- Revisar si la composicion exige un layout que contradiga el estilo de la referencia.

## 7) Contexto breve de la aplicacion (por si se comparte con otra IA)

- Herramienta para generar carruseles visuales a partir de un prompt.
- El flujo separa guion (texto) y render (imagen).
- Usa marca, narrativa, composicion y referencia visual para construir prompts finales por slide.

