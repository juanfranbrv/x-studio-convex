# Worker Result — 20260318_164719

**Model**: gpt-oss:20b
**Time**: 18s
**Tokens**: 476 prompt → 769 generated (43.53 tok/s)
**Task**: Write a Vitest test file for the function below. Cover: 1) valid input returns processed object, 2) empty title returns null, 3) negative index returns null, 4) description over 500 chars returns null

## Response

```create:__tests__/processSlide.test.ts
import { describe, it, expect } from 'vitest';
import { processSlide } from '../processSlide';

describe('processSlide', () => {
    it('returns processed object for valid input', () => {
        const input = { title: 'Test', description: 'Desc', index: 5 };
        const result = processSlide(input);
        expect(result).not.toBeNull();
        expect(result?.title).toBe('Test');
        expect(result?.description).toBe('Desc');
        expect(result?.index).toBe(5);
        expect(typeof result?.processedAt).toBe('number');
    });

    it('returns null when title is empty', () => {
        const input = { title: '   ', description: 'Desc', index: 5 };
        const result = processSlide(input);
        expect(result).toBeNull();
    });

    it('returns null when index is negative', () => {
        const input = { title: 'Test', description: 'Desc', index: -1 };
        const result = processSlide(input);
        expect(result).toBeNull();
    });

    it('returns null when description exceeds 500 characters', () => {
        const longDesc = 'a'.repeat(501);
        const input = { title: 'Test', description: longDesc, index: 5 };
        const result = processSlide(input);
        expect(result).toBeNull();
    });

    it('trims whitespace from title and description', () => {
        const input = { title: '  Title  ', description: '  Desc  ', index: 10 };
        const result = processSlide(input);
        expect(result).not.toBeNull();
        expect(result?.title).toBe('Title');
        expect(result?.description).toBe('Desc');
    });
});
```
