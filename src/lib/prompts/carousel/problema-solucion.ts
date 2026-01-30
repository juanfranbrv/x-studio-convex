import { CarouselComposition } from '../../carousel-structures'

export const PROBLEMA_SOLUCION_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'problema-solucion::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to emphasize the tension between problem (pain) and solution (relief). Use visual contrast to separate "before" (chaos/dark) from "after" (order/light).',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. CHAOS VS ORDER
    {
        id: 'problema-solucion::chaos-order',
        name: 'Chaos to Order',
        description: 'Del caos al orden.',
        layoutPrompt: 'Visual Transformation: Left side illustrates "Chaos" (scattered elements, messy lines, noise). Right side (or bottom) shows "Order" (aligned, clean, structured). The product is the stabilizing agent.',
        iconPrompt: 'Split icon: left side scribbled/messy, right side clean grid.'
    },
    // 3. THE BRIDGE
    {
        id: 'problema-solucion::bridge',
        name: 'The Bridge',
        description: 'Cruzando el abismo.',
        layoutPrompt: 'Gap & Bridge: Visual of a chasm or gap representing the Problem. A sturdy bridge (the Solution/Product) connects the user to the desired outcome on the other side.',
        iconPrompt: 'Icon of a bridge connecting two cliffs.'
    },
    // 4. LOCK AND KEY
    {
        id: 'problema-solucion::lock-key',
        name: 'Lock & Key',
        description: 'La llave incorrecta vs correcta.',
        layoutPrompt: 'Metaphor: The Problem is a locked door or complex padlock. The Solution is showcased as the precise key that opens it. Focus on the mechanism of unlocking.',
        iconPrompt: 'Icon of a key inside a padlock.'
    },
    // 5. STORM TO CALM
    {
        id: 'problema-solucion::storm-calm',
        name: 'Storm to Calm',
        description: 'De la tormenta a la calma.',
        layoutPrompt: 'Weather Metaphor: Dark, stormy, turbulent background (Problem) transitioning into a bright, clear, sunny sky (Solution). Text overlay follows the clearing path.',
        iconPrompt: 'Icon of a cloud with rain on one side, sun on the other.'
    },
    // 6. TANGLED KNOT
    {
        id: 'problema-solucion::tangled',
        name: 'Untangling',
        description: 'Desenredando el nudo.',
        layoutPrompt: 'Process Visual: A complex, tangled knot representing the frustration/problem. Below or next to it, a single straight, smooth thread representing the solution.',
        iconPrompt: 'Icon of a tangled scribble flowing into a straight line.'
    },
    // 7. HEAVY LIFT
    {
        id: 'problema-solucion::weight',
        name: 'Lifting Weight',
        description: 'Aliviando la carga.',
        layoutPrompt: 'Weight Metaphor: Visual of a heavy burden or weight crushing down (Problem). The Solution is depicted as a lever, balloon, or support that lifts the weight effortlessly.',
        iconPrompt: 'Icon of a weight being lifted by a lever or balloon.'
    },
    // 8. MAZE EXIT
    {
        id: 'problema-solucion::maze',
        name: 'Maze Exit',
        description: 'La salida del laberinto.',
        layoutPrompt: 'Navigation: A top-down view of a confusing maze (Problem). A clear, highlighted path leads directly to the exit (Solution), skipping the dead ends.',
        iconPrompt: 'Square maze icon with a clear path out.'
    },
    // 9. BROKEN FIX
    {
        id: 'problema-solucion::broken-fix',
        name: 'Broken & Fixed',
        description: 'Reparación visible.',
        layoutPrompt: 'Kintsugi Style: An object that is visibly broken or cracked (Problem). The Solution is the gold joinery that makes it whole and stronger again.',
        iconPrompt: 'Icon of a cracked object joined back together.'
    },
    // 10. FOG CLEARING
    {
        id: 'problema-solucion::fog',
        name: 'Fog Clearing',
        description: 'Claridad en la visión.',
        layoutPrompt: 'Visibility: A blurred, foggy, or out-of-focus scene (Problem) that becomes sharp, crystal clear, and vibrant through a lens or "wiper" effect (Solution).',
        iconPrompt: 'Icon of a half-blurred, half-sharp eye or lens.'
    },
    // 11. OBSTACLE JUMP
    {
        id: 'problema-solucion::hurdle',
        name: 'Hurdle Jump',
        description: 'Superando la barrera.',
        layoutPrompt: 'Action Metaphor: A tall wall or hurdle blocking the path (Problem). A dynamic line or figure vaulting over it smoothly (Solution). Momentum is key.',
        iconPrompt: 'Icon of a figure or line jumping over a barrier.'
    },
    // 12. PAIN POINT
    {
        id: 'problema-solucion::target',
        name: 'Target Pain',
        description: 'Apuntando al dolor.',
        layoutPrompt: 'Bullseye: A visual representation of the specific "pain point" (red zone/target). The Solution is the arrow hitting dead center to resolve it.',
        iconPrompt: 'Target icon with an arrow in the center.'
    }
]
