'use client'

import { useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

const REFERRAL_STORAGE_KEY = 'xstudio.referral.code'

function normalizeReferralCode(raw: string | null) {
  return String(raw || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function ReferralTracker() {
  const { user, isLoaded } = useUser()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const claimInFlightRef = useRef<string | null>(null)

  useEffect(() => {
    const code = normalizeReferralCode(searchParams.get('ref'))
    if (!code || typeof window === 'undefined') return

    window.localStorage.setItem(REFERRAL_STORAGE_KEY, code)
  }, [searchParams])

  useEffect(() => {
    if (!isLoaded || !user?.id || typeof window === 'undefined') return

    const referralCode = normalizeReferralCode(window.localStorage.getItem(REFERRAL_STORAGE_KEY))
    if (!referralCode || claimInFlightRef.current === referralCode) return

    claimInFlightRef.current = referralCode
    let cancelled = false

    void (async () => {
      try {
        const response = await fetch('/api/referrals/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: referralCode }),
        })
        const data = await response.json()
        if (cancelled) return

        if (data?.clearStoredCode) {
          window.localStorage.removeItem(REFERRAL_STORAGE_KEY)
        }

        if (response.ok && data?.status === 'applied') {
          toast({
            title: 'Referido aplicado',
            description: `El enlace ya está asociado a tu cuenta. La persona que te invitó ha recibido ${data.signupReward} créditos.`,
          })
        }
      } catch {
        claimInFlightRef.current = null
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isLoaded, toast, user?.id])

  return null
}
