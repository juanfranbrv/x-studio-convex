import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { DynamicThemeProvider } from "@/components/providers/DynamicThemeProvider";
import { BrandKitProvider } from "@/contexts/BrandKitContext";
import { UIProvider } from "@/contexts/UIContext";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "./globals.css";

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
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body
        className={cn(
          "min-h-screen font-sans antialiased overflow-x-hidden",
          "bg-mesh" // Animated mesh gradient background
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
                <UIProvider>
                  {/* Main container with floating elements support */}
                  <div className="relative flex min-h-screen flex-col">
                    {/* Decorative glow in top-left corner */}
                    <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 bg-primary/10 blur-[100px] rounded-full" />
                    <main className="flex-1">
                      {children}
                    </main>
                  </div>
                  <Toaster />
                </UIProvider>
              </BrandKitProvider>
            </DynamicThemeProvider>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
