import { LayoutProps } from './types'
import { cn } from '@/lib/utils'

export function ImpactoComercial({ image, texts, brandColors, aspectRatio }: LayoutProps) {
    // Default colors if none selected
    const mainColor = brandColors[0] || '#000000'
    const accentColor = brandColors[1] || '#FF0000'

    // Texts
    const headline = texts['headline'] || 'GRAN OFERTA'
    const discount = texts['discount'] || '50% OFF'
    const eyebrow = texts['eyebrow'] || 'SOLO HOY'
    const footer = texts['footer'] || 'www.tienda.com'

    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col pointer-events-none select-none">
            {/* Background Diagonal Split */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: `linear-gradient(135deg, ${mainColor} 0%, ${mainColor} 40%, #f3f4f6 40%, #f3f4f6 100%)`
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
                    <div className="w-full h-full bg-black/5 border-2 border-dashed border-black/10 rounded-xl flex items-center justify-center">
                        <span className="text-xs font-mono text-black/30">PRODUCT HERO</span>
                    </div>
                )}
            </div>

            {/* Eyebrow Label */}
            <div className="absolute top-8 left-8 z-20">
                <div
                    className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-sm rotate-[-2deg]"
                    style={{ backgroundColor: accentColor }}
                >
                    {eyebrow}
                </div>
            </div>

            {/* Discount Badge */}
            <div className="absolute top-1/4 right-8 z-30">
                <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg rotate-12"
                    style={{ backgroundColor: accentColor }}
                >
                    <span className="text-center leading-none transform -rotate-12">{discount}</span>
                </div>
            </div>

            {/* Headline (Big Impact) */}
            <div className="absolute bottom-20 left-0 right-0 z-30 px-8 text-center">
                <h1
                    className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-black to-zinc-800 drop-shadow-sm"
                    style={{
                        WebkitTextStroke: '1px white'
                    }}
                >
                    {headline}
                </h1>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 inset-x-0 text-center z-20">
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">{footer}</p>
            </div>
        </div>
    )
}
