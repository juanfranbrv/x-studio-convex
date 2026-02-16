import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import type {
  BrandLock,
  LayoutSpec,
  SanitizedNarrativeOut,
  StyleDNA,
} from "@/lib/pipeline/types";
import { buildStyleToBrandAdapter } from "@/lib/pipeline/adapter";
import { compilePrompt } from "@/lib/pipeline/compilePrompt";
import { ALL_FORBIDDEN_TOKENS } from "@/lib/pipeline/forbiddenTokens";
import { generateImageFromPromptRaw } from "@/lib/gemini";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type SlideInput = {
  slide: number;
  guidance: string;
  context?: string;
  emotion?: string[];
  text: {
    headline: string;
    body: string;
    cta?: string;
    url?: string;
  };
};

function validateLayoutSpec(layout: LayoutSpec) {
  const forbidden = new Set(
    [...ALL_FORBIDDEN_TOKENS, "glass", "neon", "metallic", "chrome", "cinematic", "photorealistic", "realistic"].map(
      (t) => t.toLowerCase()
    )
  );

  for (const rule of layout.rules) {
    const lower = rule.toLowerCase();
    for (const token of forbidden) {
      if (lower.includes(token)) {
        throw new Error(`Layout rule contiene estilo/material prohibido: "${token}"`);
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      brandId,
      brandLock,
      layoutSpec,
      referenceImageUrl,
      slides,
      textModel,
      imageModel,
      aspectRatio,
    } = body as {
      brandId?: string;
      brandLock: BrandLock;
      layoutSpec: LayoutSpec;
      referenceImageUrl: string;
      slides: SlideInput[];
      textModel?: string;
      imageModel?: string;
      aspectRatio?: string;
    };

    if (!brandLock || !layoutSpec || !referenceImageUrl || !slides?.length) {
      return NextResponse.json(
        { error: "Faltan brandLock, layoutSpec, referenceImageUrl o slides" },
        { status: 400 }
      );
    }

    if (!textModel || !imageModel) {
      return NextResponse.json(
        { error: "Debes proporcionar textModel e imageModel desde el panel de Admin." },
        { status: 400 }
      );
    }

    validateLayoutSpec(layoutSpec);

    const normalizedBrandId = brandId as Id<"brand_dna"> | undefined;

    const carouselId = await convex.mutation(api.pipeline.createCarousel, {
      brandId: normalizedBrandId,
      brandLock,
      layoutSpec,
    });

    const styleDNA = (await convex.action(api.pipeline.analyzeReferenceImage, {
      carouselId,
      imageUrl: referenceImageUrl,
      model: textModel,
    })) as StyleDNA;

    const adapter = buildStyleToBrandAdapter(styleDNA, brandLock);

    await convex.mutation(api.pipeline.saveAdapter, {
      carouselId,
      adapter,
    });

    const results: Array<{ slide: number; prompt: string; imageUrl?: string }> = [];

    for (const slideInput of slides) {
      const narrative = (await convex.action(api.pipeline.generateNarrativeSlide, {
        carouselId,
        slide: slideInput.slide,
        guidance: slideInput.guidance,
        context: slideInput.context,
        emotion: slideInput.emotion,
        model: textModel,
      })) as SanitizedNarrativeOut;

      const compiled = compilePrompt({
        brand: brandLock,
        style: styleDNA,
        adapter,
        layout: layoutSpec,
        narrative,
        text: slideInput.text,
      });

      await convex.mutation(api.pipeline.saveCompiledPrompt, {
        carouselId,
        slide: slideInput.slide,
        compiledPrompt: compiled,
      });

      const imageUrl = await generateImageFromPromptRaw(
        compiled.prompt,
        imageModel,
        aspectRatio
      );

      results.push({
        slide: slideInput.slide,
        prompt: compiled.prompt,
        imageUrl,
      });
    }

    return NextResponse.json({
      success: true,
      carouselId,
      styleDNA,
      results,
    });
  } catch (error: any) {
    console.error("Carousel generation error:", error);
    return NextResponse.json(
      { error: error?.message || "Error generando el carrusel" },
      { status: 500 }
    );
  }
}
