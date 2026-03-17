export const STUDIO_SELECT_TRIGGER_CLASS =
  'h-11 w-full rounded-2xl border border-input/80 bg-[hsl(var(--surface-alt))]/90 px-3.5 text-[clamp(1rem,0.96rem+0.2vw,1.08rem)] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-all hover:border-primary/20 hover:bg-white'

export const STUDIO_SELECT_CONTENT_CLASS =
  'w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)] rounded-2xl border-border/70 p-2 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.34)]'

export const STUDIO_SELECT_ITEM_CLASS =
  'min-h-11 rounded-xl px-3 py-2 text-[clamp(1rem,0.96rem+0.2vw,1.08rem)] font-medium'

export const STUDIO_RICH_SELECT_TRIGGER_CLASS =
  `${STUDIO_SELECT_TRIGGER_CLASS} relative !h-[3rem] !rounded-[1.1rem] justify-between gap-2 px-4 text-left [&_[data-slot=select-value]]:hidden`
