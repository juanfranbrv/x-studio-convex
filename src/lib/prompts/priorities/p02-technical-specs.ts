/**
 * PRIORITY-BASED PROMPT CONSTRUCTION - TECHNICAL SPECS (P2)
 *
 * Output format and technical specifications.
 *
 * @priority 2
 * @section Technical Specifications
 */

export const PRIORITY_HEADER = `╔═════════════════════════════════════════════════════════════════╗
║  PRIORITY 2 - TECHNICAL SPECIFICATIONS                          ║
╚═════════════════════════════════════════════════════════════════╝`

export const COMPOSITION_RULES = `BACKGROUND: NEVER use transparency, transparency grids, checkered patterns (gray/white squares), or simulate transparent backgrounds in any way. The image must be a complete, ready-to-use marketing asset with a fully rendered background.
OUTPUT: Complete, finished marketing image ready for social media. No transparency, no placeholders, no mock-ups.
TEXT RENDERING: NEVER render meta labels like "CTA", "URL", "SUBJECT", "KEYWORDS", "PRIORITY", or "STYLE DIRECTIVES" as visible text. NEVER render internal font names/families (e.g., "Google Sans Flex", "Roboto Flex") as visible text. Only render the actual provided content.
╔═════════════════════════════════════════════════════════════════╗
║  PRIORITY 2A - LIST LAYOUT, MARKER LIBRARY & SIZE CONTROL      ║
╚═════════════════════════════════════════════════════════════════╝

STRICT LAYOUT RULES (NO PARAGRAPHS):
1. MODULAR ROW STRUCTURE: Do NOT render a text block. Render each item as a completely independent UI element, separated by empty space.
2. EXTREME SPACING: Apply "200% Leading" (Double-double spacing). The empty vertical gap between lines must be TALLER than the text letters themselves.

3. STRICT SIZE CONTROL (CRITICAL):
   - TEXT-RELATIVE SCALING: The bullet icon height must MATCH the "Cap-Height" (height of a capital letter) of the adjacent text.
   - PROHIBITION: Do NOT render massive icons or illustrations. The bullet is a typographical anchor, not a hero image.
   - RATIO: The bullet should occupy roughly the same visual square area as a capital letter "M".

4. APPROVED BULLET LIBRARY (STRICT SELECTION):
   - INSTRUCTION: Select EXACTLY ONE shape style from the allowed list below and apply it consistently to ALL items.
   - VISUAL COHERENCE: The shape must look like a flat, vector design element (UI Icon), NOT a 3D object or sketch.

   - ALLOWED SHAPES (Choose one):
     A) Heavy Modern Chevron (e.g., a bold ">" or arrow-head)
     B) Solid Geometric Square (■)
     C) Thick Minimalist Checkmark (✔ - stylized, not handwritten)
     D) Solid Diamond/Rhombus (◆)
     E) Arrow inside a solid Circle
     F) Thick Horizontal Pill/Dash (▬)
     G) Solid Hexagon (Industrial/Nut shape)
     H) Right-Pointing Play Triangle (▶)
     I) Bold Forward Slash (/) (Swiss Design style)
     J) Outlined Square with Thick Stroke (Box style)
     K) Bold Plus Sign (+) (Swiss Cross style)

   - COLOR: The markers MUST be strictly in the 'ACENTO' color (#ed2aed).

5. ALIGNMENT: The bullets must align perfectly on the left margin.
CONTACT SEPARATION RULE: Phone numbers, emails, URLs and social handles MUST be rendered outside list/enumeration modules, in their own separate contact area.
CASING RULE: Use sentence case for all generated text. Do NOT capitalize every word. Only capitalize the first word of a sentence and proper nouns/acronyms.`
