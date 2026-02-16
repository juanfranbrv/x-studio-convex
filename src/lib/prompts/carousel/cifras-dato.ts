import { CarouselComposition } from '../../carousel-structures'

export const CIFRAS_DATO_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'cifras-dato::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to highlight a key statistic or data point. Clean, bold, trustworthy.',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. BIG NUMBER
    {
        id: 'cifras-dato::big-number',
        name: 'Big Number',
        description: 'Dato gigante.',
        layoutPrompt: 'Typography: A massive number (e.g. "85%") takes up 80% of the screen. Subtext explains it.',
        iconPrompt: 'Large "100%" text.'
    },
    // 3. PIE CHART
    {
        id: 'cifras-dato::pie',
        name: 'Pie Chart',
        description: 'Gráfico circular.',
        layoutPrompt: 'Chart: A clean, 2D pie chart or donut chart visualizing a percentage breakdown.',
        iconPrompt: 'Pie chart icon.'
    },
    // 4. BAR GRAPH
    {
        id: 'cifras-dato::bar',
        name: 'Bar Graph',
        description: 'Gráfico de barras.',
        layoutPrompt: 'Chart: Vertical bar graph comparing 3-4 data points. Highest bar is highlighted.',
        iconPrompt: 'Bar graph icon.'
    },
    // 5. TREND LINE
    {
        id: 'cifras-dato::trend',
        name: 'Trend Line',
        description: 'Tendencia.',
        layoutPrompt: 'Chart: A jagged line graph going up or down. Minimalist axes.',
        iconPrompt: 'Line graph icon.'
    },
    // 6. INFOGRAPHIC
    {
        id: 'cifras-dato::info',
        name: 'Infographic',
        description: 'Infografía.',
        layoutPrompt: 'Layout: Icons + Text + Numbers arranged in a structured flow to explain a complex stat.',
        iconPrompt: 'Infographic layout icon.'
    },
    // 7. COUNTER
    {
        id: 'cifras-dato::counter',
        name: 'The Counter',
        description: 'Contador digital.',
        layoutPrompt: 'Digital: Design aesthetic of a digital clock or odometer rolling over to the target number.',
        iconPrompt: 'Digital numbers icon.'
    },
    // 8. COMPARISON BARS
    {
        id: 'cifras-dato::compare-bars',
        name: 'Side by Side',
        description: 'Comparativa de datos.',
        layoutPrompt: 'Split: Two horizontal bars. "This Year" vs "Last Year". Direct comparison.',
        iconPrompt: 'Horizontal bars icon.'
    },
    // 9. CIRCULAR PROGRESS
    {
        id: 'cifras-dato::progress',
        name: 'Progress Circle',
        description: 'Progreso circular.',
        layoutPrompt: 'Radial: A progress ring filled to 75%. The number is inside the ring.',
        iconPrompt: 'Loading circle icon.'
    },
    // 10. TYPOGRAPHY DATA
    {
        id: 'cifras-dato::type',
        name: 'Type Data',
        description: 'Dato tipográfico.',
        layoutPrompt: 'Artistic: The number is woven into the sentence. "1 in 3 people" where "1" is huge.',
        iconPrompt: 'Text with large number.'
    },
    // 11. MAP DATA
    {
        id: 'cifras-dato::map',
        name: 'Map Point',
        description: 'Dato geográfico.',
        layoutPrompt: 'Geography: A simple map silhouette with a pin or heat zone highlighting the data location.',
        iconPrompt: 'Map pin icon.'
    },
    // 12. FUNNEL
    {
        id: 'cifras-dato::funnel',
        name: 'The Funnel',
        description: 'Embudo de conversión.',
        layoutPrompt: 'Shape: An inverted triangle divided into sections. 100% -> 50% -> 10%.',
        iconPrompt: 'Funnel icon.'
    }
]
