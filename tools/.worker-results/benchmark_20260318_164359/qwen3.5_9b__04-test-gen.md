# Worker Result — 20260318_164526

**Model**: qwen3.5:9b
**Time**: 46s
**Tokens**: 451 prompt → 903 generated (20.56 tok/s)
**Task**: Write a Vitest test file for the function below. Cover: 1) valid input returns processed object, 2) empty title returns null, 3) negative index returns null, 4) description over 500 chars returns null

## Response

```create:__tests__/processSlide.test.ts
import { describe, it, expect } from 'vitest';
import { processSlide } from '../processSlide';

describe('processSlide', () => {
    it('valid input returns processed object', () => {
        const input = {
            title: 'Test Slide',
            description: 'This is a test description',
            index: 5
        };
        const result = processSlide(input);
        expect(result).not.toBeNull();
        expect(result?.title).toBe('Test Slide');
        expect(result?.description).toBe('This is a test description');
        expect(result?.index).toBe(5);
        expect(result?.processedAt).toBeDefined();
    });

    it('empty title returns null', () => {
        const input = {
            title: '',
            description: 'Some description',
            index: 5
        };
        const result = processSlide(input);
        expect(result).toBeNull();
    });

    it('whitespace only title returns null', () => {
        const input = {
            title: '   ',
            description: 'Some description',
            index: 5
        };
        const result = processSlide(input);
        expect(result).toBeNull();
    });

    it('negative index returns null', () => {
        const input = {
            title: 'Test Slide',
            description: 'Some description',
            index: -1
        };
        const result = processSlide(input);
        expect(result).toBeNull();
    });

    it('index over 20 returns null', () => {
        const input = {
            title: 'Test Slide',
            description: 'Some description',
            index: 21
        };
        const result = processSlide(input);
        expect(result).toBeNull();
    });

    it('description over 500 chars returns null', () => {
        const longDescription = 'a'.repeat(501);
        const input = {
            title: 'Test Slide',
            description: longDescription,
            index: 5
        };
        const result = processSlide(input);
        expect(result).toBeNull();
    });

    it('description exactly 500 chars is valid', () => {
        const exactDescription = 'a'.repeat(500);
        const input = {
            title: 'Test Slide',
            description: exactDescription,
            index: 5
        };
        const result = processSlide(input);
        expect(result).not.toBeNull();
        expect(result?.description.length).toBe(500);
    });

    it('trims whitespace from title', () => {
        const input = {
            title: '  Trimmed Title  ',
            description: 'Some description',
            index: 5
        };
        const result = processSlide(input);
        expect(result?.title).toBe('Trimmed Title');
    });

    it('trims whitespace from description', () => {
        const input = {
            title: 'Test Slide',
            description: '  Trimmed Description  ',
            index: 5
        };
        const result = processSlide(input);
        expect(result?.description).toBe('Trimmed Description');
    });

    it('description with leading/trailing whitespace is trimmed', () => {
        const input = {
            title: 'Test Slide',
            description: '  Leading and trailing spaces  ',
            index: 5
        };
        const result = processSlide(input);
        expect(result?.description).toBe('Leading and trailing spaces');
    });
});
```
