import type { Metadata } from 'next'

import { LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
    title: 'Terms | Adstudio',
    description: 'Terms of service governing access, acceptable use, and the operating rules of Adstudio.',
}

export default function TermsPage() {
    return (
        <LegalPage
            page="terms"
            sectionIds={['service', 'account', 'acceptableUse', 'content', 'availability', 'liability']}
        />
    )
}
