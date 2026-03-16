import { cn } from'@/lib/utils'
import { Check, Palette } from'lucide-react'
import type { StyleChip } from'@/lib/creation-flow-types'
import { useTranslation } from'react-i18next'

interface StyleChipGroup {
 id: string
 label: string
 description?: string
}

interface StyleChipsSelectorProps {
 availableStyles: StyleChip[]
 styleGroups: StyleChipGroup[]
 selectedStyles: string[]
 customStyle: string
 onToggleStyle: (styleId: string) => void
 onCustomStyleChange: (style: string) => void
}

export function StyleChipsSelector({
 availableStyles,
 styleGroups,
 selectedStyles,
 customStyle,
 onToggleStyle,
 onCustomStyleChange,
}: StyleChipsSelectorProps) {
 const { t } = useTranslation('common')

 if (availableStyles.length === 0) {
 return null
 }

 return (
 <div className="space-y-4">
 <div className="min-h-[100px] space-y-4">
 <div className="flex flex-wrap gap-2">
 {availableStyles.map(style => {
 const isSelected = selectedStyles.includes(style.id)
 const isSuggested = style.category ==='suggested'

 return (
 <button
 key={style.id}
 onClick={() => onToggleStyle(style.id)}
 className={cn(
'group relative rounded-full border px-3 py-2 text-left transition-all duration-200',
 isSelected
 ?'border-primary bg-primary text-primary-foreground shadow-md'
 :'border-slate-200 bg-white/60 text-slate-700 hover:border-primary/40 hover:bg-primary/5'
 )}
 >
 <div className="flex items-center gap-2">
 <span className="text-xs font-semibold">{style.label}</span>
 {isSuggested ? (
 <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
 {t('suggestions.alternatives', { defaultValue:'Alternatives' })}
 </span>
 ) : null}
 {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
 </div>
 </button>
 )
 })}
 </div>
 </div>

 <div className="pt-2">
 <label className="mb-2 block pl-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
 {t('styleChips.otherStyle', { defaultValue:'Another style in mind?' })}
 </label>
 <div className="group relative">
 <input
 type="text"
 value={customStyle}
 onChange={(e) => onCustomStyleChange(e.target.value)}
 placeholder={t('styleChips.placeholder', { defaultValue:'e.g. Cyberpunk, Watercolor, Lego...' })}
 className={cn(
'h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-4 text-sm backdrop-blur-md transition-all duration-300',
'placeholder:text-slate-400',
'focus:border-primary/50 focus:bg-white/80 focus:ring-2 focus:ring-primary/20',
'hover:border-slate-300'
 )}
 />
 <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
 {customStyle ? <Check className="h-4 w-4 text-green-500" /> : <Palette className="h-4 w-4 opacity-50" />}
 </div>
 </div>
 </div>

 {(selectedStyles.length > 0 || customStyle) && (
 <div className="animate-in slide-in-from-bottom-2 flex items-center gap-2 px-1 pt-2 fade-in duration-300">
 <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
 <p className="text-[10px] font-medium text-slate-500">
 {t('styleChips.configuredDirection', { count: selectedStyles.length + (customStyle ? 1 : 0), defaultValue:'Aesthetic direction configured ({{count}} styles)' })}
 </p>
 </div>
 )}
 </div>
 )
}
