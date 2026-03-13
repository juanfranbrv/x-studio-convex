import type { Metadata } from 'next'

import { LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
    title: 'Cookies | Postlaboratory',
    description: 'Information about cookies, local storage, and technical persistence used by Postlaboratory.',
}

export default function CookiesPage() {
    return (
        <LegalPage
            page="cookies"
            sectionIds={['essential', 'preferences', 'analytics', 'management']}
        />
    )
}
