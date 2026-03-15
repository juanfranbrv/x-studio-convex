# AI Prompt Generator Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a ✨ "generate prompt for me" button in image and carousel modules that calls the configured AI model using brand kit context to fill the user's textarea, with all system prompts editable from a new admin "Prompts" tab.

**Architecture:** New `system_prompts` Convex table stores per-module prompt templates with `{{variable}}` placeholders. A new `/api/generate-user-prompt` route fetches the template, injects brand kit data + preferred language, calls the configured `model_intelligence`, and returns a user-facing prompt string. The ✨ button is added to `PromptCard` (image) and `CarouselControlsPanel` (carousel). Admin gets a new "Prompts" tab for CRUD. Brand kit page gains a language selector for `preferred_language`.

**Tech Stack:** Next.js 15 App Router, Convex (backend), TypeScript, shadcn/ui, lucide-react, i18next

---

## Chunk 1: Convex — system_prompts table + CRUD

### Task 1: Add system_prompts table to schema

**Files:**
- Modify: `convex/schema.ts`

- [ ] Open `convex/schema.ts` and add the new table after `app_settings`:

```typescript
system_prompts: defineTable({
  key: v.string(),           // e.g. "generate_user_prompt_image", "generate_user_prompt_carousel"
  name: v.string(),          // Human-readable name shown in admin
  body: v.string(),          // Prompt template with {{variable}} placeholders
  description: v.optional(v.string()),
  updated_at: v.string(),
  updated_by: v.optional(v.string()),
}).index("by_key", ["key"]),
```

