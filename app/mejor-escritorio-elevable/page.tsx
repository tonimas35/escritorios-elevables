import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { AffiliateButton } from "@/components/AffiliateButton";
import { ProsConsBox } from "@/components/ProsConsBox";
import { CompactRatings } from "@/components/CompactRatings";

export const metadata: Metadata = {
  title: "12 mejores escritorios elevables 2026 — Guia de compra",
  description:
    "Comparativa de los 12 mejores escritorios elevables electricos de 2026. Desde 110€ hasta gama premium. Analisis con datos reales, pros/contras y recomendaciones.",
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
      a: "Yo llevo mas de un ano usando uno y la espalda lo nota. Cuando coges el ritmo (30 min sentado, 15 de pie), la tension lumbar baja mucho. Si trabajas sentado mas de 4 horas al dia, es de las mejores inversiones para tu setup.",
    },
    {
      q: "Motor simple o doble: cual elijo?",
      a: "El doble es mas rapido (3.8 vs 2.5 cm/s), mas silencioso y reparte mejor el esfuerzo. Si cambias de posicion varias veces al dia, se nota. Pero si tu presupuesto no llega a 270 euros, un motor simple cumple bien — prioriza estabilidad y garantia antes que esto.",
    },
    {
      q: "Cuanto peso soportan estos escritorios?",
      a: "De 50 kg los baratos a 150 kg los premium. Un setup normal (monitor + portatil + trastos) pesa unos 12-15 kg, asi que incluso el mas basico va sobrado. Solo preocupate si tienes varios monitores con brazo o equipos pesados encima.",
    },
    {
      q: "Puedo montar un escritorio elevable solo?",
      a: "Los ligeros (menos de 22 kg, tipo Fezibo o JUMMICO) si. Los pesados como el E7 (32 kg) son un engorro en solitario al dar la vuelta al tablero. Mi regla: si pesa mas de 25 kg, pide ayuda.",
    },
    {
      q: "Que garantia tienen?",
      a: "De 2 a 5 anos. Flexispot y Maidesite dan 5 anos; marcas baratas como Fezibo o JUMMICO, solo 2. Si un motor falla, suele ser en los primeros 6 meses. Pero si puedes elegir, mejor 5 anos — es electronica con partes moviles.",
    },
    {
      q: "Cuanta electricidad consume un escritorio elevable?",
      a: "Practicamente nada. El motor funciona 10-20 segundos cada vez que cambias de altura. Consumo anual: unos 2-3 kWh, menos de 1 euro al ano en la factura.",
    },
    {
      q: "Se nota mucho la diferencia entre un escritorio de 150 euros y uno de 500?",
      a: "En estabilidad de pie, ruido y rango de altura, si. Para uso normal, uno de 180-200 EUR con anticolision va bien. Si pasas 8 horas diarias y necesitas que no vibre nada al escribir de pie, el salto a gama media-alta se nota.",
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
      <p className="mt-2 text-sm text-neutral-500">
        Actualizado: marzo 2026 · 12 modelos analizados · Desde 110 EUR
      </p>
      <p className="mt-1 text-xs text-neutral-400">
        Este articulo contiene enlaces de afiliado. Si compras a traves de ellos, recibimos una pequena comision sin coste adicional para ti.
      </p>

      {/* Intro editorial */}
      <div className="mt-8 max-w-3xl text-sm leading-relaxed text-neutral-600">
        <p>
          He analizado 12 escritorios elevables en Amazon Espana (de 120 a 550 EUR), midiendo ruido, estabilidad y leyendo cientos de opiniones reales. Mi recomendacion rapida: el <strong>Flexispot E7 Pro</strong> si el presupuesto no importa, el <strong>Maidesite T2 Pro Plus</strong> (doble motor por menos de 300 EUR) para la mayoria, y el <strong>Ergear EED-S1</strong> (140 EUR, con anticolision) si vas justo.
        </p>
      </div>

      {/* Winner callout */}
      <div className="mt-8 p-6 rounded-lg" style={{ background: 'var(--accent-light)', border: '2px solid var(--accent)' }}>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-[140px] h-[140px] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center bg-white">
            <Image src={topProduct.imagen} alt={topProduct.imagen_alt} width={140} height={140} className="object-contain p-1" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Nuestro favorito</p>
            <h2 className="text-xl font-semibold mt-1 text-neutral-800" style={{ fontFamily: 'var(--font-display)' }}>
              {topProduct.nombre}
            </h2>
            <p className="text-sm mt-1 text-neutral-600">{topProduct.veredicto}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="tabular-nums text-2xl font-bold text-neutral-800">{topProduct.precio}€</span>
              <span
                className={`tabular-nums font-bold px-2 py-0.5 rounded text-sm text-white ${
                  topProduct.puntuacion.total >= 8.5
                    ? "bg-green-500"
                    : topProduct.puntuacion.total >= 7
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
              >
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
            <tr className="bg-neutral-800 text-white">
              <th className="text-left p-3 rounded-tl font-semibold">#</th>
              <th className="text-left p-3 font-semibold">Modelo</th>
              <th className="text-center p-3 font-semibold">Motor</th>
              <th className="text-center p-3 font-semibold">Carga</th>
              <th className="text-center p-3 font-semibold">Nota</th>
              <th className="text-center p-3 font-semibold">Precio</th>
              <th className="text-center p-3 rounded-tr font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map(([asin, product], i) => (
              <tr key={asin} className="transition-colors hover:bg-neutral-50 border-b border-neutral-200">
                <td className="p-3">
                  <span className="tabular-nums text-xs font-bold" style={{ color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                </td>
                <td className="p-3">
                  <a href={`#${product.slug}`} className="flex items-center gap-3 hover:underline">
                    <div className="w-[80px] h-[80px] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center bg-neutral-50">
                      <Image src={product.imagen} alt={product.imagen_alt} width={80} height={80} className="object-contain p-1" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-neutral-800">{product.marca} {product.modelo}</p>
                      <p className="text-xs text-neutral-500">{product.rating}★ ({product.num_reviews})</p>
                    </div>
                  </a>
                </td>
                <td className="p-3 text-center">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    product.specs.tipo_motor === 'doble'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {product.specs.tipo_motor === 'doble' ? 'Doble' : 'Simple'}
                  </span>
                </td>
                <td className="p-3 text-center tabular-nums text-sm text-neutral-800">{product.specs.peso_max_carga_kg} kg</td>
                <td className="p-3 text-center">
                  <span
                    className="tabular-nums font-bold"
                    style={{
                      color: product.puntuacion.total >= 8.5
                        ? '#22c55e'
                        : product.puntuacion.total >= 7
                          ? '#f59e0b'
                          : '#ef4444',
                    }}
                  >
                    {product.puntuacion.total}
                  </span>
                </td>
                <td className="p-3 text-center tabular-nums font-bold text-neutral-800">{product.precio}€</td>
                <td className="p-3 text-center">
                  <AffiliateButton asin={asin} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editorial bridge before detailed analysis */}
      <div className="mt-12 max-w-3xl text-sm leading-relaxed text-neutral-600">
        <p>
          No siempre el mas caro es el mejor. Lo que manda es el motor, la estructura y como se llevan entre si. Aqui va cada modelo, con lo bueno y lo malo.
        </p>
      </div>

      {/* Detailed analysis of each product */}
      <div className="mt-16 space-y-16">
        {topProducts.map(([asin, product], i) => {
          const editorialContent: Record<string, string> = {
            "flexispot-e7-pro": "El que compras cuando no quieres pensar mas. 150 kg de carga, 43 dB de ruido (no lo oyes en videollamada), tablero de bambu de 160x80. No tiene puntos debiles serios. El precio (mas de 500 EUR) y el montaje pesado (35 kg, necesitas ayuda) son los unicos peros. Para setups completos con dos monitores, es imbatible.",
            "flexispot-e7": "El mas recomendado de internet por algo. Doble motor, 125 kg de carga y una estabilidad a maxima altura que los baratos no consiguen (tres secciones telescopicas). Si tu setup es solo portatil y monitor, el Maidesite T2 Pro Plus hace casi lo mismo por 200 EUR menos. Pero si quieres lo seguro, este es.",
            "maidesite-t2-pro": "La sorpresa de la guia. Doble motor, 100 kg de carga, anticolision y 5 anos de garantia por menos de 300 EUR. Pierde frente al E7 en estabilidad a maxima altura (un pelitejo de movimiento lateral) y el tablero se siente mas fino. Pero por 200 EUR menos, es la compra inteligente para la mayoria.",
            "flexispot-eg8": "Un E7 con estetica gaming: cajon con USB y tablero de fibra de carbono. Queda bien, pero a 500 EUR casi iguala al E7 Pro que tiene mejor tablero y mas carga. Solo tiene sentido si quieres el look gamer y el cajon te resulta util. Solo en negro.",
            "maidesite-s2-pro": "Motor simple, pero con 80 kg de carga (el mejor a este precio), anticolision y 5 anos de garantia por 200 EUR. Si Maidesite le pone 5 anos a este precio, es que confian en el. Para quien quiere marca fiable sin necesitar doble motor.",
            "flexispot-eg1": "La puerta de entrada a Flexispot: anticolision, 70 kg de carga y 5 anos de garantia por 210 EUR. Sin extras ni USB, tablero de 120x60 justo para dos monitores. Pero hereda la calidad de la marca y las quejas en Amazon son minimas.",
            "ergear-eed-s1": "La mejor sorpresa por debajo de 150 EUR. Anticolision y 4 memorias a 140 EUR — eso no lo ofrece ni Fezibo ni JUMMICO. Motor lento y estabilidad mejorable, pero las funcionalidades por el precio no tienen rival.",
            "sanodesk-qs-plus": "Submarca de Flexispot, pero en tierra de nadie: sin anticolision y solo 3 anos de garantia a 190 EUR. Por 20 EUR mas tienes el EG1 con anticolision y 5 anos. Solo merece la pena si lo pillas en oferta por debajo de 160 EUR.",
            "vasagle-lsd302": "El unico con tablero de 140x60 cm por debajo de 200 EUR. Si necesitas mesa grande y no llegas a 300 EUR, es tu opcion. 80 kg de carga, anticolision, 4 memorias. Garantia de solo 3 anos y montaje pesado (24 kg).",
            "fezibo-100x60": "El mas vendido en gama barata (2400+ opiniones). A 120 EUR incluye bandeja para teclado y se monta en 20 minutos. Pero 50 kg de carga es justo, tablero de 100 cm pequeno, sin anticolision y solo 2 anos de garantia. Bueno para probar; si ya sabes que lo quieres, el Ergear da mas por 20 EUR extra.",
            "jummico-hed12": "El mas barato a 160 EUR, pero se nota: 60 kg de carga, tablero de 100 cm, motor ruidoso (52 dB) y 2 anos de garantia. Tiene sentido para espacios muy pequenos donde 120 cm no cabe. Si no es tu caso, el Ergear o el Fezibo dan mas.",
          };
          const editorial = editorialContent[product.slug] || "";

          return (
          <section key={asin} id={product.slug}>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="tabular-nums text-sm font-bold" style={{ color: 'var(--accent)' }}>#{String(i + 1).padStart(2, '0')}</span>
              <h2 className="text-2xl text-neutral-800" style={{ fontFamily: 'var(--font-display)' }}>
                {product.nombre}
              </h2>
            </div>
            <p className="text-sm text-neutral-600">{product.veredicto}</p>

            <div className="mt-4 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-[200px] h-[200px] rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 bg-neutral-50">
                <Image src={product.imagen} alt={product.imagen_alt} width={200} height={200} className="object-contain p-2" />
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Precio", value: `${product.precio}€` },
                    { label: "Motor", value: product.specs.tipo_motor === 'doble' ? 'Doble' : 'Simple' },
                    { label: "Carga max", value: `${product.specs.peso_max_carga_kg} kg` },
                    { label: "Tablero", value: `${product.specs.ancho_tablero_cm}x${product.specs.profundidad_tablero_cm} cm` },
                  ].map((spec) => (
                    <div key={spec.label} className="p-2 rounded bg-neutral-50">
                      <p className="text-xs text-neutral-500">{spec.label}</p>
                      <p className="tabular-nums text-sm font-semibold text-neutral-800">{spec.value}</p>
                    </div>
                  ))}
                </div>
                <ProsConsBox pros={product.pros} cons={product.contras} />
              </div>
            </div>

            {/* Editorial analysis */}
            {editorial && (
              <div className="mt-5 max-w-3xl">
                <p className="text-sm leading-relaxed text-neutral-600">
                  {editorial}
                </p>
              </div>
            )}

            {/* Compact ratings grid instead of long RatingBars */}
            <div className="mt-4 max-w-md">
              <CompactRatings puntuacion={product.puntuacion} />
            </div>

            <p className="mt-3 text-sm text-neutral-600">
              <strong className="text-neutral-800">Ideal para:</strong> {product.ideal_para}
            </p>

            <div className="mt-4">
              <AffiliateButton asin={asin} showPrice={product.precio} size="lg" />
            </div>
          </section>
          );
        })}
      </div>

      {/* Como elegir section */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl mb-6 text-neutral-800" style={{ fontFamily: 'var(--font-display)' }}>
          Como elegir el mejor escritorio elevable
        </h2>
        <div className="space-y-6 text-sm leading-relaxed text-neutral-600">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-800">El motor: simple vs doble</h3>
            <p>
              El doble es mas rapido (3.8 vs 2.5 cm/s), mas silencioso y mas estable al moverse. Si cambias de posicion 4+ veces al dia con un setup pesado, merece la pena. Si lo mueves dos veces al dia con un portatil, el simple cumple.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-800">Estabilidad: importa mas de lo que crees</h3>
            <p>
              De pie, el escritorio esta a 110-120 cm y cualquier vibracion se amplifica. Si la pantalla tiembla al teclear, te cansas la vista. Busca patas con tres secciones telescopicas y estructura pesada. E7 Pro y E7 son los mejores; en los baratos hay que aceptar algo de movimiento.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-800">Ruido: ojo si haces videollamadas</h3>
            <p>
              Baratos: 50-52 dB (se oye). Premium: 43-45 dB (casi no se nota). Si cambias de altura durante una llamada, con 50 dB la otra persona lo percibe. Con 43, no.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-800">Rango de altura: ojo si mides mas de 1.85 m</h3>
            <p>
              Baratos: 72-118 cm. Premium: 58-125 cm. Si mides mas de 1.85 m y el escritorio llega solo a 118 cm, vas a trabajar encorvado. El E7 llega a 123 cm y el Maidesite T2 Pro a 127 cm.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-800">Garantia y postventa</h3>
            <p>
              Flexispot y Maidesite dan 5 anos; marcas baratas, 2. Los problemas graves suelen aparecer en los primeros 6 meses. Si puedes elegir, 5 anos siempre — tiene electronica y partes moviles.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-800">Anticolision: no te la juegues</h3>
            <p>
              Para el motor si detecta un obstaculo al bajar. Sin anticolision, el motor sigue y puede romper cajones o el propio mecanismo. Desde 140 EUR ya lo encuentras (Ergear), asi que no merece la pena ahorrar y quedarse sin el.
            </p>
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="mt-12 max-w-3xl p-6 rounded-lg bg-neutral-50">
        <h2 className="text-lg font-semibold mb-3 text-neutral-800" style={{ fontFamily: 'var(--font-display)' }}>
          Guias relacionadas
        </h2>
        <div className="space-y-2 text-sm">
          <p>
            <Link href="/escritorio-elevable-barato" className="underline" style={{ color: 'var(--accent)' }}>Mejores escritorios elevables baratos</Link> — Si tu presupuesto esta por debajo de 220 euros, esta guia va mas al detalle en la gama economica.
          </p>
          <p>
            <Link href="/flexispot-e7-opiniones" className="underline" style={{ color: 'var(--accent)' }}>Flexispot E7: opinion y review completa</Link> — Analisis a fondo del E7 con opiniones reales de compradores.
          </p>
          <p>
            <Link href="/flexispot-vs-maidesite" className="underline" style={{ color: 'var(--accent)' }}>Flexispot vs Maidesite: comparativa</Link> — Las dos marcas mas vendidas cara a cara. ¿Cual merece la pena?
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl mb-6 text-neutral-800" style={{ fontFamily: 'var(--font-display)' }}>
          Preguntas frecuentes
        </h2>
        <div className="space-y-6">
          {faqItems.map((faq) => (
            <div key={faq.q}>
              <h3 className="text-base font-semibold text-neutral-800">{faq.q}</h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
