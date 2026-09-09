import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qué escritorio elevable comprar: test de 4 preguntas",
  description:
    "Responde 4 preguntas sobre uso, motor, peso del setup y ruido, y te decimos qué escritorio elevable encaja contigo. Sin registro.",
  alternates: { canonical: "/que-escritorio-elevable-comprar" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
    { "@type": "ListItem", position: 2, name: "Qué escritorio elevable comprar", item: "https://elevable.es/que-escritorio-elevable-comprar" },
  ],
};

export default function QueComprarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