- [ ] Run `npx convex dev` (or check it's running) — schema change applies automatically on next push. No migration needed for new tables.

- [ ] Commit:
```bash
rtk git add convex/schema.ts && rtk git commit -m "feat: add system_prompts table to schema"
```

---

### Task 2: Create Convex queries and mutations for system_prompts

**Files:**
- Create: `convex/systemPrompts.ts`

- [ ] Create `convex/systemPrompts.ts`:

```typescript
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByKey = query({
    args: { key: v.string() },
    handler: async (ctx, { key }) => {
        return await ctx.db
            .query("system_prompts")
            .withIndex("by_key", (q) => q.eq("key", key))
            .first();
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("system_prompts").collect();
    },
});

export const upsert = mutation({
    args: {
        key: v.string(),
        name: v.string(),
        body: v.string(),
        description: v.optional(v.string()),
        updated_by: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("system_prompts")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .first();

        const timestamp = new Date().toISOString();

        if (existing) {
            await ctx.db.patch(existing._id, {
                name: args.name,
                body: args.body,
                description: args.description,
                updated_at: timestamp,
                updated_by: args.updated_by,
            });
            return existing._id;
        } else {
            return await ctx.db.insert("system_prompts", {
                key: args.key,
                name: args.name,
                body: args.body,
                description: args.description,
                updated_at: timestamp,
                updated_by: args.updated_by,
            });
        }
    },
});

export const remove = mutation({
    args: { id: v.id("system_prompts") },
    handler: async (ctx, { id }) => {
        await ctx.db.delete(id);
    },
});
```

- [ ] Commit:
```bash
rtk git add convex/systemPrompts.ts && rtk git commit -m "feat: add system_prompts Convex queries and mutations"
```

---

### Task 3: Seed default prompts via admin API route

**Files:**
- Create: `src/app/api/admin/seed-prompts/route.ts`

These are the two default prompts. Variables injected at runtime: `{{brand_name}}`, `{{tone_of_voice}}`, `{{target_audience}}`, `{{business_overview}}`, `{{brand_values}}`, `{{marketing_hooks}}`, `{{language}}`, `{{module}}`.

- [ ] Create `src/app/api/admin/seed-prompts/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/../convex/_generated/api'

const DEFAULT_PROMPTS = [
    {
        key: 'generate_user_prompt_image',
        name: 'Generate user prompt — Image',
        description: 'Used when the user clicks ✨ in the image module to get inspiration for their prompt.',
        body: `You are a creative social media expert specialized in visual content.

A user wants to create a social media IMAGE post but doesn't know what to publish.

Brand context:
- Brand: {{brand_name}}
- Business: {{business_overview}}
- Tone of voice: {{tone_of_voice}}
- Target audience: {{target_audience}}
- Brand values: {{brand_values}}
- Marketing hooks: {{marketing_hooks}}

Generate ONE compelling image prompt in {{language}} that:
1. Is specific and visually descriptive (colors, composition, mood, subject)
2. Connects with the brand's tone and audience
3. Would make an engaging social media post
4. Is 1-3 sentences maximum

Return ONLY the prompt text, nothing else. No explanations, no labels, no quotes.`,
    },
    {
        key: 'generate_user_prompt_carousel',
        name: 'Generate user prompt — Carousel',
        description: 'Used when the user clicks ✨ in the carousel module to get inspiration for their prompt.',
        body: `You are a creative social media strategist specialized in carousel content.

A user wants to create a social media CAROUSEL post but doesn't know what topic to cover.

Brand context:
- Brand: {{brand_name}}
- Business: {{business_overview}}
- Tone of voice: {{tone_of_voice}}
- Target audience: {{target_audience}}
- Brand values: {{brand_values}}
- Marketing hooks: {{marketing_hooks}}

Generate ONE compelling carousel idea in {{language}} that:
1. Has a clear educational or storytelling angle (tips, steps, story, comparison)
2. Connects with the brand's tone and audience
3. Would generate saves and shares on social media
4. Is 1-3 sentences describing the topic and angle

Return ONLY the prompt text, nothing else. No explanations, no labels, no quotes.`,
    },
]

export async function POST() {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
    if (!convexUrl) return NextResponse.json({ error: 'No Convex URL' }, { status: 500 })

    const convex = new ConvexHttpClient(convexUrl)

    for (const prompt of DEFAULT_PROMPTS) {
        await convex.mutation(api.systemPrompts.upsert, {
            ...prompt,
            updated_by: userId,
        })
    }

    return NextResponse.json({ success: true, seeded: DEFAULT_PROMPTS.length })
}
```

- [ ] Commit:
```bash
rtk git add src/app/api/admin/seed-prompts/route.ts && rtk git commit -m "feat: add seed-prompts admin route with default prompts"
```

---

## Chunk 2: API Route — generate-user-prompt

### Task 4: Create /api/generate-user-prompt route

**Files:**
- Create: `src/app/api/generate-user-prompt/route.ts`
- Reference: `src/app/api/generate-text/route.ts` (pattern to follow)
- Reference: `src/lib/gemini.ts` (for model resolution)

This route:
1. Authenticates the user
2. Receives `{ module: 'image' | 'carousel', brandKitId: string }`
3. Fetches the system prompt template from `system_prompts` by key
4. Fetches user's brand kit from `brand_dna`
5. Fetches `model_intelligence` from `app_settings`
6. Injects brand kit variables into the template
7. Calls the intelligence model
8. Returns `{ text: string }`

- [ ] Create `src/app/api/generate-user-prompt/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/../convex/_generated/api'
import { log } from '@/lib/logger'
import type { Id } from '@/../convex/_generated/dataModel'

const LANGUAGE_NAMES: Record<string, string> = {
    es: 'Spanish',
    en: 'English',
    fr: 'French',
    de: 'German',
    pt: 'Portuguese',
    it: 'Italian',
    ca: 'Catalan',
}

function injectVariables(template: string, vars: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '')
}

async function callIntelligenceModel(model: string, prompt: string): Promise<string> {
    // Resolve provider from model prefix (e.g. "wisdom/gemini-3-flash-preview")
    const [provider] = model.split('/')

    if (provider === 'google' || !model.includes('/')) {
        const { getGoogleTextGenerativeModel } = await import('@/lib/gemini')
        const modelId = model.includes('/') ? model.split('/').slice(1).join('/') : model
        const instance = await getGoogleTextGenerativeModel(modelId)
        const result = await instance.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.85, maxOutputTokens: 300 },
        })
        return result.response.text()?.trim() || ''
    }

    // For wisdom, naga, atlas — they share the same OpenAI-compatible API pattern
    // Fallback: use google flash if provider not directly supported here
    const { getGoogleTextGenerativeModel } = await import('@/lib/gemini')
    const instance = await getGoogleTextGenerativeModel('gemini-2.0-flash-lite')
    const result = await instance.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.85, maxOutputTokens: 300 },
    })
    return result.response.text()?.trim() || ''
}

export async function POST(request: NextRequest) {
    const startedAt = Date.now()
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { module, brandKitId } = body as { module: 'image' | 'carousel'; brandKitId: string }

        if (!module || !brandKitId) {
            return NextResponse.json({ error: 'module and brandKitId are required' }, { status: 400 })
        }

        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
        if (!convexUrl) return NextResponse.json({ error: 'No Convex URL' }, { status: 500 })
        const convex = new ConvexHttpClient(convexUrl)

        // Fetch in parallel: system prompt template, brand kit, AI config
        const promptKey = `generate_user_prompt_${module}`
        const [promptTemplate, brandKit, aiConfig] = await Promise.all([
            convex.query(api.systemPrompts.getByKey, { key: promptKey }),
            convex.query(api.brands.getBrandDNAById, { id: brandKitId as Id<'brand_dna'> }),
            convex.query(api.settings.getAIConfig),
        ])

        if (!promptTemplate) {
            return NextResponse.json({ error: `No prompt template found for key: ${promptKey}` }, { status: 404 })
        }

        if (!brandKit) {
            return NextResponse.json({ error: 'Brand kit not found' }, { status: 404 })
        }

        // Build variable map from brand kit
        const langCode = brandKit.preferred_language || 'es'
        const langName = LANGUAGE_NAMES[langCode] || 'Spanish'
        const textAssets = brandKit.text_assets as { marketing_hooks?: string[]; ctas?: string[]; brand_context?: string } | undefined

        const variables: Record<string, string> = {
            brand_name: brandKit.brand_name || '',
            business_overview: brandKit.business_overview || '',
            tone_of_voice: (brandKit.tone_of_voice || []).join(', '),
            target_audience: (brandKit.target_audience || []).join(', '),
            brand_values: (brandKit.brand_values || []).join(', '),
            marketing_hooks: (textAssets?.marketing_hooks || []).slice(0, 3).join(', '),
            language: langName,
            module,
        }

        const compiledPrompt = injectVariables(promptTemplate.body, variables)
        log.info('PROMPT_GEN', `generate-user-prompt | module=${module} model=${aiConfig.intelligenceModel}`)

        const text = await callIntelligenceModel(aiConfig.intelligenceModel, compiledPrompt)

        log.success('PROMPT_GEN', `generate-user-prompt done | ${Date.now() - startedAt}ms`)

        return NextResponse.json({ success: true, text })

    } catch (error: unknown) {
        log.error('PROMPT_GEN', 'generate-user-prompt failed', error)
        const details = error instanceof Error ? error.message : String(error)
        return NextResponse.json({ error: 'Error generating prompt', details }, { status: 500 })
    }
}
```

- [ ] Check that `api.brands.getBrandDNAById` exists in `convex/brands.ts`. If it doesn't, find the correct query name and update the import accordingly.

- [ ] Commit:
```bash
rtk git add src/app/api/generate-user-prompt/route.ts && rtk git commit -m "feat: add generate-user-prompt API route"
```

---

## Chunk 3: UI — PromptCard (Image module)

### Task 5: Add ✨ inspire button to PromptCard

**Files:**
- Modify: `src/components/studio/PromptCard.tsx`

The button appears when the textarea is EMPTY (the user has nothing written yet). It shows a loading spinner while generating. On success the generated text fills the textarea.

- [ ] Read `src/components/studio/PromptCard.tsx` fully to understand current structure (already done — 104 lines).

- [ ] Update `PromptCard.tsx` with new props and button:

**New props to add to `PromptCardProps`:**
```typescript
onInspire?: () => void
isInspiring?: boolean
```

**New button — insert ABOVE the existing `<textarea>` wrapper div, inside the `flex gap-3` div, before the `<div className="flex-1 relative">`:**

Place a small icon-only button to the left of the textarea area, or better: place it INSIDE the textarea's absolute-positioned area (top-left corner when empty). The cleanest approach: add a small icon button below the textarea when it's empty.

Actually the best UX: add a `Wand2` icon button that appears at the top-left inside the textarea when `value` is empty, similar to the existing Sparkles at top-right.

**Full updated file:**

```typescript
'use client'

import { Loader2 } from '@/components/ui/spinner'
import { useState } from 'react'
import { Sparkles, Send, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

interface PromptCardProps {
    value: string
    onChange: (value: string) => void
    onAnalyze: () => void
    onGenerate: () => void
    isAnalyzing?: boolean
    isGenerating?: boolean
    canGenerate?: boolean
    hasGeneratedImage?: boolean
    placeholder?: string
    onInspire?: () => void
    isInspiring?: boolean
}

export function PromptCard({
    value,
    onChange,
    onAnalyze,
    onGenerate,
    isAnalyzing = false,
    isGenerating = false,
    canGenerate = false,
    hasGeneratedImage = false,
    placeholder,
    onInspire,
    isInspiring = false,
}: PromptCardProps) {
    const { t } = useTranslation('common')
    const isLoading = isAnalyzing || isGenerating

    const handleSubmit = () => {
        if (hasGeneratedImage) {
            onGenerate()
        } else if (canGenerate) {
            onGenerate()
        } else {
            onAnalyze()
        }
    }

    const getButtonLabel = () => {
        if (isGenerating) return t('promptCard.generating', { defaultValue: 'Generating...' })
        if (isAnalyzing) return t('promptCard.analyzing', { defaultValue: 'Analyzing...' })
        if (hasGeneratedImage) return t('promptCard.apply', { defaultValue: 'Apply' })
        if (canGenerate) return t('promptCard.generate', { defaultValue: 'Generate' })
        return t('promptCard.analyze', { defaultValue: 'Analyze' })
    }

    const getPlaceholder = () => {
        if (hasGeneratedImage) {
            return t('promptCard.editPlaceholder', { defaultValue: "Describe the changes: 'make it darker', 'change the background'..." })
        }
        return placeholder || t('promptCard.createPlaceholder', { defaultValue: 'Describe what you want to create...' })
    }

    return (
        <div className="rounded-xl border border-border/60 bg-card/70 p-4">
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <textarea
                        id="prompt-card-input"
                        aria-label={hasGeneratedImage
                            ? t('promptCard.editAria', { defaultValue: 'Edit generated image prompt' })
                            : t('promptCard.createAria', { defaultValue: 'Prompt to generate image' })}
                        placeholder={getPlaceholder()}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full min-h-[60px] max-h-[120px] text-sm p-3 pr-10 rounded-xl border border-border/60 bg-background/70 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors placeholder:text-muted-foreground/70"
                        rows={2}
                    />
                    {!hasGeneratedImage && value.trim() && (
                        <button
                            type="button"
                            onClick={onAnalyze}
                            disabled={isLoading}
                            className="absolute right-3 top-3 text-primary/70 hover:text-primary transition-colors disabled:opacity-50"
                            title={t('promptCard.analyzeWithAi', { defaultValue: 'Analyze with AI' })}
                        >
                            <Sparkles className="w-4 h-4" />
                        </button>
                    )}
                    {!hasGeneratedImage && !value.trim() && onInspire && (
                        <button
                            type="button"
                            onClick={onInspire}
                            disabled={isInspiring || isLoading}
                            className="absolute right-3 top-3 text-primary/70 hover:text-primary transition-colors disabled:opacity-50"
                            title={t('promptCard.inspireMe', { defaultValue: 'Generate a prompt idea for me' })}
                        >
                            {isInspiring ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Wand2 className="w-4 h-4" />
                            )}
                        </button>
                    )}
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading || (!canGenerate && !hasGeneratedImage && !value.trim())}
                    className="h-auto px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4" />
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            {getButtonLabel()}
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
```

- [ ] Commit:
```bash
rtk git add src/components/studio/PromptCard.tsx && rtk git commit -m "feat: add inspire (Wand2) button to PromptCard when textarea is empty"
```

---

### Task 6: Wire PromptCard inspire button in image page

**Files:**
- Modify: `src/app/image/page.tsx`

Find where `<PromptCard>` is rendered (search for `<PromptCard`) and add `onInspire` and `isInspiring` props.

- [ ] Find the `<PromptCard` usage in `src/app/image/page.tsx`:
```bash
grep -n "PromptCard\|onInspire\|isInspiring" src/app/image/page.tsx
```

- [ ] Add state near the top of the component (with other useState declarations):
```typescript
const [isInspiring, setIsInspiring] = useState(false)
```

- [ ] Add the `handleInspire` function (near other handlers, after finding where `activeBrandKit` and `promptValue`/`setPromptValue` are used):
```typescript
const handleInspire = async () => {
    if (!activeBrandKit?.id || isInspiring) return
    setIsInspiring(true)
    try {
        const res = await fetch('/api/generate-user-prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module: 'image', brandKitId: activeBrandKit.id }),
        })
        const data = await res.json()
        if (data.success && data.text) {
            // Find and update the prompt value — use the same setter used for the textarea
            setPromptValue(data.text)  // adjust variable name to match actual state variable
        }
    } catch (err) {
        console.error('Failed to generate prompt inspiration:', err)
    } finally {
        setIsInspiring(false)
    }
}
```

- [ ] Add `onInspire={handleInspire}` and `isInspiring={isInspiring}` to the `<PromptCard` JSX element.

- [ ] Check exact state variable name for prompt by searching:
```bash
grep -n "promptValue\|setPromptValue\|prompt.*useState\|useState.*prompt" src/app/image/page.tsx | head -10
```

- [ ] Commit:
```bash
rtk git add src/app/image/page.tsx && rtk git commit -m "feat: wire inspire handler in image page"
```

---

## Chunk 4: UI — Carousel module inspire button

### Task 7: Add ✨ inspire button to CarouselControlsPanel

**Files:**
- Modify: `src/components/studio/carousel/CarouselControlsPanel.tsx`

- [ ] Find the `<Textarea` for the prompt in the carousel panel:
```bash
grep -n "Textarea\|setPrompt\|prompt.*value\|value.*prompt" src/components/studio/carousel/CarouselControlsPanel.tsx | head -20
```

- [ ] Add `isInspiring` state near other state declarations:
```typescript
const [isInspiring, setIsInspiring] = useState(false)
```

- [ ] Add `handleInspire` function (near other handlers):
```typescript
const handleInspire = async () => {
    const brandKitId = (brandKit?.id || (brandKit as any)?._id) as string | undefined
    if (!brandKitId || isInspiring) return
    setIsInspiring(true)
    try {
        const res = await fetch('/api/generate-user-prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module: 'carousel', brandKitId }),
        })
        const data = await res.json()
        if (data.success && data.text) {
            setPrompt(data.text)
        }
    } catch (err) {
        console.error('Failed to generate prompt inspiration:', err)
    } finally {
        setIsInspiring(false)
    }
}
```

- [ ] Find the `<Textarea` at line ~2830 and add the inspire icon button. The pattern: wrap the Textarea in a `relative` div, and add the `Wand2` icon button positioned absolute at top-right when `prompt` is empty:

```tsx
<div className="relative">
    <Textarea
        placeholder={t('ui.promptPlaceholder')}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        // ... keep all existing props
    />
    {!prompt.trim() && brandKit && (
        <button
            type="button"
            onClick={handleInspire}
            disabled={isInspiring}
            className="absolute right-3 top-3 text-primary/70 hover:text-primary transition-colors disabled:opacity-50"
            title="Generate a prompt idea for me"
        >
            {isInspiring ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Wand2 className="w-4 h-4" />
            )}
        </button>
    )}
</div>
```

- [ ] Add imports at top of file if not already there:
```typescript
import { Wand2 } from 'lucide-react'
import { Loader2 } from '@/components/ui/spinner'
```

- [ ] Commit:
```bash
rtk git add src/components/studio/carousel/CarouselControlsPanel.tsx && rtk git commit -m "feat: add inspire button to carousel prompt textarea"
```

---

## Chunk 5: Brand Kit — preferred_language field in UI

### Task 8: Add language selector to brand kit page

**Files:**
- Modify: `src/app/brand-kit/page.tsx`

The `preferred_language` field exists in schema and types but is not shown in the UI. Need to add a language selector so users can set it.

- [ ] Find where brand kit fields are edited in the page. Search for the inline edit pattern:
```bash
grep -n "updateActiveBrandKit\|tagline\|tone_of_voice\|EditableField\|inline.*edit\|edit.*inline" src/app/brand-kit/page.tsx | head -20
```

- [ ] Find a good location to add the language selector — ideally near other brand identity fields (brand name, tagline, tone of voice). Look for section headers or groupings.

- [ ] Add a language selector. First check what UI pattern is used for dropdowns/selects in the brand kit page. If using shadcn Select:

```tsx
// Near other editable fields, add:
<div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">
        {t('brandKit.preferredLanguage', { defaultValue: 'Preferred language' })}
    </span>
    <Select
        value={activeBrandKit.preferred_language || 'es'}
        onValueChange={async (lang) => {
            await updateActiveBrandKit({ preferred_language: lang })
        }}
    >
        <SelectTrigger className="w-32 h-8 text-sm">
            <SelectValue />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="es">🇪🇸 Español</SelectItem>
            <SelectItem value="en">🇬🇧 English</SelectItem>
            <SelectItem value="fr">🇫🇷 Français</SelectItem>
            <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
            <SelectItem value="pt">🇵🇹 Português</SelectItem>
            <SelectItem value="it">🇮🇹 Italiano</SelectItem>
            <SelectItem value="ca">Català</SelectItem>
        </SelectContent>
    </Select>
</div>
```

- [ ] Check that `updateActiveBrandKit` accepts `preferred_language`. Search `update-user-brand-kit.ts` if needed:
```bash
grep -n "preferred_language\|brand_name\|payload\|Partial" src/app/actions/update-user-brand-kit.ts | head -10
```

- [ ] Commit:
```bash
rtk git add src/app/brand-kit/page.tsx && rtk git commit -m "feat: add preferred_language selector to brand kit page"
```

---

## Chunk 6: Admin — Prompts tab

### Task 9: Add "Prompts" tab to admin panel

**Files:**
- Modify: `src/app/admin/page.tsx`

Steps are precise — the file is large (~2000+ lines). Be surgical.

- [ ] **Step 1:** Add `'prompts'` to the `ADMIN_TABS` array (line 80):

Find:
```typescript
const ADMIN_TABS = ['requests', 'users', 'transactions', 'settings', 'models', 'styles', 'economics', 'billing', 'links', 'feedback', 'compositions'] as const
```
Replace with:
```typescript
const ADMIN_TABS = ['requests', 'users', 'transactions', 'settings', 'models', 'styles', 'economics', 'billing', 'links', 'feedback', 'compositions', 'prompts'] as const
```

- [ ] **Step 2:** Add the Convex query and mutation hooks at the top of the component (near other useQuery/useMutation calls):
```typescript
const systemPrompts = useQuery(api.systemPrompts.listAll)
const upsertSystemPrompt = useMutation(api.systemPrompts.upsert)
const removeSystemPrompt = useMutation(api.systemPrompts.remove)
```

- [ ] **Step 3:** Add state for editing prompts (near other useState declarations):
```typescript
const [editingPrompt, setEditingPrompt] = useState<{ key: string; name: string; body: string; description?: string } | null>(null)
const [promptDraft, setPromptDraft] = useState('')
const [isSeedingPrompts, setIsSeedingPrompts] = useState(false)
```

- [ ] **Step 4:** Add seed handler (near other handlers):
```typescript
const handleSeedPrompts = async () => {
    setIsSeedingPrompts(true)
    try {
        await fetch('/api/admin/seed-prompts', { method: 'POST' })
    } finally {
        setIsSeedingPrompts(false)
    }
}
```

- [ ] **Step 5:** Add TabsTrigger after the compositions trigger (line ~703):
```tsx
<TabsTrigger value="prompts" className="gap-2">
    <Wand2 className="w-4 h-4" />
    Prompts
</TabsTrigger>
```

- [ ] **Step 6:** Add TabsContent after the compositions content. Find `</TabsContent>` that closes compositions and add after it:

```tsx
<TabsContent value="prompts" className="space-y-4">
    <div className="flex items-center justify-between">
        <div>
            <h3 className="text-lg font-semibold">System Prompts</h3>
            <p className="text-sm text-muted-foreground">
                Edit the AI prompts used throughout the app. Variables use {"{{variable}}"} syntax.
            </p>
        </div>
        <Button
            variant="outline"
            size="sm"
            onClick={handleSeedPrompts}
            disabled={isSeedingPrompts}
        >
            {isSeedingPrompts ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Seed defaults
        </Button>
    </div>

    {!systemPrompts || systemPrompts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
            <p>No prompts yet.</p>
            <p className="text-sm mt-1">Click "Seed defaults" to add the default prompts.</p>
        </div>
    ) : (
        <div className="space-y-4">
            {systemPrompts.map((prompt) => (
                <div key={prompt._id} className="rounded-xl border border-border p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <div className="font-medium">{prompt.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{prompt.key}</div>
                            {prompt.description && (
                                <div className="text-sm text-muted-foreground mt-1">{prompt.description}</div>
                            )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setEditingPrompt({ key: prompt.key, name: prompt.name, body: prompt.body, description: prompt.description })
                                    setPromptDraft(prompt.body)
                                }}
                            >
                                Edit
                            </Button>
                        </div>
                    </div>

                    {editingPrompt?.key === prompt.key ? (
                        <div className="space-y-2">
                            <textarea
                                className="w-full min-h-[200px] text-sm p-3 rounded-lg border border-border bg-background/70 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
                                value={promptDraft}
                                onChange={(e) => setPromptDraft(e.target.value)}
                            />
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingPrompt(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={async () => {
                                        await upsertSystemPrompt({
                                            key: prompt.key,
                                            name: prompt.name,
                                            body: promptDraft,
                                            description: prompt.description,
                                        })
                                        setEditingPrompt(null)
                                    }}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <pre className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 overflow-auto max-h-[120px] whitespace-pre-wrap">
                            {prompt.body}
                        </pre>
                    )}
                </div>
            ))}
        </div>
    )}
</TabsContent>
```

- [ ] Add missing imports at top of admin page (check existing imports first):
```typescript
import { Wand2 } from 'lucide-react'
// Plus and Loader2 likely already imported — verify
```

- [ ] Commit:
```bash
rtk git add src/app/admin/page.tsx && rtk git commit -m "feat: add Prompts tab to admin panel with list and edit UI"
```

---

## Chunk 7: Verification

### Task 10: Seed prompts and visual verification

- [ ] Make sure Convex dev server is running:
```bash
npx convex dev
```

- [ ] Start Next.js dev server:
```bash
rtk pnpm dev
```

- [ ] Seed default prompts by calling the endpoint from the admin panel ("Seed defaults" button) or via curl:
```bash
curl -X POST http://localhost:3000/api/admin/seed-prompts
```
Expected: `{"success":true,"seeded":2}`

- [ ] **Verify Admin Prompts tab:**
  - Navigate to `/admin`
  - Click "Prompts" tab
  - Verify two prompts appear: "Generate user prompt — Image" and "Generate user prompt — Carousel"
  - Click "Edit" on one, modify the body, click "Save" — verify it persists on reload

- [ ] **Verify Brand Kit language selector:**
  - Navigate to `/brand-kit`
  - Verify a language selector appears
  - Change to "English", verify it saves (check Convex dashboard or reload)

- [ ] **Verify Image module inspire button:**
  - Navigate to `/image`
  - Ensure a brand kit is active
  - The prompt textarea should be empty — verify the `Wand2` icon appears at top-right of textarea
  - Click it — verify loading spinner shows, then text appears in the textarea
  - Verify the generated text is in the brand's preferred language

- [ ] **Verify Carousel module inspire button:**
  - Navigate to `/carousel`
  - Ensure a brand kit is active
  - Empty textarea should show `Wand2` icon
  - Click it — verify text fills in
  - Type something in the textarea — verify the Wand2 disappears (replaced by nothing since value is not empty and Sparkles logic doesn't apply to carousel)

- [ ] **Verify button disappears when text is present:**
  - After inspire fills the textarea, the `Wand2` button should be gone (condition: `!value.trim()`)

- [ ] If any visual issues found, fix and re-verify before marking complete.

- [ ] Final commit if any fixes were made:
```bash
rtk git add -A && rtk git commit -m "fix: post-verification fixes for AI prompt generator"
```
