import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { BrandKitProvider } from "@/contexts/BrandKitContext";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "X Studio | Motor de Diseño Inteligente",
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
        className={`${inter.variable} font-sans antialiased`}
      >
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <BrandKitProvider>
              {children}
              <Toaster />
            </BrandKitProvider>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
