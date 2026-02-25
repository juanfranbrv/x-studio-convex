import { SignUp } from '@clerk/nextjs'
import { authConfig } from '@/lib/auth-config'

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <SignUp
                path={authConfig.signUpPath}
                signInUrl={authConfig.signInPath}
                fallbackRedirectUrl={authConfig.onboardingPath}
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
