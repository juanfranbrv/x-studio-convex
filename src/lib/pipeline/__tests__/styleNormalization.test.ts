import { describe, expect, it } from "vitest";
import { normalizeStyleDNA } from "../styleNormalization";
import type { StyleDNA } from "../types";

describe("style normalization", () => {
  it("normalizes line_art lighting and guards against dark fill", () => {
    const input: StyleDNA = {
      version: "1.0",
      source: "reference_image_analysis",
      family: "line_art",
      render_medium: "ink on paper",
      lighting: "dramatic chiaroscuro",
      positives: ["dramatic", "chiaroscuro"],
      negatives: ["deep shadows"],
    };

    const output = normalizeStyleDNA(input);

    expect(output.lighting).toBe("flat/none");
    expect(output.positives.join(" ").toLowerCase()).not.toContain("chiaroscuro");
    expect(output.negatives.join(" ").toLowerCase()).not.toContain("dramatic");
    expect(output.negatives.join(" ").toLowerCase()).toContain("no black background fill");
  });
});
