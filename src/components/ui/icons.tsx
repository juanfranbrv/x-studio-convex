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
    ArrowLeft01Icon,
    ArrowLeft05Icon,
    ArrowRight05Icon,
    ArrowUp05Icon,
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
    // ─── New icons for studio/image/carousel migration ───
    AlertCircleIcon,
    MailAtSign01Icon,
    BookmarkAdd01Icon,
    Bug01Icon,
    Eraser01Icon,
    ImageAdd01Icon,
    ImageDownloadIcon,
    InstagramIcon,
    LayerIcon,
    Layout01Icon,
    BulbIcon,
    Linkedin01Icon,
    SquareLock01Icon,
    SquareUnlock01Icon,
    MapPinIcon,
    Maximize01Icon,
    Message01Icon,
    MinusSignIcon,
    MouseLeftClick01Icon,
    MusicNote01Icon,
    ColorPickerIcon,
    PowerIcon,
    Route01Icon,
    SentIcon,
    SquareArrowDown01Icon,
    TextFontIcon,
    Undo02Icon,
    MagicWand01Icon,
    YoutubeIcon,
    ZoomInAreaIcon,
    ZoomOutAreaIcon,
    FloppyDiskIcon,
    WorkHistoryIcon,
    FingerPrintIcon,
    Cancel01Icon,
    PaintBrush04Icon,
    SmartPhone01Icon,
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
export const IconSave = createIcon(FloppyDiskIcon)
export const IconUndo = createIcon(Undo02Icon)
export const IconEraser = createIcon(Eraser01Icon)
export const IconSend = createIcon(SentIcon)

// ─── Arrows & Chevrons ───
export const IconArrowRight = createIcon(ArrowRight01Icon)
export const IconArrowDown = createIcon(ArrowDown01Icon)
export const IconArrowUp = createIcon(ArrowUp01Icon)
export const IconArrowLeft = createIcon(ArrowLeft01Icon)
export const IconChevronDown = createIcon(ArrowDown05Icon)
export const IconChevronUp = createIcon(ArrowUp05Icon)
export const IconChevronLeft = createIcon(ArrowLeft05Icon)
export const IconChevronRight = createIcon(ArrowRight05Icon)

// ─── Status ───
export const IconSparkles = createIcon(SparklesIcon)
export const IconCheck = createIcon(CheckmarkCircle01Icon)
export const IconClock = createIcon(Clock01Icon)
export const IconLoading = createIcon(Loading03Icon)
export const IconAlertCircle = createIcon(AlertCircleIcon)
export const IconBug = createIcon(Bug01Icon)
export const IconPower = createIcon(PowerIcon)

// ─── User ───
export const IconUser = createIcon(User02Icon)
export const IconLogout = createIcon(Logout02Icon)
export const IconShield = createIcon(ShieldEnergyIcon)
export const IconFingerprint = createIcon(FingerPrintIcon)

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
export const IconMessage = createIcon(Message01Icon)

// ─── Design & Studio ───
export const IconPalette = createIcon(PaintBrush01Icon)
export const IconGrid = createIcon(GridViewIcon)
export const IconCalendar = createIcon(Calendar03Icon)
export const IconWand = createIcon(MagicWand01Icon)
export const IconPaintbrush = createIcon(PaintBrush04Icon)
export const IconColorPicker = createIcon(ColorPickerIcon)
export const IconLayers = createIcon(LayerIcon)
export const IconLayout = createIcon(Layout01Icon)
export const IconImageAdd = createIcon(ImageAdd01Icon)
export const IconImageDownload = createIcon(ImageDownloadIcon)
export const IconSquareArrowDown = createIcon(SquareArrowDown01Icon)
export const IconTextFont = createIcon(TextFontIcon)
export const IconMouseClick = createIcon(MouseLeftClick01Icon)
export const IconLightbulb = createIcon(BulbIcon)
export const IconRoute = createIcon(Route01Icon)

// ─── Media & Social ───
export const IconInstagram = createIcon(InstagramIcon)
export const IconLinkedin = createIcon(Linkedin01Icon)
export const IconYoutube = createIcon(YoutubeIcon)
export const IconMusic = createIcon(MusicNote01Icon)

// ─── Security ───
export const IconLock = createIcon(SquareLock01Icon)
export const IconUnlock = createIcon(SquareUnlock01Icon)

// ─── Map & Location ───
export const IconMapPin = createIcon(MapPinIcon)
export const IconPhone = createIcon(SmartPhone01Icon)
export const IconAtSign = createIcon(MailAtSign01Icon)

// ─── Zoom ───
export const IconZoomIn = createIcon(ZoomInAreaIcon)
export const IconZoomOut = createIcon(ZoomOutAreaIcon)
export const IconMaximize = createIcon(Maximize01Icon)

// ─── Misc ───
export const IconMinus = createIcon(MinusSignIcon)
export const IconClose = createIcon(Cancel01Icon)
export const IconBookmarkAdd = createIcon(BookmarkAdd01Icon)
export const IconHistory = createIcon(WorkHistoryIcon)
