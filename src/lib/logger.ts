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

const labelStyle: Record<string, (text: string) => string> = {
    IMAGE: chalk.bgCyan.black,
    TEXT: chalk.bgMagenta.white,
    API: chalk.bgBlue.white,
    FLOW: chalk.bgYellow.black,
    BRAND: chalk.bgGreen.black,
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

function formatDetails(details?: unknown) {
    if (!details) return ''
    if (details instanceof Error) {
        const payload = {
            name: details.name,
            message: details.message,
            stack: details.stack,
        }
        return dim(JSON.stringify(payload))
    }
    try {
        return dim(JSON.stringify(details))
    } catch {
        return dim(String(details))
    }
}

function buildSection(label: string, lines: string[], level: LogLevel) {
    const header = `${tag(label, level)} ${lineStyle[level](truncate(lines[0] || ''))}`
    const body = lines
        .slice(1)
        .flatMap((line) => wrapLine(line))
        .map((line) => `${lineStyle[level]('  -')} ${truncate(line)}`)
    return [header, ...body].join('\n')
}

export const log = {
    info(label: string, message: string, details?: unknown) {
        console.log(tag(label, 'info'), truncate(toSingleLine(message)), formatDetails(details))
    },
    success(label: string, message: string, details?: unknown) {
        console.log(tag(label, 'success'), truncate(toSingleLine(message)), formatDetails(details))
    },
    warn(label: string, message: string, details?: unknown) {
        console.warn(tag(label, 'warn'), truncate(toSingleLine(message)), formatDetails(details))
    },
    error(label: string, message: string, details?: unknown) {
        console.error(tag(label, 'error'), truncate(toSingleLine(message)), formatDetails(details))
    },
    debug(label: string, message: string, details?: unknown) {
        console.log(tag(label, 'debug'), truncate(toSingleLine(message)), formatDetails(details))
    },
    section(label: string, lines: string[], level: LogLevel = 'info') {
        console.log(buildSection(label, lines, level))
    }
}
