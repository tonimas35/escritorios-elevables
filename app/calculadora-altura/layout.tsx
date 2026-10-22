import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de altura de escritorio — Altura ideal según tu estatura",
  description:
    "Calcula la altura ideal de tu escritorio elevable según tu estatura, sentado y de pie, con un dibujo de tu puesto acotado.",
  alternates: { canonical: "/calculadora-altura" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
    { "@type": "ListItem", position: 2, name: "Calculadora de Altura de Escritorio", item: "https://elevable.es/calculadora-altura" },
  ],
};

export default function CalculadoraLayout({ children }: { children: React.ReactNode }) {
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
