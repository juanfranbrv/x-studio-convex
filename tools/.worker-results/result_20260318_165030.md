# Worker Result — 20260318_165030

**Model**: gemma3:27b
**Time**: 54s
**Tokens**: 496 prompt → 385 generated (7.14 tok/s)
**Task**: Write a Vitest test file for the function below. Cover: 1) valid input returns processed object, 2) empty title returns null, 3) negative index returns null, 4) description over 500 chars returns null

## Response

```create:__tests__/processSlide.test.ts
import { processSlide } from '../src/processSlide';

describe('processSlide', () => {
  it('should return processed object for valid input', () => {
    const input = { title: 'Test Title', description: 'Test Description', index: 1 };
    const expected = { ...input, title: 'Test Title', description: 'Test Description', processedAt: expect.any(Number) };
    expect(processSlide(input)).toEqual(expected);
  });

  it('should return null for empty title', () => {
    const input = { title: '', description: 'Test Description', index: 1 };
    expect(processSlide(input)).toBeNull();
  });

  it('should return null for negative index', () => {
    const input = { title: 'Test Title', description: 'Test Description', index: -1 };
    expect(processSlide(input)).toBeNull();
  });

  it('should return null for description over 500 characters', () => {
    const longDescription = 'a'.repeat(501);
    const input = { title: 'Test Title', description: longDescription, index: 1 };
    expect(processSlide(input)).toBeNull();
  });

  it('should trim whitespace from title and description', () => {
    const input = { title: '  Test Title  ', description: '  Test Description  ', index: 1 };
    const expected = { ...input, title: 'Test Title', description: 'Test Description', processedAt: expect.any(Number) };
    expect(processSlide(input)).toEqual(expected);
  });
});
```
