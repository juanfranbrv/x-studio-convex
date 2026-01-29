/**
 * Vision analysis prompt for extracting subject + visual style from a reference image.
 * Keep this file free of logic so prompts can be reviewed/edited easily.
 */

export const IMAGE_ANALYSIS_PROMPT = `Act as a Technical Art Director and expert in visual curation. Analyze the attached image and extract ONLY its visual and aesthetic style.

GOLDEN RULE: IGNORE THE SUBJECT. Do not say if there is a person, dog, building, or what is happening. Describe ONLY how it looks.

Return a JSON object with:

1. "subject": Always set to "unknown"
2. "subjectLabel": Always set to "N/A"
3. "lighting": One of: "bright", "dim", "natural", "studio", "golden_hour", "unknown"
4. "colorPalette": Array of 3-5 dominant hex colors extracted from the image
5. "keywords": An array with exactly 1 string. That string MUST be in ENGLISH and be a single dense, comma-separated paragraph (no bullets), 40-80 words, prioritizing the strongest descriptors first. It must cover:
   - Medium & Materiality (e.g., cel-shading, oil on canvas, analog photography, Unreal Engine render, VHS glitch)
   - Lighting & Shadows (e.g., Rembrandt lighting, hard light, ambient occlusion, bioluminescence, underexposure)
   - Chromatic Language (e.g., desaturated palette, cyan/orange duotone, pastel gradients, high dynamic range)
   - Texture & Post-Processing (e.g., ISO 800 film grain, chromatic aberration, visible brushstrokes, matte finish)
   - Optics & Composition (e.g., shallow depth of field, bokeh, fisheye lens, isometric perspective)
   - Vibe/Mood (e.g., ethereal, cyberpunk, vintage 1950s, minimalist, dreamlike)
6. "confidence": A number between 0 and 1 indicating confidence in the analysis

Respond ONLY with valid JSON, no markdown or explanation.`
