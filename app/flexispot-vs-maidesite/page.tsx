import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { AffiliateButton } from "@/components/AffiliateButton";
import { RatingBar } from "@/components/RatingBar";

export const metadata: Metadata = {
  title: "Flexispot vs Maidesite 2026 — Cual es mejor?",
  description:
    "Comparativa Flexispot vs Maidesite: analizamos el E7 vs T2 Pro Plus y EG1 vs S2 Pro. Motor, estabilidad, precio y cual merece la pena en 2026.",
};

const RATING_LABELS: Record<string, string> = {
  calidad_construccion: "Calidad",
  estabilidad: "Estabilidad",
  facilidad_montaje: "Montaje",
  relacion_calidad_precio: "Calidad-precio",
  funcionalidades: "Funciones",
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
      { "@type": "ListItem", position: 2, name: "Flexispot vs Maidesite", item: "https://elevable.es/flexispot-vs-maidesite" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Flexispot o Maidesite: cual es mejor marca?",
        acceptedAnswer: { "@type": "Answer", text: "Flexispot tiene mejor reputacion global, mas opciones y mas opiniones. Maidesite ofrece mejor precio por las mismas prestaciones. Ambas marcas tienen buena garantia (5 anos) y servicio post-venta en Espana." },
      },
      {
        "@type": "Question",
        name: "Los motores de Flexispot y Maidesite son iguales?",
        acceptedAnswer: { "@type": "Answer", text: "No exactamente. Flexispot usa motores LoctekMotion (su propia subsidiaria). Maidesite usa motores de terceros de calidad similar. En la practica, las diferencias son minimas: misma velocidad (3.8 cm/s) y ruido parecido." },
      },
      {
        "@type": "Question",
        name: "Puedo usar un tablero diferente con estas marcas?",
        acceptedAnswer: { "@type": "Answer", text: "Si. Ambas marcas venden tambien la estructura sola (sin tablero). Si tienes un tablero de IKEA o de madera maciza, puedes montarlo encima. Asegurate de que el ancho sea compatible con la estructura." },
      },
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

      <h1 className="text-3xl md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
        <span style={{ color: 'var(--accent)' }}>Flexispot</span> vs Maidesite
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        Actualizado: marzo 2026 · Las dos marcas mas vendidas en Amazon Espana
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        Este articulo contiene enlaces de afiliado.
      </p>

      {/* TL;DR */}
      <div className="mt-8 p-6 rounded" style={{ background: 'var(--bg-dark)', color: 'var(--text-inverse)' }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>TL;DR</p>
        <p className="mt-2 text-base leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>
          Flexispot gana en calidad y estabilidad. Maidesite gana en precio. Si puedes gastar 480€, el E7 es mejor escritorio.
          Si quieres doble motor por menos de 300€, el Maidesite T2 Pro Plus es imbatible.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <AffiliateButton asin={e7Asin} text={`Flexispot E7 — ${e7Product.precio}€`} size="md" />
          <AffiliateButton asin={t2Asin} text={`Maidesite T2 Pro — ${t2Product.precio}€`} size="md" />
        </div>
      </div>

      {/* Head to head: E7 vs T2 Pro */}
      <section className="mt-12">
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Duelo premium: E7 vs T2 Pro Plus
        </h2>

        {/* Product cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[[e7Asin, e7Product] as const, [t2Asin, t2Product] as const].map(([asin, product], i) => (
            <div key={asin} className="p-6 rounded" style={{ background: 'var(--bg-card)', border: i === 0 ? '2px solid var(--accent)' : '1px solid var(--border)' }}>
              {i === 0 && <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Recomendado</span>}
              {i === 1 && <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Mejor precio</span>}
              <div className="flex items-center gap-4 mt-2">
                <div className="w-20 h-20 rounded overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                  <Image src={product.imagen} alt={product.imagen_alt} width={80} height={80} className="object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{product.marca} {product.modelo}</h3>
                  <p className="mono text-xl font-bold mt-1">{product.precio}€</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}★ · {product.num_reviews} opiniones</p>
                </div>
              </div>
              <div className="mt-4">
                <AffiliateButton asin={asin} size="lg" />
              </div>
            </div>
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

      <div className="divider my-10" />

      {/* Rating comparison */}
      <section>
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Puntuaciones comparadas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--accent)' }}>Flexispot E7</h3>
            <div className="space-y-2">
              {Object.entries(e7Product.puntuacion).filter(([k]) => k !== 'total').map(([key, value]) => (
                <RatingBar key={key} label={RATING_LABELS[key] || key} value={value as number} />
              ))}
              <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <RatingBar label="TOTAL" value={e7Product.puntuacion.total} />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Maidesite T2 Pro Plus</h3>
            <div className="space-y-2">
              {Object.entries(t2Product.puntuacion).filter(([k]) => k !== 'total').map(([key, value]) => (
                <RatingBar key={key} label={RATING_LABELS[key] || key} value={value as number} />
              ))}
              <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <RatingBar label="TOTAL" value={t2Product.puntuacion.total} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider my-10" />

      {/* Entry level comparison */}
      {eg1 && s2 && (
        <section>
          <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Duelo economico: EG1 vs S2 Pro
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Si tu presupuesto es de 200-250€, estas son las opciones de entrada de cada marca.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[[eg1[0], eg1[1]] as const, [s2[0], s2[1]] as const].map(([asin, product]) => (
              <div key={asin} className="p-5 rounded" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                    <Image src={product.imagen} alt={product.imagen_alt} width={64} height={64} className="object-contain" />
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
                  <AffiliateButton asin={asin} showPrice={product.precio} size="lg" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="divider my-10" />

      {/* Verdict */}
      <section className="max-w-3xl">
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Veredicto: cual comprar?
        </h2>
        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>Compra el Flexispot E7 si:</strong> tu presupuesto llega a 480€,
            necesitas maxima estabilidad (setup pesado, multiples monitores), o quieres un escritorio que dure 5+ anos sin problemas.
            Es el mejor escritorio elevable que se puede comprar en Amazon Espana.
          </p>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>Compra el Maidesite T2 Pro Plus si:</strong> quieres doble motor
            por menos de 300€. Es el mejor ratio prestaciones/precio del mercado. Para un setup estandar (monitor + portatil),
            cumple perfectamente.
          </p>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>Para presupuesto ajustado (~200€):</strong> el Flexispot EG1 tiene
            mejor garantia (5 anos) y mas opiniones. El Maidesite S2 Pro tiene mas carga (80 kg vs 70 kg). Ambos son buenas opciones.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <AffiliateButton asin={e7Asin} text={`Flexispot E7 — ${e7Product.precio}€`} size="lg" />
          <AffiliateButton asin={t2Asin} text={`Maidesite T2 — ${t2Product.precio}€`} size="lg" />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Preguntas frecuentes
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "Flexispot o Maidesite: cual es mejor marca?",
              a: "Flexispot tiene mejor reputacion global, mas opciones y mas opiniones. Maidesite ofrece mejor precio por las mismas prestaciones. Ambas marcas tienen buena garantia (5 anos) y servicio post-venta en Espana.",
            },
            {
              q: "Los motores de Flexispot y Maidesite son iguales?",
              a: "No exactamente. Flexispot usa motores LoctekMotion (su propia subsidiaria). Maidesite usa motores de terceros de calidad similar. En la practica, las diferencias son minimas: misma velocidad (3.8 cm/s) y ruido parecido.",
            },
            {
              q: "Puedo usar un tablero diferente con estas marcas?",
              a: "Si. Ambas marcas venden tambien la estructura sola (sin tablero). Si tienes un tablero de IKEA o de madera maciza, puedes montarlo encima. Asegurate de que el ancho sea compatible con la estructura.",
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
