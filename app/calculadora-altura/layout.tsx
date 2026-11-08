import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Altura de la mesa de escritorio según tu estatura (calculadora)",
  description:
    "¿A qué altura debe estar tu escritorio? Pon tu estatura y te da la altura de la mesa sentado y de pie, la de la silla y la del monitor, con una tabla de 150 a 200 cm.",
  alternates: { canonical: "/calculadora-altura" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
    { "@type": "ListItem", position: 2, name: "Altura de la mesa de escritorio", item: "https://elevable.es/calculadora-altura" },
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
