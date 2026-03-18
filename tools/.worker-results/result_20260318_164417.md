# Worker Result — 20260318_164417

**Model**: qwen3.5:9b
**Time**: 39s
**Tokens**: 418 prompt → 791 generated (20.28 tok/s)
**Task**: Refactor this function: extract the validation logic into a separate function called 'validateSlideInput' that returns { valid: boolean, error?: string }. The main function should call validateSlideIn

## Response

```edit:path/to/file
<<<< SEARCH
export function processSlide(input: { title: string; description: string; index: number }) {
    if (!input.title || input.title.trim().length === 0) {
        console.error('Title is required');
        return null;
    }
    if (input.index < 0 || input.index > 20) {
        console.error('Index must be between 0 and 20');
        return null;
    }
    if (input.description && input.description.length > 500) {
        console.error('Description too long');
        return null;
    }
    return {
        ...input,
        title: input.title.trim(),
        description: input.description?.trim() || '',
        processedAt: Date.now()
    };
}
====
export function validateSlideInput(input: { title: string; description: string; index: number }) {
    if (!input.title || input.title.trim().length === 0) {
        return { valid: false, error: 'Title is required' };
    }
    if (input.index < 0 || input.index > 20) {
        return { valid: false, error: 'Index must be between 0 and 20' };
    }
    if (input.description && input.description.length > 500) {
        return { valid: false, error: 'Description too long' };
    }
    return { valid: true };
}

export function processSlide(input: { title: string; description: string; index: number }) {
    const validation = validateSlideInput(input);
    if (!validation.valid) {
        console.error(validation.error);
        return null;
    }
    return {
        ...input,
        title: input.title.trim(),
        description: input.description?.trim() || '',
        processedAt: Date.now()
    };
}
>>>> END
```
