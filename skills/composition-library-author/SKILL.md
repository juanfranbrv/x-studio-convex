---
name: composition-library-author
description: Create and edit legacy layout compositions for X Studio with production-ready output for /admin/legacy-compositions. Use when the user asks to add, replace, delete, or migrate compositions between basic and advanced mode, including thumbnail-ready IDs.
---

# Composition Library Author

## Overview
This skill authors legacy compositions compatible with the restored catalog flow in X Studio.
It returns JSON objects ready to paste into the admin composition manager.
Structural prompts must match the existing house style in `legacy-layout-overrides.json`:
short, creative, open-ended, and not overly prescriptive.
Do not include a "### Estilo" section in structural prompts.

## When To Use
Use this skill when the request is about:
- creating new compositions for one intent
- replacing weak compositions with stronger variants
- moving compositions between basic and advanced mode
- generating composition content and thumbnail guidance together
- producing JSON payloads for manual import/editing

## Required Inputs
Minimum:
- `intent` (e.g. `servicio`, `oferta`, `comunicado`, `pasos`)
- objective in plain words

Optional:
- `text_density`: `low` | `mid` | `high`
- `tone`: `editorial` | `comercial` | `institucional` | `didactico` | `dinamico`
- number of variants
- desired mode (`basic`, `advanced`, or both)

## Workflow
1. Collect intent and objective.
2. Choose 2-5 archetypes that are meaningfully different (no cosmetic variants).
3. Generate one composition object per archetype with:
- `id`, `name`, `description`
- `svgIcon`, `textZone`
- `promptInstruction`, `structuralPrompt`
- `skillVersion` (version del skill que genero la composicion)
- `modeBasic`, `modeAdvanced`
- `thumbnailSpec`
4. Validate quality:
- no contradictions between structural lines
- explicit protected text zone
- explicit logo policy
- clear reading flow
- no exact color mentions (no hex, no color names, no palette references)
5. Return machine-friendly JSON first, then a short human summary.

## Thumbnail Rule (Important)
Legacy thumbnails are rendered from layout IDs and pattern matching in `src/components/studio/creation-flow/LayoutThumbnail.tsx`.
For new compositions, force recognizable ID tokens so the visual is coherent:
- `grid`, `mosaic`, `catalogo` -> grid family
- `split`, `versus`, `comparison` -> split family
- `process`, `timeline`, `pasos` -> process family
- `radial`, `spotlight`, `hero` -> radial family
- `card`, `frame`, `tarjeta` -> card family
- `list`, `check`, `memo` -> list family
- `stat`, `metric`, `dashboard`, `dato` -> data/stat family

If no known token is present, thumbnail quality degrades to generic fallback.

## Output Contract
Always output JSON array with this shape:

```json
[
  {
    "id": "servicio-grid-beneficios",
    "name": "Servicio en Mosaico de Beneficios",
    "description": "Bloques modulares para explicar beneficios sin saturar el foco.",
    "svgIcon": "Layout",
    "textZone": "left",
    "promptInstruction": "Modular bento-style composition with protected left reading lane and hierarchical service blocks.",
    "structuralPrompt": "## Composición: ...\n**Estructura:** ...\n\n### Jerarquía Visual\n1. ...\n2. ...\n3. ...\n\n### Distribución\n- ...\n- ...\n- ...\n\n### Evitar\n...",
    "modeBasic": true,
    "modeAdvanced": true,
    "thumbnailSpec": {
      "family": "grid",
      "idTokens": ["grid", "mosaic"],
      "focus": "left-lane + modular blocks"
    }
  }
]
```

Detailed schema and constraints: `references/output-schema.md`

## Script Usage
Generate deterministic variants:

```powershell
python .agents/skills/composition-library-author/scripts/generate_legacy_composition.py --intent servicio --goal "captar leads para curso de informatica" --count 4 --text-density mid --tone comercial
```

Write JSON directly to file:

```powershell
python .agents/skills/composition-library-author/scripts/generate_legacy_composition.py --intent oferta --goal "campana de descuento febrero" --count 3 --out outputs/oferta-composiciones.json
```

Intent/archetype matrix: `references/archetype-matrix.md`

## Resources
- `scripts/generate_legacy_composition.py`: deterministic generator for composition variants
- `references/output-schema.md`: exact JSON contract and field constraints
- `references/archetype-matrix.md`: mapping of intents to recommended archetypes and thumbnail families
