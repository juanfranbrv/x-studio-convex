# Worker Result — 20260318_175018

**Model**: qwen3.5:27b
**Time**: 1599s
**Tokens**: 451 prompt → 1012 generated (0.63 tok/s)
**Task**: Write a Vitest test file for the function below. Cover: 1) valid input returns processed object, 2) empty title returns null, 3) negative index returns null, 4) description over 500 chars returns null

## Response

```create:__tests__/processSlide.test.ts
import { describe, it, expect } from 'vitest';
import { processSlide } from '../processSlide';

describe('processSlide', () => {
  it('returns processed object for valid input', () => {
    const input = {
      title: 'Test Title',
      description: 'Test Description',
      index: 5
    };
    const result = processSlide(input);
    expect(result).not.toBeNull();
    expect(result?.title).toBe('Test Title');
    expect(result?.description).toBe('Test Description');
    expect(result?.index).toBe(5);
    expect(result?.processedAt).toBeDefined();
  });

  it('returns null for empty title', () => {
    const input = {
      title: '',
      description: 'Test Description',
      index: 5
    };
    const result = processSlide(input);
    expect(result).toBeNull();
  });

  it('returns null for negative index', () => {
    const input = {
      title: 'Test Title',
      description: 'Test Description',
      index: -1
    };
    const result = processSlide(input);
    expect(result).toBeNull();
  });

  it('returns null for description over 500 chars', () => {
    const input = {
      title: 'Test Title',
      description: 'x'.repeat(501),
      index: 5
    };
    const result = processSlide(input);
    expect(result).toBeNull();
  });

  it('trims whitespace from title and description', () => {
    const input = {
      title: '  Test Title  ',
      description: '  Test Description  ',
      index: 5
    };
    const result = processSlide(input);
    expect(result?.title).toBe('Test Title');
    expect(result?.description).toBe('Test Description');
  });
});
```
