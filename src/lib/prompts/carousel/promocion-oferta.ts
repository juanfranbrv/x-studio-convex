import { CarouselComposition } from '../../carousel-structures'

export const PROMOCION_OFERTA_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'promocion-oferta::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to maximize sales. High urgency, clear CTA, product focus.',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. GIANT PERCENT
    {
        id: 'promocion-oferta::percent',
        name: 'Big Discount',
        description: 'Porcentaje gigante.',
        layoutPrompt: 'Typography: "-50%" fits the entire canvas. Background is the product texture.',
        iconPrompt: 'Percentage sign.'
    },
    // 3. COUNTDOWN TIMER
    {
        id: 'promocion-oferta::timer',
        name: 'Urgency Timer',
        description: 'Contador regresivo.',
        layoutPrompt: 'UI: Digital countdown timer (00:23:59) prominent red. "Ending Soon" text.',
        iconPrompt: 'Timer clock.'
    },
    // 4. COUPON TICKET
    {
        id: 'promocion-oferta::coupon',
        name: 'The Coupon',
        description: 'Cupón recortable.',
        layoutPrompt: 'Visual: Dashed line border looking like a physical coupon. Code "SAVE20" in center.',
        iconPrompt: 'Dashed ticket.'
    },
    // 5. FLASH SALE
    {
        id: 'promocion-oferta::flash',
        name: 'Flash Bolt',
        description: 'Oferta relámpago.',
        layoutPrompt: 'Iconography: Large lightning bolt splitting the screen. High contrast yellow/black energy.',
        iconPrompt: 'Lightning bolt.'
    },
    // 6. BUNDLE STACK
    {
        id: 'promocion-oferta::bundle',
        name: 'The Bundle',
        description: 'Pack de productos.',
        layoutPrompt: 'Product: A stack of boxes or digital assets showing "Everything you get". High value perception.',
        iconPrompt: 'Stack of boxes.'
    },
    // 7. LIMITED BADGE
    {
        id: 'promocion-oferta::limited',
        name: 'Limited Edition',
        description: 'Edición limitada.',
        layoutPrompt: 'Badge: Gold or premium badge graphic saying "Only 10 Left" or "Exclusive".',
        iconPrompt: 'Star badge.'
    },
    // 8. PRICE SLASH
    {
        id: 'promocion-oferta::slash',
        name: 'Price Slash',
        description: 'Precio tachado.',
        layoutPrompt: 'Typography: Old price (grey, strikethrough) -> New Price (Large, Color).',
        iconPrompt: 'Price tag strikethrough.'
    },
    // 9. GIFT BOX
    {
        id: 'promocion-oferta::gift',
        name: 'Bonus Gift',
        description: 'Regalo extra.',
        layoutPrompt: 'Object: A wrapped gift box or present being opened. "Free Bonus" text.',
        iconPrompt: 'Gift box.'
    },
    // 10. MEMBER CARD
    {
        id: 'promocion-oferta::card',
        name: 'VIP Access',
        description: 'Acceso VIP.',
        layoutPrompt: 'Object: Realistic credit card or membership card visual. "Premium Member".',
        iconPrompt: 'Credit card.'
    },
    // 11. SHOPPING CART
    {
        id: 'promocion-oferta::cart',
        name: 'Cart Reminder',
        description: 'Carrito de compra.',
        layoutPrompt: 'Icon: Stylish shopping cart or bag icon overflowing with items.',
        iconPrompt: 'Shopping cart.'
    },
    // 12. TEXT OVERLAY
    {
        id: 'promocion-oferta::overlay',
        name: 'Sale Overlay',
        description: 'Texto sobre producto.',
        layoutPrompt: 'Layering: Full screen product photo. Semi-transparent bar across eyes/center with "SOLD OUT" or "SALE".',
        iconPrompt: 'Text bar over square.'
    }
]
