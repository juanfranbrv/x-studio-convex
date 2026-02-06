import { describe, expect, it } from "vitest";
import { sanitizeGuidance, sanitizeNarrative } from "../sanitizer";
import type { NarrativeOut } from "../types";

describe("sanitizer", () => {
  it("removes background/style/lighting tokens across fields", async () => {
    const narrative: NarrativeOut = {
      slide: 1,
      subject: "Fondo negro mate con tipografia",
      context: "diseño premium con render",
      emotion: ["dramatic lighting", "calma"],
    };

    const sanitized = await sanitizeNarrative(narrative, {
      extraFields: {
        mood: "dark shadows, golden hour lighting",
      },
    });

    expect(sanitized.subject.toLowerCase()).not.toContain("fondo negro");
    expect(sanitized.context?.toLowerCase()).not.toContain("premium");
    expect(sanitized.emotion?.join(" ").toLowerCase()).not.toContain("dramatic");

    expect(sanitized.lint.byField.subject.length).toBeGreaterThan(0);
    expect(sanitized.lint.byCategory.background.length).toBeGreaterThan(0);
  });

  it("sanitizes guidance input", () => {
    const result = sanitizeGuidance("fondo negro y golden hour");
    expect(result.cleaned.toLowerCase()).not.toContain("fondo negro");
    expect(result.cleaned.toLowerCase()).not.toContain("golden hour");
    expect(result.lint.removedTokens.length).toBeGreaterThan(0);
  });
});
