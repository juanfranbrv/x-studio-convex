import type { Metadata } from 'next'

import { LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
    title: 'Cookies | Post laboratory',
    description: 'Information about cookies, local storage, and technical persistence used by Post laboratory.',
}

export default function CookiesPage() {
    return (
        <LegalPage
            page="cookies"
            sectionIds={['essential', 'preferences', 'analytics', 'management']}
        />
    )
}
