# Worker Result — 20260318_193416

**Model**: gpt-oss:20b
**Time**: 14s
**Tokens**: 431 prompt → 520 generated (40.25 tok/s)
**Task**: Add a new 'priority' field (type: 'low' | 'medium' | 'high', default 'medium') to the CarouselSlide type AND update the createSlide factory function to accept and default it. Show edit blocks for BOTH

## Response

```edit:types/carousel.ts
<<<< SEARCH
export interface CarouselSlide {
    index: number
    headline?: string
    title: string
    description: string
    status: 'pending' | 'generating' | 'done' | 'error'
}
====
export interface CarouselSlide {
    index: number
    headline?: string
    title: string
    description: string
    status: 'pending' | 'generating' | 'done' | 'error'
    priority: 'low' | 'medium' | 'high'
}
>>>> END
```

```edit:utils/slideFactory.ts
<<<< SEARCH
export function createSlide(params: { title: string; description: string; index: number }): CarouselSlide {
    return {
        index: params.index,
        title: params.title,
        description: params.description,
        status: 'pending'
    }
}
====
export function createSlide(params: { title: string; description: string; index: number; priority?: 'low' | 'medium' | 'high' }): CarouselSlide {
    return {
        index: params.index,
        title: params.title,
        description: params.description,
        status: 'pending',
        priority: params.priority ?? 'medium'
    }
}
>>>> END
```
