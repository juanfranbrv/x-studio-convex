import Link from 'next/link'
import { Bot, ArrowRight, Sparkles, Palette, Layers, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { auth } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'

export default async function HomePage() {
  const { userId } = await auth()
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-pink-900/20" />

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold font-heading">X Studio</span>
          </div>
          <div className="flex items-center gap-4">
            {userId ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/brand-kit">
                    Ir al Dashboard
                  </Link>
                </Button>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">
                    Iniciar sesión
                  </Link>
                </Button>
                <Button className="btn-gradient" asChild>
                  <Link href="/sign-up">
                    Comenzar gratis
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Motor de Diseño Inteligente</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 leading-tight">
            Tu Director Creativo
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Potenciado por IA
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Genera assets de marketing visual que respetan el ADN de tu marca.
            Colores, logotipos, tipografía y tono — siempre coherentes.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="btn-gradient text-lg px-8 py-6 glow-primary" asChild>
              <Link href="/sign-up">
                Empezar ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link href="#features">
                Ver demo
              </Link>
            </Button>
          </div>
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
