# Worker Result — 20260318_164931

**Model**: gemma3:27b
**Time**: 59s
**Tokens**: 452 prompt → 413 generated (7.17 tok/s)
**Task**: Given the API response example below, generate a TypeScript type definition called 'ApiSlideResponse' that accurately types this JSON structure. Include JSDoc comments for each field. Output ONLY a ``

## Response

```create:types/api-slide.ts
/**
 * Represents the response from the API for a single slide.
 */
type ApiSlideResponse = {
  /**
   * The unique identifier for the slide.
   */
  id: string;
  /**
   * The index of the slide in a sequence.
   */
  index: number;
  /**
   * The title of the slide.
   */
  title: string;
  /**
   * The headline text for the slide.
   */
  headline: string;
  /**
   * A description for the slide.
   */
  description: string;
  /**
   * The status of the slide (e.g., "done", "pending").
   */
  status: string;
  /**
   * URL of the image associated with the slide.
   */
  imageUrl: string;
  /**
   * Metadata about the slide generation process.
   */
  metadata: {
    /**
     * Timestamp indicating when the slide was generated.
     */
    generatedAt: string;
    /**
     * The model used to generate the slide.
     */
    model: string;
    /**
     * The number of prompt tokens used.
     */
    promptTokens: number;
    /**
     * The number of completion tokens used.
     */
    completionTokens: number;
  };
  /**
   * An array of tags associated with the slide.
   */
  tags: string[];
  /**
   * The dimensions of the slide image.
   */
  dimensions: {
    /**
     * The width of the slide image.
     */
    width: number;
    /**
     * The height of the slide image.
     */
    height: number;
  };
};
```
