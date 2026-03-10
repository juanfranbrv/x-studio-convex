'use client'

import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useSignIn } from '@clerk/nextjs'
import { AuthShell } from '@/components/auth/AuthShell'
import { Button } from '@/components/ui/button'
import { authConfig } from '@/lib/auth-config'

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
      <path
        d="M21.805 12.233c0-.78-.07-1.528-.2-2.247H12v4.254h5.49a4.697 4.697 0 0 1-2.038 3.082v2.56h3.298c1.93-1.776 3.055-4.395 3.055-7.649Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.964-.895 6.618-2.418l-3.298-2.56c-.913.612-2.08.973-3.32.973-2.553 0-4.716-1.724-5.49-4.042H3.104v2.64A9.997 9.997 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.51 13.953A5.996 5.996 0 0 1 6.203 12c0-.678.117-1.336.307-1.953V7.407H3.104A9.997 9.997 0 0 0 2 12c0 1.612.385 3.135 1.104 4.593l3.406-2.64Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.005c1.468 0 2.785.505 3.822 1.498l2.868-2.867C16.959 3.026 14.695 2 12 2A9.997 9.997 0 0 0 3.104 7.407l3.406 2.64c.774-2.318 2.937-4.042 5.49-4.042Z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function GoogleAuthCard() {
  const { isLoaded, signIn } = useSignIn()
  const [isPending, setIsPending] = useState(false)

  const handleGoogleAuth = async () => {
    if (!isLoaded || !signIn) return

    setIsPending(true)

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: authConfig.ssoCallbackPath,
        redirectUrlComplete: authConfig.onboardingPath,
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="glass-card studio-tone-panel overflow-hidden border border-white/55 bg-white/86 p-6 shadow-[0_30px_80px_-38px_rgba(15,23,42,0.42)] backdrop-blur-2xl sm:p-7">
      <div className="mb-7 space-y-2">
        <h3 className="text-3xl font-heading font-bold tracking-tight text-foreground">Continuar</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Accede con Google y vuelve directamente a tu estudio.
        </p>
      </div>

      <Button
        className="feedback-action h-16 w-full justify-between rounded-[1.55rem] border border-border/70 bg-background/92 px-5 text-base font-semibold text-foreground shadow-[0_22px_44px_-30px_rgba(15,23,42,0.5)] hover:bg-background"
        disabled={isPending || !isLoaded}
        onClick={() => void handleGoogleAuth()}
        type="button"
        variant="outline"
      >
        <span className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleMark />}
          </span>
          <span>Continuar con Google</span>
        </span>
        <ArrowRight className="h-4.5 w-4.5 opacity-70" />
      </Button>

      <div className="mt-4 min-h-10">
        <div id="clerk-captcha" />
      </div>
    </div>
  )
}

export function GoogleAuthPage() {
  return (
    <AuthShell mode="sign-in">
      <GoogleAuthCard />
    </AuthShell>
  )
}
