import type { Metadata } from 'next'

import { LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
    title: 'Cookies | Adstudio',
    description: 'Information about cookies, local storage, and technical persistence used by Adstudio.',
}

export default function CookiesPage() {
    return (
        <LegalPage
            page="cookies"
            sectionIds={['essential', 'preferences', 'analytics', 'management']}
        />
    )
}
