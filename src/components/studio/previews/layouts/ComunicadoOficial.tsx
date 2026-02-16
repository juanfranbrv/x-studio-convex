import { LayoutProps } from './types'
import { cn } from '@/lib/utils'

export function ComunicadoOficial({ texts, brandColors, logoId, isGhost }: LayoutProps) {
    const mainColor = isGhost ? '#f4f4f5' : (brandColors[0] || '#000000')

    // Texts
    const title = texts['announcement_title'] || 'COMUNICADO OFICIAL'
    const body = texts['announcement_body'] || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    const date = texts['effective_date'] || '15 MARZO 2024'

    return (
        <div className={cn(
            "w-full h-full relative flex flex-col p-8 border-[12px] border-double bg-white",
            isGhost ? "border-zinc-100" : ""
        )} style={{ borderColor: isGhost ? undefined : mainColor }}>
            {/* Header */}
            <div className="border-b border-black/10 pb-6 mb-6 flex flex-col items-center justify-center text-center">
                {(isGhost || logoId) && (
                    <div className="h-10 w-32 bg-zinc-50 border border-zinc-100 mb-4 flex items-center justify-center text-[10px] text-zinc-300">
                        {isGhost ? '' : 'LOGO'}
                    </div>
                )}

                {isGhost ? (
                    <div className="h-6 w-[60%] rounded bg-zinc-200" />
                ) : (
                    <h1 className="text-2xl font-serif font-bold text-black uppercase tracking-widest">{title}</h1>
                )}

                <div className="w-16 h-1 mt-4" style={{ backgroundColor: isGhost ? '#e4e4e7' : mainColor }} />
            </div>

            {/* Body */}
            <div className="flex-1 text-center flex flex-col items-center justify-start pt-4 space-y-2">
                {isGhost ? (
                    <>
                        <div className="h-3 w-full rounded bg-zinc-100" />
                        <div className="h-3 w-full rounded bg-zinc-100" />
                        <div className="h-3 w-[80%] rounded bg-zinc-100" />
                    </>
                ) : (
                    <p className="text-sm text-zinc-600 leading-relaxed max-w-[90%] font-serif">
                        {body}
                    </p>
                )}

                {isGhost ? (
                    <div className="h-3 w-24 rounded bg-zinc-200 !mt-8" />
                ) : (
                    <p className="mt-8 text-xs font-bold text-black/40 uppercase tracking-widest">
                        {date}
                    </p>
                )}
            </div>

            {/* Watermark */}
            {!isGhost && (
                <div className="absolute bottom-4 right-4 text-[10px] text-zinc-300 font-mono">
                    REF: 2024-OFFICIAL
                </div>
            )}
        </div>
    )
}
