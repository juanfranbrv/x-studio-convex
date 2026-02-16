import { LayoutProps } from './types'
import { cn } from '@/lib/utils'

export function HeroProducto({ image, texts, brandColors, aspectRatio, isGhost }: LayoutProps) {
    const mainColor = isGhost ? '#f4f4f5' : (brandColors[0] || '#000000')
    const accentColor = isGhost ? '#d4d4d8' : (brandColors[1] || '#FFD700')

    const headline = texts['headline'] || 'PRODUCT NAME'
    const tag = texts['tag'] || 'PREMIUM'
    const price = texts['price'] || '$99.99'

    return (
        <div className="w-full h-full relative overflow-hidden bg-white flex flex-col items-center justify-center p-8">
            {/* Minimal Background Element */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute top-0 right-0 w-1/2 h-full opacity-20"
                    style={{ background: `linear-gradient(to left, ${accentColor}, transparent)` }}
                />
            </div>

            {/* Tag Label */}
            <div className="absolute top-10 left-10 z-20">
                {isGhost ? (
                    <div className="h-4 w-16 rounded bg-zinc-200" />
                ) : (
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400">
                        {tag}
                    </span>
                )}
            </div>

            {/* Product Center */}
            <div className="relative z-10 w-[80%] h-[60%] flex items-center justify-center">
                {image ? (
                    <img src={image} className="w-full h-full object-contain drop-shadow-2xl" alt="Product" />
                ) : (
                    <div className={cn(
                        "w-full h-full rounded-2xl flex items-center justify-center border-2 border-dashed",
                        isGhost ? "bg-zinc-50 border-zinc-200" : "bg-black/5 border-black/10"
                    )}>
                        {!isGhost && <span className="text-xs font-mono text-black/20">HERO IMAGE</span>}
                    </div>
                )}
            </div>

            {/* Typography Overlay */}
            <div className="absolute bottom-10 left-10 right-10 z-20 space-y-2">
                {isGhost ? (
                    <div className="space-y-2">
                        <div className="h-10 w-[80%] rounded bg-zinc-200" />
                        <div className="h-5 w-24 rounded bg-zinc-300" />
                    </div>
                ) : (
                    <>
                        <h1 className="text-5xl font-black tracking-tighter leading-none" style={{ color: mainColor }}>
                            {headline}
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-bold italic" style={{ color: accentColor }}>
                                {price}
                            </span>
                            <div className="h-px flex-1 bg-zinc-200" />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
