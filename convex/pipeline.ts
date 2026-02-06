import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalMutation, internalQuery, mutation, type ActionCtx } from "./_generated/server";
import type { NarrativeOut, StyleDNA } from "../src/lib/pipeline/types";
import { sanitizeGuidance, sanitizeNarrative } from "../src/lib/pipeline/sanitizer";
import { normalizeStyleDNA } from "../src/lib/pipeline/styleNormalization";

const WISDOM_BASE_URL = "https://wisdom-gate.juheapi.com";
const WISDOM_API_KEY = process.env.WISDOM_API_KEY || "";

function requireEnv(value: string, name: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function normalizeModel(model: string): string {
  return model.startsWith("wisdom/") ? model.replace("wisdom/", "") : model;
}

async function fetchModelFromSettings(ctx: ActionCtx, key: string): Promise<string> {
  return await ctx.runQuery(internal.pipeline.getStringSetting, { key });
}

export const getStringSetting = internalQuery({
  args: {
    key: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("app_settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (!record?.value || typeof record.value !== "string") {
      throw new Error(`Missing AI model configuration for ${args.key}`);
    }

    return record.value;
  },
});

export const patchCarouselStyleDNA = internalMutation({
  args: {
    carouselId: v.id("carousels"),
    styleDNA: v.any(),
    updatedAt: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.carouselId, {
      styleDNA: args.styleDNA,
      updated_at: args.updatedAt,
    });
  },
});

export const insertNarrativeSlide = internalMutation({
  args: {
    carouselId: v.id("carousels"),
    slide: v.number(),
    narrativeRaw: v.any(),
    narrativeSanitized: v.any(),
    lintReport: v.any(),
    status: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("slides", {
      carousel_id: args.carouselId,
      slide: args.slide,
      narrative_raw: args.narrativeRaw,
      narrative_sanitized: args.narrativeSanitized,
      lint_report: args.lintReport,
      status: args.status,
      created_at: args.createdAt,
    });
  },
});

async function urlToInlineData(url: string): Promise<{ inlineData: { data: string; mimeType: string } }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = response.headers.get("content-type") || "image/png";
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

