# Output Schema

Each generated variant must contain:

- `id` (string, kebab-case, unique)
- `name` (string)
- `description` (string)
- `svgIcon` (string, usually `Layout`)
- `textZone` (`top` | `bottom` | `left` | `right` | `center` | `top-left` | `top-right` | `bottom-left` | `bottom-right` | `overlay`)
- `promptInstruction` (short single-line guidance)
- `structuralPrompt` (multi-line imperative structural guidance)
- `modeBasic` (boolean)
- `modeAdvanced` (boolean)
- `thumbnailSpec` (object)

`thumbnailSpec` fields:
- `family`: `grid` | `split` | `process` | `radial` | `card` | `list` | `stat`
- `idTokens`: array of recommended ID tokens to trigger coherent thumbnails
- `focus`: short visual summary
- `layoutThumbnailHint`: implementation hint

## Quality Gate

Reject a variant if any of these fails:
- Missing protected text-safe area in structural prompt
- Missing logo policy in structural prompt
- Contradictory instructions (e.g. "full bleed text overlay" and "fully clear text zone")
- ID without token hints that map to thumbnail families

## Practical Mode Rule

Use `modeBasic=true` only for simple readable archetypes and low/mid density.
Always set `modeAdvanced=true` unless user requests a strict basic-only component.
