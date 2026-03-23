import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparador de escritorios elevables — Filtra y compara",
  description:
    "Compara escritorios elevables por precio, motor, carga y altura. Encuentra el modelo perfecto con nuestro comparador interactivo.",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
    { "@type": "ListItem", position: 2, name: "Comparador de Escritorios Elevables", item: "https://elevable.es/comparador" },
  ],
};

export default function ComparadorLayout({ children }: { children: React.ReactNode }) {
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
