# Worker Result — 20260318_164458

**Model**: qwen3.5:9b
**Time**: 27s
**Tokens**: 422 prompt → 549 generated (20.54 tok/s)
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
     * Index position of the slide
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
     * Status of the slide generation
     */
    status: string;

    /**
     * URL to the slide image
     */
    imageUrl: string;

    /**
     * Metadata about the slide generation
     */
    metadata: {
        /**
         * ISO timestamp when the slide was generated
         */
        generatedAt: string;

        /**
         * AI model used for generation
         */
        model: string;

        /**
         * Number of tokens used in the prompt
         */
        promptTokens: number;

        /**
         * Number of tokens generated in completion
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
         * Width of the slide in pixels
         */
        width: number;

        /**
         * Height of the slide in pixels
         */
        height: number;
    };
}
```
