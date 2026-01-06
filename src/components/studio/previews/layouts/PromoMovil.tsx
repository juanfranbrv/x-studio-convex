import { LayoutProps } from './types'
import { Smartphone } from 'lucide-react'

export function PromoMovil({ image, texts, brandColors }: LayoutProps) {
    const mainColor = brandColors[0] || '#000000'

    // Texts
    const handle = texts['handle'] || '@TU_MARCA'
    const headline = texts['headline'] || 'PROMO APP'
    const subheadline = texts['subheadline'] || 'Descarga Gratis'
    const disclaimer = texts['disclaimer'] || '*Aplican condiciones'

    return (
        <div className="w-full h-full relative bg-zinc-100 overflow-hidden flex flex-col items-center justify-center">
            {/* Background Hand Placeholder (simplified) */}
            <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[70%] bg-zinc-300 rounded-full blur-3xl opacity-50" />

            {/* Phone Frame */}
            <div className="relative z-10 w-[45%] aspect-[9/19] bg-black rounded-[2rem] p-3 shadow-2xl rotate-[-5deg] border-4 border-zinc-800">
                {/* Screen Content */}
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative flex flex-col">
                    {/* Header Bar */}
                    <div
                        className="h-12 w-full flex items-center justify-center"
                        style={{ backgroundColor: mainColor }}
                    >
                        <span className="text-white text-xs font-bold">{handle}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col items-center gap-4">
                        {image ? (
                            <div className="w-full aspect-square rounded-lg overflow-hidden shadow-sm">
                                <img src={image} className="w-full h-full object-cover" alt="Content" />
                            </div>
                        ) : (
                            <div className="w-full aspect-square bg-zinc-100 rounded-lg flex items-center justify-center border border-dashed border-zinc-300">
                                <Smartphone className="text-zinc-300 w-8 h-8" />
                            </div>
                        )}

                        <div className="text-center space-y-1">
                            <h2 className="text-xl font-black leading-tight text-black">{headline}</h2>
                            <p className="text-xs text-zinc-500 font-medium">{subheadline}</p>
                        </div>

                        <div className="mt-auto w-full pt-4">
                            <div className="w-full h-8 bg-black rounded-full flex items-center justify-center">
                                <span className="text-white text-[10px] font-bold">CLICK HERE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer at bottom */}
            <div className="absolute bottom-4 inset-x-0 text-center z-20">
                <p className="text-[9px] text-zinc-400">{disclaimer}</p>
            </div>
        </div>
    )
}
