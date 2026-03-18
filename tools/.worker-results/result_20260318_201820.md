# Worker Result — 20260318_201820

**Model**: qwen3.5:9b
**Time**: 41s
**Tokens**: 451 prompt → 781 generated (19.23 tok/s)
**Task**: Write a Vitest test file for the function below. Cover: 1) valid input returns processed object, 2) empty title returns null, 3) negative index returns null, 4) description over 500 chars returns null

## Response

```create:__tests__/processSlide.test.ts
import { processSlide } from '../processSlide';

describe('processSlide', () => {
    it('returns processed object for valid input', () => {
        const input = {
            title: 'Test Slide',
            description: 'This is a test description',
            index: 5
        };
        const result = processSlide(input);
        expect(result).not.toBeNull();
        expect(result.title).toBe('Test Slide');
        expect(result.description).toBe('This is a test description');
        expect(result.index).toBe(5);
        expect(result.processedAt).toBeDefined();
    });

    it('returns null for empty title', () => {
        const input = {
            title: '',
            description: 'Some description',
            index: 5
        };
        const result = processSlide(input);
        expect(result).toBeNull();
    });

    it('returns null for whitespace-only title', () => {
        const input = {
            title: '   ',
            description: 'Some description',
            index: 5
        };
        const result = processSlide(input);
        expect(result).toBeNull();
    });

    it('returns null for negative index', () => {
        const input = {
            title: 'Test Slide',
            description: 'Some description',
            index: -1
        };
        const result = processSlide(input);
        expect(result).toBeNull();
    });

    it('returns null for index greater than 20', () => {
        const input = {
            title: 'Test Slide',
            description: 'Some description',
            index: 21
        };
        const result = processSlide(input);
        expect(result).toBeNull();
    });

    it('returns null for description over 500 characters', () => {
        const longDescription = 'a'.repeat(501);
        const input = {
            title: 'Test Slide',
            description: longDescription,
            index: 5
        };
        const result = processSlide(input);
        expect(result).toBeNull();
    });

    it('trims whitespace from title', () => {
        const input = {
            title: '  Trimmed Title  ',
            description: 'Some description',
            index: 5
        };
        const result = processSlide(input);
        expect(result.title).toBe('Trimmed Title');
    });

    it('trims whitespace from description', () => {
        const input = {
            title: 'Test Slide',
            description: '  Trimmed Description  ',
            index: 5
        };
        const result = processSlide(input);
        expect(result.description).toBe('Trimmed Description');
    });

    it('handles undefined description by returning empty string', () => {
        const input = {
            title: 'Test Slide',
            description: undefined,
            index: 5
        };
        const result = processSlide(input);
        expect(result.description).toBe('');
    });
});
```
