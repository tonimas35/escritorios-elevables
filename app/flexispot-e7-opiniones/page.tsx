import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getAllProducts } from "@/lib/products";
import { FECHA, FECHA_EN_FRASE } from "@/lib/fecha";
import { AffiliateButton } from "@/components/AffiliateButton";
import { AvisoAfiliado, AvisoAfiliadoTabla } from "@/components/AvisoAfiliado";
import { ProsConsBox } from "@/components/ProsConsBox";
import { CompactRatings } from "@/components/CompactRatings";
import { FadeIn } from "@/components/FadeIn";
import { productSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Flexispot E7 opiniones y review 2026 — Merece la pena?",
  description:
    "Review completa del Flexispot E7: el escritorio elevable más vendido. Analizamos motor, estabilidad, montaje y si merece la pena en 2026. Con opiniones reales.",
  alternates: { canonical: "/flexispot-e7-opiniones" },
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

  const faqItems = [
    {
      q: "Merece la pena el Flexispot E7 en 2026?",
      a: "Si. No ha aparecido nada que lo supere en su combinacion de estabilidad, motor y garantía. Compradores con 3-4 años de uso reportan cero problemas. Es además el modelo con más valoraciones y mejor nota media del catálogo, y el unico junto al FLEXISPOT de 160x80 con cinco años de garantía.",
    },
    {
      q: "El marco Flexispot merece la pena sin tablero?",
      a: "El Pro añade tablero de bambú, 150 kg de carga y un motor un poco más rápido, con el sobrecoste que eso supone. Si tu setup es pesado (dos monitores con brazos) o quieres el mejor acabado, lo justifica. Para monitor + portátil, el E7 normal va sobrado.",
    },
    {
      q: "Se puede montar el Flexispot E7 solo?",
      a: "Se puede, pero no lo recomiendo. 32 kg de estructura y un momento critico al dar la vuelta al tablero. Con otra persona, 45 minutos. Solo, hora y media y alguna palabra mal sonante.",
    },
    {
      q: "Cuanto tarda en subir y bajar el E7?",
      a: "Recorrido completo: 17 segundos. En la práctica, de sentado a de pie son 10-11 segundos. Con las 4 memorias, pulsas un boton y te olvidas.",
    },
    {
      q: "El E7 hace ruido en videollamadas?",
      a: "45 dB. En videollamada con Zoom o Teams, la otra persona no lo nota. Si grabas audio en silencio, el micro lo capta. Para uso normal, no molesta.",
    },
    {
      q: "Que problemas tiene el Flexispot E7 según los compradores?",
      a: "Lo que se repite: tablero con alguna marca al llegar (logistica, Flexispot sustituye gratis), instrucciones confusas en el paso de cableado, y algún controlador que se reinicia solo (se arregla recalibrando). No he encontrado quejas serias sobre motor o estructura fallando.",
    },
  ];

  const e7Schema = productSchema(asin, product, "/flexispot-e7-opiniones");

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(e7Schema) }}
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

      <FadeIn>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product image */}
          <div className="w-full md:w-72 h-72 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 product-image-container">
            <Image src={product.imagen} alt={product.imagen_alt} width={280} height={280} className="object-contain p-4" />
          </div>

          {/* Product info */}
          <div className="flex-1">
            <p className="editorial-mark mb-2" style={{ color: 'var(--color-secondary)' }}>Review completa &middot; {FECHA}</p>
            <h1 className="text-3xl md:text-4xl mt-1 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
              {product.nombre}
            </h1>
            <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
              Actualizado: {FECHA_EN_FRASE}
            </p>

            <div className="flex items-center gap-4 mt-4">
              <span className="mono font-bold text-sm px-2 py-1 rounded text-white" style={{ background: 'var(--color-secondary)' }}>
                {product.puntuacion.total}/10
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{product.rating}★ en Amazon</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {product.veredicto}
            </p>

            <div className="mt-4">
              <AffiliateButton asin={asin} size="lg" />
              <AvisoAfiliado />
            </div>

            <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              Enlace de afiliado. Si compras a traves de el, recibimos una comisión sin coste para ti.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Editorial intro */}
      <FadeIn delay={100}>
        <div className="mt-10 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <p>
              El marco del E7 lleva años siendo de lo más recomendado en foros y en YouTube, y los números acompañan: es el producto con más valoraciones de todo el catálogo y el que mejor nota media saca. Doble motor, 125 kg de carga y cinco años de garantía en la estructura. El matiz importante es que viene sin tablero, así que hay que sumar ese gasto antes de compararlo con un escritorio completo.
            </p>
        </div>
      </FadeIn>

      <div className="divider my-10" />

      {/* Specs grid */}
      <FadeIn>
        <section>
          <h2 className="text-2xl mb-6 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
            Especificaciones tecnicas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Motor", value: "Doble motor", detail: "LoctekMotion" },
              { label: "Rango de altura", value: `${product.specs.rango_altura_min_cm}–${product.specs.rango_altura_max_cm} cm`, detail: "65 cm de recorrido" },
              { label: "Velocidad", value: `${product.specs.velocidad_cm_s} cm/s`, detail: "De los más rapidos" },
              { label: "Carga máxima", value: `${product.specs.peso_max_carga_kg} kg`, detail: "Setup completo" },
              { label: "Tablero", value: `${product.specs.ancho_tablero_cm}x${product.specs.profundidad_tablero_cm} cm`, detail: product.specs.material_tablero || '' },
              { label: "Peso estructura", value: `${product.specs.peso_estructura_kg} kg`, detail: "Acero robusto" },
              { label: "Ruido", value: `${product.specs.ruido_db} dB`, detail: "Silencioso" },
              { label: "Garantía", value: `${product.specs.garantia_anos} años`, detail: "Flexispot oficial" },
              { label: "Presets", value: `${product.specs.presets_memoria} memorias`, detail: "Ajuste rápido" },
              { label: "Anticolision", value: product.specs.sistema_anticolision ? "Si" : "No", detail: "Proteccion activa" },
            ].map((spec, si) => (
              <FadeIn key={spec.label} delay={si * 40}>
                <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{spec.label}</p>
                  <p className="mono text-lg font-bold mt-0.5">{spec.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{spec.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      <div className="divider my-10" />

      {/* Pros and cons */}
      <FadeIn>
        <section>
          <h2 className="text-2xl mb-6 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
            Pros y contras
          </h2>
          <ProsConsBox pros={product.pros} cons={product.contras} />
        </section>
      </FadeIn>

      <div className="divider my-10" />

      {/* Detailed review sections */}
      <section className="max-w-3xl space-y-8">
        <FadeIn>
          <h2 className="text-2xl heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
            Análisis detallado
          </h2>
        </FadeIn>

        {[
          { title: "Motor y rendimiento", text: "Doble motor LoctekMotion (fabricado por Flexispot, no comprado a terceros). A 3.8 cm/s, pasar de sentado a de pie tarda 10-11 segundos. Los 45 dB de ruido son un zumbido grave, no un chirrido. En videollamada, la otra persona no lo percibe. En una grabacion en silencio, el micro si lo captaria." },
          { title: "Estabilidad (aquí es donde gana)", text: "La razon principal para comprar el E7. Tres secciones telescópicas (los baratos tienen dos) y base ancha y pesada. A máxima altura (123 cm), el movimiento lateral al escribir es mínimo. Con un modelo de gama de entrada, la pantalla vibra y te cansa la vista al cabo de una hora. Con el E7, ese efecto desaparece. Es probablemente por lo que la gente que compra el E7 acaba usando más la posición de pie." },
          { title: "Montaje: no es difícil, pero si pesado", text: "Instrucciones claras, herramientas incluidas, proceso sencillo. El problema es el peso: 32 kg de estructura. Con dos personas, 45 minutos tranquilos. Solo, hora y media y frustracion. Truco: pon el tablero boca abajo, atornilla la estructura encima, y entre dos levantais el conjunto montado." },
          { title: "¿Para quien SI es el E7?", text: "Teletrabajo a jornada completa, setup con monitor grande (o dos), personas altas (rango hasta 123 cm). En resumen: compras, montas, y te olvidas del tema escritorios durante años." },
          { title: "¿Para quien NO es el E7?", text: "Si tu setup es solo un portátil, estás pagando de más: cualquier modelo de la gama de entrada cumple de sobra. Si quieres probar lo de trabajar de pie, empieza barato y haz upgrade después." },
          { title: "Que dicen los compradores en Amazon", text: "He leído las opiniones publicadas. Lo positivo que más se repite: estabilidad, silencio y durabilidad a largo plazo. Lo negativo: algún tablero marcado al llegar (Flexispot sustituye gratis), instrucciones de cableado algo confusas, y el peso que sorprende a quien espera un mueble tipo IKEA. Si sabes que es un escritorio motorizado de 32 kg, no es complicado." },
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

      {/* Ratings */}
      <FadeIn>
        <section>
          <h2 className="text-2xl mb-6 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>Puntuacion</h2>
          <div className="max-w-md">
            <CompactRatings puntuacion={product.puntuacion} />
          </div>
        </section>
      </FadeIn>

      {/* CTA */}
      <FadeIn>
        <div className="mt-10 p-6 rounded text-center noise-bg" style={{ background: 'linear-gradient(135deg, var(--color-secondary-light), white)', borderLeft: '3px solid var(--accent)' }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Veredicto</p>
          <p className="text-xl mt-2" style={{ fontFamily: 'var(--font-display)' }}>{product.veredicto}</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            No es barato, pero la estabilidad, el motor y la garantía no tienen rival a este precio. Si buscas algo para años, es la apuesta segura.
          </p>
          <div className="mt-4 inline-block">
            <AffiliateButton asin={asin} size="lg" />
            <AvisoAfiliado />
          </div>
        </div>
      </FadeIn>

      <div className="divider my-10" />

      {/* Alternatives */}
      <FadeIn>
        <section>
          <h2 className="text-2xl mb-4 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
            Alternativas al Flexispot E7
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Si el E7 no te encaja, estas son las tres alternativas que yo miraria.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'var(--color-secondary)', color: 'white' }}>
                  <th className="text-left p-3 rounded-tl" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Modelo</th>
                  <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Motor</th>
                  <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Nota</th>
                  <th className="text-center p-3 rounded-tr" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}></th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: 'var(--accent-light)', borderBottom: '1px solid var(--border)' }}>
                  <td className="p-3 font-semibold">Flexispot E7 (este)</td>
                  <td className="p-3 text-center">Doble</td>
                  <td className="p-3 text-center mono font-bold" style={{ color: 'var(--pro)' }}>{product.puntuacion.total}</td>
                  <td className="p-3 text-center"><AffiliateButton asin={asin} size="sm" /></td>
                </tr>
                {alternatives.map(([altAsin, alt]) => (
                  <tr key={altAsin} className="hover:bg-[var(--accent-light)]" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="p-3 font-semibold">{alt.marca} {alt.modelo}</td>
                    <td className="p-3 text-center">{alt.specs.tipo_motor === 'doble' ? 'Doble' : 'Simple'}</td>
                    <td className="p-3 text-center mono font-bold">{alt.puntuacion.total}</td>
                    <td className="p-3 text-center"><AffiliateButton asin={altAsin} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
              <AvisoAfiliadoTabla />
          </div>
        </section>
      </FadeIn>

      {/* Internal links */}
      <FadeIn>
        <section className="mt-10 max-w-3xl p-6 rounded" style={{ background: 'var(--color-secondary-light)', borderLeft: '3px solid var(--color-secondary)' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Sigue leyendo
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <Link href="/flexispot-vs-maidesite" className="underline" style={{ color: 'var(--accent)' }}>Flexispot vs Maidesite: comparativa completa</Link> — ¿Vale la pena el E7 o el Maidesite T2 Pro es suficiente?
            </p>
            <p>
              <Link href="/mejor-escritorio-elevable" className="underline" style={{ color: 'var(--accent)' }}>Los 12 mejores escritorios elevables de 2026</Link> — Los 12 modelos comparados, de la gama de entrada a la premium.
            </p>
            <p>
              <Link href="/escritorio-elevable-barato" className="underline" style={{ color: 'var(--accent)' }}>Escritorios elevables baratos</Link> — Si el marco Flexispot se te va de presupuesto, aquí está la gama de entrada.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* FAQ */}
      <section className="mt-12 max-w-3xl">
        <FadeIn>
          <div className="p-8 rounded-lg noise-bg" style={{ background: 'var(--bg-secondary)' }}>
            <h2 className="text-2xl mb-2 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
              Preguntas frecuentes sobre el Flexispot E7
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
