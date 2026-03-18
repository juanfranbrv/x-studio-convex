# Worker Result — 20260318_164823

**Model**: gemma3:27b
**Time**: 67s
**Tokens**: 461 prompt → 468 generated (7.08 tok/s)
**Task**: Refactor this function: extract the validation logic into a separate function called 'validateSlideInput' that returns { valid: boolean, error?: string }. The main function should call validateSlideIn

## Response

```edit:src/processSlide.ts
<<<<
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
>>>>
export function processSlide(input: { title: string; description: string; index: number }) {
    const validationResult = validateSlideInput(input);
    if (!validationResult.valid) {
        console.error(validationResult.error);
        return null;
    }

    return {
        ...input,
        title: input.title.trim(),
        description: input.description?.trim() || '',
        processedAt: Date.now()
    };
}

function validateSlideInput(input: { title: string; description: string; index: number }) {
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
```
