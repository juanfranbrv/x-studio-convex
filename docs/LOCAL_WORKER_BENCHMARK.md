# Benchmark de Local Worker

Benchmark operativo para evaluar si el workflow `orquestador potente -> worker local/cloud -> revision manual` merece la pena en `x-studio`.

## Objetivo

Medir si `local-worker` reduce coste total de trabajo en tareas mecanicas del repo sin degradar demasiado:

- tiempo total
- aplicabilidad de la salida
- precision respecto a la instruccion
- carga de revision

## Regla de seguridad

Este benchmark se ejecuta siempre en **modo propuesta**:

- el worker **no** modifica archivos del repo
- **no** se usa `--apply`
- toda salida se guarda en `tools/.worker-results/`
- cualquier cambio real requeriria revision y aplicacion manual posterior

## Que mide

Cada corrida registra:

- `time_s`: tiempo de generacion del modelo
- `prompt_tokens`: tokens de entrada reportados por el worker
- `gen_tokens`: tokens generados
- `tok_per_sec`: velocidad estimada
- `followed_format`: clasificacion del contrato de salida
- `valid_blocks`: numero de bloques `edit/create` validos
- `has_extraneous_text`: si hay texto sobrante fuera de bloques

## Clasificacion de formato

- `YES`: la respuesta contiene uno o mas bloques validos y no mete texto sobrante
- `PARTIAL`: hay bloques validos, pero tambien texto extra o bloques defectuosos
- `UNCLEAR`: el modelo responde con `UNCLEAR:` porque falta contexto o la tarea no esta bien especificada
- `NO`: no hay bloques utilizables

## Tareas incluidas

La bateria mezcla niveles de dificultad y tamano:

- pequena: i18n acotado en un componente
- pequena-media: normalizacion de logs en un componente del flujo creativo
- media: i18n coordinado en varios componentes
- media: mejora del propio harness del benchmark
- grande: normalizacion de logs en `analyze-brand-dna`
- grande: i18n de una pagina grande de `carousel`

## Criterios de lectura

Un modelo o workflow gana valor cuando:

- entrega formato `YES` o `PARTIAL` de forma estable
- requiere poca correccion manual
- no introduce cambios laterales
- compensa el tiempo de preparar la spec y revisar la salida

Pierde valor cuando:

- obliga a reintentos frecuentes
- necesita specs demasiado largas para entender la tarea
- produce mucho texto no aplicable
- el tiempo total se acerca demasiado al de hacerlo directamente

## Ejecucion

Ejemplos:

```bash
bash tools/run-benchmark.sh gpt-oss:20b
bash tools/run-benchmark.sh qwen3.5:9b
OLLAMA_API_KEY=<key> bash tools/run-benchmark.sh glm-5:cloud
```

## Resultado esperado

El benchmark no decide por si solo si un modelo "sirve" o "no sirve". La lectura correcta es por tipo de tarea:

- tareas de transformacion mecanica
- tareas multiarchivo
- tareas de contexto grande

La decision final debe salir del coste total del workflow, no solo de la calidad bruta del texto generado.
