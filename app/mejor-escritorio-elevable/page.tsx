import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { AffiliateButton } from "@/components/AffiliateButton";
import { ProsConsBox } from "@/components/ProsConsBox";
import { CompactRatings } from "@/components/CompactRatings";
import { FadeIn } from "@/components/FadeIn";

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

  // Group products by tier for editorial bridges
  const premiumProducts = topProducts.filter(([, p]) => p.precio > 300);
  const midProducts = topProducts.filter(([, p]) => p.precio >= 150 && p.precio <= 300);
  const budgetProducts = topProducts.filter(([, p]) => p.precio < 150);

  const ratingBg = (score: number) =>
    score >= 8.5
      ? "var(--rating-good)"
      : score >= 7
        ? "var(--rating-okay)"
        : "var(--rating-bad)";

  return (
    <div>
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

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
          <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Inicio</Link>
          {" "}&gt;{" "}Mejores escritorios elevables
        </nav>

        <FadeIn>
          <h1 className="text-3xl md:text-5xl heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
            Los <span style={{ color: 'var(--accent)' }}>12 mejores</span> escritorios elevables de 2026
          </h1>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            Actualizado: marzo 2026 · 12 modelos analizados · Desde 110 EUR
          </p>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            Este articulo contiene enlaces de afiliado. Si compras a traves de ellos, recibimos una pequena comision sin coste adicional para ti.
          </p>
        </FadeIn>

        {/* Intro editorial */}
        <FadeIn delay={100}>
          <div className="mt-8 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              He analizado 12 escritorios elevables en Amazon Espana (de 120 a 550 EUR), midiendo ruido, estabilidad y leyendo cientos de opiniones reales. Mi recomendacion rapida: el <strong>Flexispot E7 Pro</strong> si el presupuesto no importa, el <strong>Maidesite T2 Pro Plus</strong> (doble motor por menos de 300 EUR) para la mayoria, y el <strong>Ergear EED-S1</strong> (140 EUR, con anticolision) si vas justo.
            </p>
          </div>
        </FadeIn>

        {/* Winner callout — #1 product gets special treatment */}
        <FadeIn delay={200}>
          <div className="mt-8 p-6 rounded-lg noise-bg" style={{ background: 'linear-gradient(135deg, var(--accent-light), rgba(196, 122, 58, 0.03))', border: '2px solid var(--accent)' }}>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-[160px] h-[160px] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center product-image-container">
                <Image src={topProduct.imagen} alt={topProduct.imagen_alt} width={160} height={160} className="object-contain p-1" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Nuestro favorito</p>
                <h2 className="text-xl font-semibold mt-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  {topProduct.nombre}
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{topProduct.veredicto}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="tabular-nums text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{topProduct.precio}€</span>
                  <span
                    className="tabular-nums font-bold px-2 py-0.5 rounded text-sm text-white"
                    style={{ background: ratingBg(topProduct.puntuacion.total) }}
                  >
                    {topProduct.puntuacion.total}/10
                  </span>
                  <AffiliateButton asin={topAsin} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Summary table */}
        <FadeIn delay={150}>
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
                  <tr key={asin} className="transition-colors hover:bg-[var(--bg-secondary)]" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="p-3">
                      <span className="tabular-nums text-xs font-bold" style={{ color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                    </td>
                    <td className="p-3">
                      <a href={`#${product.slug}`} className="flex items-center gap-3 hover:underline">
                        <div className="w-[80px] h-[80px] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center product-image-container">
                          <Image src={product.imagen} alt={product.imagen_alt} width={80} height={80} className="object-contain p-1" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{product.marca} {product.modelo}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}★ ({product.num_reviews})</p>
                        </div>
                      </a>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-xs font-medium px-2 py-0.5 rounded" style={{
                        background: product.specs.tipo_motor === 'doble' ? 'rgba(46, 139, 62, 0.12)' : 'var(--bg-secondary)',
                        color: product.specs.tipo_motor === 'doble' ? 'var(--pro)' : 'var(--text-muted)',
                      }}>
                        {product.specs.tipo_motor === 'doble' ? 'Doble' : 'Simple'}
                      </span>
                    </td>
                    <td className="p-3 text-center tabular-nums text-sm" style={{ color: 'var(--text-primary)' }}>{product.specs.peso_max_carga_kg} kg</td>
                    <td className="p-3 text-center">
                      <span
                        className="tabular-nums font-bold"
                        style={{ color: ratingBg(product.puntuacion.total) }}
                      >
                        {product.puntuacion.total}
                      </span>
                    </td>
                    <td className="p-3 text-center tabular-nums font-bold" style={{ color: 'var(--text-primary)' }}>{product.precio}€</td>
                    <td className="p-3 text-center">
                      <AffiliateButton asin={asin} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>

        {/* Editorial bridge before detailed analysis */}
        <FadeIn>
          <div className="mt-12 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              No siempre el mas caro es el mejor. Lo que manda es el motor, la estructura y como se llevan entre si. Aqui va cada modelo, con lo bueno y lo malo.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Detailed analysis of each product — with layout variation */}
      <div className="mt-8">
        {/* Premium tier bridge */}
        {premiumProducts.length > 0 && (
          <div className="py-8 mb-4 noise-bg" style={{ background: 'var(--bg-secondary)' }}>
            <div className="max-w-5xl mx-auto px-6">
              <FadeIn>
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                  <p className="text-xs font-bold uppercase tracking-[0.3em] whitespace-nowrap" style={{ color: 'var(--accent)' }}>
                    Gama premium
                  </p>
                  <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                </div>
                <p className="text-center text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Para quien quiere lo mejor y no mira el precio
                </p>
              </FadeIn>
            </div>
          </div>
        )}

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

          // Determine if this product is at a tier boundary to insert bridge callouts
          const isFirstMid = midProducts.length > 0 && product.slug === midProducts[0][1].slug;
          const isFirstBudget = budgetProducts.length > 0 && product.slug === budgetProducts[0][1].slug;

          // Every 3rd product gets a background band
          const hasBand = i % 3 === 2;
          // Alternate image position
          const imageRight = i % 2 === 1;

          return (
            <div key={asin}>
              {/* Tier bridge callouts */}
              {isFirstMid && (
                <div className="py-8 mb-4 noise-bg" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="max-w-5xl mx-auto px-6">
                    <FadeIn>
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                        <p className="text-xs font-bold uppercase tracking-[0.3em] whitespace-nowrap" style={{ color: 'var(--accent)' }}>
                          Gama media
                        </p>
                        <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                      </div>
                      <p className="text-center text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                        Donde esta el equilibrio entre precio y prestaciones
                      </p>
                    </FadeIn>
                  </div>
                </div>
              )}
              {isFirstBudget && (
                <div className="py-8 mb-4 noise-bg" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="max-w-5xl mx-auto px-6">
                    <FadeIn>
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                        <p className="text-xs font-bold uppercase tracking-[0.3em] whitespace-nowrap" style={{ color: 'var(--accent)' }}>
                          Gama economica
                        </p>
                        <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                      </div>
                      <p className="text-center text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                        Opciones solidas sin arruinarte
                      </p>
                    </FadeIn>
                  </div>
                </div>
              )}

              <section
                id={product.slug}
                className={`py-12 ${hasBand ? 'noise-bg' : ''}`}
                style={hasBand ? { background: 'var(--bg-secondary)' } : {}}
              >
                <div className="max-w-5xl mx-auto px-6">
                  <FadeIn delay={i * 50}>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="tabular-nums text-sm font-bold" style={{ color: 'var(--accent)' }}>#{String(i + 1).padStart(2, '0')}</span>
                      <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                        {product.nombre}
                      </h2>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{product.veredicto}</p>

                    <div className={`mt-4 flex flex-col gap-6 ${imageRight ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                      <div className="w-full md:w-[200px] h-[200px] rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 product-image-container">
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
                            <div key={spec.label} className="p-2 rounded" style={{ background: hasBand ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{spec.label}</p>
                              <p className="tabular-nums text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{spec.value}</p>
                            </div>
                          ))}
                        </div>
                        <ProsConsBox pros={product.pros} cons={product.contras} />
                      </div>
                    </div>

                    {/* Editorial analysis */}
                    {editorial && (
                      <div className="mt-5 max-w-3xl">
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {editorial}
                        </p>
                      </div>
                    )}

                    {/* Compact ratings grid */}
                    <div className="mt-4 max-w-md">
                      <CompactRatings puntuacion={product.puntuacion} />
                    </div>

                    <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Ideal para:</strong> {product.ideal_para}
                    </p>

                    <div className="mt-4">
                      <AffiliateButton asin={asin} showPrice={product.precio} size="lg" />
                    </div>
                  </FadeIn>
                </div>
              </section>
            </div>
          );
        })}
      </div>

      {/* Como elegir section — with numbered circles */}
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <section className="mt-16 max-w-3xl">
            <h2 className="text-2xl mb-8 heading-accent" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Como elegir el mejor escritorio elevable
            </h2>
            <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {[
                { title: "El motor: simple vs doble", text: "El doble es mas rapido (3.8 vs 2.5 cm/s), mas silencioso y mas estable al moverse. Si cambias de posicion 4+ veces al dia con un setup pesado, merece la pena. Si lo mueves dos veces al dia con un portatil, el simple cumple." },
                { title: "Estabilidad: importa mas de lo que crees", text: "De pie, el escritorio esta a 110-120 cm y cualquier vibracion se amplifica. Si la pantalla tiembla al teclear, te cansas la vista. Busca patas con tres secciones telescopicas y estructura pesada. E7 Pro y E7 son los mejores; en los baratos hay que aceptar algo de movimiento." },
                { title: "Ruido: ojo si haces videollamadas", text: "Baratos: 50-52 dB (se oye). Premium: 43-45 dB (casi no se nota). Si cambias de altura durante una llamada, con 50 dB la otra persona lo percibe. Con 43, no." },
                { title: "Rango de altura: ojo si mides mas de 1.85 m", text: "Baratos: 72-118 cm. Premium: 58-125 cm. Si mides mas de 1.85 m y el escritorio llega solo a 118 cm, vas a trabajar encorvado. El E7 llega a 123 cm y el Maidesite T2 Pro a 127 cm." },
                { title: "Garantia y postventa", text: "Flexispot y Maidesite dan 5 anos; marcas baratas, 2. Los problemas graves suelen aparecer en los primeros 6 meses. Si puedes elegir, 5 anos siempre — tiene electronica y partes moviles." },
                { title: "Anticolision: no te la juegues", text: "Para el motor si detecta un obstaculo al bajar. Sin anticolision, el motor sigue y puede romper cajones o el propio mecanismo. Desde 140 EUR ya lo encuentras (Ergear), asi que no merece la pena ahorrar y quedarse sin el." },
              ].map((item, i) => (
                <FadeIn key={item.title} delay={i * 80}>
                  <div className="relative pl-14">
                    <span className="absolute left-0 top-0 mono text-3xl font-bold" style={{ color: 'var(--accent)', opacity: 0.2 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Internal links */}
        <FadeIn>
          <section className="mt-12 max-w-3xl p-6 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
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
        </FadeIn>

        {/* FAQ — with distinct background band and styling */}
        <section className="mt-16 mb-8 max-w-3xl">
          <FadeIn>
            <div className="p-8 rounded-lg noise-bg" style={{ background: 'var(--bg-secondary)' }}>
              <h2 className="text-2xl mb-2 heading-accent" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Preguntas frecuentes
              </h2>
              <div className="mt-6">
                {faqItems.map((faq, i) => (
                  <FadeIn key={faq.q} delay={i * 60}>
                    <div className="faq-item">
                      <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{faq.q}</h3>
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>
      </div>
    </div>
  );
}
