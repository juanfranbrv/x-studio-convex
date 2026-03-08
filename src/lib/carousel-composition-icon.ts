type CarouselCompositionIconInput = {
    id: string
    name?: string
    description?: string
    layoutPrompt?: string
    icon?: string
    iconPrompt?: string
}

const EXACT_ICON_MAP: Record<string, string> = {
    free: 'category',
    'basic-orbit-hook': 'track_changes',
    'basic-split-stage': 'splitscreen',
    'basic-card-core': 'crop_square',
    'basic-z-path': 'route',
    'basic-modular-grid': 'grid_view',
    'basic-pillar-rhythm': 'view_column',
    'basic-diagonal-pulse': 'north_east',
    'basic-timeline-ribbon': 'timeline',
    'basic-frame-focus': 'filter_center_focus',
    'basic-cta-stage': 'ads_click',
    'basic-tercios-grid': 'rule',
    'basic-golden-spiral': 'gesture',
    'basic-u-frame': 'aspect_ratio',
    'basic-golden-triangle': 'change_history',
    'basic-negative-chamber': 'crop_3_2',
    'basic-symmetric-core': 'balance',
    'basic-f-scan': 'view_sidebar',
    'basic-z-scan': 'alt_route',
    'basic-odd-cluster': 'hub',
    'basic-layered-depth': 'layers',
    'basic-twin-cards': 'filter_none',
    'basic-radial-hub': 'radar',
    'basic-arc-stage': 'radio_button_unchecked',
    'basic-window-strips': 'view_stream',
    'basic-crosshair-focus': 'center_focus_strong',
    'basic-ribbon-s': 'timeline',
    'basic-pyramid-stack': 'view_agenda',
    'basic-offset-quadrants': 'dashboard',
    'basic-leading-lines': 'flare',
    'basic-vanishing-run': 'zoom_in',
    'hero-hook': 'campaign',
    'before-after': 'compare',
    'split-duo': 'splitscreen',
    'storm-to-calm': 'wb_sunny',
    'pas-triptych': 'view_week',
    'timeline-pins': 'location_on',
    'scorecard': 'leaderboard',
    'faq-grid': 'quiz',
    'checklist': 'checklist',
    'action-checklist': 'fact_check',
    'stack-steps': 'stairs',
    'timeline-h': 'timeline',
    'timeline': 'timeline',
    'timeline-ribbon': 'timeline',
    'quote': 'format_quote',
    'speech-bubbles': 'forum',
    'chat-thread': 'question_answer',
    'reply-thread': 'reply',
    'tagged-qa': 'contact_support',
    'compare-bars': 'bar_chart',
    versus: 'compare_arrows',
    'yes-no-split': 'call_split',
    'big-number': 'numbers',
    metric: 'query_stats',
    percent: 'percent',
    pie: 'pie_chart',
    radar: 'radar',
    graph: 'show_chart',
    trend: 'trending_up',
    bar: 'bar_chart',
    'bar-chart': 'bar_chart',
    winner: 'emoji_events',
    podium: 'leaderboard',
    medals: 'military_tech',
    trophy: 'emoji_events',
    crown: 'workspace_premium',
    ticket: 'confirmation_number',
    coupon: 'local_offer',
    gift: 'redeem',
    price: 'sell',
    cart: 'shopping_cart',
    bundle: 'inventory_2',
    countdown: 'timer',
    timer: 'timer',
    stars: 'stars',
    lightbulb: 'lightbulb',
    brain: 'psychology',
    map: 'map',
    tree: 'account_tree',
    pipeline: 'lan',
    ladder: 'stairs',
    maze: 'route',
    spotlight: 'center_focus_strong',
    target: 'track_changes',
    bullseye: 'track_changes',
    bridge: 'join_inner',
    puzzle: 'extension',
    tools: 'build',
    hotline: 'support_agent',
    schedule: 'calendar_month',
    calendar: 'calendar_month',
    clock: 'schedule',
    document: 'description',
    notebook: 'menu_book',
    bookmarks: 'bookmarks',
    story: 'auto_stories',
    video: 'play_circle',
    film: 'movie',
    logo: 'image',
    profile: 'account_circle',
    author: 'edit_note',
    headshot: 'account_box',
    badge: 'badge',
    alarm: 'notifications_active',
    alert: 'warning',
    warning: 'warning',
    breach: 'crisis_alert',
    maintenance: 'build_circle',
    sidebar: 'view_sidebar',
    table: 'table_chart',
    board: 'dashboard',
    cards: 'view_agenda',
    'card-stack': 'filter_none',
    grid: 'grid_view',
    'grid-cards': 'grid_view',
    'grid-quads': 'grid_view',
    'grid-contrast': 'grid_view',
    honeycomb: 'apps',
    cloud: 'cloud',
    'cloud-sun': 'wb_sunny',
    eclipse: 'brightness_2',
    ghost: 'visibility_off',
    fog: 'blur_on',
    filter: 'filter_alt',
    swap: 'swap_horiz',
    lock: 'shield',
    'lock-key': 'shield',
    chain: 'device_hub',
    crack: 'broken_image',
    broken: 'broken_image',
    'broken-fix': 'build',
    'broken-mirror': 'broken_image',
    eraser: 'backspace',
    thorn: 'dangerous',
    torn: 'content_cut',
    slash: 'remove',
    flip: 'flip',
    orbit: 'track_changes',
    intersection: 'join_full',
    zigzag: 'timeline',
    'z-flow': 'alt_route',
}

