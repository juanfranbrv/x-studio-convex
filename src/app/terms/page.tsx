import type { Metadata } from 'next'

import { LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
    title: 'Terms | Postlaboratory',
    description: 'Terms of service governing access, acceptable use, and the operating rules of Postlaboratory.',
}

export default function TermsPage() {
    return (
        <LegalPage
            page="terms"
            sectionIds={['service', 'account', 'acceptableUse', 'content', 'availability', 'liability']}
        />
    )
}
