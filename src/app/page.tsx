'use client'

import { Loader2 } from '@/components/ui/spinner'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useAuth, useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  Bot,
  CheckCircle,
  Clock,
  Mail,
} from 'lucide-react'
import { AppLogo } from '@/components/ui/AppLogo'
import { api } from '@/../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { brand } from '@/lib/brand'
import { cn } from '@/lib/utils'

const FONT_LANDING = 'Google Sans Flex, sans-serif'

/* ─── Curved section divider (SVG wave) ─── */
function SectionCurve({ position, className }: { position: 'top' | 'bottom'; className?: string }) {
  if (position === 'top') {
    return (
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={cn('block w-full', className)} style={{ height: 'clamp(40px, 5vw, 80px)' }}>
        <path d="M0,80 C360,0 1080,0 1440,80 L1440,80 L0,80 Z" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={cn('block w-full', className)} style={{ height: 'clamp(40px, 5vw, 80px)' }}>
      <path d="M0,0 C360,80 1080,80 1440,0 L1440,0 L0,0 Z" fill="currentColor" />
    </svg>
  )
}

export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const userEmail = user?.emailAddresses[0]?.emailAddress || ''

  const betaAccess = useQuery(api.admin.checkBetaAccess, userEmail ? { email: userEmail } : 'skip')

  if (isLoaded && isSignedIn && betaAccess && !betaAccess.hasAccess) {
    if (betaAccess.status === 'pending' || betaAccess.status === 'rejected') {
      return <PendingAccessScreen status={betaAccess.status} email={userEmail} />
    }
  }

  return <LandingPage hasAccess={betaAccess?.hasAccess ?? false} />
}

/* ─────────────────────────── Pending Screen ─────────────────────────── */

function PendingAccessScreen({ status, email }: { status: string; email: string }) {
  const { t } = useTranslation('home')
  const { signOut } = useAuth()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-8" style={{ fontFamily: FONT_LANDING }}>
      <div className="glass-card relative z-10 w-full max-w-md border border-border/40 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border/30 bg-muted shadow-inner">
          {status === 'pending' ? (
            <Clock className="h-10 w-10 animate-pulse text-primary" />
          ) : (
            <Bot className="h-10 w-10 text-destructive" />
          )}
        </div>

        <h2 className="mb-2 text-3xl font-bold tracking-tight">
          {status === 'pending' ? t('pending.titlePending') : t('pending.titleRejected')}
        </h2>

        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          {status === 'pending'
            ? t('pending.bodyPending', { email })
            : t('pending.bodyRejected')}
        </p>

        <Button
          variant="outline"
          onClick={() => signOut({ redirectUrl: '/' })}
          className="glass h-12 w-full border-white/20 text-base font-medium transition-all duration-300 hover:bg-white/10"
        >
          {t('pending.backHome')}
        </Button>
      </div>
    </div>
  )
}

/* ─────────────────────────── Main Landing ─────────────────────────── */

function LandingPage({ hasAccess = false }: { hasAccess?: boolean }) {
  const { t } = useTranslation('home')

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden" style={{ fontFamily: FONT_LANDING }}>
      {/* ── Nav ── */}
      <LandingNav hasAccess={hasAccess} />

      {/* ── Hero ── */}
      <HeroSection hasAccess={hasAccess} />

      {/* ── Feature Tabs ── */}
      <FeatureTabsSection />

      {/* ── Feature Showcases (split layout) ── */}
      <FeatureShowcasesSection />

      {/* ── Stats ── */}
      <StatsSection />

      {/* ── Final CTA ── */}
      <FinalCTASection hasAccess={hasAccess} />

      {/* ── Footer ── */}
      <LandingFooter />
    </div>
  )
}

/* ─────────────────────────── Navigation ─────────────────────────── */

