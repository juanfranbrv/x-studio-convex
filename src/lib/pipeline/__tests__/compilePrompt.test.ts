import { describe, expect, it } from "vitest";
import { compilePrompt } from "../compilePrompt";
import type { BrandLock, LayoutSpec, SanitizedNarrativeOut, StyleDNA, StyleToBrandAdapterOut } from "../types";

const brand: BrandLock = {
  language: "es",
  palette: { fondo: "#f0e500", texto: "#141210", acento: "#ff6a00" },
  backgroundIsAbsolute: true,
  textRules: { allowOnlyTextField: true, forbidExtraText: true },
};

const layout: LayoutSpec = {
  blueprintId: "minimal",
  rules: ["Grid 2x2, text block top-left, subject bottom-right"],
};

const style: StyleDNA = {
  version: "1.0",
  source: "reference_image_analysis",
  family: "photo",
  render_medium: "digital photo",
  positives: ["clean contrast"],
  negatives: ["no blur", "no gradient"],
};

const adapter: StyleToBrandAdapterOut = {
  applicationRules: ["mantener realismo"],
  materialTranslationRules: [],
  degradationPolicy: {
    tierA_nonnegotiable: ["StyleDNA manda"],
    tierB_prefer: ["coherencia de color"],
    tierC_optional: ["simplificar"],
  },
};

describe("compilePrompt", () => {
  it("respects layer order and background guard", () => {
    const narrative: SanitizedNarrativeOut = {
      slide: 1,
      subject: "persona trabajando",
      lint: { removedTokens: [], changed: false, byField: {}, byCategory: {} },
      __sanitized: true,
    };

    const compiled = compilePrompt({
      brand,
      style,
      adapter,
      layout,
      narrative,
      text: { headline: "Titulo", body: "Cuerpo" },
    });

    const prompt = compiled.prompt;
    const indices = [
      prompt.indexOf("LAYER 0"),
      prompt.indexOf("LAYER 1"),
      prompt.indexOf("LAYER 2"),
      prompt.indexOf("LAYER 3"),
      prompt.indexOf("LAYER 4"),
      prompt.indexOf("LAYER 5"),
    ];

    for (let i = 1; i < indices.length; i += 1) {
      expect(indices[i]).toBeGreaterThan(indices[i - 1]);
    }

    expect(prompt).toContain("covering >=85% of canvas");
    expect(prompt).toContain("No black/dark fills");
  });

  it("rejects non-sanitized narrative", () => {
    const narrative = {
      slide: 1,
      subject: "persona trabajando",
      lint: { removedTokens: [], changed: false, byField: {}, byCategory: {} },
      __sanitized: false,
    } as unknown as SanitizedNarrativeOut;

    expect(() =>
      compilePrompt({
        brand,
        style,
        adapter,
        layout,
        narrative,
        text: { headline: "Titulo", body: "Cuerpo" },
      })
    ).toThrow();
  });
});