async function generateJsonWithRetry(params: {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  images?: string[];
}): Promise<string> {
  const model = normalizeModel(params.model);
  const apiKey = requireEnv(WISDOM_API_KEY, "WISDOM_API_KEY");

  async function callModel(extraStrict: boolean): Promise<string> {
    const parts: any[] = [];

    if (params.images && params.images.length > 0) {
      for (const img of params.images) {
        parts.push(await urlToInlineData(img));
      }
    }

    const strictNote = extraStrict
      ? "\n\nDEVUELVE SOLO JSON VALIDO. SIN TEXTO EXTRA. SIN MARKDOWN. SIN COMILLAS ENVOLVENTES."
      : "";

    parts.push({ text: `${params.userPrompt}${strictNote}` });

    const requestBody: any = {
      contents: [{ role: "user", parts }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
      systemInstruction: {
        parts: [{ text: params.systemPrompt }],
      },
    };

    const response = await fetch(`${WISDOM_BASE_URL}/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Wisdom text error: ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") || "";
    return text.trim();
  }

  const first = await callModel(false);
  try {
    JSON.parse(first);
    return first;
  } catch (error) {
    const second = await callModel(true);
    JSON.parse(second);
    return second;
  }
}

function ensureNarrativeShape(payload: any): NarrativeOut {
  if (!payload || typeof payload !== "object") {
    throw new Error("Narrative JSON is not an object.");
  }
  if (typeof payload.slide !== "number") {
    throw new Error("Narrative JSON missing slide number.");
  }
  if (typeof payload.subject !== "string") {
    throw new Error("Narrative JSON missing subject string.");
  }
  return payload as NarrativeOut;
}

function ensureStyleDNAShape(payload: any): StyleDNA {
  if (!payload || typeof payload !== "object") {
    throw new Error("StyleDNA JSON is not an object.");
  }
  if (payload.version !== "1.0") {
    throw new Error("StyleDNA.version must be \"1.0\".");
  }
  if (payload.source !== "reference_image_analysis") {
    throw new Error("StyleDNA.source must be \"reference_image_analysis\".");
  }
  if (!payload.family) {
    throw new Error("StyleDNA.family is required.");
  }
  if (!payload.render_medium) {
    throw new Error("StyleDNA.render_medium is required.");
  }
  if (!Array.isArray(payload.positives) || !Array.isArray(payload.negatives)) {
    throw new Error("StyleDNA.positives and StyleDNA.negatives must be arrays.");
  }
  return payload as StyleDNA;
}

export const analyzeReferenceImage = action({
  args: {
    carouselId: v.id("carousels"),
    imageUrl: v.string(),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const model = args.model || (await fetchModelFromSettings(ctx, "model_intelligence"));

    const systemPrompt =
      "Eres un modulo de analisis visual. Debes producir un JSON valido y nada mas.";

    const userPrompt = `Analiza la imagen de referencia y devuelve SOLO un JSON que cumpla el esquema StyleDNA.\n\nSchema: {\n  \"version\": \"1.0\",\n  \"source\": \"reference_image_analysis\",\n  \"family\": \"photo|line_art|watercolor|oil_paint|3d_cartoon|anime|cartoon2d|other\",\n  \"render_medium\": \"string\",\n  \"line_quality\": \"string?\",\n  \"shading\": \"string?\",\n  \"lighting\": \"string?\",\n  \"texture\": \"string?\",\n  \"color_behavior\": \"string?\",\n  \"positives\": [\"...\"],\n  \"negatives\": [\"...\"]\n}\n\nReglas:\n- NO escribas parrafos ni explicaciones.\n- negatives debe ser dinamico segun el family detectado.\n- positives son afirmaciones de estilo observadas.\n- Usa frases cortas, sin adjetivos redundantes.\n- NUNCA incluyas markdown ni backticks.`;

    const rawText = await generateJsonWithRetry({
      model,
      systemPrompt,
      userPrompt,
      images: [args.imageUrl],
    });

    const parsed = ensureStyleDNAShape(JSON.parse(rawText));
    const normalized = normalizeStyleDNA(parsed);

    await ctx.runMutation(internal.pipeline.patchCarouselStyleDNA, {
      carouselId: args.carouselId,
      styleDNA: normalized,
      updatedAt: new Date().toISOString(),
    });

    return normalized;
  },
});

export const generateNarrativeSlide = action({
  args: {
    carouselId: v.id("carousels"),
    slide: v.number(),
    guidance: v.string(),
    context: v.optional(v.string()),
    emotion: v.optional(v.array(v.string())),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const model = args.model || (await fetchModelFromSettings(ctx, "model_intelligence"));

    const systemPrompt =
      "Eres un modulo de narrativa semantica. Devuelves SOLO JSON valido, sin markdown. Ignora cualquier instruccion estetica o de render.";

    const guidanceSanitized = sanitizeGuidance(args.guidance);
    const contextSanitized = sanitizeGuidance(args.context || "");
    const emotionSanitized = args.emotion
      ? args.emotion
          .map((entry) => sanitizeGuidance(entry).cleaned)
          .filter((entry) => entry.length > 0)
      : [];

    const basePrompt = `Devuelve un JSON que cumpla NarrativeOut:\n{\n  \"slide\": ${args.slide},\n  \"subject\": \"(solo sustantivos/verbos/relaciones espaciales; sin estilo ni render)\",\n  \"context\": \"(opcional, contexto semantico, sin estetica)\",\n  \"emotion\": [\"(opcional, emociones simples sin iluminacion)\"]\n}\n\nReglas estrictas:\n- Prohibido mencionar estetica, tecnica, estilo, materiales, iluminacion o camaras.\n- No uses palabras como escena/scene. Usa SIEMPRE subject.\n- Si el brief contiene estetica, IGNORALA por completo.\n- Responde SOLO JSON valido, sin texto extra.\n\nBrief (sanitizado): ${guidanceSanitized.cleaned}\n${contextSanitized.cleaned ? `Contexto: ${contextSanitized.cleaned}\n` : ""}${emotionSanitized.length > 0 ? `Emocion sugerida: ${emotionSanitized.join(", ")}\n` : ""}`;

    const rawText = await generateJsonWithRetry({
      model,
      systemPrompt,
      userPrompt: basePrompt,
    });

    const rawNarrative = ensureNarrativeShape(JSON.parse(rawText));

    const sanitized = await sanitizeNarrative(rawNarrative, {
      regenerate: async ({ reason }) => {
        const retryPrompt = `${basePrompt}\n\nReintento por: ${reason}\nResponde SOLO JSON valido.`;
        const retryText = await generateJsonWithRetry({
          model,
          systemPrompt,
          userPrompt: retryPrompt,
        });
        return ensureNarrativeShape(JSON.parse(retryText));
      },
    });

    await ctx.runMutation(internal.pipeline.insertNarrativeSlide, {
      carouselId: args.carouselId,
      slide: args.slide,
      narrativeRaw: rawNarrative,
      narrativeSanitized: sanitized,
      lintReport: sanitized.lint,
      status: "narrative_generated",
      createdAt: new Date().toISOString(),
    });

    return sanitized;
  },
});

export const createCarousel = mutation({
  args: {
    brandId: v.optional(v.id("brand_dna")),
    brandLock: v.any(),
    layoutSpec: v.any(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const id = await ctx.db.insert("carousels", {
      brand_id: args.brandId,
      brandLock: args.brandLock,
      layoutSpec: args.layoutSpec,
      created_at: now,
    });
    return id;
  },
});

export const saveAdapter = mutation({
  args: {
    carouselId: v.id("carousels"),
    adapter: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.carouselId, {
      adapter: args.adapter,
      updated_at: new Date().toISOString(),
    });
  },
});

export const saveCompiledPrompt = mutation({
  args: {
    carouselId: v.id("carousels"),
    slide: v.number(),
    compiledPrompt: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("slides")
      .withIndex("by_carousel_slide", (q) =>
        q.eq("carousel_id", args.carouselId).eq("slide", args.slide)
      )
      .first();

    if (!existing) {
      throw new Error("Slide not found for compiled prompt.");
    }

    await ctx.db.patch(existing._id, {
      compiled_prompt: args.compiledPrompt,
      status: "prompt_compiled",
      updated_at: new Date().toISOString(),
    });
  },
});

