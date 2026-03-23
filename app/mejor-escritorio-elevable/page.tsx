import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { AffiliateButton } from "@/components/AffiliateButton";
import { ProsConsBox } from "@/components/ProsConsBox";
import { RatingBar } from "@/components/RatingBar";

export const metadata: Metadata = {
  title: "12 mejores escritorios elevables 2026 — Guia de compra",
  description:
    "Comparativa de los 12 mejores escritorios elevables electricos de 2026. Desde 110€ hasta gama premium. Analisis con datos reales, pros/contras y recomendaciones.",
};

const RATING_LABELS: Record<string, string> = {
  calidad_construccion: "Calidad de construccion",
  estabilidad: "Estabilidad",
  facilidad_montaje: "Facilidad de montaje",
  relacion_calidad_precio: "Relacion calidad-precio",
  funcionalidades: "Funcionalidades",
};

export default function MejorEscritorioPage() {
  const topProducts = getAllProducts()
    .filter(([, p]) => p.disponible)
    .sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total);

  const [topAsin, topProduct] = topProducts[0];

  const top3 = topProducts.slice(0, 3);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
      { "@type": "ListItem", position: 2, name: "Mejores Escritorios Elevables", item: "https://elevable.es/mejor-escritorio-elevable" },
    ],
  };

  const productSchemas = top3.map(([, p]) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    description: p.veredicto,
    brand: { "@type": "Brand", name: p.marca },
    image: p.imagen,
    url: `https://elevable.es/mejor-escritorio-elevable#${p.slug}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating,
      reviewCount: p.num_reviews,
    },
    offers: {
      "@type": "Offer",
      price: p.precio,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  }));

  const faqItems = [
    {
      q: "Merece la pena un escritorio elevable?",
      a: "Si trabajas sentado mas de 4 horas al dia, si. Alternar entre sentado y de pie reduce dolor de espalda, mejora la concentracion y quema mas calorias. La inversion se amortiza en salud.",
    },
    {
      q: "Motor simple o doble: cual elijo?",
      a: "Motor doble es mas rapido, silencioso y estable. Motor simple es mas barato. Si tu presupuesto llega a 270\u20ac, el Maidesite T2 Pro Plus ofrece doble motor al mejor precio. Por debajo de 200\u20ac, motor simple es suficiente.",
    },
    {
      q: "Cuanto peso soportan estos escritorios?",
      a: "Desde 50 kg (modelos basicos) hasta 150 kg (Flexispot E7 Pro). Para un setup estandar (monitor, portatil, teclado) necesitas unos 15-20 kg de carga. Incluso el modelo mas basico sobra.",
    },
    {
      q: "Puedo montar un escritorio elevable solo?",
      a: "Los modelos ligeros (<22 kg) si. Los pesados (>25 kg) es recomendable montarlos entre dos personas, sobre todo al dar la vuelta al tablero. Todos incluyen herramientas y el montaje dura 20-60 minutos.",
    },
    {
      q: "Que garantia tienen?",
      a: "Varia de 2 a 5 anos. Flexispot y Maidesite ofrecen 5 anos en la mayoria de modelos. Las marcas mas baratas (Fezibo, JUMMICO) ofrecen 2 anos. La garantia es un buen indicador de la confianza del fabricante.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {productSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Inicio</Link>
        {" "}&gt;{" "}Mejores escritorios elevables
      </nav>

      <h1 className="text-3xl md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
        Los <span style={{ color: 'var(--accent)' }}>12 mejores</span> escritorios elevables de 2026
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        Actualizado: marzo 2026 · 12 modelos analizados · Desde 110 EUR
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        Este articulo contiene enlaces de afiliado. Si compras a traves de ellos, recibimos una pequena comision sin coste adicional para ti.
      </p>

      {/* Winner callout */}
      <div className="mt-8 p-6 rounded" style={{ background: 'var(--accent-light)', border: '2px solid var(--accent)' }}>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
            <Image src={topProduct.imagen} alt={topProduct.imagen_alt} width={96} height={96} className="object-contain" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Nuestro favorito</p>
            <h2 className="text-xl font-semibold mt-1" style={{ fontFamily: 'var(--font-display)' }}>
              {topProduct.nombre}
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{topProduct.veredicto}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="mono text-2xl font-bold">{topProduct.precio}€</span>
              <span className="mono font-bold px-2 py-0.5 rounded text-sm" style={{ background: 'var(--pro)', color: 'white' }}>
                {topProduct.puntuacion.total}/10
              </span>
              <AffiliateButton asin={topAsin} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary table */}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: 'var(--bg-dark)', color: 'var(--text-inverse)' }}>
              <th className="text-left p-3 rounded-tl" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>#</th>
              <th className="text-left p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Modelo</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Motor</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Carga</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Nota</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Precio</th>
              <th className="text-center p-3 rounded-tr" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}></th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map(([asin, product], i) => (
              <tr key={asin} className="transition-colors hover:bg-[var(--accent-light)]" style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="p-3">
                  <span className="mono text-xs font-bold" style={{ color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                </td>
                <td className="p-3">
                  <a href={`#${product.slug}`} className="flex items-center gap-2 hover:underline">
                    <div className="w-8 h-8 rounded flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                      <Image src={product.imagen} alt={product.imagen_alt} width={32} height={32} className="object-contain" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{product.marca} {product.modelo}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}★ ({product.num_reviews})</p>
                    </div>
                  </a>
                </td>
                <td className="p-3 text-center">
                  <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: product.specs.tipo_motor === 'doble' ? 'rgba(107, 203, 119, 0.15)' : 'var(--border)', color: product.specs.tipo_motor === 'doble' ? 'var(--pro)' : 'var(--text-muted)' }}>
                    {product.specs.tipo_motor === 'doble' ? 'Doble' : 'Simple'}
                  </span>
                </td>
                <td className="p-3 text-center mono text-sm">{product.specs.peso_max_carga_kg} kg</td>
                <td className="p-3 text-center">
                  <span className="mono font-bold" style={{ color: product.puntuacion.total >= 8 ? 'var(--pro)' : 'var(--text-primary)' }}>
                    {product.puntuacion.total}
                  </span>
                </td>
                <td className="p-3 text-center mono font-bold">{product.precio}€</td>
                <td className="p-3 text-center">
                  <AffiliateButton asin={asin} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed analysis of each product */}
      <div className="mt-16 space-y-16">
        {topProducts.map(([asin, product], i) => (
          <section key={asin} id={product.slug}>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="mono text-sm font-bold" style={{ color: 'var(--accent)' }}>#{String(i + 1).padStart(2, '0')}</span>
              <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
                {product.nombre}
              </h2>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{product.veredicto}</p>

            <div className="mt-4 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-48 rounded overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                <Image src={product.imagen} alt={product.imagen_alt} width={180} height={180} className="object-contain p-2" />
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Precio", value: `${product.precio}€` },
                    { label: "Motor", value: product.specs.tipo_motor === 'doble' ? 'Doble' : 'Simple' },
                    { label: "Carga max", value: `${product.specs.peso_max_carga_kg} kg` },
                    { label: "Tablero", value: `${product.specs.ancho_tablero_cm}x${product.specs.profundidad_tablero_cm} cm` },
                  ].map((spec) => (
                    <div key={spec.label} className="p-2 rounded" style={{ background: 'var(--bg-secondary)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{spec.label}</p>
                      <p className="mono text-sm font-semibold">{spec.value}</p>
                    </div>
                  ))}
                </div>
                <ProsConsBox pros={product.pros} cons={product.contras} />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {Object.entries(product.puntuacion)
                .filter(([key]) => key !== "total")
                .map(([key, value]) => (
                  <RatingBar key={key} label={RATING_LABELS[key] || key} value={value as number} />
                ))}
              <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <RatingBar label="TOTAL" value={product.puntuacion.total} />
              </div>
            </div>

            <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong>Ideal para:</strong> {product.ideal_para}
            </p>

            <div className="mt-4">
              <AffiliateButton asin={asin} showPrice={product.precio} size="lg" />
            </div>
          </section>
        ))}
      </div>

      {/* FAQ */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Preguntas frecuentes
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "Merece la pena un escritorio elevable?",
              a: "Si trabajas sentado mas de 4 horas al dia, si. Alternar entre sentado y de pie reduce dolor de espalda, mejora la concentracion y quema mas calorias. La inversion se amortiza en salud.",
            },
            {
              q: "Motor simple o doble: cual elijo?",
              a: "Motor doble es mas rapido, silencioso y estable. Motor simple es mas barato. Si tu presupuesto llega a 270€, el Maidesite T2 Pro Plus ofrece doble motor al mejor precio. Por debajo de 200€, motor simple es suficiente.",
            },
            {
              q: "Cuanto peso soportan estos escritorios?",
              a: "Desde 50 kg (modelos basicos) hasta 150 kg (Flexispot E7 Pro). Para un setup estandar (monitor, portatil, teclado) necesitas unos 15-20 kg de carga. Incluso el modelo mas basico sobra.",
            },
            {
              q: "Puedo montar un escritorio elevable solo?",
              a: "Los modelos ligeros (<22 kg) si. Los pesados (>25 kg) es recomendable montarlos entre dos personas, sobre todo al dar la vuelta al tablero. Todos incluyen herramientas y el montaje dura 20-60 minutos.",
            },
            {
              q: "Que garantia tienen?",
              a: "Varía de 2 a 5 anos. Flexispot y Maidesite ofrecen 5 anos en la mayoria de modelos. Las marcas mas baratas (Fezibo, JUMMICO) ofrecen 2 anos. La garantia es un buen indicador de la confianza del fabricante.",
            },
          ].map((faq) => (
            <div key={faq.q}>
              <h3 className="text-base font-semibold">{faq.q}</h3>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
