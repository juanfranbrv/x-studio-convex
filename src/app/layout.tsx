import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es" suppressHydrationWarning>
        <body
          className={`${inter.variable} font-sans antialiased`}
        >
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
        </body>
      </html>
    </ClerkProvider>
  );
}
