import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { AffiliateButton } from "@/components/AffiliateButton";
import { CompactRatings } from "@/components/CompactRatings";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Flexispot vs Maidesite 2026 — Cual es mejor?",
  description:
    "Comparativa Flexispot vs Maidesite: analizamos el E7 vs T2 Pro Plus y EG1 vs S2 Pro. Motor, estabilidad, precio y cual merece la pena en 2026.",
};


export default function FlexispotVsMaidesitePage() {
  const e7 = getProductBySlug("flexispot-e7");
  const t2 = getProductBySlug("maidesite-t2-pro");
  const eg1 = getProductBySlug("flexispot-eg1");
  const s2 = getProductBySlug("maidesite-s2-pro");

  if (!e7 || !t2) return <p>Productos no encontrados</p>;

  const [e7Asin, e7Product] = e7;
  const [t2Asin, t2Product] = t2;

  const comparisons = [
    { label: "Precio", e7: `${e7Product.precio}€`, t2: `${t2Product.precio}€`, winner: "t2" as const },
    { label: "Motor", e7: "Doble", t2: "Doble", winner: "tie" as const },
    { label: "Rango altura", e7: `${e7Product.specs.rango_altura_min_cm}–${e7Product.specs.rango_altura_max_cm} cm`, t2: `${t2Product.specs.rango_altura_min_cm}–${t2Product.specs.rango_altura_max_cm} cm`, winner: "t2" as const },
    { label: "Carga maxima", e7: `${e7Product.specs.peso_max_carga_kg} kg`, t2: `${t2Product.specs.peso_max_carga_kg} kg`, winner: "e7" as const },
    { label: "Velocidad", e7: `${e7Product.specs.velocidad_cm_s} cm/s`, t2: `${t2Product.specs.velocidad_cm_s} cm/s`, winner: "tie" as const },
    { label: "Ruido", e7: `${e7Product.specs.ruido_db} dB`, t2: `${t2Product.specs.ruido_db} dB`, winner: "e7" as const },
    { label: "Tablero", e7: `${e7Product.specs.ancho_tablero_cm}x${e7Product.specs.profundidad_tablero_cm} cm`, t2: `${t2Product.specs.ancho_tablero_cm}x${t2Product.specs.profundidad_tablero_cm} cm`, winner: "tie" as const },
    { label: "Memorias", e7: `${e7Product.specs.presets_memoria}`, t2: `${t2Product.specs.presets_memoria}`, winner: "tie" as const },
    { label: "Garantia", e7: `${e7Product.specs.garantia_anos} anos`, t2: `${t2Product.specs.garantia_anos} anos`, winner: "tie" as const },
    { label: "Nota total", e7: `${e7Product.puntuacion.total}/10`, t2: `${t2Product.puntuacion.total}/10`, winner: "e7" as const },
    { label: "Opiniones Amazon", e7: `${e7Product.rating}★ (${e7Product.num_reviews})`, t2: `${t2Product.rating}★ (${t2Product.num_reviews})`, winner: "e7" as const },
  ];

  const faqItems = [
    {
      q: "Flexispot o Maidesite: cual es mejor marca?",
      a: "Flexispot lleva mas anos, tiene mas modelos y fabrica sus propios motores. Maidesite ofrece prestaciones similares a precios mas bajos. Ambas dan 5 anos de garantia y postventa en Espana. Como marca, Flexispot tiene mas recorrido. Producto a producto, Maidesite compite bien.",
    },
    {
      q: "Los motores de Flexispot y Maidesite son iguales?",
      a: "No. Flexispot fabrica los suyos (LoctekMotion); Maidesite compra a terceros de buena calidad. En specs rinden igual (3.8 cm/s, ruido parecido). Los Flexispot tienen algo mejor historial en reviews de 2-3 anos, pero ambos aguantan 10.000+ ciclos.",
    },
    {
      q: "Puedo usar un tablero diferente con estas marcas?",
      a: "Si, las dos venden la estructura sola. Flexispot acepta tableros de 120-200 cm; Maidesite, de 120-180 cm. Minimo 2 cm de grosor para que los tornillos agarren.",
    },
    {
      q: "Cual tiene mejor servicio postventa en Espana?",
      a: "Flexispot: respuesta en 24-48h, envian recambio sin esperar devolucion. Maidesite: 48-72h segun compradores. Ambas gestionan garantias bien, pero Flexispot es mas agil.",
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
      { "@type": "ListItem", position: 2, name: "Flexispot vs Maidesite", item: "https://elevable.es/flexispot-vs-maidesite" },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Inicio</Link>
        {" "}&gt;{" "}Flexispot vs Maidesite
      </nav>

      <FadeIn>
        <h1 className="text-3xl md:text-5xl heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
          <span style={{ color: 'var(--accent)' }}>Flexispot</span> vs Maidesite
        </h1>
        <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          Actualizado: marzo 2026 · Las dos marcas mas vendidas en Amazon Espana
        </p>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          Este articulo contiene enlaces de afiliado.
        </p>
      </FadeIn>

      {/* Editorial intro */}
      <FadeIn delay={100}>
        <div className="mt-8 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <p>
            Las dos marcas que mas se venden en Amazon Espana. La pregunta de siempre: ¿cual compro? Respuesta corta: Flexispot gana en calidad, Maidesite gana en precio. Aqui van los datos.
          </p>
        </div>
      </FadeIn>

      {/* TL;DR */}
      <FadeIn delay={200}>
        <div className="mt-8 p-6 rounded-lg noise-bg" style={{ background: 'linear-gradient(135deg, var(--accent-light), rgba(196, 122, 58, 0.03))', border: '2px solid var(--accent)' }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>TL;DR</p>
          <p className="mt-2 text-base leading-relaxed" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)' }}>
            Flexispot gana en calidad y estabilidad. Maidesite gana en precio. Si puedes gastar 480€, el E7 es mejor escritorio.
            Si quieres doble motor por menos de 300€, el Maidesite T2 Pro Plus es imbatible.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <AffiliateButton asin={e7Asin} text={`Flexispot E7 — ${e7Product.precio}€`} size="md" />
            <AffiliateButton asin={t2Asin} text={`Maidesite T2 Pro — ${t2Product.precio}€`} size="md" />
          </div>
        </div>
      </FadeIn>

      {/* Head to head: E7 vs T2 Pro */}
      <FadeIn>
        <section className="mt-12">
          <h2 className="text-2xl mb-6 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
            Duelo premium: E7 vs T2 Pro Plus
          </h2>

          <div className="max-w-3xl mb-8 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              Los dos modelos premium mas vendidos de cada marca. Specs parecidas sobre el papel. La diferencia: 210 EUR y los detalles.
            </p>
          </div>

          {/* Product cards side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[[e7Asin, e7Product] as const, [t2Asin, t2Product] as const].map(([productAsin, product], i) => (
              <FadeIn key={productAsin} delay={i * 120}>
                <div className="p-6 rounded-lg product-card-hover" style={{ background: 'var(--bg-card)', border: i === 0 ? '2px solid var(--accent)' : '1px solid var(--border)' }}>
                  {i === 0 && <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Recomendado</span>}
                  {i === 1 && <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Mejor precio</span>}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center product-image-container">
                      <Image src={product.imagen} alt={product.imagen_alt} width={80} height={80} className="object-contain" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{product.marca} {product.modelo}</h3>
                      <p className="mono text-xl font-bold mt-1">{product.precio}€</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}★ · {product.num_reviews} opiniones</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <AffiliateButton asin={productAsin} size="lg" />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Spec comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'var(--bg-dark)', color: 'var(--text-inverse)' }}>
                  <th className="text-left p-3 rounded-tl" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Especificacion</th>
                  <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Flexispot E7</th>
                  <th className="text-center p-3 rounded-tr" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Maidesite T2 Pro+</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row.label} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="p-3 font-medium">{row.label}</td>
                    <td className={`p-3 text-center mono ${row.winner === 'e7' ? 'font-bold' : ''}`}
                      style={row.winner === 'e7' ? { color: 'var(--pro)' } : {}}>
                      {row.e7} {row.winner === 'e7' && '✓'}
                    </td>
                    <td className={`p-3 text-center mono ${row.winner === 't2' ? 'font-bold' : ''}`}
                      style={row.winner === 't2' ? { color: 'var(--pro)' } : {}}>
                      {row.t2} {row.winner === 't2' && '✓'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </FadeIn>

      {/* Analysis by criteria */}
      <section className="mt-12 max-w-3xl space-y-8">
        <FadeIn>
          <h2 className="text-2xl mb-2 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
            Analisis por criterio
          </h2>
        </FadeIn>

        {[
          { title: "Motor y velocidad", text: "Misma velocidad: 3.8 cm/s. La diferencia: Flexispot fabrica sus propios motores (LoctekMotion). Maidesite compra a terceros de buena calidad. En el dia a dia no se nota. A largo plazo, los Flexispot podrian envejecer algo mejor, pero no tengo datos para afirmarlo." },
          { title: "Estabilidad", text: "Gana el E7. Tres secciones telescopicas y 32 kg frente a dos secciones y 27 kg del T2 Pro. A maxima altura, el E7 apenas se mueve; el T2 Pro tiene algo de juego lateral. Si tecleas suave no lo notas. Si tecleas con fuerza, si." },
          { title: "Ruido", text: "45 dB vs 48 dB. En una habitacion normal, no se nota la diferencia. Ambos son silenciosos para videollamadas. Solo importa si grabas audio profesional." },
          { title: "Capacidad de carga", text: "125 kg vs 100 kg. Un setup normal pesa 12-15 kg. Los 100 kg del Maidesite dan margen de sobra para el 95% de usuarios. Solo importa si tienes equipo pesado encima." },
          { title: "Rango de altura", text: "E7: 58-123 cm. T2 Pro: 62-127 cm. Si mides mas de 1.88 m, Maidesite llega mas arriba. Si mides menos de 1.70 m o usas silla gaming baja, Flexispot baja mas." },
          { title: "Precio (el elefante en la habitacion)", text: "480 vs 270 EUR. Mi respuesta honesta: para la mayoria, el T2 Pro Plus hace el 90% por poco mas de la mitad del precio. Pero si trabajas 8 horas, eres sensible a la vibracion y quieres algo para 7-8 anos, los 210 EUR extra se reparten en mucho tiempo de uso." },
        ].map((section, si) => (
          <FadeIn key={section.title} delay={si * 60}>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{section.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {section.text}
              </p>
            </div>
          </FadeIn>
        ))}
      </section>

      <div className="divider my-10" />

      {/* Rating comparison */}
      <FadeIn>
        <section>
          <h2 className="text-2xl mb-6 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
            Puntuaciones comparadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--accent)' }}>Flexispot E7</h3>
              <CompactRatings puntuacion={e7Product.puntuacion} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Maidesite T2 Pro Plus</h3>
              <CompactRatings puntuacion={t2Product.puntuacion} />
            </div>
          </div>
        </section>
      </FadeIn>

      <div className="divider my-10" />

      {/* Entry level comparison */}
      {eg1 && s2 && (
        <FadeIn>
          <section>
            <h2 className="text-2xl mb-4 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
              Duelo economico: EG1 vs S2 Pro
            </h2>
            <div className="max-w-3xl mb-6 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>
                Modelos de entrada por unos 200 EUR. Motor simple, 5 anos de garantia. EG1 tiene mas reviews y mejor nota. S2 Pro tiene mas carga (80 vs 70 kg) y una memoria extra. Setup normal: EG1. Setup pesado: S2 Pro.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[[eg1[0], eg1[1]] as const, [s2[0], s2[1]] as const].map(([productAsin, product], i) => (
                <FadeIn key={productAsin} delay={i * 100}>
                  <div className="p-5 rounded-lg product-card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-[120px] h-[120px] rounded-lg overflow-hidden flex items-center justify-center product-image-container">
                        <Image src={product.imagen} alt={product.imagen_alt} width={120} height={120} className="object-contain p-1" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.marca} {product.modelo}</h3>
                        <p className="mono text-lg font-bold">{product.precio}€</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}★ · {product.puntuacion.total}/10</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      <div className="p-2 rounded" style={{ background: 'var(--bg-secondary)' }}>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Carga</p>
                        <p className="mono text-sm font-bold">{product.specs.peso_max_carga_kg} kg</p>
                      </div>
                      <div className="p-2 rounded" style={{ background: 'var(--bg-secondary)' }}>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Garantia</p>
                        <p className="mono text-sm font-bold">{product.specs.garantia_anos} anos</p>
                      </div>
                      <div className="p-2 rounded" style={{ background: 'var(--bg-secondary)' }}>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Memorias</p>
                        <p className="mono text-sm font-bold">{product.specs.presets_memoria}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <AffiliateButton asin={productAsin} showPrice={product.precio} size="lg" />
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      <div className="divider my-10" />

      {/* Verdict */}
      <FadeIn>
        <section className="max-w-3xl">
          <h2 className="text-2xl mb-4 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
            Veredicto: cual comprar
          </h2>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              <strong style={{ color: 'var(--text-primary)' }}>480 EUR:</strong> Flexispot E7. La mejor estabilidad, motor propio, historial solido. Es el que yo tengo.
            </p>
            <p>
              <strong style={{ color: 'var(--text-primary)' }}>250-300 EUR:</strong> Maidesite T2 Pro Plus. El 90% de la experiencia del E7 por 210 EUR menos. La compra inteligente para la mayoria.
            </p>
            <p>
              <strong style={{ color: 'var(--text-primary)' }}>~200 EUR:</strong> EG1 o S2 Pro, muy parecidos. EG1 por marca y reviews, S2 Pro si quieres mas carga. Cualquiera es buena compra.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <AffiliateButton asin={e7Asin} text={`Flexispot E7 — ${e7Product.precio}€`} size="lg" />
            <AffiliateButton asin={t2Asin} text={`Maidesite T2 — ${t2Product.precio}€`} size="lg" />
          </div>
        </section>
      </FadeIn>

      {/* Internal links */}
      <FadeIn>
        <section className="mt-10 max-w-3xl p-6 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Otras guias
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <Link href="/flexispot-e7-opiniones" className="underline" style={{ color: 'var(--accent)' }}>Flexispot E7: review completa</Link> — Analisis a fondo del E7 con todo lo bueno y lo malo.
            </p>
            <p>
              <Link href="/mejor-escritorio-elevable" className="underline" style={{ color: 'var(--accent)' }}>Los 12 mejores escritorios elevables de 2026</Link> — Comparativa completa con todas las marcas.
            </p>
            <p>
              <Link href="/escritorio-elevable-barato" className="underline" style={{ color: 'var(--accent)' }}>Escritorios elevables baratos</Link> — Opciones por debajo de 220 euros analizadas a fondo.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* FAQ */}
      <section className="mt-12 max-w-3xl">
        <FadeIn>
          <div className="p-8 rounded-lg noise-bg" style={{ background: 'var(--bg-secondary)' }}>
            <h2 className="text-2xl mb-2 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
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
  );
}
