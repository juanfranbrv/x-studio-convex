'use client'

import { useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { useRouter } from 'next/navigation'
import { Bot, Sparkles, Palette, Layers, Zap, Loader2, CheckCircle, Clock, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const userEmail = user?.emailAddresses[0]?.emailAddress || ''

  // Check beta access for logged in users
  const betaAccess = useQuery(
    api.admin.checkBetaAccess,
    userEmail ? { email: userEmail } : 'skip'
  )

  // Show pending/rejected screens only for those specific states
  if (isLoaded && isSignedIn && betaAccess && !betaAccess.hasAccess) {
    if (betaAccess.status === 'pending' || betaAccess.status === 'rejected') {
      return <PendingAccessScreen status={betaAccess.status} email={userEmail} />
    }
  }

  return <BetaLandingPage hasAccess={betaAccess?.hasAccess ?? false} />
}

function PendingAccessScreen({ status, email }: { status: string; email: string }) {
  const { signOut } = useAuth()

  const handleGoHome = () => {
    signOut({ redirectUrl: '/' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="glass-card max-w-md w-full p-8 text-center relative z-10 border border-white/20 shadow-2xl">
        <div className="mb-6 mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-inner border border-white/10">
          {status === 'pending' ? (
            <Clock className="w-10 h-10 text-primary animate-pulse" />
          ) : (
            <Bot className="w-10 h-10 text-destructive" />
          )}
        </div>

        <h2 className="text-3xl font-bold font-heading mb-2 tracking-tight">
          {status === 'pending' ? 'Solicitud Pendiente' : 'Acceso Denegado'}
        </h2>

        <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
          {status === 'pending'
            ? `Tu solicitud para ${email} está siendo revisada por nuestro equipo.`
            : 'Tu solicitud no fue aprobada en esta ocasión.'}
        </p>

        <Button
          variant="outline"
          onClick={handleGoHome}
          className="w-full glass hover:bg-white/10 border-white/20 h-12 text-base font-medium transition-all duration-300"
        >
          Volver a la página principal
        </Button>
      </div>
    </div>
  )
}

function BetaLandingPage({ hasAccess = false }: { hasAccess?: boolean }) {
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
    } catch (error: any) {
      setMessage('Error al enviar solicitud')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6 transition-all duration-300">
          <div className="flex items-center gap-4 group">
            <div className="flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <Bot className="w-8 h-8 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
            </div>
            <span className="text-xl font-bold font-heading tracking-tight opacity-90">
              PostLaboratory
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-[10px] uppercase tracking-wider text-primary font-bold">Beta Privada</span>
            </div>
            {!hasAccess && (
              <Link href="/sign-in">
                <Button variant="ghost" className="text-sm font-medium hover:bg-primary/5 transition-colors">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-20 px-6 relative">
        {/* Abstract Background elements */}
        <div className="absolute top-40 right-10 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-secondary/15 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto py-12 text-center">


          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 leading-[1.1] tracking-tight text-balance text-foreground">
            Tu Director Creativo <br />
            <span className="text-primary italic px-2">
              con Inteligencia de Marca
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Genera assets de marketing que respetan tu ADN sin esfuerzo.
            Coherencia visual total impulsada por un motor inteligente.
          </p>

          <div className="max-w-xl mx-auto relative">
            <div className="glass-card relative p-8 md:p-10 border-white/20 shadow-2xl backdrop-blur-xl">
              {hasAccess ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-12 h-12 text-primary" />
                    <h2 className="text-2xl font-bold">Acceso Confirmado</h2>
                  </div>
                  <p className="text-muted-foreground">Tu cuenta está lista para empezar a crear assets de impacto.</p>
                  <Link href="/image" className="block">
                    <Button className="w-full bg-primary text-primary-foreground h-14 text-lg font-bold rounded-2xl shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                      Entrar al Studio <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-left mb-6">
                    <h2 className="text-2xl font-bold mb-1">
                      {submitted ? '¡Estas en la lista!' : 'Únete a la Beta Privada'}
                    </h2>
                    <p className="text-muted-foreground font-medium">
                      {submitted
                        ? 'Te avisaremos en cuanto tu acceso esté habilitado.'
                        : 'Acceso exclusivo y limitado para creadores y marcas.'}
                    </p>
                  </div>

                  {submitted ? (
                    <div className="flex flex-col items-center gap-4 py-6 bg-primary/5 rounded-2xl border border-primary/10">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-primary font-bold text-lg">{message || "Registro completado"}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary text-lg transition-all"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary text-primary-foreground h-14 px-8 text-lg font-bold rounded-2xl shadow-md transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          'Solicitar Invitación'
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </div>
            {!hasAccess && (
              <div className="mt-5 text-center">
                <Link
                  href="/brand-kit?action=new"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Ya tengo cuenta, Llévame al Estudio.
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto mt-32">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Palette className="w-8 h-8 text-primary" />}
              title="Brand DNA"
              description="Define tu identidad una vez y deja que la IA se encargue de aplicarla en cada píxel."
              delay="delay-0"
            />
            <FeatureCard
              icon={<Layers className="w-8 h-8 text-secondary" />}
              title="Multi-Brand"
              description="Gestiona infinitos universos visuales con coherencia absoluta desde un solo lugar."
              delay="delay-100"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-primary" />}
              title="Visual Iteration"
              description="Edición semántica y espacial. Habla con la IA como si fuera tu diseñador senior."
              delay="delay-200"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 glass-card p-8 border-white/5">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">PostLaboratory</span>
          </div>
          <p className="text-sm text-muted-foreground/60 font-medium text-center md:text-left">
            © 2024 PostLaboratory. Powered by Creative AI.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs font-bold text-muted-foreground/40 hover:text-primary transition-colors uppercase tracking-widest leading-none">Privacy</a>
            <a href="#" className="text-xs font-bold text-muted-foreground/40 hover:text-primary transition-colors uppercase tracking-widest leading-none">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) {
  return (
    <div className={cn(
      "glass-card p-10 border-white/10 hover:border-primary/30 transition-all duration-500 hover:scale-[1.03] group relative overflow-hidden",
      delay
    )}>
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
      <div className="mb-8 w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shadow-inner group-hover:bg-primary/10 transition-all border border-white/5">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
    </div>
  )
}

