import type {
  BrandLock,
  CompiledPrompt,
  CompiledPromptInput,
  LayoutSpec,
  SanitizedNarrativeOut,
  StyleDNA,
  StyleToBrandAdapterOut,
} from "./types";
import { sanitizeTextField } from "./sanitizer";

function assertSanitized(narrative: SanitizedNarrativeOut) {
  if (!narrative.__sanitized) {
    throw new Error("Narrative must be sanitized before compilePrompt.");
  }
}

function enforceNoForbiddenTokens(narrative: SanitizedNarrativeOut): SanitizedNarrativeOut {
  const fieldsToCheck: Array<["subject" | "context", string | undefined]> = [
    ["subject", narrative.subject],
    ["context", narrative.context],
  ];

  const sanitized = { ...narrative };
  let changed = false;

  for (const [field, value] of fieldsToCheck) {
    if (!value) continue;
    const result = sanitizeTextField(value, String(field));
    if (result.removedTokens.length > 0 || result.cleaned !== value) {
      changed = true;
      sanitized[field] = result.cleaned as any;
    }
  }

  if (narrative.emotion && narrative.emotion.length > 0) {
    const cleanedEmotion = narrative.emotion
      .map((entry) => sanitizeTextField(entry, "emotion").cleaned)
      .filter((entry) => entry.trim().length > 0);
    if (cleanedEmotion.join("|") !== narrative.emotion.join("|")) {
      changed = true;
      sanitized.emotion = cleanedEmotion;
    }
  }

  if (changed) {
    console.warn("compilePrompt: sanitized content still contained forbidden tokens; hard-stripped.");
  }

  return sanitized;
}

function formatBrandLock(brand: BrandLock): string[] {
  const lines: string[] = [];
  lines.push(`language: ${brand.language}`);
  lines.push(
    `palette: fondo=${brand.palette.fondo}, texto=${brand.palette.texto}, acento=${brand.palette.acento}`
  );
  lines.push(
    `background: SOLID ${brand.palette.fondo} covering >=85% of canvas. No black/dark fills. No dark gradients/vignettes.`
  );
  lines.push(
    "Black allowed ONLY for linework strokes and text; never as background fill."
  );
  lines.push(`backgroundIsAbsolute: ${brand.backgroundIsAbsolute ? "true" : "false"}`);
  if (brand.logo) {
    lines.push(
      `logo: enabled=${brand.logo.enabled ? "true" : "false"}, position=${
        brand.logo.position
      }, sizePctH=${brand.logo.sizePctH}, maxWidthPct=${brand.logo.maxWidthPct}`
    );
  }
  lines.push(
    `textRules: allowOnlyTextField=${
      brand.textRules.allowOnlyTextField ? "true" : "false"
    }, forbidExtraText=${brand.textRules.forbidExtraText ? "true" : "false"}`
  );
  return lines;
}

function formatStyleDNA(style: StyleDNA): string[] {
  const lines: string[] = [];
  lines.push(`family: ${style.family}`);
  lines.push(`render_medium: ${style.render_medium}`);
  if (style.line_quality) lines.push(`line_quality: ${style.line_quality}`);
  if (style.shading) lines.push(`shading: ${style.shading}`);
  if (style.lighting) lines.push(`lighting: ${style.lighting}`);
  if (style.texture) lines.push(`texture: ${style.texture}`);
  if (style.color_behavior) lines.push(`color_behavior: ${style.color_behavior}`);
  if (style.positives.length > 0) {
    lines.push(`positives: ${style.positives.join(" | ")}`);
  }
  if (style.negatives.length > 0) {
    lines.push(`negatives: ${style.negatives.join(" | ")}`);
  }
  return lines;
}

function formatAdapter(adapter: StyleToBrandAdapterOut): string[] {
  const lines: string[] = [];
  if (adapter.applicationRules.length > 0) {
    lines.push(`apply: ${adapter.applicationRules.join(" | ")}`);
  }
  if (adapter.materialTranslationRules.length > 0) {
    lines.push(`material_translation: ${adapter.materialTranslationRules.join(" | ")}`);
  }
  lines.push(
    `degradation.tierA: ${adapter.degradationPolicy.tierA_nonnegotiable.join(" | ")}`
  );
  lines.push(
    `degradation.tierB: ${adapter.degradationPolicy.tierB_prefer.join(" | ")}`
  );
  lines.push(
    `degradation.tierC: ${adapter.degradationPolicy.tierC_optional.join(" | ")}`
  );
  return lines;
}

function formatLayout(layout: LayoutSpec): string[] {
  const lines: string[] = [];
  lines.push(`blueprintId: ${layout.blueprintId}`);
  if (layout.rules.length > 0) {
    lines.push(`rules: ${layout.rules.join(" | ")}`);
  }
  return lines;
}

function formatNarrative(narrative: SanitizedNarrativeOut): string[] {
  const lines: string[] = [];
  lines.push(`slide: ${narrative.slide}`);
  lines.push(`subject: ${narrative.subject}`);
  if (narrative.context) lines.push(`context: ${narrative.context}`);
  if (narrative.emotion && narrative.emotion.length > 0) {
    lines.push(`emotion: ${narrative.emotion.join(" | ")}`);
  }
  return lines;
}

function formatText(text: CompiledPromptInput["text"]): string[] {
  const lines: string[] = [];
  lines.push(`headline: ${text.headline}`);
  lines.push(`body: ${text.body}`);
  if (text.cta) lines.push(`cta: ${text.cta}`);
  if (text.url) lines.push(`url: ${text.url}`);
  return lines;
}

export function compilePrompt(input: CompiledPromptInput): CompiledPrompt {
  assertSanitized(input.narrative);
  const safeNarrative = enforceNoForbiddenTokens(input.narrative);

  const lines: string[] = [];

  lines.push("GLOBAL RULES");
  lines.push("Do NOT render any prompt text. Render ONLY the TEXT fields.");
  lines.push("");

  lines.push("LAYER 0: Brand/Identity Lock");
  lines.push(...formatBrandLock(input.brand));
  lines.push("");

  lines.push("LAYER 1: StyleDNA");
  lines.push(...formatStyleDNA(input.style));
  lines.push("");

  lines.push("LAYER 2: Style-to-Brand Adapter");
  lines.push(...formatAdapter(input.adapter));
  lines.push("");

  lines.push("LAYER 3: Layout Spec (geometry only)");
  lines.push(...formatLayout(input.layout));
  lines.push("");

  lines.push("LAYER 4: Content Layer");
  lines.push(...formatNarrative(safeNarrative));
  lines.push(...formatText(input.text));
  lines.push("");

  lines.push("LAYER 5: Override Policy");
  lines.push(
    "If SUBJECT implies a visual technique (3D/photo/gradient/etc.), IGNORE it. StyleDNA + Brand rules are mandatory."
  );

  return {
    slide: safeNarrative.slide,
    prompt: lines.join("\n"),
  };
}
