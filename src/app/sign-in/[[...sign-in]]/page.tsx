import { SignIn } from '@clerk/nextjs'
import { authConfig } from '@/lib/auth-config'

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <SignIn
                path={authConfig.signInPath}
                signUpUrl={authConfig.signUpPath}
                fallbackRedirectUrl={authConfig.signedInDefaultPath}
                forceRedirectUrl={authConfig.signedInDefaultPath}
                appearance={{
                    elements: {
                        rootBox: 'mx-auto',
                        card: 'bg-card border border-border shadow-xl',
                    },
                }}
            />
        </div>
    )
}
