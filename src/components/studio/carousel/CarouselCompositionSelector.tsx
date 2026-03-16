'use client'

import { motion } from'framer-motion'
import { cn } from'@/lib/utils'
import { resolveCarouselCompositionIcon } from'@/lib/carousel-composition-icon'

type CarouselComposition = {
 id: string
 name: string
 description: string
 layoutPrompt?: string
 icon?: string
 iconPrompt?: string
 scope:'global' |'narrative'
}

interface CarouselCompositionSelectorProps {
 compositions: CarouselComposition[]
 selectedId: string
 onSelect: (id: string) => void
}

function renderCompositionIcon(iconName: string) {
 const trimmed = iconName.trim()
 if (!trimmed) return null

 if (trimmed.startsWith('<svg')) {
 return (
 <div
 className="w-10 h-10 text-primary/70 overflow-hidden flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
 dangerouslySetInnerHTML={{ __html: trimmed }}
 />
 )
 }

 return (
 <div className="w-10 h-10 flex items-center justify-center text-primary/70">
 <span
 className="material-symbols-outlined leading-none"
 style={{ fontSize:'40px' }}
 >
 {trimmed}
 </span>
 </div>
 )
}

export function CarouselCompositionSelector({
 compositions,
 selectedId,
 onSelect
}: CarouselCompositionSelectorProps) {
 return (
 <div className="space-y-3">
 <div className="grid grid-cols-3 gap-2">
 {compositions.map((composition) => {
 const isSelected = selectedId === composition.id
 const resolvedIcon = resolveCarouselCompositionIcon(composition)
 const isGlobal = composition.scope ==='global'

 return (
 <motion.button
 key={composition.id}
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.95 }}
 onClick={() => onSelect(composition.id)}
 className={cn(
'group relative flex h-full flex-col rounded-xl border overflow-hidden text-left backdrop-blur-sm transition-all duration-300',
 isSelected
 ?'border-primary/40 bg-primary/5 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.25)]'
 : isGlobal
 ?'border-slate-200/75 bg-white/50 hover:bg-white/85 hover:border-slate-300/75 hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.06)]'
 :'border-slate-200/85 bg-slate-50/75 hover:bg-white/92 hover:border-slate-300/85 hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]'
 )}
 title={composition.description}
 >
 <div
 className={cn(
'w-full flex items-center justify-center px-1 py-2 transition-colors',
 isSelected
 ?'bg-primary/5'
 : isGlobal
 ?'bg-zinc-50/35 group-hover:bg-zinc-50/70'
 :'bg-slate-100/55 group-hover:bg-slate-100/75'
 )}
 >
 {renderCompositionIcon(resolvedIcon)}
 </div>

 <div
 className={cn(
'flex flex-1 flex-col gap-0.5 border-t p-1.5 pt-1 transition-colors',
 isSelected
 ?'border-primary/20 bg-primary/5'
 : isGlobal
 ?'border-slate-100 bg-white/35'
 :'border-slate-200/70 bg-slate-50/55'
 )}
 >
 <span
 className={cn(
'block truncate text-center text-[9px] font-semibold transition-colors duration-200',
 isSelected
 ?'text-primary'
 :'text-slate-500 group-hover:text-slate-700'
 )}
 >
 {composition.name}
 </span>
 <span
 className={cn(
'line-clamp-3 text-center text-[9px] leading-tight opacity-90',
 isSelected ?'text-primary/75' :'text-muted-foreground/80'
 )}
 >
 {composition.description}
 </span>
 </div>
 </motion.button>
 )
 })}
 </div>
 </div>
 )
}
