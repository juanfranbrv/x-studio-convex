# Worker Result — 20260318_165725

**Model**: glm-5:cloud
**Time**: 11s
**Tokens**: 404 prompt → 1036 generated (0 tok/s)
**Task**: Write a Vitest test file for the function below. Cover: 1) valid input returns processed object, 2) empty title returns null, 3) negative index returns null, 4) description over 500 chars returns null

## Response

```create:__tests__/processSlide.test.ts
import { describe, it, expect } from 'vitest';
import { processSlide } from '../processSlide';

describe('processSlide', () => {
    it('returns processed object for valid input', () => {
        const input = { title: 'Test Title', description: 'Test description', index: 5 };
        const result = processSlide(input);

        expect(result).not.toBeNull();
        expect(result?.title).toBe('Test Title');
        expect(result?.description).toBe('Test description');
        expect(result?.index).toBe(5);
        expect(result).toHaveProperty('processedAt');
    });

    it('returns null for empty title', () => {
        const input = { title: '', description: 'Test description', index: 5 };
        expect(processSlide(input)).toBeNull();
    });

    it('returns null for whitespace-only title', () => {
        const input = { title: '   ', description: 'Test description', index: 5 };
        expect(processSlide(input)).toBeNull();
    });

    it('returns null for negative index', () => {
        const input = { title: 'Test Title', description: 'Test description', index: -1 };
        expect(processSlide(input)).toBeNull();
    });

    it('returns null for description over 500 chars', () => {
        const input = { title: 'Test Title', description: 'a'.repeat(501), index: 5 };
        expect(processSlide(input)).toBeNull();
    });

    it('trims whitespace from title and description', () => {
        const input = { title: '  Test Title  ', description: '  Test description  ', index: 5 };
        const result = processSlide(input);

        expect(result).not.toBeNull();
        expect(result?.title).toBe('Test Title');
        expect(result?.description).toBe('Test description');
    });
});
```
