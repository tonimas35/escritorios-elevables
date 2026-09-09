import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { AffiliateButton } from "@/components/AffiliateButton";
import { ProsConsBox } from "@/components/ProsConsBox";
import { CompactRatings } from "@/components/CompactRatings";
import { FadeIn } from "@/components/FadeIn";
import { productSchema, itemListSchema } from "@/lib/schema";
import { reviewsAprox } from "@/lib/format";

export const metadata: Metadata = {
  title: "12 mejores escritorios elevables 2026 — Guia de compra",
  description:
    "Comparativa de los 12 mejores escritorios elevables eléctricos de 2026. De la gama de entrada a la premium. Análisis con datos reales, pros/contras y recomendaciones.",
  alternates: { canonical: "/mejor-escritorio-elevable" },
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

  const productSchemas = topProducts.map(([a, p]) =>
    productSchema(a, p, "/mejor-escritorio-elevable")
  );

  // ItemList: la estructura que describe una comparativa "los mejores X",
  // y la que mejor interpretan buscadores y asistentes de IA.
  const listSchema = itemListSchema(
    "Los 12 mejores escritorios elevables de 2026",
    topProducts,
    "/mejor-escritorio-elevable"
  );

  const faqItems = [
    {
      q: "Merece la pena un escritorio elevable?",
      a: "Depende de si vas a usarlo. Un escritorio elevable solo aporta algo si de verdad lo subes: el patron habitual es alternar unos 30 minutos sentado y 15 de pie. Si trabajas sentado más de cuatro horas al día y sabes que vas a cambiar de postura, compensa. Si sospechas que lo vas a dejar siempre a la misma altura, te sale más barato una mesa normal.",
    },
    {
      q: "Motor simple o doble: cual elijo?",
      a: "El doble es más rápido (3.8 vs 2.5 cm/s), más silencioso y reparte mejor el esfuerzo. Si cambias de posición varias veces al día, se nota. Pero si el presupuesto manda, un motor simple cumple bien \u2014 prioriza estabilidad y garantía antes que esto.",
    },
    {
      q: "Cuanto peso soportan estos escritorios?",
      a: "De 50 kg los baratos a 160 kg los premium. Un setup normal (monitor + portatil + trastos) pesa unos 12-15 kg, así que incluso el más básico va sobrado. Solo preocupate si tienes varios monitores con brazo o equipos pesados encima.",
    },
    {
      q: "Puedo montar un escritorio elevable solo?",
      a: "Los ligeros, por debajo de 22 kg, como el Fezibo o los Devoko, si. Los pesados como el E7 (32 kg) son un engorro en solitario al dar la vuelta al tablero. Como referencia: por encima de 25 kg, mejor entre dos.",
    },
    {
      q: "Que garantía tienen?",
      a: "En España la garantía legal mínima son tres años para cualquier producto nuevo, así que ese es el suelo de todo el catálogo. Por encima de eso, Flexispot ofrece cinco años en la estructura, que es la garantía comercial más larga del catálogo. Si un motor falla suele hacerlo en los primeros meses, pero al ser electrónica con partes móviles esos dos años de más tienen valor.",
    },
    {
      q: "Cuanta electricidad consume un escritorio elevable?",
      a: "Prácticamente nada. El motor funciona 10-20 segundos cada vez que cambias de altura. Consumo anual: unos 2-3 kWh, menos de 1 euro al año en la factura.",
    },
    {
      q: "¿Se nota mucho la diferencia entre la gama de entrada y la premium?",
      a: "En estabilidad de pie, ruido y rango de altura, si. Para uso normal, uno de gama media con anticolisión va bien. Si pasas 8 horas diarias y necesitas que no vibre nada al escribir de pie, el salto a gama media-alta se nota.",
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
      ? "var(--color-secondary)"
      : score >= 7
        ? "var(--rating-okay)"
        : "var(--rating-bad)";

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
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
          {/* Editorial header with rules */}
          <div className="editorial-rule mb-6" />
          <p className="editorial-mark mb-3" style={{ color: 'var(--color-secondary)' }}>
            Guia de compra &middot; Marzo 2026
          </p>
          <h1 className="text-3xl md:text-5xl heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
            Los <span style={{ color: 'var(--accent)' }}>12 mejores</span> escritorios elevables de 2026
          </h1>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            Actualizado: septiembre de 2026 &middot; 12 modelos analizados
          </p>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            Este articulo contiene enlaces de afiliado. Si compras a traves de ellos, recibimos una pequena comision sin coste adicional para ti.
          </p>
          <div className="editorial-rule mt-6" />
        </FadeIn>

        {/* Intro editorial */}
        <FadeIn delay={100}>
          <div className="mt-8 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              Hemos reunido las especificaciones de 12 escritorios elevables a la venta en Amazon España, de la gama de entrada a la premium, y las hemos ordenado con los mismos cinco criterios para todos. En corto: el <strong>marco Flexispot</strong> es la mejor compra si ya tienes tablero o quieres montar uno a medida; el <strong>FLEXISPOT de 160x80</strong> es el más completo de los que vienen listos para usar; y el <strong>MAIDeSITe T2 Pro MAX</strong> solo compensa si necesitas sus 160 kg de carga. Cómo puntuamos y qué no hacemos está en la <a href="/metodologia" style={{ textDecoration: 'underline' }}>metodología</a>.
            </p>
          </div>
        </FadeIn>

        {/* Winner callout */}
        <FadeIn delay={200}>
          <div className="mt-8 p-6 rounded noise-bg" style={{ background: 'linear-gradient(135deg, var(--color-secondary-light), white)', borderLeft: '3px solid var(--accent)' }}>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-[160px] h-[160px] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center product-image-container">
                <Image src={topProduct.imagen} alt={topProduct.imagen_alt} width={160} height={160} className="object-contain p-1" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary)' }}>Nuestro favorito</p>
                <h2 className="text-xl font-semibold mt-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  {topProduct.nombre}
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{topProduct.veredicto}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="tabular-nums text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{topProduct.puntuacion.total}</span>
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
                <tr style={{ background: 'var(--color-secondary)', color: 'white' }}>
                  <th className="text-left p-3 rounded-tl" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>#</th>
                  <th className="text-left p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Modelo</th>
                  <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Motor</th>
                  <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Carga</th>
                  <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Nota</th>
                  <th className="text-center p-3 rounded-tr" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}></th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map(([asin, product], i) => (
                  <tr key={asin} className="transition-colors hover:bg-[var(--color-secondary-light)]" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="p-3">
                      <span className="tabular-nums text-xs font-bold" style={{ color: 'var(--color-secondary)' }}>{String(i + 1).padStart(2, '0')}</span>
                    </td>
                    <td className="p-3">
                      <a href={`#${product.slug}`} className="flex items-center gap-3 hover:underline">
                        <div className="w-[80px] h-[80px] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center product-image-container">
                          <Image src={product.imagen} alt={product.imagen_alt} width={80} height={80} className="object-contain p-1" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{product.marca} {product.modelo}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}&#9733; ({reviewsAprox(product.num_reviews)})</p>
                        </div>
                      </a>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-xs font-medium px-2 py-0.5 rounded" style={{
                        background: product.specs.tipo_motor === 'doble' ? 'var(--color-secondary-subtle)' : 'var(--bg-secondary)',
                        color: product.specs.tipo_motor === 'doble' ? 'var(--color-secondary)' : 'var(--text-muted)',
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
                    <td className="p-3 text-center">
                      <AffiliateButton asin={asin} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>

        {/* Editorial bridge */}
        <FadeIn>
          <div className="mt-12 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              No siempre el más caro es el mejor. Lo que manda es el motor, la estructura y como se llevan entre si. Aquí va cada modelo, con lo bueno y lo malo.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Detailed analysis of each product */}
      <div className="mt-8">
        {/* Premium tier bridge */}
        {premiumProducts.length > 0 && (
          <div className="py-8 mb-4" style={{ background: 'var(--color-secondary)', color: 'white' }}>
            <div className="max-w-5xl mx-auto px-6">
              <FadeIn>
                <p className="editorial-mark" style={{ color: 'rgba(255,255,255,0.5)' }}>Seccion I</p>
                <p className="text-lg mt-1" style={{ fontFamily: 'var(--font-display)', color: 'white' }}>
                  Gama premium
                </p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Para quien quiere lo mejor y no mira el precio
                </p>
              </FadeIn>
            </div>
          </div>
        )}

        {topProducts.map(([asin, product], i) => {
          // El texto editorial sale del catalogo: una sola fuente de verdad,
          // cubre los 12 productos y se actualiza con los datos.
          const editorial = product.veredicto || "";

          const isFirstMid = midProducts.length > 0 && product.slug === midProducts[0][1].slug;
          const isFirstBudget = budgetProducts.length > 0 && product.slug === budgetProducts[0][1].slug;

          const hasBand = i % 3 === 2;
          const imageRight = i % 2 === 1;

          return (
            <div key={asin}>
              {/* Tier bridge callouts */}
              {isFirstMid && (
                <div className="py-8 mb-4" style={{ background: 'var(--color-secondary)', color: 'white' }}>
                  <div className="max-w-5xl mx-auto px-6">
                    <FadeIn>
                      <p className="editorial-mark" style={{ color: 'rgba(255,255,255,0.5)' }}>Seccion II</p>
                      <p className="text-lg mt-1" style={{ fontFamily: 'var(--font-display)', color: 'white' }}>
                        Gama media
                      </p>
                      <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Donde esta el equilibrio entre precio y prestaciones
                      </p>
                    </FadeIn>
                  </div>
                </div>
              )}
              {isFirstBudget && (
                <div className="py-8 mb-4" style={{ background: 'var(--color-secondary)', color: 'white' }}>
                  <div className="max-w-5xl mx-auto px-6">
                    <FadeIn>
                      <p className="editorial-mark" style={{ color: 'rgba(255,255,255,0.5)' }}>Seccion III</p>
                      <p className="text-lg mt-1" style={{ fontFamily: 'var(--font-display)', color: 'white' }}>
                        Gama económica
                      </p>
                      <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
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
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="editorial-number text-5xl" style={{ opacity: 0.12 }}>{String(i + 1).padStart(2, '0')}</span>
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

                    {/* Editorial analysis — pull quote style */}
                    {editorial && (
                      <div className="mt-5 max-w-3xl pl-6" style={{ borderLeft: '2px solid var(--accent)', opacity: 0.9 }}>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {editorial}
                        </p>
                      </div>
                    )}

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

      {/* Como elegir section */}
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <section className="mt-16 max-w-3xl">
            <div className="editorial-rule mb-6" />
            <h2 className="text-2xl mb-8 heading-accent" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Como elegir el mejor escritorio elevable
            </h2>
            <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {[
                { title: "El motor: simple vs doble", text: "El doble es más rápido (3.8 vs 2.5 cm/s), más silencioso y más estable al moverse. Si cambias de posición 4+ veces al día con un setup pesado, merece la pena. Si lo mueves dos veces al día con un portatil, el simple cumple." },
                { title: "Estabilidad: importa más de lo que crees", text: "De pie, el escritorio esta a 110-120 cm y cualquier vibración se amplifica. Si la pantalla tiembla al teclear, te cansas la vista. Busca patas con tres secciones telescópicas y estructura pesada. el marco Flexispot es el mejor del catalogo en este apartado; en los baratos hay que aceptar algo de movimiento." },
                { title: "Ruido: ojo si haces videollamadas", text: "Baratos: 50-52 dB (se oye). Premium: 43-45 dB (casi no se nota). Si cambias de altura durante una llamada, con 50 dB la otra persona lo percibe. Con 43, no." },
                { title: "Rango de altura: ojo si mides más de 1.85 m", text: "Baratos: 72-118 cm. Premium: 58-125 cm. Si mides más de 1.85 m y el escritorio llega solo a 118 cm, vas a trabajar encorvado. El E7 llega a 123 cm y el Maidesite T2 Pro a 127 cm." },
                { title: "Garantía y postventa", text: "Flexispot y Maidesite dan 5 años; marcas baratas, 2. Los problemas graves suelen aparecer en los primeros 6 meses. Si puedes elegir, 5 años siempre \u2014 tiene electronica y partes moviles." },
                { title: "Anticolision: no te la juegues", text: "Para el motor si detecta un obstaculo al bajar. Sin anticolision, el motor sigue y puede romper cajones o el propio mecanismo. Lo encuentras ya en la gama de entrada (ErGear), así que no merece la pena ahorrar y quedarse sin el." },
              ].map((item, i) => (
                <FadeIn key={item.title} delay={i * 80}>
                  <div className="relative pl-14">
                    <span className="absolute left-0 top-0 editorial-number text-3xl" style={{ opacity: 0.15 }}>
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
          <section className="mt-12 max-w-3xl p-6 rounded" style={{ background: 'var(--color-secondary-light)', borderLeft: '3px solid var(--color-secondary)' }}>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Guias relacionadas
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <Link href="/escritorio-elevable-barato" className="underline" style={{ color: 'var(--accent)' }}>Mejores escritorios elevables baratos</Link> &mdash; Si vas a la gama de entrada, esta guía entra más al detalle.
              </p>
              <p>
                <Link href="/flexispot-e7-opiniones" className="underline" style={{ color: 'var(--accent)' }}>Flexispot E7: opinion y review completa</Link> &mdash; Análisis a fondo del E7 con opiniones reales de compradores.
              </p>
              <p>
                <Link href="/flexispot-vs-maidesite" className="underline" style={{ color: 'var(--accent)' }}>Flexispot vs Maidesite: comparativa</Link> &mdash; Las dos marcas más vendidas cara a cara. Cual merece la pena?
              </p>
            </div>
          </section>
        </FadeIn>

        {/* FAQ */}
        <section className="mt-16 mb-8 max-w-3xl">
          <FadeIn>
            <div className="p-8 rounded noise-bg" style={{ background: 'var(--bg-secondary)' }}>
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
