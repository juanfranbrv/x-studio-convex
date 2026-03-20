'use client'

import { SignIn, SignUp } from '@clerk/nextjs'
import { AuthShell } from '@/components/auth/AuthShell'
import { authConfig } from '@/lib/auth-config'

const clerkAuthAppearance = {
  layout: {
    socialButtonsVariant: 'blockButton',
    socialButtonsPlacement: 'top',
    showOptionalFields: false,
  },
  elements: {
    rootBox: 'mx-auto w-full',
    cardBox: 'w-full',
    card: 'w-full rounded-[1.5rem] border border-border bg-white p-6 shadow-lg sm:p-7',
    headerTitle: 'font-heading text-3xl font-bold tracking-tight text-foreground',
    headerSubtitle: 'mt-2 text-sm leading-6 text-muted-foreground',
    socialButtonsBlockButton:
      'feedback-action h-16 w-full justify-between rounded-2xl border border-border/70 bg-white px-5 text-base font-semibold text-foreground shadow-[0_22px_44px_-30px_rgba(15,23,42,0.5)] transition-all hover:bg-muted/50',
    socialButtonsBlockButtonText: 'text-base font-semibold text-foreground',
    socialButtonsProviderIcon__google: 'h-5 w-5',
    dividerLine: 'bg-border',
    dividerText: 'text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground',
    formFieldLabel: 'text-sm font-medium text-foreground',
    formFieldInput:
      'h-12 rounded-2xl border border-border bg-white px-4 text-base text-foreground shadow-none transition-all focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    formButtonPrimary:
      'h-12 rounded-2xl bg-primary px-4 text-base font-semibold text-primary-foreground shadow-[0_20px_40px_-28px_hsl(var(--primary)/0.8)] transition-all hover:bg-primary/90',
    footerActionText: 'text-sm text-muted-foreground',
    footerActionLink: 'text-sm font-semibold text-primary hover:text-primary/80',
    identityPreviewText: 'text-sm font-medium text-foreground',
    identityPreviewEditButton:
      'text-sm font-semibold text-primary transition-colors hover:text-primary/80',
    formResendCodeLink: 'text-sm font-semibold text-primary hover:text-primary/80',
    otpCodeFieldInput:
      'h-12 w-12 rounded-2xl border border-border bg-white text-base font-semibold text-foreground shadow-none',
    alertText: 'text-sm',
    formFieldWarningText: 'text-sm text-destructive',
    formFieldSuccessText: 'text-sm text-primary',
    footer: 'mt-6',
  },
} as const

export function ClerkSignInPage() {
  return (
    <AuthShell mode="sign-in">
      <SignIn
        appearance={clerkAuthAppearance}
        forceRedirectUrl={authConfig.onboardingPath}
        path={authConfig.signInPath}
        routing="path"
        signUpUrl={authConfig.signUpPath}
      />
    </AuthShell>
  )
}

export function ClerkSignUpPage() {
  return (
    <AuthShell mode="sign-up">
      <SignUp
        appearance={clerkAuthAppearance}
        forceRedirectUrl={authConfig.onboardingPath}
        path={authConfig.signUpPath}
        routing="path"
        signInUrl={authConfig.signInPath}
      />
    </AuthShell>
  )
}
