# Worker Result — 20260318_193349

**Model**: gpt-oss:20b
**Time**: 26s
**Tokens**: 476 prompt → 999 generated (39.42 tok/s)
**Task**: Write a Vitest test file for the function below. Cover: 1) valid input returns processed object, 2) empty title returns null, 3) negative index returns null, 4) description over 500 chars returns null

## Response

```create:__tests__/processSlide.test.ts
import { describe, it, expect } from 'vitest';
import { processSlide } from '../processSlide';

describe('processSlide', () => {
  it('returns processed object for valid input', () => {
    const input = { title: ' Slide ', description: ' Description ', index: 5 };
    const result = processSlide(input);
    expect(result).toBeTruthy();
    expect(result?.title).toBe('Slide');
    expect(result?.description).toBe('Description');
    expect(result?.index).toBe(5);
    expect(result?.processedAt).toBeDefined();
    expect(typeof result?.processedAt).toBe('number');
  });

  it('returns null for empty title', () => {
    const input = { title: '   ', description: 'Desc', index: 3 };
    const result = processSlide(input);
    expect(result).toBeNull();
  });

  it('returns null for negative index', () => {
    const input = { title: 'Title', description: 'Desc', index: -1 };
    const result = processSlide(input);
    expect(result).toBeNull();
  });

  it('returns null for description over 500 chars', () => {
    const longDesc = 'a'.repeat(501);
    const input = { title: 'Title', description: longDesc, index: 10 };
    const result = processSlide(input);
    expect(result).toBeNull();
  });

  it('trims whitespace from title and description', () => {
    const input = { title: '  Title  ', description: '  Desc  ', index: 2 };
    const result = processSlide(input);
    expect(result?.title).toBe('Title');
    expect(result?.description).toBe('Desc');
  });
});
```
