import { LayoutProps } from './types'

export function ComunicadoOficial({ texts, brandColors, logoId }: LayoutProps) {
    const mainColor = brandColors[0] || '#000000'

    // Texts
    const title = texts['announcement_title'] || 'COMUNICADO OFICIAL'
    const body = texts['announcement_body'] || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    const date = texts['effective_date'] || '15 MARZO 2024'

    return (
        <div className="w-full h-full relative bg-white flex flex-col p-8 border-[12px] border-double" style={{ borderColor: mainColor }}>
            {/* Header */}
            <div className="border-b border-black/10 pb-6 mb-6 flex flex-col items-center justify-center text-center">
                {logoId && (
                    <div className="h-10 w-32 bg-zinc-100 mb-4 flex items-center justify-center text-[10px] text-zinc-400">
                        LOGO
                    </div>
                )}
                <h1 className="text-2xl font-serif font-bold text-black uppercase tracking-widest">{title}</h1>
                <div className="w-16 h-1 bg-black mt-4" style={{ backgroundColor: mainColor }} />
            </div>

            {/* Body */}
            <div className="flex-1 text-center flex flex-col items-center justify-start pt-4">
                <p className="text-sm text-zinc-600 leading-relaxed max-w-[90%] font-serif">
                    {body}
                </p>
                <p className="mt-8 text-xs font-bold text-black/40 uppercase tracking-widest">
                    {date}
                </p>
            </div>

            {/* Watermark */}
            <div className="absolute bottom-4 right-4 text-[10px] text-zinc-300 font-mono">
                REF: 2024-OFFICIAL
            </div>
        </div>
    )
}
