import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test: que escritorio elevable necesitas? — 5 preguntas",
  description:
    "Responde 5 preguntas y te recomendamos el escritorio elevable perfecto para ti. Sin registro, resultado inmediato.",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
    { "@type": "ListItem", position: 2, name: "Test: Que Escritorio Elevable Necesitas", item: "https://elevable.es/test" },
  ],
};

export default function TestLayout({ children }: { children: React.ReactNode }) {
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
