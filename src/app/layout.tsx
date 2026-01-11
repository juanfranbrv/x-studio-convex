import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { DynamicThemeProvider } from "@/components/providers/DynamicThemeProvider";
import { BrandKitProvider } from "@/contexts/BrandKitContext";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "./globals.css";

// Plus Jakarta Sans: more geometric and friendly than Inter
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "X Imagen | Motor de Diseño Inteligente",
  description: "Plataforma de generación de assets de marketing visual con IA que respeta el ADN de tu marca",
  keywords: ["IA", "diseño", "marketing", "branding", "generación de imágenes"],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased overflow-x-hidden",
          "bg-mesh", // Animated mesh gradient background
          jakarta.variable
        )}
      >
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <DynamicThemeProvider>
              <BrandKitProvider>
                {/* Main container with floating elements support */}
                <div className="relative flex min-h-screen flex-col">
                  {/* Decorative glow in top-left corner */}
                  <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 bg-primary/10 blur-[100px] rounded-full" />
                  <main className="flex-1">
                    {children}
                  </main>
                </div>
                <Toaster />
              </BrandKitProvider>
            </DynamicThemeProvider>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
