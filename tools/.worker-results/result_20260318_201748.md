# Worker Result — 20260318_201748

**Model**: qwen3.5:9b
**Time**: 30s
**Tokens**: 422 prompt → 571 generated (19.31 tok/s)
**Task**: Given the API response example below, generate a TypeScript type definition called 'ApiSlideResponse' that accurately types this JSON structure. Include JSDoc comments for each field. Output ONLY a ``

## Response

```create:types/api-slide.ts
/**
 * Represents a slide response from the API
 */
export interface ApiSlideResponse {
  /**
   * Unique identifier for the slide
   */
  id: string;

  /**
   * Position index of the slide in the sequence
   */
  index: number;

  /**
   * Title of the slide
   */
  title: string;

  /**
   * Headline text for the slide
   */
  headline: string;

  /**
   * Description of the slide
   */
  description: string;

  /**
   * Status of the slide (e.g., 'done', 'processing', 'failed')
   */
  status: string;

  /**
   * URL to the slide image
   */
  imageUrl: string;

  /**
   * Metadata information about the slide generation
   */
  metadata: {
    /**
     * ISO 8601 timestamp when the slide was generated
     */
    generatedAt: string;

    /**
     * AI model used to generate the slide
     */
    model: string;

    /**
     * Number of tokens used in the prompt
     */
    promptTokens: number;

    /**
     * Number of tokens generated in the completion
     */
    completionTokens: number;
  };

  /**
   * Array of tags associated with the slide
   */
  tags: string[];

  /**
   * Dimensions of the slide image
   */
  dimensions: {
    /**
     * Width of the image in pixels
     */
    width: number;

    /**
     * Height of the image in pixels
     */
    height: number;
  };
}
```
