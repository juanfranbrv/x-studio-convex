import chalk from 'chalk'

type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug'

const levelStyle: Record<LogLevel, (text: string) => string> = {
    info: chalk.bgBlue.white,
    success: chalk.bgGreen.black,
    warn: chalk.bgYellow.black,
    error: chalk.bgRed.white,
    debug: chalk.bgMagenta.white,
}

const lineStyle: Record<LogLevel, (text: string) => string> = {
    info: chalk.cyan,
    success: chalk.green,
    warn: chalk.yellow,
    error: chalk.red,
    debug: chalk.magenta,
}

const dim = chalk.gray
const MAX_LINE = 80
const MAX_PREVIEW = 240
const SHOW_STACKS = process.env.LOG_STACKS === '1'

const labelStyle: Record<string, (text: string) => string> = {
    IMAGE: chalk.bgCyan.black,
    TEXT: chalk.bgMagenta.white,
    API: chalk.bgBlue.white,
    FLOW: chalk.bgYellow.black,
    BRAND: chalk.bgGreen.black,
    CAROUSEL: chalk.bgHex('#1D4ED8').white,
    VISION: chalk.bgWhite.black,
    REPLICATE: chalk.bgHex('#6D28D9').white,
    ECONOMIC: chalk.bgHex('#065F46').white,
    LAZYPROMPT: chalk.bgHex('#92400E').white,
    SESSION: chalk.bgHex('#0F766E').white,
}

function tag(label: string, level: LogLevel) {
    const key = label.trim().toUpperCase()
    const paint = labelStyle[key] || levelStyle[level]
    return paint(` ${label} `)
}

function toSingleLine(text: string) {
    return text.replace(/\s+/g, ' ').trim()
}

function truncate(text: string, max = MAX_LINE) {
    if (text.length <= max) return text
    return `${text.slice(0, Math.max(0, max - 3))}...`
}

function nowTime() {
    return new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })
}

function wrapLine(text: string, max = MAX_LINE): string[] {
    const clean = toSingleLine(text)
    if (!clean) return ['']
    if (clean.length <= max) return [clean]
    const parts: string[] = []
    let rest = clean
    while (rest.length > max) {
        parts.push(rest.slice(0, max))
        rest = rest.slice(max)
    }
    if (rest.length) parts.push(rest)
    return parts
}

function safeStringify(value: unknown) {
    try {
        return JSON.stringify(value)
    } catch {
        return String(value)
    }
}

function formatDetails(details?: unknown) {
    if (details === undefined || details === null) return []

    if (details instanceof Error) {
        const lines = [
            `error: ${details.name}: ${details.message}`,
            SHOW_STACKS && details.stack ? `stack: ${truncate(toSingleLine(details.stack), MAX_PREVIEW)}` : undefined,
        ].filter(Boolean) as string[]
        return lines.map((line) => dim(`  ${chalk.gray('·')} ${line}`))
    }

    if (typeof details === 'string') {
        return [dim(`  ${chalk.gray('·')} detalle: ${truncate(toSingleLine(details), MAX_PREVIEW)}`)]
    }

    if (typeof details === 'object') {
        const entries = Object.entries(details as Record<string, unknown>)
        if (!entries.length) return [dim(`  ${chalk.gray('·')} detalle: {}`)]
        return entries.map(([key, value]) => {
            const rendered = typeof value === 'string'
                ? truncate(toSingleLine(value), MAX_PREVIEW)
                : truncate(toSingleLine(safeStringify(value)), MAX_PREVIEW)
            return dim(`  ${chalk.gray('·')} ${key}: ${rendered}`)
        })
    }

    return [dim(`  ${chalk.gray('·')} detalle: ${String(details)}`)]
}

function buildSection(label: string, lines: string[], level: LogLevel) {
    const time = dim(`[${nowTime()}]`)
    const header = `${time} ${tag(label, level)} ${lineStyle[level](truncate(lines[0] || ''))}`
    const body = lines
        .slice(1)
        .flatMap((line) => wrapLine(line))
        .map((line) => `${lineStyle[level]('  -')} ${truncate(line)}`)
    return [header, ...body].join('\n')
}

function write(level: LogLevel, label: string, message: string, details?: unknown) {
    const time = dim(`[${nowTime()}]`)
    const head = `${time} ${tag(label, level)} ${lineStyle[level](truncate(toSingleLine(message), MAX_PREVIEW))}`
    const detailLines = formatDetails(details)
    const output = detailLines.length ? `${head}\n${detailLines.join('\n')}` : head

    if (level === 'warn') {
        console.warn(output)
        return
    }
    if (level === 'error') {
        console.error(output)
        return
    }
    console.log(output)
}

export const log = {
    info(label: string, message: string, details?: unknown) {
        write('info', label, message, details)
    },
    success(label: string, message: string, details?: unknown) {
        write('success', label, message, details)
    },
    warn(label: string, message: string, details?: unknown) {
        write('warn', label, message, details)
    },
    error(label: string, message: string, details?: unknown) {
        write('error', label, message, details)
    },
    debug(label: string, message: string, details?: unknown) {
        write('debug', label, message, details)
    },
    section(label: string, lines: string[], level: LogLevel = 'info') {
        console.log(buildSection(label, lines, level))
    }
}
