"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { authConfig } from "@/lib/auth-config";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

import { esES } from "@clerk/localizations";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();

    return (
        <ClerkProvider
            publishableKey={publishableKey}
            localization={esES}
            signInUrl={authConfig.signInPath}
            signUpUrl={authConfig.signUpPath}
            signInForceRedirectUrl={authConfig.onboardingPath}
            signInFallbackRedirectUrl={authConfig.onboardingPath}
            signUpForceRedirectUrl={authConfig.onboardingPath}
            signUpFallbackRedirectUrl={authConfig.onboardingPath}
            afterSignOutUrl={authConfig.afterSignOutPath}
        >
            <ConvexProvider client={convex}>
                {children}
            </ConvexProvider>
        </ClerkProvider>
    );
}
