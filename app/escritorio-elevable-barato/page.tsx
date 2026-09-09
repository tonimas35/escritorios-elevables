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
  title: "Mejores escritorios elevables baratos 2026",
  description:
    "Los 6 mejores escritorios elevables baratos en Amazon. Comparativa actualizada de la gama de entrada. Analizamos calidad, motor, estabilidad y garantía.",
  alternates: { canonical: "/escritorio-elevable-barato" },
};


export default function EscritorioBaratoPage() {
  const cheapProducts = getAllProducts()
    .filter(([, p]) => p.disponible && p.precio < 220)
    .sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total);

  const winner = cheapProducts[0];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
      { "@type": "ListItem", position: 2, name: "Escritorios Elevables Baratos", item: "https://elevable.es/escritorio-elevable-barato" },
    ],
  };

  const faqItems = [
    {
      q: "Cual es el escritorio elevable más barato que merece la pena?",
      a: `El ${winner?.[1].marca} ${winner?.[1].modelo}. Tiene anticolisión, 4 memorias y 5 años de garantía, cosas que no suelen venir juntas en la gama de entrada. Si buscas algo aún más contenido, el Fezibo cumple para un setup básico.`,
    },
    {
      q: "Motor simple o doble para un escritorio barato?",
      a: "En la gama de entrada, casi todos llevan motor simple. Es más lento (20 seg el recorrido completo vs 12 del doble), pero para un setup normal de portatil y monitor va de sobra. Si quieres doble motor sin salirte de lo barato, el marco Flexispot es la opcion, aunque tendras que sumarle un tablero.",
    },
    {
      q: "Cuanto dura un escritorio elevable barato?",
      a: "Entre 3 y 7 años con uso normal (2-4 cambios al día). Los motores aguantan unos 10.000 ciclos. Los problemas que se ven en Amazon son casi siempre del controlador electronico, no del motor, y un reinicio suele arreglarlo.",
    },
    {
      q: "Necesito herramientas especiales para montarlo?",
      a: "No, todos incluyen llaves Allen y tornillos. Montaje en 20-45 minutos. Los ligeros (Fezibo, Devoko) se montan solo; el VASAGLE (24 kg) mejor entre dos. Un destornillador eléctrico ayuda pero no es obligatorio.",
    },
    {
      q: "Que sacrifico por comprar un escritorio elevable barato?",
      a: "Velocidad del motor (2.5 vs 3.8 cm/s), estabilidad a máxima altura (algo de vibración al escribir de pie) y acabado del tablero (melamina básica). También menos rango de altura (72-118 cm vs 58-125 cm), un problema si mides más de 1.85 m.",
    },
    {
      q: "Anticolision: es necesario en un escritorio barato?",
      a: "Si. Para el motor si detecta un obstaculo (cajon, silla, rodilla). Sin anticolision, el motor sigue y puede romper cosas. Lo encuentras ya en la gama de entrada (ErGear), así que no merece la pena quedarse sin él por ahorrar un poco.",
    },
  ];

  const cheapSchemas = cheapProducts.map(([a, p]) =>
    productSchema(a, p, "/escritorio-elevable-barato")
  );

  const listSchema = itemListSchema(
    "Mejores escritorios elevables baratos",
    cheapProducts,
    "/escritorio-elevable-barato"
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const ratingBg = (score: number) =>
    score >= 8.5
      ? "var(--color-secondary)"
      : score >= 7
        ? "var(--rating-okay)"
        : "var(--rating-bad)";

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
      {cheapSchemas.map((sch, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sch) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Inicio</Link>
        {" "}&gt;{" "}Escritorios elevables baratos
      </nav>

      <FadeIn>
        <div className="editorial-rule mb-6" />
        <p className="editorial-mark mb-3" style={{ color: 'var(--color-secondary)' }}>
          Guia de compra &middot; Marzo 2026
        </p>
        <h1 className="text-3xl md:text-5xl heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
          Mejores escritorios elevables <span style={{ color: 'var(--accent)' }}>baratos</span> 2026
        </h1>
        <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          Actualizado: septiembre de 2026 &middot; {cheapProducts.length} modelos analizados de la gama de entrada
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
            No necesitas irte a la gama alta. Si tu setup es portátil + monitor + teclado, la gama de entrada te vale. Mi recomendación rápida: el <strong>marco Flexispot</strong> si quieres lo mejor de esta franja, el <strong>ErGear de 120x60</strong> si buscas anticolisión, y el <strong>Fezibo</strong> para probar con lo mínimo.
          </p>
        </div>
      </FadeIn>

      {/* Winner callout */}
      {winner && (
        <FadeIn delay={200}>
          <div className="mt-8 p-6 rounded noise-bg" style={{ background: 'linear-gradient(135deg, var(--color-secondary-light), white)', borderLeft: '3px solid var(--accent)' }}>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-[140px] h-[140px] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center product-image-container">
                <Image src={winner[1].imagen} alt={winner[1].imagen_alt} width={140} height={140} className="object-contain p-1" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary)' }}>Ganador calidad-precio</p>
                <h2 className="text-xl font-semibold mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                  {winner[1].nombre}
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{winner[1].veredicto}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="mono text-2xl font-bold">{winner[1].puntuacion.total}</span>
                  <span className="mono font-bold px-2 py-0.5 rounded text-sm text-white" style={{ background: ratingBg(winner[1].puntuacion.total) }}>
                    {winner[1].puntuacion.total}/10
                  </span>
                  <AffiliateButton asin={winner[0]} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Quick comparison table */}
      <FadeIn delay={150}>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: 'var(--color-secondary)', color: 'white' }}>
                <th className="text-left p-3 rounded-tl" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>#</th>
                <th className="text-left p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Modelo</th>
                <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Tablero</th>
                <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Carga</th>
                <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Anticolision</th>
                <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Nota</th>
                <th className="text-center p-3 rounded-tr" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}></th>
              </tr>
            </thead>
            <tbody>
              {cheapProducts.map(([asin, product], i) => (
                <tr key={asin} className="transition-colors hover:bg-[var(--accent-light)]" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="p-3">
                    <span className="mono text-xs font-bold" style={{ color: 'var(--color-secondary)' }}>{String(i + 1).padStart(2, '0')}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-[80px] h-[80px] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center product-image-container">
                        <Image src={product.imagen} alt={product.imagen_alt} width={80} height={80} className="object-contain p-1" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{product.marca} {product.modelo}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}★ ({reviewsAprox(product.num_reviews)})</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center mono text-sm">{product.specs.ancho_tablero_cm}x{product.specs.profundidad_tablero_cm}</td>
                  <td className="p-3 text-center mono text-sm">{product.specs.peso_max_carga_kg} kg</td>
                  <td className="p-3 text-center text-sm" style={{ color: product.specs.sistema_anticolision ? 'var(--rating-good)' : 'var(--rating-bad)' }}>{product.specs.sistema_anticolision ? '✓' : '✗'}</td>
                  <td className="p-3 text-center mono font-bold" style={{ color: ratingBg(product.puntuacion.total) }}>{product.puntuacion.total}</td>
                  <td className="p-3 text-center">
                    <AffiliateButton asin={asin} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>

      {/* How to choose section */}
      <FadeIn>
        <div className="mt-12 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          <h2 className="text-2xl mb-4 heading-accent" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Como elegir un escritorio elevable barato (sin arrepentirte)
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              En esta franja, casi todos llevan motor simple: más lento y algo más ruidoso. Acepta eso de entrada. Lo que si deberias exigir: <strong>memorias de altura</strong> (si no, al cuarto día dejas de usarlo), <strong>tablero de al menos 120 cm</strong> si usas monitor externo, y <strong>anticolision</strong> para que el motor pare si hay algo debajo.
            </p>
            <p>
              La garantía importa mucho. Los problemas con motores baratos aparecen entre el mes 8 y el 18. Con 5 años de cobertura, te despreocupas. Con 2, cada ruido raro te pone nervioso.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* What you sacrifice section */}
      <FadeIn>
        <div className="mt-8 max-w-3xl p-6 rounded-lg noise-bg" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Que sacrificas por el precio (hablando claro)
          </h3>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              Motor simple va sobrado para un setup normal. Lo que notas es la estabilidad a máxima altura: si mides 1.85 m, hay algo de vibración lateral al escribir de pie. No dramatica, pero perceptible.
            </p>
            <p>
              El tablero de melamina se siente menos solido que bambu. Una alfombrilla de escritorio lo soluciona. El ruido (50 dB vs 43 dB en premium) se nota en una habitacion en silencio, pero solo dura 10-20 segundos cada vez que cambias de altura.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Detailed analysis of each product */}
      <div className="mt-12 space-y-16">
        {cheapProducts.map(([asin, product], i) => {
          const editorial = "";
          const imageRight = i % 2 === 1;

          return (
          <FadeIn key={asin} delay={i * 60}>
            <section id={product.slug}>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="mono text-sm font-bold" style={{ color: 'var(--color-secondary)' }}>#{String(i + 1).padStart(2, '0')}</span>
                <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
                  {product.nombre}
                </h2>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{product.veredicto}</p>

              <div className={`mt-4 flex flex-col gap-6 ${imageRight ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 product-image-container">
                  <Image src={product.imagen} alt={product.imagen_alt} width={180} height={180} className="object-contain p-2" />
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[
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

              {/* Editorial analysis */}
              {editorial && (
                <div className="mt-5 max-w-3xl">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {editorial}
                  </p>
                </div>
              )}

              <div className="mt-4 max-w-md">
                <CompactRatings puntuacion={product.puntuacion} />
              </div>

              <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <strong>Ideal para:</strong> {product.ideal_para}
              </p>

              <div className="mt-4">
                <AffiliateButton asin={asin} showPrice={product.precio} size="lg" />
              </div>
            </section>
          </FadeIn>
          );
        })}
      </div>

      {/* Price tiers guide */}
      <FadeIn>
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl mb-4 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
            ¿Qué deberías exigir en cada escalón?
          </h2>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              <strong style={{ color: 'var(--text-primary)' }}>Para probar:</strong> motor simple, tableros de 100 cm, casi ninguno con anticolisión. Con solo un portátil encima va bien.
            </p>
            <p>
              <strong style={{ color: 'var(--text-primary)' }}>El punto dulce:</strong> anticolisión, tableros de 120-140 cm y garantías de 3 a 5 años. Para teletrabajo estándar, cualquiera de estos cumple.
            </p>
            <p>
              <strong style={{ color: 'var(--text-primary)' }}>Lo mejor de la franja:</strong> el marco Flexispot, con cinco años de garantía en la estructura. Y si necesitas más carga, el <Link href="/flexispot-vs-maidesite" className="underline" style={{ color: 'var(--accent)' }}>MAIDeSITe T2 Pro MAX</Link> sube a otra liga.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* Internal links */}
      <FadeIn>
        <section className="mt-10 max-w-3xl p-6 rounded" style={{ background: 'var(--color-secondary-light)', borderLeft: '3px solid var(--color-secondary)' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Otras guias que te pueden interesar
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <Link href="/mejor-escritorio-elevable" className="underline" style={{ color: 'var(--accent)' }}>Los 12 mejores escritorios elevables de 2026</Link> — Incluye modelos premium si decides subir de presupuesto.
            </p>
            <p>
              <Link href="/flexispot-e7-opiniones" className="underline" style={{ color: 'var(--accent)' }}>Flexispot E7: opinion y review</Link> — El rey de los escritorios elevables, analizado a fondo.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* FAQ for SEO */}
      <section className="mt-16 max-w-3xl">
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
