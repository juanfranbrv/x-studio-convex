import type { Metadata } from 'next'

import { LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
    title: 'Contact | Postlaboratory',
    description: 'About Postlaboratory, how the product is built, and the official channels to reach the team.',
}

export default function ContactPage() {
    return (
        <LegalPage
            page="contact"
            sectionIds={['about', 'approach', 'support', 'partnerships']}
        />
    )
}
