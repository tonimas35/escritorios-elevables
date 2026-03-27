import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getAllProducts } from "@/lib/products";
import { AffiliateButton } from "@/components/AffiliateButton";
import { ProsConsBox } from "@/components/ProsConsBox";
import { CompactRatings } from "@/components/CompactRatings";

export const metadata: Metadata = {
  title: "Fezibo escritorio elevable opiniones y review 2026 — Merece la pena?",
  description:
    "Review honesta del Fezibo 100x60: el escritorio elevable electrico mas barato. Analizamos si merece la pena por 120 EUR, para quien es y para quien no.",
};

export default function FeziboReviewPage() {
  const result = getProductBySlug("fezibo-100x60");
  if (!result) return <p>Producto no encontrado</p>;
  const [asin, product] = result;

  const alternatives = getAllProducts()
    .filter(([, p]) => p.slug !== "fezibo-100x60" && p.disponible && p.precio <= 250)
    .sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total)
    .slice(0, 3);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
      { "@type": "ListItem", position: 2, name: "Mejores Escritorios", item: "https://elevable.es/mejor-escritorio-elevable" },
      { "@type": "ListItem", position: 3, name: "Fezibo Opiniones", item: "https://elevable.es/fezibo-opiniones" },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nombre,
    image: product.imagen,
    description: product.veredicto,
    brand: { "@type": "Brand", name: product.marca },
    review: {
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: product.puntuacion.total, bestRating: 10 },
      author: { "@type": "Organization", name: "Elevable.es" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.num_reviews,
      bestRating: 5,
    },
    offers: {
      "@type": "Offer",
      price: product.precio,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `https://www.amazon.es/dp/${asin}?tag=escritoriosel-21`,
    },
  };

  const faqItems = [
    {
      q: "El Fezibo vale la pena por 120 euros?",
      a: "Si tu expectativa es un escritorio elevable basico que sube y baja sin problemas, si. No esperes la estabilidad de un Flexispot E7 ni la velocidad de un doble motor. Pero para un estudiante o alguien que quiere probar un elevable por primera vez, es la forma mas barata de hacerlo con motor electrico.",
    },
    {
      q: "El Fezibo sirve para trabajar 8 horas al dia?",
      a: "Puede, pero no lo recomiendo como escritorio principal para jornada completa. Con 50 kg de carga y un tablero de 100x60 cm, el espacio y la capacidad son justos. Si teletrabajas a jornada completa, invierte un poco mas en algo con tablero de 120 cm y mas carga, como el Ergear EED-S1 por 140 euros.",
    },
    {
      q: "Que puedo poner encima del Fezibo?",
      a: "Un monitor de hasta 27 pulgadas, un portatil, teclado y raton. Eso son unos 15-20 kg. Hasta ahi va perfecto. Si quieres dos monitores con brazo, un altavoz y una lampara, te pasas de espacio y probablemente de peso. Para setup dual monitor, necesitas al menos 120 cm de tablero.",
    },
    {
      q: "El Fezibo es ruidoso?",
      a: "A 50 dB es audible pero no molesto. Es como el ruido de fondo de una oficina tranquila. En una videollamada, la otra persona no lo nota. Solo tarda unos 18 segundos en hacer el recorrido completo, asi que el ruido es breve.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Inicio</Link>
        {" "}&gt;{" "}
        <Link href="/mejor-escritorio-elevable" className="hover:underline" style={{ color: 'var(--accent)' }}>Mejores escritorios</Link>
        {" "}&gt;{" "}Fezibo opiniones
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product image */}
        <div className="w-full md:w-72 h-72 rounded overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-secondary)' }}>
          <Image src={product.imagen} alt={product.imagen_alt} width={280} height={280} className="object-contain p-4" />
        </div>

        {/* Product info */}
        <div className="flex-1">
          <p className="editorial-mark mb-2" style={{ color: 'var(--color-secondary)' }}>Review completa &middot; Marzo 2026</p>
          <h1 className="text-3xl md:text-4xl mt-1 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
            {product.nombre}
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Actualizado: marzo 2026 · {product.num_reviews}+ opiniones analizadas
          </p>

          <div className="flex items-center gap-4 mt-4">
            <span className="mono text-3xl font-bold">{product.precio}€</span>
            {product.precio_habitual && (
              <span className="mono text-lg line-through" style={{ color: 'var(--text-muted)' }}>{product.precio_habitual}€</span>
            )}
            <span className="mono font-bold text-sm px-2 py-1 rounded" style={{ background: 'var(--pro)', color: 'white' }}>
              {product.puntuacion.total}/10
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{product.rating}★ en Amazon · {product.num_reviews} opiniones</span>
          </div>

          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {product.veredicto}
          </p>

          <div className="mt-4">
            <AffiliateButton asin={asin} showPrice={product.precio} size="lg" />
          </div>

          <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            Enlace de afiliado. Si compras a traves de el, recibimos una comision sin coste para ti.
          </p>
        </div>
      </div>

      {/* Editorial intro */}
      <div className="mt-10 max-w-3xl space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        <p>
          El Fezibo es el escritorio elevable electrico mas barato que puedes comprar ahora mismo en Amazon Espana. 120 euros. Con motor. Sube y baja pulsando un boton. Hace cinco anos esto habria parecido ciencia ficcion. Hoy es una realidad, pero con matices importantes que necesitas conocer antes de comprar.
        </p>
        <p>
          He analizado las 2400+ opiniones en Amazon, he comparado sus specs con los otros modelos baratos del mercado, y tengo claro para quien tiene sentido y para quien no. Si tu presupuesto es ajustado, esto te interesa.
        </p>
      </div>

      <div className="divider my-10" />

      {/* Specs grid */}
      <section>
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Especificaciones tecnicas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Motor", value: "Simple", detail: "Basico pero funcional" },
            { label: "Rango de altura", value: `${product.specs.rango_altura_min_cm}–${product.specs.rango_altura_max_cm} cm`, detail: "44 cm de recorrido" },
            { label: "Velocidad", value: `${product.specs.velocidad_cm_s} cm/s`, detail: "Estandar" },
            { label: "Carga maxima", value: `${product.specs.peso_max_carga_kg} kg`, detail: "Setup ligero" },
            { label: "Tablero", value: `${product.specs.ancho_tablero_cm}x${product.specs.profundidad_tablero_cm} cm`, detail: product.specs.material_tablero || '' },
            { label: "Peso estructura", value: `${product.specs.peso_estructura_kg} kg`, detail: "Ligero" },
            { label: "Ruido", value: `${product.specs.ruido_db} dB`, detail: "Audible" },
            { label: "Garantia", value: `${product.specs.garantia_anos} anos`, detail: "Estandar" },
            { label: "Presets", value: `${product.specs.presets_memoria} memorias`, detail: "Ajuste rapido" },
            { label: "Anticolision", value: product.specs.sistema_anticolision ? "Si" : "No", detail: "No incluido" },
          ].map((spec) => (
            <div key={spec.label} className="p-4 rounded" style={{ background: 'var(--bg-secondary)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{spec.label}</p>
              <p className="mono text-lg font-bold mt-0.5">{spec.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{spec.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider my-10" />

      {/* Pros and cons */}
      <section>
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Pros y contras
        </h2>
        <ProsConsBox pros={product.pros} cons={product.contras} />
      </section>

      <div className="divider my-10" />

      {/* Detailed review */}
      <section className="max-w-3xl space-y-8">
        <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
          Analisis detallado
        </h2>

        <div>
          <h3 className="text-lg font-semibold">120 euros con motor: que sacrificas?</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            El motor simple es lento (2.5 cm/s) y ruidoso comparado con los doble motor. El recorrido completo tarda unos 18 segundos, que se sienten largos cuando vienes de un escritorio electrico rapido. Pero si es tu primer elevable, no lo vas a notar. Las 3 memorias de altura te permiten guardar tus posiciones favoritas y olvidarte.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            No tiene anticolision. Si la mesa choca con algo al bajar, el motor sigue empujando. Es el sacrificio mas relevante del precio bajo. Si tienes una cajonera debajo, ojo. La solucion casera: pon un tope adhesivo a la altura del obstaculo.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Estabilidad: lo justo</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Con 16 kg de estructura y patas de dos secciones, la estabilidad es la minima aceptable. A posicion de pie (110+ cm), el tablero se mueve al escribir. No es dramatico con un portatil, pero con un monitor de 27 pulgadas en brazo, se nota. Para personas por encima de 1.80 m, la altura maxima de 116 cm puede quedarse justa.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Para quien SI es el Fezibo</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Estudiantes que quieren alternar sentado y de pie mientras estudian. Personas que trabajan desde casa unas horas al dia (no jornada completa). Quien quiere probar un escritorio elevable sin gastarse mas de 130 euros. Y para espacios pequenos: 100x60 cm cabe en cualquier rincon.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Para quien NO es</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Teletrabajadores a jornada completa que necesitan espacio para dual monitor. Personas altas (mas de 1.80 m) que necesitan el escritorio por encima de 116 cm. Quien tenga monitores pesados o un setup de mas de 30-40 kg. Y si ya tienes un elevable y quieres mejorar, el salto del Fezibo a un Ergear o Flexispot EG1 se nota bastante por solo 20-90 euros mas.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Que dicen los 2400 compradores</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            La nota media de 4.3 con tantas opiniones es un dato fiable. Lo que mas se repite: facil de montar, funciona bien para lo que cuesta, y la bandeja para teclado incluida es un bonus inesperado. En lo negativo: tablero pequeno para quien esperaba algo mas grande, estabilidad justa a maxima altura, y algun caso de motor que zumba mas de la cuenta tras unos meses de uso.
          </p>
        </div>
      </section>

      <div className="divider my-10" />

      {/* Ratings */}
      <section>
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>Puntuacion</h2>
        <div className="max-w-md">
          <CompactRatings puntuacion={product.puntuacion} />
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 p-6 rounded text-center" style={{ background: 'var(--color-secondary-light)', borderLeft: '3px solid var(--accent)' }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Veredicto</p>
        <p className="text-xl mt-2" style={{ fontFamily: 'var(--font-display)' }}>{product.veredicto}</p>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          No es el mejor escritorio elevable. Pero a 120 euros, es la forma mas barata de descubrir si trabajar de pie va contigo.
        </p>
        <div className="mt-4 inline-block">
          <AffiliateButton asin={asin} showPrice={product.precio} size="lg" />
        </div>
      </div>

      <div className="divider my-10" />

      {/* Alternatives */}
      <section>
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Alternativas al Fezibo
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Si puedes estirar un poco el presupuesto, estas opciones ofrecen mejoras significativas por poco dinero mas.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: 'var(--color-secondary)', color: 'white' }}>
                <th className="text-left p-3 rounded-tl" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Modelo</th>
                <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Motor</th>
                <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Nota</th>
                <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Precio</th>
                <th className="text-center p-3 rounded-tr" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}></th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: 'var(--accent-light)', borderBottom: '1px solid var(--border)' }}>
                <td className="p-3 font-semibold">Fezibo 100x60 (este)</td>
                <td className="p-3 text-center">Simple</td>
                <td className="p-3 text-center mono font-bold" style={{ color: 'var(--pro)' }}>{product.puntuacion.total}</td>
                <td className="p-3 text-center mono font-bold">{product.precio}€</td>
                <td className="p-3 text-center"><AffiliateButton asin={asin} size="sm" /></td>
              </tr>
              {alternatives.map(([altAsin, alt]) => (
                <tr key={altAsin} className="hover:bg-[var(--accent-light)]" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="p-3 font-semibold">{alt.marca} {alt.modelo}</td>
                  <td className="p-3 text-center">{alt.specs.tipo_motor === 'doble' ? 'Doble' : alt.specs.tipo_motor === 'manual' ? 'Manual' : 'Simple'}</td>
                  <td className="p-3 text-center mono font-bold">{alt.puntuacion.total}</td>
                  <td className="p-3 text-center mono font-bold">{alt.precio}€</td>
                  <td className="p-3 text-center"><AffiliateButton asin={altAsin} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Internal links */}
      <section className="mt-10 max-w-3xl p-6 rounded" style={{ background: 'var(--color-secondary-light)', borderLeft: '3px solid var(--color-secondary)' }}>
        <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Sigue leyendo
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <Link href="/escritorio-elevable-barato" className="underline" style={{ color: 'var(--accent)' }}>Escritorios elevables baratos</Link> — Todas las opciones por menos de 200 euros, comparadas.
          </p>
          <p>
            <Link href="/mejor-escritorio-elevable" className="underline" style={{ color: 'var(--accent)' }}>Los mejores escritorios elevables de 2026</Link> — Si puedes estirar el presupuesto, aqui estan todos.
          </p>
          <p>
            <Link href="/comparador" className="underline" style={{ color: 'var(--accent)' }}>Comparador interactivo</Link> — Filtra por precio, altura y motor para encontrar tu escritorio.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Preguntas frecuentes sobre el Fezibo
        </h2>
        <div className="space-y-6">
          {faqItems.map((faq) => (
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
