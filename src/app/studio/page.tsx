'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Redirect from old /studio path to new /image path
export default function StudioRedirectPage() {
    const router = useRouter()

    useEffect(() => {
        router.replace('/image')
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-muted-foreground">Redirigiendo...</p>
        </div>
    )
}
