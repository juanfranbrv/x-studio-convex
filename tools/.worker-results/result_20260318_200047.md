# Worker Result — 20260318_200047

**Model**: glm-5:cloud
**Time**: 6s
**Tokens**: 367 prompt → 542 generated (0 tok/s)
**Task**: Given the API response example below, generate a TypeScript type definition called 'ApiSlideResponse' that accurately types this JSON structure. Include JSDoc comments for each field. Output ONLY a ``

## Response

```create:types/api-slide.ts
/**
 * Represents the API response for a slide object.
 */
export type ApiSlideResponse = {
  /** Unique identifier for the slide. */
  id: string;

  /** Zero-based position of the slide in the deck. */
  index: number;

  /** Short title of the slide. */
  title: string;

  /** Main headline text displayed on the slide. */
  headline: string;

  /** Longer description or body text for the slide. */
  description: string;

  /** Current status of the slide (e.g., "done", "pending", "error"). */
  status: string;

  /** URL of the slide's image asset. */
  imageUrl: string;

  /** Metadata about the slide generation process. */
  metadata: {
    /** ISO 8601 timestamp when the slide was generated. */
    generatedAt: string;

    /** Name of the model used to generate the slide. */
    model: string;

    /** Number of tokens used in the prompt. */
    promptTokens: number;

    /** Number of tokens in the completion response. */
    completionTokens: number;
  };

  /** Array of tags associated with the slide. */
  tags: string[];

  /** Dimensions of the slide in pixels. */
  dimensions: {
    /** Width of the slide in pixels. */
    width: number;

    /** Height of the slide in pixels. */
    height: number;
  };
};
```
