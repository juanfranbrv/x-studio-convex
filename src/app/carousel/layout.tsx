import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PostLaboratory Carrusel | Motor de Diseno Inteligente",
};

export default function CarouselLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

