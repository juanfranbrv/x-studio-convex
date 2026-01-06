import { LayoutProps } from './types'

export function HeroProducto({ image, texts, brandColors }: LayoutProps) {
    const mainColor = brandColors[0] || '#000000'

    // Texts
    const productName = texts['product_name'] || 'PRODUCTO HERO'
    const price = texts['price'] || ''
    const tagline = texts['tagline'] || 'Calidad Premium'

    return (
        <div className="w-full h-full relative bg-white flex flex-col">
            {/* Top 75%: Image */}
            <div className="flex-1 relative flex items-center justify-center p-8">
                {image ? (
                    <img
                        src={image}
                        className="w-full h-full object-contain drop-shadow-xl"
                        alt="Hero"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                        <span className="text-4xl">📦</span>
                    </div>
                )}

                {/* Floating Tags/Price */}
                {price && (
                    <div className="absolute top-8 right-8 bg-white shadow-lg px-4 py-2 rounded-full border border-zinc-100">
                        <span className="font-bold text-lg">{price}</span>
                    </div>
                )}
            </div>

            {/* Bottom 25%: Text Info */}
            <div className="h-[25%] bg-zinc-50 border-t border-zinc-100 p-6 flex flex-col items-start justify-center relative">
                <div
                    className="absolute top-0 left-0 h-1 w-24"
                    style={{ backgroundColor: mainColor }}
                />
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{tagline}</p>
                <h1 className="text-3xl font-black text-zinc-900 leading-none">{productName}</h1>
            </div>
        </div>
    )
}
