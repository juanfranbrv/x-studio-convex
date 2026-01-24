import { LayoutProps } from './types'
import { cn } from '@/lib/utils'
import { Smartphone } from 'lucide-react'

export function PromoMovil({ image, texts, brandColors, aspectRatio, isGhost }: LayoutProps) {
    const mainColor = isGhost ? '#f4f4f5' : (brandColors[0] || '#2563eb')
    const accentColor = isGhost ? '#d4d4d8' : (brandColors[1] || '#fbbf24')

    const headline = texts['headline'] || 'NUEVA APP'
    const body = texts['body'] || 'Disponible ahora en todas las plataformas.'
    const button = texts['button'] || 'DESCARGAR'

    return (
        <div className="w-full h-full relative bg-zinc-50 overflow-hidden flex flex-col pointer-events-none select-none">
            {/* Background Texture Area */}
            <div
                className="absolute inset-x-0 top-0 h-[60%] z-0"
                style={{ backgroundColor: mainColor, opacity: isGhost ? 1 : 0.1 }}
            />

            {/* Floating Elements (Circle) */}
            <div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full z-0 blur-[80px]"
                style={{ backgroundColor: accentColor, opacity: isGhost ? 0.3 : 0.2 }}
            />

            {/* Mobile Device Mockup */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[60%] h-[70%] z-20">
                <div className={cn(
                    "w-full h-full rounded-[2.5rem] border-[6px] relative overflow-hidden shadow-2xl bg-white",
                    isGhost ? "border-zinc-300" : "border-zinc-900"
                )}>
                    {/* Inner Screen */}
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                        {image ? (
                            <img src={image} className="w-full h-full object-cover rounded-[1.8rem]" alt="App Preview" />
                        ) : (
                            <div className={cn(
                                "w-full h-full rounded-[1.8rem] border-2 border-dashed flex flex-col items-center justify-center gap-2",
                                isGhost ? "bg-zinc-50 border-zinc-200" : "bg-zinc-100 border-zinc-200"
                            )}>
                                {!isGhost && (
                                    <>
                                        <Smartphone className="w-6 h-6 text-zinc-300" />
                                        <span className="text-[10px] font-mono text-zinc-400">APP SCREEN</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-0 inset-x-0 h-[35%] bg-white/80 backdrop-blur-md z-30 p-8 flex flex-col items-center text-center space-y-3">
                {isGhost ? (
                    <div className="space-y-2 w-full flex flex-col items-center">
                        <div className="h-6 w-[70%] rounded bg-zinc-200" />
                        <div className="h-10 w-[40%] rounded-full bg-zinc-300 !mt-4" />
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-black tracking-tight leading-tight" style={{ color: mainColor }}>{headline}</h2>
                        <p className="text-xs text-zinc-500 max-w-[80%] line-clamp-2">{body}</p>
                        <div
                            className="px-6 py-2 rounded-full text-white text-[10px] font-bold tracking-widest shadow-lg"
                            style={{ backgroundColor: mainColor }}
                        >
                            {button}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
