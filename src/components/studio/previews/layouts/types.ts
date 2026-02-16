export interface LayoutProps {
    image: string | null
    brandColors: string[]
    logoId: string | null
    texts: Record<string, string>
    aspectRatio: number
    isGhost?: boolean
}
