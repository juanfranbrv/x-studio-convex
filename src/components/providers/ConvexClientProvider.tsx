"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode } from "react";
import { authConfig } from "@/lib/auth-config";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

import { esES } from "@clerk/localizations";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider
            localization={esES}
            signInUrl={authConfig.signInPath}
            signUpUrl={authConfig.signUpPath}
            signInFallbackRedirectUrl={authConfig.signedInDefaultPath}
            signInForceRedirectUrl={authConfig.signedInDefaultPath}
            signUpFallbackRedirectUrl={authConfig.onboardingPath}
            signUpForceRedirectUrl={authConfig.onboardingPath}
            afterSignOutUrl={authConfig.afterSignOutPath}
        >
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
