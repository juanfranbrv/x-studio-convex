'use client'

import { useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { useRouter } from 'next/navigation'
import { Bot, Sparkles, Palette, Layers, Zap, Loader2, CheckCircle, Clock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const userEmail = user?.emailAddresses[0]?.emailAddress || ''

  // Check beta access for logged in users
  const betaAccess = useQuery(
    api.admin.checkBetaAccess,
    userEmail ? { email: userEmail } : 'skip'
  )

  // No automatic redirect anymore - let user stay on home page
  // We still handle pending/rejected states to inform the user
  if (isLoaded && isSignedIn && betaAccess && !betaAccess.hasAccess) {
    return <PendingAccessScreen status={betaAccess.status} email={userEmail} />
  }

  // Not logged in or logged in and approved - show landing
  return <BetaLandingPage hasAccess={betaAccess?.hasAccess ?? false} />
}

// Screen for users who are logged in but don't have access yet
function PendingAccessScreen({ status, email }: { status: string; email: string }) {
  const { signOut } = useAuth()

  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Solicitud Pendiente</CardTitle>
            <CardDescription className="text-base">
              Tu solicitud de acceso está siendo revisada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Recibirás un email en <strong>{email}</strong> cuando tu acceso sea aprobado.
            </p>
            <Button variant="outline" onClick={() => signOut()}>
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">Acceso Denegado</CardTitle>
            <CardDescription>
              Tu solicitud no fue aprobada en esta ocasión.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => signOut()}>
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // status === 'none' - user logged in but never requested access
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Acceso Beta Privada</CardTitle>
          <CardDescription>
            Tu email ({email}) no tiene acceso a la beta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Contacta con el administrador para solicitar acceso.
          </p>
          <Button variant="outline" onClick={() => signOut()}>
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Landing page with beta request form
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-pink-900/20" />

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold font-heading">X Studio</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30">
            <span className="text-xs text-yellow-500 font-medium">Beta Privada</span>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-8 py-4 text-center">

          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 leading-tight">
            Tu Director Creativo
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Potenciado por IA
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Genera assets de marketing visual que respetan el ADN de tu marca.
            Colores, logotipos, tipografía y tono — siempre coherentes.
          </p>

          {/* Beta Request Form or Imagen Link */}
          <Card className="max-w-md mx-auto">
            {hasAccess ? (
              <CardHeader className="text-center py-10">
                <CardTitle className="text-2xl mb-4">¡Ya tienes acceso!</CardTitle>
                <CardDescription className="text-base mb-6">
                  Tu cuenta está activa. Puedes empezar a crear ahora mismo.
                </CardDescription>
                <Link href="/image">
                  <Button className="w-full btn-gradient py-6 text-lg">
                    Entrar a Imagen <Sparkles className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardHeader>
            ) : (
              <>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {submitted ? '¡Solicitud Recibida!' : 'Solicita Acceso a la Beta'}
                  </CardTitle>
                  <CardDescription>
                    {submitted
                      ? 'Te notificaremos cuando tu acceso sea aprobado.'
                      : 'Estamos aceptando un número limitado de usuarios.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="flex flex-col items-center gap-4 py-4">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                      <p className="text-muted-foreground">{message}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <Button type="submit" disabled={isSubmitting} className="btn-gradient">
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Solicitar'
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </>
            )}
          </Card>

          {/* Link for existing users - only show if not already approved */}
          {!hasAccess && (
            <p className="mt-4 text-center">
              <a href="/sign-in" className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4">
                Ya tengo cuenta, llévame al dashboard
              </a>
            </p>
          )}
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-heading text-center mb-16">
            ¿Por qué X Studio?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <Palette className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Brand DNA</h3>
              <p className="text-muted-foreground">
                Define tu paleta, tipografías y tono. La IA genera siempre respetando tu identidad.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6">
                <Layers className="w-7 h-7 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Marca</h3>
              <p className="text-muted-foreground">
                Gestiona múltiples marcas desde una sola cuenta. Cambio de contexto instantáneo.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Iteración Visual</h3>
              <p className="text-muted-foreground">
                Anota directamente sobre la imagen. La IA entiende tus correcciones espaciales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            <span className="font-semibold">X Studio</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 X Studio. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
