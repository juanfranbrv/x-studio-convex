# Worker Result — 20260318_193333

**Model**: gpt-oss:20b
**Time**: 14s
**Tokens**: 443 prompt → 570 generated (39.85 tok/s)
**Task**: Given the API response example below, generate a TypeScript type definition called 'ApiSlideResponse' that accurately types this JSON structure. Include JSDoc comments for each field. Output ONLY a ``

## Response

```create:types/api-slide.ts
export type ApiSlideResponse = {
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
  /** Metadata about generation */
  metadata: {
    /** ISO 8601 timestamp when generated */
    generatedAt: string;
    /** Model used for generation */
    model: string;
    /** Number of prompt tokens */
    promptTokens: number;
    /** Number of completion tokens */
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
};
```
