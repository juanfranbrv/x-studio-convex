import type { StyleDNA } from "./types";

export function normalizeStyleDNA(style: StyleDNA): StyleDNA {
  if (style.family !== "line_art") return style;

  const cleanedPositives = style.positives.filter(
    (item) => !/chiaroscuro|dramatic|deep shadows/i.test(item)
  );
  const cleanedNegatives = style.negatives.filter(
    (item) => !/chiaroscuro|dramatic|deep shadows/i.test(item)
  );

  return {
    ...style,
    lighting: "flat/none",
    positives: Array.from(
      new Set([...cleanedPositives, "high contrast via crosshatching density"])
    ),
    negatives: Array.from(
      new Set([
        ...cleanedNegatives,
        "no black background fill",
        "black only for linework and text",
      ])
    ),
  };
}
