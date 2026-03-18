# Worker Result — 20260318_193225

**Model**: gpt-oss:20b
**Time**: 66s
**Tokens**: 445 prompt → 2583 generated (39.11 tok/s)
**Task**: Refactor this function: extract the validation logic into a separate function called 'validateSlideInput' that returns { valid: boolean, error?: string }. The main function should call validateSlideIn

## Response

```edit:slideProcessor.ts
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
function validateSlideInput(input: { title: string; description: string; index: number }): { valid: boolean; error?: string } {
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
    const { valid, error } = validateSlideInput(input);
    if (!valid) {
        console.error(error);
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
