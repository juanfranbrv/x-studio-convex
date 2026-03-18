# Worker Result — 20260318_164703

**Model**: gpt-oss:20b
**Time**: 15s
**Tokens**: 443 prompt → 617 generated (43.4 tok/s)
**Task**: Given the API response example below, generate a TypeScript type definition called 'ApiSlideResponse' that accurately types this JSON structure. Include JSDoc comments for each field. Output ONLY a ``

## Response

```create:types/api-slide.ts
// TypeScript type definition for API slide response
export interface ApiSlideResponse {
    /** Unique identifier for the slide */
    id: string;
    /** Zero-based index of the slide */
    index: number;
    /** Title of the slide */
    title: string;
    /** Headline text */
    headline: string;
    /** Description text */
    description: string;
    /** Status of the slide */
    status: string;
    /** URL to the slide image */
    imageUrl: string;
    /** Metadata about the slide generation */
    metadata: {
        /** ISO 8601 timestamp when the slide was generated */
        generatedAt: string;
        /** Model used for generation */
        model: string;
        /** Number of prompt tokens used */
        promptTokens: number;
        /** Number of completion tokens generated */
        completionTokens: number;
    };
    /** Tags associated with the slide */
    tags: string[];
    /** Dimensions of the slide image */
    dimensions: {
        /** Width in pixels */
        width: number;
        /** Height in pixels */
        height: number;
    };
}
```
