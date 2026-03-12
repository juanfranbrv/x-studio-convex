'use client'

import { Loader2 } from '@/components/ui/spinner'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth, useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Bot, CheckCircle, Clock, Layers, Mail, Palette, Zap } from 'lucide-react'
import { api } from '@/../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

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

  return <BetaLandingPage hasAccess={betaAccess?.hasAccess ?? false} />
}

function PendingAccessScreen({ status, email }: { status: string; email: string }) {
  const { t } = useTranslation('home')
  const { signOut } = useAuth()

  const handleGoHome = () => {
    signOut({ redirectUrl: '/' })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-8">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="glass-card relative z-10 w-full max-w-md border border-white/20 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 to-secondary/20 shadow-inner">
          {status === 'pending' ? (
            <Clock className="h-10 w-10 animate-pulse text-primary" />
          ) : (
            <Bot className="h-10 w-10 text-destructive" />
          )}
        </div>

        <h2 className="mb-2 font-heading text-3xl font-bold tracking-tight">
          {status === 'pending' ? t('pending.titlePending') : t('pending.titleRejected')}
        </h2>

        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          {status === 'pending'
            ? t('pending.bodyPending', { email })
            : t('pending.bodyRejected')}
        </p>

        <Button
          variant="outline"
          onClick={handleGoHome}
          className="glass h-12 w-full border-white/20 text-base font-medium transition-all duration-300 hover:bg-white/10"
        >
          {t('pending.backHome')}
        </Button>
      </div>
    </div>
  )
}

function BetaLandingPage({ hasAccess = false }: { hasAccess?: boolean }) {
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
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-[1.75rem] border border-white/10 bg-background/72 px-4 py-4 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.32)] backdrop-blur-xl transition-all duration-300 sm:px-6">
          <div className="group flex items-center gap-4">
            <div className="flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <Bot className="h-8 w-8 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight opacity-90">Adstudio</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/pricing" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:inline-flex">
              Pricing
            </Link>
            <div className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 sm:inline-flex">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{t('landing.privateBeta')}</span>
            </div>
            {!hasAccess ? (
              <Link href="/sign-in">
                <Button variant="ghost" className="text-sm font-medium transition-colors hover:bg-primary/5">
                  {t('landing.login')}
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </nav>

      <main className="relative flex-1 px-6 pb-20 pt-32">
        <div className="pointer-events-none absolute right-10 top-40 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-20 left-10 -z-10 h-[500px] w-[500px] rounded-full bg-secondary/15 blur-[150px]" />

        <div className="mx-auto max-w-4xl py-12 text-center">
          <h1 className="mb-6 text-balance font-heading text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl">
            {t('landing.heroTitleLine1')} <br />
            <span className="px-2 italic text-primary">{t('landing.heroTitleHighlight')}</span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-xl font-medium leading-relaxed text-muted-foreground/80 md:text-2xl">
            {t('landing.heroBody')}
          </p>

          <div className="relative mx-auto max-w-xl">
            <div className="glass-card relative border-white/20 p-8 shadow-2xl backdrop-blur-xl md:p-10">
              {hasAccess ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-12 w-12 text-primary" />
                    <h2 className="text-2xl font-bold">{t('landing.accessConfirmed')}</h2>
                  </div>
                  <p className="text-muted-foreground">{t('landing.accessReady')}</p>
                  <Link href="/image" className="block">
                    <Button className="h-14 w-full rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-md transition-all hover:scale-[1.02] active:scale-95">
                      {t('landing.enterStudio')} <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="mb-6 text-left">
                    <h2 className="mb-1 text-2xl font-bold">
                      {submitted ? t('landing.onList') : t('landing.joinBeta')}
                    </h2>
                    <p className="font-medium text-muted-foreground">
                      {submitted ? t('landing.onListBody') : t('landing.joinBetaBody')}
                    </p>
                  </div>

                  {submitted ? (
                    <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/10 bg-primary/5 py-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-lg font-bold text-primary">{message || t('landing.registrationCompleted')}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative flex-1">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-14 rounded-2xl border-white/10 bg-white/5 pl-12 text-lg transition-all focus:border-primary focus:ring-primary"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-14 rounded-2xl bg-primary px-8 text-lg font-bold text-primary-foreground shadow-md transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 className="h-6 w-6" /> : t('landing.requestInvite')}
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {!hasAccess ? (
              <div className="mt-5 text-center">
                <Link href="/brand-kit?action=new" className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground">
                  {t('landing.alreadyHaveAccount')}
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mx-auto mt-24 w-full max-w-7xl sm:mt-32">
          <div className="grid gap-6 md:grid-cols-3 xl:gap-8">
            <FeatureCard
              icon={<Palette className="h-8 w-8 text-primary" />}
              title={t('features.brandDNA.title')}
              description={t('features.brandDNA.description')}
              delay="delay-0"
            />
            <FeatureCard
              icon={<Layers className="h-8 w-8 text-secondary" />}
              title={t('features.multiBrand.title')}
              description={t('features.multiBrand.description')}
              delay="delay-100"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-primary" />}
              title={t('features.visualIteration.title')}
              description={t('features.visualIteration.description')}
              delay="delay-200"
            />
          </div>
        </div>
      </main>

      <footer className="mt-auto px-4 py-10 sm:px-8 sm:py-12">
        <div className="glass-card mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 border-white/5 p-6 sm:p-8 md:flex-row">
          <div className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">Adstudio</span>
          </div>
          <p className="text-center text-sm font-medium text-muted-foreground/60 md:text-left">
            {t('footer.copyright')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-x-6">
            <Link href="/privacy" className="text-xs font-bold uppercase leading-none tracking-widest text-muted-foreground/40 transition-colors hover:text-primary">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="text-xs font-bold uppercase leading-none tracking-widest text-muted-foreground/40 transition-colors hover:text-primary">
              {t('footer.terms')}
            </Link>
            <Link href="/cookies" className="text-xs font-bold uppercase leading-none tracking-widest text-muted-foreground/40 transition-colors hover:text-primary">
              {t('footer.cookies')}
            </Link>
            <Link href="/contact" className="text-xs font-bold uppercase leading-none tracking-widest text-muted-foreground/40 transition-colors hover:text-primary">
              {t('footer.contact')}
            </Link>
            <Link href="/pricing" className="text-xs font-bold uppercase leading-none tracking-widest text-muted-foreground/40 transition-colors hover:text-primary">
              {t('footer.pricing')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) {
  return (
    <div className={cn(
      'glass-card group relative overflow-hidden border-white/10 p-6 transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 sm:p-8 lg:p-10',
      delay
    )}>
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-white/5 shadow-inner transition-all group-hover:bg-primary/10 sm:mb-8">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold tracking-tight sm:mb-4 sm:text-2xl">{title}</h3>
      <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
    </div>
  )
}


