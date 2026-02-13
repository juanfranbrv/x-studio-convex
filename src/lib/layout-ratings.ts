export type LayoutRatingStoreEntry = {
    totalPoints: number
    uses: number
    votes: number
}

export type LayoutRatingStats = LayoutRatingStoreEntry & {
    average: number
}

const LEGACY_MARKS_STORAGE_KEY = 'admin_layout_marks_v1'
const LEGACY_RATINGS_STORAGE_KEY = 'admin_layout_ratings_v1'
const MIGRATION_FLAG_KEY = 'admin_layout_ratings_migrated_to_convex_v1'

const isBrowser = () => typeof window !== 'undefined'

const parseJson = <T>(raw: string | null, fallback: T): T => {
    if (!raw) return fallback
    try {
        return JSON.parse(raw) as T
    } catch {
        return fallback
    }
}

export const getLayoutRatingStats = (
    layoutId: string,
    store?: Record<string, LayoutRatingStoreEntry>
): LayoutRatingStats => {
    const entry = store?.[layoutId]
    const totalPoints = Number(entry?.totalPoints ?? 0)
    const uses = Number(entry?.uses ?? 0)
    const votes = Number(entry?.votes ?? 0)
    const average = uses > 0 ? totalPoints / uses : 0
    return {
        totalPoints: Number.isFinite(totalPoints) ? totalPoints : 0,
        uses: Number.isFinite(uses) ? uses : 0,
        votes: Number.isFinite(votes) ? votes : 0,
        average,
    }
}

export const hasLayoutRatingsMigrationRun = (): boolean => {
    if (!isBrowser()) return true
    return window.localStorage.getItem(MIGRATION_FLAG_KEY) === '1'
}

export const markLayoutRatingsMigrationAsDone = (): void => {
    if (!isBrowser()) return
    window.localStorage.setItem(MIGRATION_FLAG_KEY, '1')
}

export const readLegacyLayoutMarks = (): Record<string, 'heart' | 'skull'> => {
    if (!isBrowser()) return {}
    const parsed = parseJson<Record<string, 'heart' | 'skull'>>(
        window.localStorage.getItem(LEGACY_MARKS_STORAGE_KEY),
        {}
    )
    const safe: Record<string, 'heart' | 'skull'> = {}
    Object.entries(parsed).forEach(([layoutId, mark]) => {
        if (!layoutId) return
        if (mark === 'heart' || mark === 'skull') {
            safe[layoutId] = mark
        }
    })
    return safe
}

export const readLegacyLayoutRatings = (): Record<string, LayoutRatingStoreEntry> => {
    if (!isBrowser()) return {}
    const parsed = parseJson<Record<string, LayoutRatingStoreEntry>>(
        window.localStorage.getItem(LEGACY_RATINGS_STORAGE_KEY),
        {}
    )
    const safe: Record<string, LayoutRatingStoreEntry> = {}
    Object.entries(parsed).forEach(([layoutId, entry]) => {
        if (!layoutId) return
        const totalPoints = Number(entry?.totalPoints ?? 0)
        const uses = Number(entry?.uses ?? 0)
        const votes = Number(entry?.votes ?? 0)
        safe[layoutId] = {
            totalPoints: Number.isFinite(totalPoints) ? totalPoints : 0,
            uses: Number.isFinite(uses) ? uses : 0,
            votes: Number.isFinite(votes) ? votes : 0,
        }
    })
    return safe
}

export const clearLegacyLayoutRatingStorage = (): void => {
    if (!isBrowser()) return
    window.localStorage.removeItem(LEGACY_MARKS_STORAGE_KEY)
    window.localStorage.removeItem(LEGACY_RATINGS_STORAGE_KEY)
}

