import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PostLaboratory Imagen | Generador IA",
  description: "Modulo de imagen para crear creatives de marketing con IA respetando el ADN de marca.",
  keywords: ["imagen IA", "marketing visual", "branding", "generador de imagenes", "postlaboratory"],
};

export default function ImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

