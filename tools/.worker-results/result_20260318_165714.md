# Worker Result — 20260318_165714

**Model**: glm-5:cloud
**Time**: 8s
**Tokens**: 367 prompt → 582 generated (0 tok/s)
**Task**: Given the API response example below, generate a TypeScript type definition called 'ApiSlideResponse' that accurately types this JSON structure. Include JSDoc comments for each field. Output ONLY a ``

## Response

```create:types/api-slide.ts
/**
 * Represents the dimensions of a slide.
 */
export interface SlideDimensions {
  /** The width of the slide in pixels. */
  width: number;
  /** The height of the slide in pixels. */
  height: number;
}

/**
 * Metadata about the slide generation process.
 */
export interface SlideMetadata {
  /** ISO 8601 timestamp of when the slide was generated. */
  generatedAt: string;
  /** The AI model used to generate the slide content. */
  model: string;
  /** Number of tokens used in the prompt. */
  promptTokens: number;
  /** Number of tokens in the completion response. */
  completionTokens: number;
}

/**
 * API response representing a single slide.
 */
export interface ApiSlideResponse {
  /** Unique identifier for the slide. */
  id: string;
  /** Zero-based index position of the slide in a deck. */
  index: number;
  /** The title of the slide. */
  title: string;
  /** The main headline text displayed on the slide. */
  headline: string;
  /** A description or body text for the slide. */
  description: string;
  /** The current status of the slide (e.g., "done", "pending", "error"). */
  status: string;
  /** URL to the slide's image asset. */
  imageUrl: string;
  /** Metadata about the slide generation. */
  metadata: SlideMetadata;
  /** Array of tags associated with the slide. */
  tags: string[];
  /** The dimensions of the slide. */
  dimensions: SlideDimensions;
}
```