const KEYWORD_ICON_RULES: Array<{ pattern: RegExp; icon: string }> = [
    { pattern: /\b(quote|frase|citation|cita)\b/, icon: 'format_quote' },
    { pattern: /\b(faq|pregunta|respuesta|q&a|qa|thread|chat|reply)\b/, icon: 'quiz' },
    { pattern: /\b(check|checklist|diagnostico|audit|review|valida|verify)\b/, icon: 'fact_check' },
    { pattern: /\b(error|alert|warning|riesgo|problema|fallo|breach)\b/, icon: 'warning' },
    { pattern: /\b(before|after|antes|despues|compar|versus|vs|split)\b/, icon: 'compare' },
    { pattern: /\b(rank|ranking|top|winner|podium|medal|trophy)\b/, icon: 'leaderboard' },
    { pattern: /\b(metric|dato|stat|cifra|number|percent|percentage)\b/, icon: 'query_stats' },
    { pattern: /\b(pie|donut|radar|chart|graph|trend|bar)\b/, icon: 'pie_chart' },
    { pattern: /\b(timeline|history|cronolog|era|step|paso|process|flow|journey)\b/, icon: 'timeline' },
    { pattern: /\b(offer|promo|discount|price|coupon|deal|sale)\b/, icon: 'local_offer' },
    { pattern: /\b(cart|bundle|product|catalog|inventory|gift)\b/, icon: 'inventory_2' },
    { pattern: /\b(meme|humor|funny|drake|clown)\b/, icon: 'theater_comedy' },
    { pattern: /\b(tutorial|how to|guide|manual|recipe|framework)\b/, icon: 'menu_book' },
    { pattern: /\b(story|case study|case|article|document|memo|note)\b/, icon: 'article' },
    { pattern: /\b(location|pin|map|route|path)\b/, icon: 'location_on' },
    { pattern: /\b(service|support|help|hotline)\b/, icon: 'support_agent' },
    { pattern: /\b(target|focus|spotlight|bullseye)\b/, icon: 'center_focus_strong' },
    { pattern: /\b(orbit|radial|hub|ecosystem|network|tree|pipeline)\b/, icon: 'hub' },
    { pattern: /\b(grid|modular|tile|quad|bento|cards)\b/, icon: 'grid_view' },
    { pattern: /\b(frame|window|card|panel|board)\b/, icon: 'crop_square' },
    { pattern: /\b(diagonal|triangle|pyramid|ladder|stairs)\b/, icon: 'change_history' },
    { pattern: /\b(cta|action|click|button|convert)\b/, icon: 'ads_click' },
]

function normalizeBaseId(id: string): string {
    return id.includes('::') ? id.split('::')[1] || id : id
}

function findExactIcon(baseId: string): string | undefined {
    if (EXACT_ICON_MAP[baseId]) return EXACT_ICON_MAP[baseId]

    const tokens = baseId.split(/[^a-z0-9]+/i).filter(Boolean)
    for (const token of tokens) {
        if (EXACT_ICON_MAP[token]) {
            return EXACT_ICON_MAP[token]
        }
    }

    return undefined
}

export function resolveCarouselCompositionIcon(input: CarouselCompositionIconInput): string {
    const explicitIcon = (input.icon || '').trim()
    if (explicitIcon) return explicitIcon

    const baseId = normalizeBaseId(input.id)
    const exactIcon = findExactIcon(baseId)
    if (exactIcon) return exactIcon

    const semanticText = [
        baseId,
        input.name,
        input.description,
        input.iconPrompt,
        input.layoutPrompt,
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

    for (const rule of KEYWORD_ICON_RULES) {
        if (rule.pattern.test(semanticText)) {
            return rule.icon
        }
    }

    return 'grid_view'
}
