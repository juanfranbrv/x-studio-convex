import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post laboratory Carrusel | Motor de Diseno Inteligente",
};

export default function CarouselLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

