import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getAllProducts } from "@/lib/products";
import { AffiliateButton } from "@/components/AffiliateButton";
import { ProsConsBox } from "@/components/ProsConsBox";
import { RatingBar } from "@/components/RatingBar";

export const metadata: Metadata = {
  title: "Flexispot E7 opiniones y review 2026 — Merece la pena?",
  description:
    "Review completa del Flexispot E7: el escritorio elevable mas vendido. Analizamos motor, estabilidad, montaje y si merece la pena en 2026. Con opiniones reales.",
};

const RATING_LABELS: Record<string, string> = {
  calidad_construccion: "Calidad de construccion",
  estabilidad: "Estabilidad",
  facilidad_montaje: "Facilidad de montaje",
  relacion_calidad_precio: "Relacion calidad-precio",
  funcionalidades: "Funcionalidades",
};

export default function FlexispotE7ReviewPage() {
  const result = getProductBySlug("flexispot-e7");
  if (!result) return <p>Producto no encontrado</p>;
  const [asin, product] = result;

  // Get alternatives for comparison
  const alternatives = getAllProducts()
    .filter(([, p]) => p.slug !== "flexispot-e7" && p.disponible)
    .sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total)
    .slice(0, 3);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
      { "@type": "ListItem", position: 2, name: "Mejores Escritorios", item: "https://elevable.es/mejor-escritorio-elevable" },
      { "@type": "ListItem", position: 3, name: "Flexispot E7 Opiniones", item: "https://elevable.es/flexispot-e7-opiniones" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Merece la pena el Flexispot E7 en 2026?",
        acceptedAnswer: { "@type": "Answer", text: "Si. Sigue siendo el mejor equilibrio entre calidad, estabilidad y precio. Los modelos mas nuevos no han mejorado significativamente la formula del E7." },
      },
      {
        "@type": "Question",
        name: "Flexispot E7 o E7 Pro?",
        acceptedAnswer: { "@type": "Answer", text: "El E7 Pro cuesta 70 EUR mas, tiene tablero de bambu y soporta 150 kg (vs 125 kg). Si tu setup pesa mas de 80 kg o quieres el mejor acabado, el Pro merece la pena. Si no, ahorra con el E7." },
      },
      {
        "@type": "Question",
        name: "Se puede montar solo?",
        acceptedAnswer: { "@type": "Answer", text: "Tecnicamente si, pero es complicado por el peso (32 kg la estructura). Recomendamos montarlo entre dos personas, sobre todo al atornillar el tablero y dar la vuelta." },
      },
      {
        "@type": "Question",
        name: "Cuanto tarda en subir y bajar?",
        acceptedAnswer: { "@type": "Answer", text: "A 3.8 cm/s, el recorrido completo (58 a 123 cm) tarda unos 17 segundos. En uso real, cambiar entre sentado y de pie tarda unos 8-10 segundos." },
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
        {" "}&gt;{" "}
        <Link href="/mejor-escritorio-elevable" className="hover:underline" style={{ color: 'var(--accent)' }}>Mejores escritorios</Link>
        {" "}&gt;{" "}Flexispot E7 opiniones
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product image */}
        <div className="w-full md:w-72 h-72 rounded overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-secondary)' }}>
          <Image src={product.imagen} alt={product.imagen_alt} width={280} height={280} className="object-contain p-4" />
        </div>

        {/* Product info */}
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Review completa</p>
          <h1 className="text-3xl md:text-4xl mt-1" style={{ fontFamily: 'var(--font-display)' }}>
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

      <div className="divider my-10" />

      {/* Specs grid */}
      <section>
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Especificaciones tecnicas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Motor", value: "Doble motor", detail: "LoctekMotion" },
            { label: "Rango de altura", value: `${product.specs.rango_altura_min_cm}–${product.specs.rango_altura_max_cm} cm`, detail: "65 cm de recorrido" },
            { label: "Velocidad", value: `${product.specs.velocidad_cm_s} cm/s`, detail: "De los mas rapidos" },
            { label: "Carga maxima", value: `${product.specs.peso_max_carga_kg} kg`, detail: "Setup completo" },
            { label: "Tablero", value: `${product.specs.ancho_tablero_cm}x${product.specs.profundidad_tablero_cm} cm`, detail: product.specs.material_tablero || '' },
            { label: "Peso estructura", value: `${product.specs.peso_estructura_kg} kg`, detail: "Acero robusto" },
            { label: "Ruido", value: `${product.specs.ruido_db} dB`, detail: "Silencioso" },
            { label: "Garantia", value: `${product.specs.garantia_anos} anos`, detail: "Flexispot oficial" },
            { label: "Presets", value: `${product.specs.presets_memoria} memorias`, detail: "Ajuste rapido" },
            { label: "Anticolision", value: product.specs.sistema_anticolision ? "Si" : "No", detail: "Proteccion activa" },
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

      {/* Detailed review sections */}
      <section className="max-w-3xl space-y-8">
        <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
          Analisis detallado
        </h2>

        <div>
          <h3 className="text-lg font-semibold">Motor y rendimiento</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            El E7 usa doble motor LoctekMotion, el mismo fabricante que suministra a otras marcas premium. La velocidad de
            3.8 cm/s significa que pasar de sentado a de pie tarda unos 17 segundos — lo suficientemente rapido para no
            perder el ritmo de trabajo. El ruido de 45 dB es equivalente a una conversacion en voz baja: no molesta en
            videollamadas.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Estabilidad</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Este es el punto fuerte del E7 y donde se diferencia de los escritorios baratos. A maxima altura (123 cm),
            el movimiento lateral es minimo. El marco en forma de T invertida con 3 secciones telescopicas le da una rigidez
            que los modelos de 2 secciones no consiguen. Para escribir de pie, la estabilidad es fundamental.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Montaje</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            El montaje lleva unos 45-60 minutos. Las instrucciones son claras y viene con todas las herramientas necesarias.
            El punto critico es el peso: la estructura sola pesa 32 kg. Es muy recomendable montarlo entre dos personas,
            especialmente al dar la vuelta al tablero. No es complicado, pero si pesado.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Relacion calidad-precio</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            A 480 EUR (530 EUR sin descuento), el E7 no es barato. Pero comparado con marcas como Fully Jarvis o
            Humanscale que cuestan el doble, ofrece prestaciones equivalentes. Si tu uso es diario y profesional, la
            diferencia de precio con un escritorio barato se amortiza en durabilidad, garantia y estabilidad.
          </p>
        </div>
      </section>

      <div className="divider my-10" />

      {/* Ratings */}
      <section>
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>Puntuacion</h2>
        <div className="max-w-lg space-y-3">
          {Object.entries(product.puntuacion)
            .filter(([key]) => key !== "total")
            .map(([key, value]) => (
              <RatingBar key={key} label={RATING_LABELS[key] || key} value={value as number} />
            ))}
          <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <RatingBar label="TOTAL" value={product.puntuacion.total} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 p-6 rounded text-center" style={{ background: 'var(--accent-light)', border: '2px solid var(--accent)' }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Veredicto</p>
        <p className="text-xl mt-2" style={{ fontFamily: 'var(--font-display)' }}>{product.veredicto}</p>
        <div className="mt-4 inline-block">
          <AffiliateButton asin={asin} showPrice={product.precio} size="lg" />
        </div>
      </div>

      <div className="divider my-10" />

      {/* Alternatives */}
      <section>
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Alternativas al Flexispot E7
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: 'var(--bg-dark)', color: 'var(--text-inverse)' }}>
                <th className="text-left p-3 rounded-tl" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Modelo</th>
                <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Motor</th>
                <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Nota</th>
                <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Precio</th>
                <th className="text-center p-3 rounded-tr" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}></th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: 'var(--accent-light)', borderBottom: '1px solid var(--border)' }}>
                <td className="p-3 font-semibold">Flexispot E7 (este)</td>
                <td className="p-3 text-center">Doble</td>
                <td className="p-3 text-center mono font-bold" style={{ color: 'var(--pro)' }}>{product.puntuacion.total}</td>
                <td className="p-3 text-center mono font-bold">{product.precio}€</td>
                <td className="p-3 text-center"><AffiliateButton asin={asin} size="sm" /></td>
              </tr>
              {alternatives.map(([altAsin, alt]) => (
                <tr key={altAsin} className="hover:bg-[var(--accent-light)]" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="p-3 font-semibold">{alt.marca} {alt.modelo}</td>
                  <td className="p-3 text-center">{alt.specs.tipo_motor === 'doble' ? 'Doble' : 'Simple'}</td>
                  <td className="p-3 text-center mono font-bold">{alt.puntuacion.total}</td>
                  <td className="p-3 text-center mono font-bold">{alt.precio}€</td>
                  <td className="p-3 text-center"><AffiliateButton asin={altAsin} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Preguntas frecuentes sobre el Flexispot E7
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "Merece la pena el Flexispot E7 en 2026?",
              a: "Si. Sigue siendo el mejor equilibrio entre calidad, estabilidad y precio. Los modelos mas nuevos no han mejorado significativamente la formula del E7.",
            },
            {
              q: "Flexispot E7 o E7 Pro?",
              a: "El E7 Pro cuesta 70 EUR mas, tiene tablero de bambu y soporta 150 kg (vs 125 kg). Si tu setup pesa mas de 80 kg o quieres el mejor acabado, el Pro merece la pena. Si no, ahorra con el E7.",
            },
            {
              q: "Se puede montar solo?",
              a: "Tecnicamente si, pero es complicado por el peso (32 kg la estructura). Recomendamos montarlo entre dos personas, sobre todo al atornillar el tablero y dar la vuelta.",
            },
            {
              q: "Cuanto tarda en subir y bajar?",
              a: "A 3.8 cm/s, el recorrido completo (58 a 123 cm) tarda unos 17 segundos. En uso real, cambiar entre sentado y de pie tarda unos 8-10 segundos.",
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
