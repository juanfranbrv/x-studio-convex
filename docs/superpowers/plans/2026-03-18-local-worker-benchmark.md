# Local Worker Benchmark Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un benchmark realista para evaluar si `local-worker` reduce coste operativo en `x-studio` sin permitir que el worker altere el código automáticamente.

**Architecture:** El benchmark se ejecuta en modo propuesta: cada modelo recibe una spec acotada, devuelve bloques `edit/create`, el harness clasifica el formato a partir del resultado guardado y genera métricas comparables. Las tareas mezclan cambios pequeños, medianos y de mayor envergadura del propio repo, pero nunca se autoaplican.

**Tech Stack:** Bash, Node.js, JSON specs, markdown de resultados, Ollama local/cloud.

---

### Task 1: Documentación del benchmark

**Files:**
- Create: `docs/LOCAL_WORKER_BENCHMARK.md`
- Modify: `docs/TECHNICAL_REFERENCE.md`

- [ ] Definir objetivo, reglas de seguridad, métricas y criterios de éxito.
- [ ] Documentar que el benchmark opera en modo propuesta y no modifica archivos del repo.
- [ ] Registrar en la referencia técnica la existencia del benchmark y su regla de no autoaplicación.

### Task 2: Evaluador de resultados

**Files:**
- Create: `tools/evaluate-worker-result.mjs`

- [ ] Implementar un parser del markdown de resultados del worker.
- [ ] Clasificar `YES`, `PARTIAL`, `UNCLEAR` o `NO` en base al contenido real de la respuesta.
- [ ] Contar bloques válidos y detectar texto sobrante fuera de bloques.

### Task 3: Mejora del harness

**Files:**
- Modify: `tools/run-benchmark.sh`

- [ ] Usar el evaluador sobre el archivo de resultado en lugar de inferir formato desde stdout.
- [ ] Añadir columnas de bloques válidos y texto sobrante.
- [ ] Mantener compatibilidad con los specs actuales y con modelos locales/cloud.

### Task 4: Specs reales del repo

**Files:**
- Create: `tools/specs/bench-06-i18n-save-preset-dialog.json`
- Create: `tools/specs/bench-07-logger-branding-configurator.json`
- Create: `tools/specs/bench-08-i18n-creation-flow-batch.json`
- Create: `tools/specs/bench-09-benchmark-harness-meta.json`
- Create: `tools/specs/bench-10-logger-analyze-brand-dna.json`
- Create: `tools/specs/bench-11-i18n-carousel-page.json`

- [ ] Añadir tareas pequeñas, medianas y grandes ancladas a archivos reales de `x-studio`.
- [ ] Mantenerlas en modo propuesta, sin `--apply`.
- [ ] Hacer explícitas las reglas de precisión y de no tocar nada fuera de los archivos listados.

### Task 5: Ejecución inicial

**Files:**
- Generate: `tools/.worker-results/benchmark_<timestamp>/`

- [ ] Ejecutar una ronda inicial con al menos un modelo local representativo.
- [ ] Recoger resumen y revisar si el nuevo clasificador refleja mejor la realidad.
- [ ] Informar de resultados reales sin exagerar conclusiones.
