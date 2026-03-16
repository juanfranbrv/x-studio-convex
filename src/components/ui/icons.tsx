/**
 * Centralized icon exports — hugeicons replacements for lucide-react.
 * Import from here instead of lucide-react for a distinctive visual identity.
 *
 * Usage: import { IconHome, IconImage, ... } from '@/components/ui/icons'
 */
'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import {
    Home01Icon,
    Image02Icon,
    Settings01Icon,
    Briefcase02Icon,
    ContractsIcon,
    CarouselHorizontal02Icon,
    Video02Icon,
    Layout03Icon,
    Setting06Icon,
    PlusSignIcon,
    ArrowRight01Icon,
    ArrowDown01Icon,
    ArrowUp01Icon,
    SparklesIcon,
    Logout02Icon,
    User02Icon,
    ShieldEnergyIcon,
    Wallet02Icon,
    CreditCardAcceptIcon,
    GiftIcon,
    Share01Icon,
    Copy01Icon,
    Clock01Icon,
    ReceiptDollarIcon,
    Mail01Icon,
    Rocket01Icon,
    Calendar03Icon,
    BotIcon,
    Megaphone02Icon,
    PaintBrush01Icon,
    Menu02Icon,
    Search01Icon,
    Delete01Icon,
    Download02Icon,
    Upload02Icon,
    Edit02Icon,
    Refresh01Icon,
    CheckmarkCircle01Icon,
    Link01Icon,
    GridViewIcon,
    DocumentCodeIcon,
    Add01Icon,
    Rotate01Icon,
    ArrowDown05Icon,
    Loading03Icon,
} from '@hugeicons/core-free-icons'
import { ComponentProps } from 'react'

type IconProps = Omit<ComponentProps<typeof HugeiconsIcon>, 'icon'>

// Default stroke width — slightly bolder than default (1.5) for better presence
const DEFAULT_STROKE_WIDTH = 2

// Helper to create icon components from hugeicon definitions
function createIcon(icon: typeof Home01Icon) {
    const IconComponent = ({ strokeWidth = DEFAULT_STROKE_WIDTH, ...props }: IconProps) => (
        <HugeiconsIcon icon={icon} strokeWidth={strokeWidth} {...props} />
    )
    IconComponent.displayName = 'HugeIcon'
    return IconComponent
}

// ─── Navigation ───
export const IconHome = createIcon(Home01Icon)
export const IconImage = createIcon(Image02Icon)
export const IconCarousel = createIcon(CarouselHorizontal02Icon)
export const IconVideo = createIcon(Video02Icon)
export const IconStudio = createIcon(Layout03Icon)
export const IconSettings = createIcon(Settings01Icon)
export const IconBrandKit = createIcon(ContractsIcon)

// ─── Actions ───
export const IconPlus = createIcon(PlusSignIcon)
export const IconAdd = createIcon(Add01Icon)
export const IconEdit = createIcon(Edit02Icon)
export const IconDelete = createIcon(Delete01Icon)
export const IconDownload = createIcon(Download02Icon)
export const IconUpload = createIcon(Upload02Icon)
export const IconRefresh = createIcon(Refresh01Icon)
export const IconRotate = createIcon(Rotate01Icon)
export const IconCopy = createIcon(Copy01Icon)
export const IconShare = createIcon(Share01Icon)
export const IconLink = createIcon(Link01Icon)
export const IconSearch = createIcon(Search01Icon)
export const IconMenu = createIcon(Menu02Icon)

// ─── Arrows ───
export const IconArrowRight = createIcon(ArrowRight01Icon)
export const IconArrowDown = createIcon(ArrowDown01Icon)
export const IconArrowUp = createIcon(ArrowUp01Icon)
export const IconChevronDown = createIcon(ArrowDown05Icon)

// ─── Status ───
export const IconSparkles = createIcon(SparklesIcon)
export const IconCheck = createIcon(CheckmarkCircle01Icon)
export const IconClock = createIcon(Clock01Icon)
export const IconLoading = createIcon(Loading03Icon)

// ─── User ───
export const IconUser = createIcon(User02Icon)
export const IconLogout = createIcon(Logout02Icon)
export const IconShield = createIcon(ShieldEnergyIcon)

// ─── Billing ───
export const IconWallet = createIcon(Wallet02Icon)
export const IconCreditCard = createIcon(CreditCardAcceptIcon)
export const IconGift = createIcon(GiftIcon)
export const IconReceipt = createIcon(ReceiptDollarIcon)

// ─── Communication ───
export const IconMail = createIcon(Mail01Icon)
export const IconMegaphone = createIcon(Megaphone02Icon)
export const IconBot = createIcon(BotIcon)
export const IconRocket = createIcon(Rocket01Icon)

// ─── Design ───
export const IconPalette = createIcon(PaintBrush01Icon)
export const IconGrid = createIcon(GridViewIcon)
export const IconCalendar = createIcon(Calendar03Icon)
