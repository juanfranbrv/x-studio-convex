import type { BrandLock, StyleDNA, StyleToBrandAdapterOut } from "./types";

function isWhiteLike(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return (
    normalized === "#fff" ||
    normalized === "#ffffff" ||
    normalized === "white" ||
    normalized === "blanco"
  );
}

function mentionsAny(text: string | undefined, tokens: string[]): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return tokens.some((token) => lower.includes(token));
}

export function buildStyleToBrandAdapter(
  style: StyleDNA,
  brand: BrandLock
): StyleToBrandAdapterOut {
  const applicationRules: string[] = [];
  const materialTranslationRules: string[] = [];

  const fondoIsWhite = isWhiteLike(brand.palette.fondo);
  const renderMentionsPaper = mentionsAny(style.render_medium, ["paper", "papel"]) ||
    mentionsAny(style.texture, ["paper", "papel"]) ||
    mentionsAny(style.positives.join(" "), ["paper", "papel"]);

  if (renderMentionsPaper && !fondoIsWhite) {
    materialTranslationRules.push(
      `Tratar el sustrato como papel teñido con el color fondo (${brand.palette.fondo}) en lugar de blanco.`
    );
  }

  if (style.family === "photo" && !fondoIsWhite) {
    applicationRules.push(
      "Mantener realismo fotografico; aplicar una gradacion sutil con el color de fondo sin destruir la iluminacion realista."
    );
  }

  if (style.family === "line_art") {
    applicationRules.push(
      "Priorizar lineas limpias y consistentes; no introducir texturas pictoricas."
    );
  }

  if (style.family === "watercolor" || style.family === "oil_paint") {
    applicationRules.push(
      "Preservar comportamiento del medio (lavados, pinceladas) sin añadir tecnicas externas."
    );
  }

  if (style.family === "3d_cartoon" || style.family === "cartoon2d" || style.family === "anime") {
    applicationRules.push(
      "Respetar proporciones estilizadas, evitando realismo fotografico."
    );
  }

  const degradationPolicy = {
    tierA_nonnegotiable: [
      "StyleDNA tiene prioridad absoluta sobre cualquier indicio estetico del subject.",
      "Respetar paleta y reglas de marca como obligatorias.",
      "No introducir tecnicas no declaradas en StyleDNA.",
    ],
    tierB_prefer: [
      "Mantener coherencia de line_quality, shading y texture si estan presentes.",
      "Aplicar reglas de traduccion de materiales cuando existan conflictos con la marca.",
    ],
    tierC_optional: [
      "Simplificar detalles secundarios si interfieren con la legibilidad de texto.",
      "Reducir complejidad de textura si compite con la jerarquia tipografica.",
    ],
  };

  return {
    applicationRules,
    materialTranslationRules,
    degradationPolicy,
  };
}
