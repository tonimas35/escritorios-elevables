import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { CRITERIOS } from "@/lib/metodologia";

export const metadata: Metadata = {
  title: "Cómo analizamos los escritorios elevables",
  description:
    "Qué hacemos y qué no: no probamos los escritorios físicamente. Explicamos de dónde salen los datos, cómo puntuamos cada modelo y cómo se financia la web.",
  alternates: { canonical: "/metodologia" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
    { "@type": "ListItem", position: 2, name: "Metodología", item: "https://elevable.es/metodologia" },
  ],
};

export default function MetodologiaPage() {
  const total = getAllProducts().length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <p className="editorial-mark" style={{ color: "var(--color-secondary)" }}>
        Metodología
      </p>
      <h1 className="text-3xl md:text-4xl mt-2" style={{ fontFamily: "var(--font-display)" }}>
        Cómo analizamos los escritorios
      </h1>

      <div className="divider my-8" />

      <section className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        <p style={{ color: "var(--text-primary)", fontWeight: 500 }}>
          No probamos los escritorios físicamente. Conviene decirlo antes que nada.
        </p>
        <p>
          Elevable es un trabajo de análisis de datos, no un laboratorio. No montamos
          los modelos ni los tenemos en casa, así que no vas a encontrar aquí
          impresiones de uso inventadas. Lo que sí hacemos es reunir las
          especificaciones de {total} escritorios, contrastarlas con lo que declara
          cada fabricante en Amazon y ordenarlas con un criterio explícito.
        </p>
        <p>
          Nos parece más útil eso que una reseña que finge haber usado quince
          escritorios distintos.
        </p>
      </section>

      <div className="divider my-8" />

      <section>
        <h2 className="text-xl mb-4" style={{ fontFamily: "var(--font-display)" }}>
          De dónde salen los datos
        </h2>
        <ul className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Especificaciones:</strong>{" "}
            ficha del fabricante en Amazon España. Altura, carga, motor, velocidad,
            ruido, memorias y garantía.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Valoraciones:</strong>{" "}
            nota media de Amazon España, redondeada a la baja porque solo puede
            subir.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Precios:</strong> no los
            publicamos. El importe exacto lo ves en Amazon.
          </li>
        </ul>
      </section>

      <div className="divider my-8" />

      <section>
        <h2 className="text-xl mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Cómo puntuamos
        </h2>
        <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
          Cada modelo recibe una nota sobre 10 en cinco apartados. La nota global es
          su media ponderada.
        </p>
        <div className="space-y-4">
          {CRITERIOS.map((c) => (
            <div key={c.nombre} className="pl-4" style={{ borderLeft: "2px solid var(--color-secondary)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {c.nombre}
              </p>
              <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--text-secondary)" }}>
                {c.base}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider my-8" />

      <section>
        <h2 className="text-xl mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Por qué no publicamos precios
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Amazon cambia precios a diario. Una cifra escrita hoy está desactualizada
          en una semana, y mostrar un precio que ya no existe es engañar al lector.
          Por eso no publicamos ninguno —ni cifras ni franjas— y dejamos que el
          importe lo veas en Amazon, que es el único sitio donde siempre es
          correcto.
        </p>
      </section>

      <div className="divider my-8" />

      <section>
        <h2 className="text-xl mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Cómo se financia esto
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Con comisiones de afiliado de Amazon. Si compras a través de un enlace de
          la web, Amazon nos paga un porcentaje y tú pagas lo mismo. No cobramos de
          ninguna marca ni aceptamos productos a cambio de reseñas, entre otras
          cosas porque no hacemos reseñas de uso.
        </p>
        <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--text-secondary)" }}>
          El orden de los modelos sale de la puntuación, no de la comisión.
        </p>
      </section>

      <div className="divider my-8" />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/mejor-escritorio-elevable" className="underline" style={{ color: "var(--accent)" }}>
          Ver la comparativa
        </Link>
        <Link href="/comparador" className="underline" style={{ color: "var(--accent)" }}>
          Comparador
        </Link>
        <Link href="/que-escritorio-elevable-comprar" className="underline" style={{ color: "var(--accent)" }}>
          Test de recomendación
        </Link>
      </div>
    </div>
  );
}
