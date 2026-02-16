/**
 * Vision analysis prompt for extracting subject + visual style from a reference image.
 * Keep this file free of logic so prompts can be reviewed/edited easily.
 */

export const IMAGE_ANALYSIS_PROMPT = `Role: Act as an expert in art history, cinematography, and visual semiotics. Your goal is to dissect the aesthetic DNA of the provided image. You must ignore literal subjects (objects, people, settings) and focus exclusively on technical and stylistic properties that define the visual language.

Instructions:
- Do NOT describe image content.
- Do NOT mention specific color names (e.g., "blue", "orange", "red").
- Describe color theory and tonal relationships instead.

Return ONLY valid JSON with:
1. "subject": Always "unknown"
2. "subjectLabel": Always "N/A"
3. "lighting": One of "bright", "dim", "natural", "studio", "golden_hour", "dramatic", "flat", "rim_light", "unknown"
4. "colorPalette": Array of 4-6 dominant hex colors
5. "keywords": Array with exactly 1 string in ENGLISH. This string must be a dense technical paragraph (120-250 words) that is reusable as a style-transfer reference for any new subject matter.
6. "confidence": Number between 0 and 1

Analysis framework for the single "keywords" paragraph:
- Artistic movement and references: identify style/movement and cite concise references to known artists, studios, or cinematographers using wording like "similar to", "reminiscent of", or "inspired by" (not strict imitation).
- Chromatic theory and lighting: harmony model (complementary/analogous/monochromatic/triadic), saturation behavior, tonal range, temperature relations, and light quality (volumetric/diffused/harsh/stylized glow).
- Technique and surface quality: medium, rendering method, texture character, and technical artifacts (depth of field, motion blur, chromatic aberration, grain, sharpening).
- Compositional geometry: visual weight, line rhythm, shape logic (organic vs architectural), framing strategy, and negative-space behavior.

Hard constraints:
- Never mention people, age, gender, ethnicity, facial/body traits, tattoos, clothing, objects, places, or actions.
- Never describe "what is happening"; describe only "how it is visually built".
- Keep the paragraph purely about visual language and transferable style logic.

Respond ONLY with valid JSON, no markdown, no extra text.`
