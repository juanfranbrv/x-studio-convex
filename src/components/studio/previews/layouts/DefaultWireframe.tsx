import { LayoutProps } from './types'
import { IntentCategory } from '@/lib/creation-flow-types'
import { AlignCenter, Image as ImageIcon } from 'lucide-react'

interface DefaultWireframeProps extends LayoutProps {
    intent: IntentCategory
}

export function DefaultWireframe({ image, texts, intent, brandColors }: DefaultWireframeProps) {
    const mainColor = brandColors[0] || '#000000'
    const headline = texts['headline'] || intent.toUpperCase()
    const cta = texts['cta'] || 'DESCUBRIR MAS'

    return (
        <div className="w-full h-full relative bg-white p-6 flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at center, ${mainColor} 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Dynamic Content Center */}
            <div className="relative z-10 space-y-6 max-w-[80%]">
                {image ? (
                    <div className="w-full aspect-video bg-zinc-100 rounded-lg overflow-hidden shadow-sm">
                        <img src={image} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                ) : (
                    <div className="w-24 h-24 mx-auto bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-200">
                        <ImageIcon className="text-zinc-300 w-8 h-8" />
                    </div>
                )}

                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-black leading-tight border-b-2 border-transparent inline-block pb-1"
                        style={{ borderColor: mainColor }}
                    >
                        {headline}
                    </h2>
                    {texts['cta'] && (
                        <div className="pt-2">
                            <span className="inline-block px-4 py-2 bg-black text-white text-xs font-bold rounded-full">
                                {cta}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