function LandingNav({ hasAccess }: { hasAccess: boolean }) {
  const { t } = useTranslation('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '#features', label: t('footer.features') },
    { href: '/pricing', label: t('footer.pricing') },
    { href: '/contact', label: t('footer.contact') },
  ]

  return (
    <nav
      className={cn(
        'left-0 right-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'fixed px-4 py-3 sm:px-6'
          : 'absolute px-6 py-6 sm:px-10'
      )}
    >
      <div
        className={cn(
          'mx-auto flex items-center justify-between transition-all duration-300',
          scrolled
            ? 'max-w-[90rem] rounded-2xl border border-border/40 bg-background/80 px-6 py-3 shadow-lg backdrop-blur-xl'
            : 'max-w-[90rem] px-0 py-0'
        )}
      >
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <AppLogo className="h-9 w-11 transition-all duration-300 group-hover:scale-110" />
          <span className="text-xl font-bold tracking-tight transition-all duration-300 sm:text-2xl">
            {brand.name}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {!hasAccess ? (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" className="font-medium">
                  {t('landing.login')}
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary font-semibold text-primary-foreground shadow-md transition-all hover:scale-105">
                  {t('landing.heroCTA')}
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/image">
              <Button className="bg-primary font-semibold text-primary-foreground shadow-md">
                {t('landing.enterStudio')} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col gap-1.5 p-2 md:hidden"
          aria-label="Menu"
        >
          <span className={cn('h-0.5 w-5 rounded bg-foreground transition-all', mobileMenuOpen && 'translate-y-2 rotate-45')} />
          <span className={cn('h-0.5 w-5 rounded bg-foreground transition-all', mobileMenuOpen && 'opacity-0')} />
          <span className={cn('h-0.5 w-5 rounded bg-foreground transition-all', mobileMenuOpen && '-translate-y-2 -rotate-45')} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={cn(
          'mt-2 rounded-2xl border border-border/40 bg-background/95 p-6 shadow-xl backdrop-blur-xl md:hidden',
          !scrolled && 'mx-4'
        )}>
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              {!hasAccess ? (
                <>
                  <Link href="/sign-in">
                    <Button variant="outline" className="w-full font-medium">{t('landing.login')}</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="w-full bg-primary font-semibold text-primary-foreground">{t('landing.heroCTA')}</Button>
                  </Link>
                </>
              ) : (
                <Link href="/image">
                  <Button className="w-full bg-primary font-semibold text-primary-foreground">{t('landing.enterStudio')}</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ─────────────────────────── Hero Section ─────────────────────────── */

function HeroSection({ hasAccess }: { hasAccess: boolean }) {
  const { t } = useTranslation('home')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const submitRequest = useMutation(api.admin.submitBetaRequest)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsSubmitting(true)
    try {
      const result = await submitRequest({ email: email.trim() })
      setSubmitted(true)
      setMessage(result.message)
    } catch {
      setMessage(t('landing.requestError'))
    }
    setIsSubmitting(false)
  }

  return (
    <section className="relative px-6 pb-20 pt-32 sm:pt-40 md:pb-28 md:pt-48">

      <div className="mx-auto max-w-6xl text-center">
        {/* Headline */}
        <h1 className="mx-auto max-w-5xl text-balance text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[1.08] tracking-tight">
          {t('landing.heroTitle')}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-[clamp(1.125rem,1.5vw,1.5rem)] font-medium leading-relaxed text-muted-foreground md:mt-8">
          {t('landing.heroBody')}
        </p>

        {/* CTA area */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:mt-12">
          {hasAccess ? (
            <Link href="/image">
              <Button size="lg" className="h-14 rounded-2xl bg-primary px-10 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                {t('landing.enterStudio')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : submitted ? (
            <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4">
              <CheckCircle className="h-6 w-6 text-primary" />
              <p className="font-semibold text-primary">{message || t('landing.registrationCompleted')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full max-w-lg flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-2xl border-border/60 bg-background/60 pl-12 text-lg backdrop-blur-sm transition-all focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="h-14 rounded-2xl bg-primary px-8 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-6 w-6" /> : t('landing.heroCTA')}
              </Button>
            </form>
          )}
        </div>

        {!hasAccess && !submitted && (
          <div className="mt-4">
            <Link href="/sign-in" className="text-sm font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground">
              {t('landing.alreadyHaveAccount')}
            </Link>
          </div>
        )}

        {/* Trusted by */}
        <p className="mt-14 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 md:mt-20">
          {t('landing.trustedBy')}
        </p>
        <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-40 sm:gap-x-14">
          {[
            { name: 'Meridian', letters: 'MERIDIAN' },
            { name: 'Lumina', letters: 'LUMINA' },
            { name: 'Vertex', letters: 'VERTEX' },
            { name: 'Pulsar', letters: 'PULSAR' },
            { name: 'Arcadia', letters: 'ARCADIA' },
            { name: 'NovaBrand', letters: 'NOVA' },
          ].map((b) => (
            <span key={b.name} className="text-base font-extrabold tracking-[0.2em] text-foreground/60 sm:text-lg">
              {b.letters}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── Feature Tabs (Auto-rotate + Progress Bar) ─────────────────────────── */

const TAB_KEYS = ['brandKit', 'generateImages', 'carousels', 'editSemantic', 'multiFormat'] as const
const TAB_DURATION = 6000 // ms per tab

const TAB_IMAGES: Record<string, string> = {
  brandKit: '/landing/tab-brand.jpg',
  generateImages: '/landing/tab-generate.jpg',
  carousels: '/landing/tab-carousel.jpg',
  editSemantic: '/landing/tab-edit.jpg',
  multiFormat: '/landing/tab-format.jpg',
}

function FeatureTabsSection() {
  const { t } = useTranslation('home')
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef(Date.now())
  const isPausedRef = useRef(false)

  const activeTab = TAB_KEYS[activeIdx]

  const goToTab = useCallback((idx: number) => {
    setActiveIdx(idx)
    setProgress(0)
    startTimeRef.current = Date.now()
  }, [])

  const advanceTab = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % TAB_KEYS.length)
    setProgress(0)
    startTimeRef.current = Date.now()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPausedRef.current) return
      const elapsed = Date.now() - startTimeRef.current
      const pct = Math.min(elapsed / TAB_DURATION, 1)
      setProgress(pct)
      if (pct >= 1) advanceTab()
    }, 30)
    return () => clearInterval(timer)
  }, [advanceTab])

  const handleMouseEnter = () => { isPausedRef.current = true }
  const handleMouseLeave = () => {
    isPausedRef.current = false
    startTimeRef.current = Date.now() - progress * TAB_DURATION
  }

  return (
    <section className="relative">
      {/* Curved top divider */}
      <SectionCurve position="top" className="text-muted" />
      <div className="bg-muted pb-20 pt-8 md:pb-28 md:pt-12">
      <div className="mx-auto max-w-[90rem] px-6 sm:px-10">
        <h2 className="mb-4 text-center text-[clamp(1.75rem,3vw,3rem)] font-bold tracking-tight">
          {t('tabs.label')}
        </h2>

        <div
          className="mt-12 grid items-stretch gap-10 md:mt-16 md:grid-cols-[minmax(0,1fr)_1.4fr] md:gap-14 lg:gap-20"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Left: Tab list with thick vertical progress bars (Slack style) */}
          <div className="flex flex-col justify-between gap-0">
            {TAB_KEYS.map((key, idx) => {
              const isActive = idx === activeIdx
              const isPast = idx < activeIdx
              return (
                <button
                  key={key}
                  onClick={() => goToTab(idx)}
                  className="group relative flex flex-1 items-stretch gap-5 py-1 text-left"
                >
                  {/* Thick vertical progress bar */}
                  <div className="relative w-1 shrink-0 overflow-hidden rounded-full bg-border/40">
                    <div
                      className="absolute left-0 top-0 w-full rounded-full bg-primary"
                      style={{
                        height: isActive ? `${progress * 100}%` : isPast ? '100%' : '0%',
                        transition: isActive ? 'height 50ms linear' : 'height 300ms ease',
                      }}
                    />
                  </div>

                  {/* Text content */}
                  <div className="flex flex-1 flex-col justify-center py-4">
                    <h3 className={cn(
                      'text-[clamp(1.125rem,1.5vw,1.375rem)] font-bold tracking-tight transition-colors duration-200',
                      isActive ? 'text-foreground' : 'text-muted-foreground/60 group-hover:text-muted-foreground'
                    )}>
                      {t(`tabs.${key}.title`)}
                    </h3>

                    {/* Expandable description */}
                    <div
                      className={cn(
                        'grid transition-all duration-400',
                        isActive ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="text-[clamp(0.9375rem,1.1vw,1.125rem)] leading-relaxed text-muted-foreground">
                          {t(`tabs.${key}.description`)}
                        </p>
                        <Link
                          href={tabHref(key)}
                          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                        >
                          {t('landing.learnMore')} <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right: Image area with crossfade — stretches to match text column height */}
          <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-muted shadow-lg">
            <div className="relative h-full min-h-[300px] sm:min-h-[400px]">
              {TAB_KEYS.map((key, idx) => (
                <img
                  key={key}
                  src={TAB_IMAGES[key]}
                  alt={t(`tabs.${key}.tab`)}
                  className={cn(
                    'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
                    idx === activeIdx ? 'opacity-100' : 'opacity-0'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
      {/* Curved bottom divider */}
      <SectionCurve position="bottom" className="text-muted" />
    </section>
  )
}

function tabHref(tab: string) {
  switch (tab) {
    case 'brandKit': return '/brand-kit'
    case 'generateImages': return '/image'
    case 'carousels': return '/carousel'
    default: return '/image'
  }
}

/* ─────────────────────── Feature Showcases ─────────────────────── */

const SHOWCASES = [
  { key: 'brandDNA', image: '/landing/showcase-brand.jpg' },
  { key: 'multiAsset', image: '/landing/showcase-multi.jpg' },
  { key: 'smartEditing', image: '/landing/showcase-edit.jpg' },
  { key: 'teamScale', image: '/landing/showcase-scale.jpg' },
] as const

function FeatureShowcasesSection() {
  const { t } = useTranslation('home')

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-[90rem] px-6 sm:px-10">
        <h2 className="mx-auto max-w-3xl text-center text-[clamp(1.75rem,3vw,3rem)] font-bold tracking-tight">
          {t('showcase.sectionTitle')}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-[clamp(1.0625rem,1.3vw,1.25rem)] leading-relaxed text-muted-foreground">
          {t('showcase.sectionSubtitle')}
        </p>

        <div className="mt-16 space-y-20 md:mt-24 md:space-y-28">
          {SHOWCASES.map((item, idx) => {
            const isReversed = idx % 2 !== 0
            return (
              <div
                key={item.key}
                className={cn(
                  'grid items-center gap-10 md:grid-cols-2 md:gap-16',
                  isReversed && 'md:[&>*:first-child]:order-2'
                )}
              >
                {/* Text */}
                <div>
                  <h3 className="text-[clamp(1.5rem,2.5vw,2.5rem)] font-bold tracking-tight">
                    {t(`showcase.${item.key}.title`)}
                  </h3>
                  <p className="mt-5 text-[clamp(1.0625rem,1.3vw,1.25rem)] leading-relaxed text-muted-foreground">
                    {t(`showcase.${item.key}.description`)}
                  </p>
                  <Link
                    href="/image"
                    className="mt-6 inline-flex items-center gap-1.5 text-base font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    {t(`showcase.${item.key}.link`)} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Image */}
                <div className="overflow-hidden rounded-3xl border border-border/40 shadow-lg">
                  <img
                    src={item.image}
                    alt={t(`showcase.${item.key}.title`)}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── Stats ─────────────────────────── */

const STAT_KEYS = ['stat1', 'stat2', 'stat3', 'stat4'] as const

function StatsSection() {
  const { t } = useTranslation('home')

  return (
    <section className="relative">
      {/* Curved top divider */}
      <SectionCurve position="top" className="text-primary" />
      <div className="bg-primary pb-20 pt-8 md:pb-28 md:pt-12">
        <div className="mx-auto max-w-[90rem] px-6 sm:px-10">
          <h2 className="mb-4 text-center text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-primary-foreground">
            {t('proof.title')}
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-[clamp(1.0625rem,1.3vw,1.25rem)] text-primary-foreground/70">
            {t('proof.subtitle')}
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            {STAT_KEYS.map((key) => (
              <div key={key} className="text-center">
                <p className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-tight text-primary-foreground">
                  {t(`stats.${key}.value`)}
                </p>
                <p className="mt-2 text-sm font-medium leading-snug text-primary-foreground/70 sm:text-base">
                  {t(`stats.${key}.label`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Curved bottom divider */}
      <SectionCurve position="bottom" className="text-primary" />
    </section>
  )
}

/* ─────────────────────────── Final CTA ─────────────────────────── */

function FinalCTASection({ hasAccess }: { hasAccess: boolean }) {
  const { t } = useTranslation('home')

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-[clamp(1.75rem,3vw,3rem)] font-bold tracking-tight">
          {t('cta.title')}
        </h2>
        <p className="mt-4 text-[clamp(1.0625rem,1.3vw,1.375rem)] text-muted-foreground">
          {t('cta.subtitle')}
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href={hasAccess ? '/image' : '/sign-up'}>
            <Button size="lg" className="h-14 rounded-2xl bg-primary px-10 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:scale-105">
              {t('cta.primaryButton')}
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="h-14 rounded-2xl px-10 text-lg font-semibold">
              {t('cta.secondaryButton')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── Footer ─────────────────────────── */

function LandingFooter() {
  const { t } = useTranslation('home')

  const columns = [
    {
      title: t('footer.product'),
      links: [
        { label: t('footer.features'), href: '#features' },
        { label: t('footer.pricing'), href: '/pricing' },
        { label: t('footer.changelog'), href: '#' },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.about'), href: '/contact' },
        { label: t('footer.blog'), href: '#' },
        { label: t('footer.careers'), href: '#' },
      ],
    },
    {
      title: t('footer.resources'),
      links: [
        { label: t('footer.docs'), href: '#' },
        { label: t('footer.help'), href: '#' },
        { label: t('footer.community'), href: '#' },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { label: t('footer.privacy'), href: '/privacy' },
        { label: t('footer.terms'), href: '/terms' },
        { label: t('footer.cookies'), href: '/cookies' },
      ],
    },
  ]

  return (
    <footer className="mt-auto border-t border-border/40 bg-muted/20">
      <div className="mx-auto max-w-[90rem] px-6 py-12 sm:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-6">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <AppLogo className="h-7 w-9" />
              <span className="text-lg font-bold tracking-tight">{brand.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t('landing.heroBody')}
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground/70">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground/60">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
