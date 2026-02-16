export function buildBrandAnalysisPrompt(params: {
    detectedFonts: string[];
    weightedFonts: string[];
    detectedColors: string[];
    colorFrequency: Record<string, number>;
    fullBrandContext: string;
}): string {
    const { detectedFonts, weightedFonts, detectedColors, colorFrequency, fullBrandContext } = params;

    const fonts = detectedFonts.concat(weightedFonts).join(', ') || 'No detectadas';

    const colorsFormatted = detectedColors.slice(0, 15).map((color, idx) =>
        `${idx + 1}. ${color}${colorFrequency?.[color] ? ` (usado ${colorFrequency[color]}x)` : ''}`
    ).join('\n');

    return `Eres un experto en Branding y Diseño Estratégico. Tu objetivo es destilar la esencia de un negocio a partir de su contenido web y datos visuales.

Meta título: Analizado desde contenido de página
Meta descripción: Extraída desde HTML\n

FUENTES DETECTADAS (Prioridad): ${fonts}

COLORES DETECTADOS DEL CSS (ordenados por frecuencia de uso):
${colorsFormatted}

REGLAS IMPORTANTES:
1. brand_name: Usa el nombre comercial real, no el dominio
2. tagline: Créalo en el idioma original del contenido
3. business_overview: 2-3 frases claras sobre qué hace el negocio
4. brand_values: Exactamente 5 valores (ej: "Calidad", "Innovación", "Sostenibilidad")
5. tone_of_voice: Exactamente 3 adjetivos sobre cómo se comunican
6. visual_aesthetic: Exactamente 3 estilos artísticos o de diseño reconocibles (ej: "Swiss Style", "Brutalism", "Glassmorphism", "Corporate Memphis", "Bauhaus"). EVITA adjetivos genéricos como "Profesional" o "Limpio". Queremos la "Corriente Artística" más cercana.
7. target_audience: Exactamente 3 slots describiendo el público objetivo (ej: "Emprendedores digitales", "Padres jóvenes", "Profesionales del diseño")
8. colors: DEBES usar SOLO colores de la lista COLORES DETECTADOS DEL CSS. Elige los 5 más representativos de la marca. NO inventes colores.
9. fonts: Sugiere 2 Google Fonts que encajen (una Display/Serif, una Sans)
10. text_assets:
   - marketing_hooks: 5 frases tipo titular que capturen la propuesta de valor (EN EL IDIOMA DEL CONTENIDO)
   - visual_keywords: 5 términos PRECISOS de CORRIENTES ARTÍSTICAS o ESTILOS DE DISEÑO DE PÓSTERS que encajen con la marca (ej: "Swiss Style", "Bauhaus", "Art Deco", "Cyberpunk", "Risograph", "Brutalism", "Minimalist Poster", "Typography-driven"). PROHIBIDO usar adjetivos genéricos como "moderno", "limpio" o "lujoso". SOLO ESTILOS RECONOCIBLES.
   - ctas: 3 variaciones de llamadas a la acción relevantes para su embudo (EN EL IDIOMA DEL CONTENIDO)
   - brand_context: Un párrafo denso con detalles técnicos y operacionales del negocio extraídos del texto (mínimo 200 caracteres). Usa todo el contexto proporcionado para ser muy específico.

IMPORTANTE: Detecta automáticamente el idioma del contenido y genera TODOS los text_assets en ese mismo idioma.

Contenido del sitio web (Usa esto para los TEXT ASSETS):
${fullBrandContext.slice(0, 45000)}`;
}
