import { LayoutProps } from './types'
import { cn } from '@/lib/utils'

export function ImpactoComercial({ image, texts, brandColors, aspectRatio, isGhost }: LayoutProps) {
    // Default colors if none selected
    const mainColor = isGhost ? '#f4f4f5' : (brandColors[0] || '#000000') // zinc-100
    const accentColor = isGhost ? '#d4d4d8' : (brandColors[1] || '#FF0000') // zinc-300
    const ghostTextBase = '#e4e4e7' // zinc-200

    // Texts
    const headline = texts['headline'] || 'GRAN OFERTA'
    const discount = texts['discount'] || '50% OFF'
    const eyebrow = texts['eyebrow'] || 'SOLO HOY'
    const footer = texts['footer'] || 'www.tienda.com'

    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col pointer-events-none select-none bg-white">
            {/* Background Diagonal Split */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: `linear-gradient(135deg, ${mainColor} 0%, ${mainColor} 40%, #ffffff 40%, #ffffff 100%)`
                }}
            />

            {/* Product Image Zone (Hero) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] z-10 flex items-center justify-center">
                {image ? (
                    <img
                        src={image}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        alt="Product"
                    />
                ) : (
                    <div className={cn(
                        "w-full h-full border-2 border-dashed rounded-xl flex items-center justify-center",
                        isGhost ? "bg-zinc-50 border-zinc-200" : "bg-black/5 border-black/10"
                    )}>
                        {!isGhost && <span className="text-xs font-mono text-black/30">PRODUCT HERO</span>}
                    </div>
                )}
            </div>

            {/* Eyebrow Label */}
            <div className="absolute top-8 left-8 z-20">
                <div
                    className="px-3 py-1 shadow-sm rotate-[-2deg]"
                    style={{ backgroundColor: accentColor }}
                >
                    {isGhost ? (
                        <div className="h-2 w-12 rounded bg-white/50" />
                    ) : (
                        <span className="text-xs font-bold uppercase tracking-widest text-white">{eyebrow}</span>
                    )}
                </div>
            </div>

            {/* Discount Badge */}
            <div className="absolute top-1/4 right-8 z-30">
                <div
                    className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg rotate-12"
                    style={{ backgroundColor: accentColor }}
                >
                    {isGhost ? (
                        <div className="w-12 h-12 rounded-full bg-white/30" />
                    ) : (
                        <span className="text-center leading-none transform -rotate-12 text-white font-black text-2xl">{discount}</span>
                    )}
                </div>
            </div>

            {/* Headline (Big Impact) */}
            <div className="absolute bottom-20 left-0 right-0 z-30 px-8 text-center flex flex-col items-center">
                {isGhost ? (
                    <div className="space-y-2 w-full flex flex-col items-center">
                        <div className="h-8 w-[80%] rounded bg-zinc-200" />
                        <div className="h-8 w-[60%] rounded bg-zinc-200" />
                    </div>
                ) : (
                    <h1
                        className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-black to-zinc-800 drop-shadow-sm"
                        style={{
                            WebkitTextStroke: '1px white'
                        }}
                    >
                        {headline}
                    </h1>
                )}
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 inset-x-0 text-center z-20 flex justify-center">
                {isGhost ? (
                    <div className="h-1.5 w-24 rounded bg-zinc-200" />
                ) : (
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">{footer}</p>
                )}
            </div>
        </div>
    )
}
