import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "X Carrusel | Motor de Diseño Inteligente",
};

export default function CarouselLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
