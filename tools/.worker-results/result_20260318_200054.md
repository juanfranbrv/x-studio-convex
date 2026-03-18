# Worker Result — 20260318_200054

**Model**: glm-5:cloud
**Time**: 15s
**Tokens**: 404 prompt → 1484 generated (0 tok/s)
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
        expect(result?.processedAt).toBeDefined();
        expect(typeof result?.processedAt).toBe('number');
    });

    it('returns null when title is empty', () => {
        const input = { title: '', description: 'Test description', index: 0 };
        const result = processSlide(input);

        expect(result).toBeNull();
    });

    it('returns null when title is only whitespace', () => {
        const input = { title: '   ', description: 'Test description', index: 0 };
        const result = processSlide(input);

        expect(result).toBeNull();
    });

    it('returns null for negative index', () => {
        const input = { title: 'Test Title', description: 'Test description', index: -1 };
        const result = processSlide(input);

        expect(result).toBeNull();
    });

    it('returns null for index greater than 20', () => {
        const input = { title: 'Test Title', description: 'Test description', index: 21 };
        const result = processSlide(input);

        expect(result).toBeNull();
    });

    it('returns null when description exceeds 500 characters', () => {
        const longDescription = 'a'.repeat(501);
        const input = { title: 'Test Title', description: longDescription, index: 0 };
        const result = processSlide(input);

        expect(result).toBeNull();
    });

    it('accepts description of exactly 500 characters', () => {
        const exactDescription = 'a'.repeat(500);
        const input = { title: 'Test Title', description: exactDescription, index: 0 };
        const result = processSlide(input);

        expect(result).not.toBeNull();
        expect(result?.description).toBe(exactDescription);
    });

    it('trims whitespace from title', () => {
        const input = { title: '  Test Title  ', description: 'Test description', index: 0 };
        const result = processSlide(input);

        expect(result).not.toBeNull();
        expect(result?.title).toBe('Test Title');
    });

    it('trims whitespace from description', () => {
        const input = { title: 'Test Title', description: '  Test description  ', index: 0 };
        const result = processSlide(input);

        expect(result).not.toBeNull();
        expect(result?.description).toBe('Test description');
    });

    it('trims whitespace from both title and description', () => {
        const input = { title: '  Test Title  ', description: '  Test description  ', index: 5 };
        const result = processSlide(input);

        expect(result).not.toBeNull();
        expect(result?.title).toBe('Test Title');
        expect(result?.description).toBe('Test description');
    });

    it('returns empty string for description when undefined', () => {
        const input = { title: 'Test Title', description: undefined as unknown as string, index: 0 };
        const result = processSlide(input);

        expect(result).not.toBeNull();
        expect(result?.description).toBe('');
    });
});
```
