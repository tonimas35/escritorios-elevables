import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qué escritorio elevable comprar: test de 5 preguntas",
  description:
    "Responde 5 preguntas sobre presupuesto, uso, motor, peso y ruido, y te decimos que escritorio elevable encaja contigo. Sin registro.",
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
