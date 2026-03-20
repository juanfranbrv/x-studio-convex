'use client'

import { useState } from 'react'

import { getProtectedContactEmail, getProtectedContactMailto } from '@/lib/email/protected-email'

type ProtectedContactEmailProps = {
    revealLabel: string
    copiedLabel: string
    helperText: string
}

export function ProtectedContactEmail({ revealLabel, copiedLabel, helperText }: ProtectedContactEmailProps) {
    const [revealed, setRevealed] = useState(false)
    const [copied, setCopied] = useState(false)

    const email = revealed ? getProtectedContactEmail() : null
    const mailto = revealed ? getProtectedContactMailto() : null

    const handleReveal = () => {
        setRevealed(true)
    }

    const handleCopy = async () => {
        if (!email || !navigator?.clipboard) return

        await navigator.clipboard.writeText(email)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
    }

    return (
        <div className="mt-4 rounded-2xl border border-border/60 bg-muted/25 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {helperText}
            </p>
            <div className="mt-3 flex flex-col gap-3">
                {revealed && email && mailto ? (
                    <>
                        <a
                            href={mailto}
                            className="break-all text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                        >
                            {email}
                        </a>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex w-fit items-center rounded-full border border-border/60 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {copied ? copiedLabel : revealLabel}
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={handleReveal}
                        className="inline-flex w-fit items-center rounded-full border border-border/60 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {revealLabel}
                    </button>
                )}
            </div>
        </div>
    )
}
