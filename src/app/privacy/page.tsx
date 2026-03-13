import type { Metadata } from 'next'

import { LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
    title: 'Privacy | Postlaboratory',
    description: 'How Postlaboratory handles account data, prompts, generated content, and operational information.',
}

export default function PrivacyPage() {
    return (
        <LegalPage
            page="privacy"
            sectionIds={['controller', 'data', 'purpose', 'sharing', 'retention', 'rights']}
        />
    )
}
