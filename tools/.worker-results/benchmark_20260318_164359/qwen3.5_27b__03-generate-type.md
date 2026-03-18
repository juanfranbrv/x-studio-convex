# Worker Result — 20260318_173340

**Model**: qwen3.5:27b
**Time**: 996s
**Tokens**: 422 prompt → 630 generated (0.63 tok/s)
**Task**: Given the API response example below, generate a TypeScript type definition called 'ApiSlideResponse' that accurately types this JSON structure. Include JSDoc comments for each field. Output ONLY a ``

## Response

```create:types/api-slide.ts
/**
 * Represents the API response for a slide object.
 */
export interface ApiSlideResponse {
    /**
     * Unique identifier for the slide.
     */
    id: string;

    /**
     * The index position of the slide in a sequence.
     */
    index: number;

    /**
     * The title of the slide.
     */
    title: string;

    /**
     * The headline text displayed prominently on the slide.
     */
    headline: string;

    /**
     * A description of the slide content.
     */
    description: string;

    /**
     * The current status of the slide (e.g., "done", "pending").
     */
    status: string;

    /**
     * URL to the slide's image.
     */
    imageUrl: string;

    /**
     * Metadata about the slide generation.
     */
    metadata: {
        /**
         * ISO 8601 timestamp when the slide was generated.
         */
        generatedAt: string;

        /**
         * The AI model used to generate the slide.
         */
        model: string;

        /**
         * Number of tokens used in the prompt.
         */
        promptTokens: number;

        /**
         * Number of tokens in the completion.
         */
        completionTokens: number;
    };

    /**
     * Array of tags associated with the slide.
     */
    tags: string[];

    /**
     * The dimensions of the slide.
     */
    dimensions: {
        /**
         * Width in pixels.
         */
        width: number;

        /**
         * Height in pixels.
         */
        height: number;
    };
}
```
