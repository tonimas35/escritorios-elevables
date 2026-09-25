import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { coma, nota } from "@/lib/format";
import { garantia, motorCorto, recorrido, SIN_DATO } from "@/lib/ficha";
import { getProductBySlug } from "@/lib/products";
import { FECHA_EN_FRASE } from "@/lib/fecha";
import { AffiliateButton } from "@/components/AffiliateButton";
import { FranjaPrecio } from "@/components/FranjaPrecio";
import { AvisoAfiliadoPagina } from "@/components/AvisoAfiliado";
import { CompactRatings } from "@/components/CompactRatings";
import { FadeIn } from "@/components/FadeIn";
import { productSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Flexispot vs Maidesite 2026 — ¿Cuál es mejor?",
  description:
    "Comparativa Flexispot vs MAIDeSITe en 2026: marco contra marco y escritorio completo contra completo. Carga, altura, ruido y garantía.",
  alternates: { canonical: "/flexispot-vs-maidesite" },
};


export default function FlexispotVsMaidesitePage() {
  const e7 = getProductBySlug("flexispot-eg1");
  const t2 = getProductBySlug("maidesite-t2-pro-plus");
  const eg1 = getProductBySlug("flexispot-160x80");
  const s2 = getProductBySlug("maidesite-s2-pro");

  if (!e7 || !t2) return <p>Productos no encontrados</p>;

  const [e7Asin, e7Product] = e7;
  const [t2Asin, t2Product] = t2;

  // El ganador de cada fila sale de los datos, no se escribe a mano. La
  // variable se llama e7 por historia: es el marco FLEXISPOT EG1 (el ASIN
  // se presentaba como E7 hasta el 24/09/2026).
  type Ganador = "e7" | "t2" | "tie";
  const gana = (a: number | null, b: number | null, masEsMejor = true): Ganador => {
    if (a === null || b === null || a === b) return "tie";
    return (a > b) === masEsMejor ? "e7" : "t2";
  };
  const velocidadTxt = (p: typeof e7Product) =>
    p.specs.velocidad_cm_s !== null ? `${coma(p.specs.velocidad_cm_s)} cm/s` : "Sin dato";
  const ruidoTxt = (p: typeof e7Product) =>
    p.specs.ruido_db !== null ? `${p.specs.ruido_db} dB` : "Sin dato";
  const motores = (p: typeof e7Product) => (p.specs.tipo_motor === "doble" ? 2 : 1);
  const tramo = (p: typeof e7Product) => p.specs.rango_altura_max_cm - p.specs.rango_altura_min_cm;
  const tableroTxt = (p: typeof e7Product) =>
    p.incluye_tablero ? `${p.specs.ancho_tablero_cm}x${p.specs.profundidad_tablero_cm} cm` : "Sin tablero";

  const comparisons: { label: string; e7: string; t2: string; winner: Ganador }[] = [
    { label: "Motor", e7: motorCorto(e7Product), t2: motorCorto(t2Product), winner: gana(motores(e7Product), motores(t2Product)) },
    // Recorrido: gana el de mas centimetros entre la altura minima y la
    // maxima. No se usa el apartado de la nota: se mide contra la gama de
    // precio y los dos marcos estan en gamas distintas.
    { label: "Rango altura", e7: recorrido(e7Product), t2: recorrido(t2Product), winner: gana(tramo(e7Product), tramo(t2Product)) },
    { label: "Carga máxima", e7: `${e7Product.specs.peso_max_carga_kg} kg`, t2: `${t2Product.specs.peso_max_carga_kg} kg`, winner: gana(e7Product.specs.peso_max_carga_kg, t2Product.specs.peso_max_carga_kg) },
    { label: "Velocidad", e7: velocidadTxt(e7Product), t2: velocidadTxt(t2Product), winner: gana(e7Product.specs.velocidad_cm_s, t2Product.specs.velocidad_cm_s) },
    { label: "Ruido", e7: ruidoTxt(e7Product), t2: ruidoTxt(t2Product), winner: gana(e7Product.specs.ruido_db, t2Product.specs.ruido_db, false) },
    { label: "Tablero", e7: tableroTxt(e7Product), t2: tableroTxt(t2Product), winner: "tie" },
    { label: "Memorias", e7: `${e7Product.specs.presets_memoria ?? SIN_DATO}`, t2: `${t2Product.specs.presets_memoria ?? SIN_DATO}`, winner: gana(e7Product.specs.presets_memoria, t2Product.specs.presets_memoria) },
    { label: "Garantía", e7: garantia(e7Product), t2: garantia(t2Product), winner: gana(e7Product.specs.garantia_anos, t2Product.specs.garantia_anos) },
    // Sin ganador: cada nota se mide contra su gama de precio (METODO.md §5)
    // y estos dos marcos estan en gamas distintas.
    { label: "Nota en su gama", e7: `${nota(e7Product.puntuacion.total)}/10`, t2: `${nota(t2Product.puntuacion.total)}/10`, winner: "tie" },
    { label: "Nota en Amazon", e7: `${coma(e7Product.rating)}★`, t2: `${coma(t2Product.rating)}★`, winner: gana(e7Product.rating, t2Product.rating) },
  ];

  // Solo lo que dicen los datos del catalogo y las fichas de Amazon. Las
  // afirmaciones sobre fabricas de motores, tiempos de postventa o
  // historial de averias no tenian fuente y se retiraron el 24/09/2026.
  const faqItems = [
    {
      q: "Flexispot o Maidesite: ¿cuál es mejor marca?",
      a: `Depende del modelo, no de la marca. En este catálogo, el marco de Flexispot (EG1) es el más asequible (${coma(e7Product.rating)} de media en Amazon), y el de MAIDeSITe (${t2Product.modelo}) es el que más recorrido ofrece, con ${t2Product.specs.peso_max_carga_kg} kg de carga. En escritorios completos, el FLEXISPOT de 160x80 da 5 años en el marco y 3 en el motor${s2 && s2[1].specs.garantia_anos !== null ? `, y el MAIDeSITe S2 Pro, ${s2[1].specs.garantia_anos}` : ""}.`,
    },
    {
      q: "¿Los motores de Flexispot y Maidesite son iguales?",
      a: `No en estos modelos. El marco de Flexispot (EG1) lleva un motor y mueve ${e7Product.specs.peso_max_carga_kg} kg; el ${t2Product.modelo} de MAIDeSITe lleva dos y declara ${t2Product.specs.peso_max_carga_kg} kg. Los dos escritorios completos, el FLEXISPOT de 160x80 y el MAIDeSITe S2 Pro, llevan doble motor.`,
    },
    {
      q: "¿Puedo usar un tablero diferente con estas marcas?",
      a: `Sí, las dos venden la estructura sola. Según su ficha, el marco de Flexispot (EG1) admite tableros de 100 a 160 cm de largo y de 50 a 80 cm de fondo, y el ${t2Product.modelo} de MAIDeSITe, de 100 a 220 cm de largo; el fondo no lo declara. Compruébalo en su ficha de Amazon antes de comprar el tablero.`,
    },
  ];

  const vsSchemas = [
    productSchema(e7Asin, e7Product, "/flexispot-vs-maidesite"),
    productSchema(t2Asin, t2Product, "/flexispot-vs-maidesite"),
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
      {vsSchemas.map((sch, i) => (
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
        <Link href="/" className="hover:underline" style={{ color: 'var(--verde-estructura)' }}>Inicio</Link>
        {" "}&gt;{" "}Flexispot vs Maidesite
      </nav>

      <FadeIn>
        <h1 className="text-3xl md:text-5xl heading-accent" >
          Flexispot vs Maidesite
        </h1>
        <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          Actualizado: {FECHA_EN_FRASE} · Las dos marcas más vendidas en Amazon España
        </p>
        <div className="mt-1">
          <AvisoAfiliadoPagina />
        </div>
      </FadeIn>

      {/* Editorial intro */}
      <FadeIn delay={100}>
        <div className="mt-8 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <p>
            Dos marcas que se venden mucho en Amazon España. La pregunta de siempre: ¿cuál compro? Respuesta corta: depende de si buscas precio o capacidad. Aquí van los datos.
          </p>
        </div>
      </FadeIn>

      {/* TL;DR */}
      <FadeIn delay={200}>
        <div className="mt-8 p-6" style={{ background: 'var(--bs-superficie)', borderLeft: '3px solid var(--bs-verde-botella)' }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--verde-estructura)' }}>TL;DR</p>
          <p className="mt-2 text-base leading-relaxed" style={{  color: 'var(--text-dark)' }}>
            No hay un ganador único, porque no compiten en el mismo sitio. Flexispot domina el precio: su marco, el EG1, es el marco más asequible del catálogo, con {coma(e7Product.rating)} de media en Amazon, aunque lleva un solo motor. MAIDeSITe domina la capacidad: el {t2Product.modelo} aguanta {t2Product.specs.peso_max_carga_kg} kg y va de {coma(t2Product.specs.rango_altura_min_cm)} a {coma(t2Product.specs.rango_altura_max_cm)} cm, cifras que Flexispot no ofrece en este catálogo. En escritorios completos, con tablero incluido, la cosa se aprieta entre el FLEXISPOT de 160x80 y el MAIDeSITe S2 Pro, y ahí deciden el tamaño del tablero y la garantía.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <AffiliateButton asin={e7Asin} text="Flexispot EG1 en Amazon" size="md" />
            <AffiliateButton asin={t2Asin} text={`MAIDeSITe ${t2Product.modelo} en Amazon`} size="md" />
          </div>
        </div>
      </FadeIn>

      {/* Cara a cara: EG1 contra el marco de MAIDeSITe */}
      <FadeIn>
        <section className="mt-12">
          <h2 className="text-2xl mb-6 heading-accent" >
            Marco contra marco: FLEXISPOT vs {t2Product.modelo}
          </h2>

          <div className="max-w-3xl mb-8 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
            Los dos son solo estructura, así que a ambos hay que sumarles el tablero. Pero no juegan en la misma liga de precio, y conviene saber por que.
          </p>
          </div>

          {/* Product cards side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[[e7Asin, e7Product] as const, [t2Asin, t2Product] as const].map(([productAsin, product], i) => (
              <FadeIn key={productAsin} delay={i * 120}>
                <div className="p-6 rounded-lg product-card-hover" style={{ background: 'var(--bg-card)', border: i === 0 ? '2px solid var(--verde-estructura)' : '1px solid var(--border)' }}>
                  {i === 0 && <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--verde-estructura)' }}>Recomendado</span>}
                  {i === 1 && <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Mejor precio</span>}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center product-image-container">
                      <Image src={product.imagen} alt={product.imagen_alt} width={80} height={80} className="object-contain" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold" >{product.marca} {product.modelo}</h3>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{coma(product.rating)}★ en Amazon</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <FranjaPrecio product={product} />
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
                <tr style={{ background: 'var(--color-secondary)', color: 'white' }}>
                  <th className="text-left p-3 rounded-tl" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Especificación</th>
                  <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>{e7Product.marca} {e7Product.modelo}</th>
                  <th className="text-center p-3 rounded-tr" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>{t2Product.marca} {t2Product.modelo}</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row.label} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="p-3 font-medium">{row.label}</td>
                    <td className={`p-3 text-center ${row.winner === 'e7' ? 'font-bold' : ''}`}
                      style={row.winner === 'e7' ? { color: 'var(--pro)' } : {}}>
                      {row.e7} {row.winner === 'e7' && '✓'}
                    </td>
                    <td className={`p-3 text-center ${row.winner === 't2' ? 'font-bold' : ''}`}
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
          <h2 className="text-2xl mb-2 heading-accent" >
            Análisis por criterio
          </h2>
        </FadeIn>

        {[
          { title: "Motor", text: `El Flexispot lleva un motor; el MAIDeSITe, dos. El doble motor reparte el esfuerzo entre las dos patas y es lo que le permite declarar ${t2Product.specs.peso_max_carga_kg} kg frente a los ${e7Product.specs.peso_max_carga_kg} kg que mueve el Flexispot. La ficha del Flexispot no declara la velocidad.` },
          { title: "Capacidad de carga", text: `${e7Product.specs.peso_max_carga_kg} kg en movimiento el Flexispot (100 kg en estático), ${t2Product.specs.peso_max_carga_kg} kg el MAIDeSITe. Para un portátil y un monitor, los dos sobran; para dos monitores en brazo y equipo pesado, el MAIDeSITe.` },
          { title: "Rango de altura", text: `Flexispot: ${coma(e7Product.specs.rango_altura_min_cm)}–${coma(e7Product.specs.rango_altura_max_cm)} cm. MAIDeSITe: ${t2Product.specs.rango_altura_min_cm}–${t2Product.specs.rango_altura_max_cm} cm. El MAIDeSITe baja ${coma(e7Product.specs.rango_altura_min_cm - t2Product.specs.rango_altura_min_cm)} cm más y sube ${coma(t2Product.specs.rango_altura_max_cm - e7Product.specs.rango_altura_max_cm)} cm más, que es lo que importa si eres muy bajo o muy alto.` },
          { title: "Garantía", text: `El Flexispot da 5 años en el marco y 3 en el motor. ${t2Product.specs.garantia_anos !== null ? `El MAIDeSITe, ${t2Product.specs.garantia_anos} años.` : "La ficha del MAIDeSITe en Amazon no declara los años de garantía."}` },
          { title: "Lo que cuesta cada uno", text: "Ninguno de los dos incluye tablero, así que a los dos hay que sumarles ese coste. El Flexispot cuesta bastante menos y tiene muchas más valoraciones detrás. Salvo que necesites la carga o la altura del MAIDeSITe, el Flexispot cumple para un setup normal." },
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
          <h2 className="text-2xl mb-6 heading-accent" >
            Puntuaciones comparadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--verde-estructura)' }}>{e7Product.marca} {e7Product.modelo}</h3>
              <CompactRatings puntuacion={e7Product.puntuacion} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">MAIDeSITe {t2Product.modelo}</h3>
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
            <h2 className="text-2xl mb-4 heading-accent" >
              Con tablero incluido: FLEXISPOT 160x80 vs S2 Pro
            </h2>
            <div className="max-w-3xl mb-6 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>
            Los dos llegan completos, sin comprar nada aparte. El FLEXISPOT de 160x80 ofrece el tablero más grande, de {eg1[1].specs.ancho_tablero_cm}x{eg1[1].specs.profundidad_tablero_cm}, pero mueve {eg1[1].specs.peso_max_carga_kg} kg. El MAIDeSITe S2 Pro trae tablero de {s2[1].specs.ancho_tablero_cm}x{s2[1].specs.profundidad_tablero_cm} y {s2[1].specs.peso_max_carga_kg} kg de carga. Si quieres superficie, el Flexispot; si quieres carga, el MAIDeSITe.
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
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{coma(product.rating)}★ · {nota(product.puntuacion.total)}/10</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      <div className="p-2 rounded" style={{ background: 'var(--bg-secondary)' }}>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Carga</p>
                        <p className="text-sm font-bold">{product.specs.peso_max_carga_kg} kg</p>
                      </div>
                      <div className="p-2 rounded" style={{ background: 'var(--bg-secondary)' }}>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Garantía</p>
                        <p className="text-sm font-bold">{garantia(product)}</p>
                      </div>
                      <div className="p-2 rounded" style={{ background: 'var(--bg-secondary)' }}>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Memorias</p>
                        <p className="text-sm font-bold">{product.specs.presets_memoria ?? SIN_DATO}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <FranjaPrecio product={product} />
                      <AffiliateButton asin={productAsin} size="lg" />
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
          <h2 className="text-2xl mb-4 heading-accent" >
            Veredicto: cual comprar
          </h2>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
            <strong style={{ color: 'var(--text-primary)' }}>Marco FLEXISPOT:</strong> el marco más asequible del catálogo, con {coma(e7Product.rating)} de media en Amazon, pero con un solo motor. Suma el tablero aparte.
          </p>
            <p>
            <strong style={{ color: 'var(--text-primary)' }}>MAIDeSITe {t2Product.modelo}:</strong> solo si necesitas sus {t2Product.specs.peso_max_carga_kg} kg de carga o su recorrido de {coma(t2Product.specs.rango_altura_min_cm)} a {coma(t2Product.specs.rango_altura_max_cm)} cm; si no, estás pagando de más. También viene sin tablero.
          </p>
            <p>
            <strong style={{ color: 'var(--text-primary)' }}>Con tablero incluido:</strong> FLEXISPOT 160x80 o MAIDeSITe S2 Pro. El primero por superficie y garantía, el segundo por carga.
          </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <AffiliateButton asin={e7Asin} text="Flexispot EG1 en Amazon" size="lg" />
            <AffiliateButton asin={t2Asin} text={`MAIDeSITe ${t2Product.modelo} en Amazon`} size="lg" />
          </div>
        </section>
      </FadeIn>

      {/* Internal links */}
      <FadeIn>
        <section className="mt-10 max-w-3xl p-6 rounded" style={{ background: 'var(--color-secondary-light)', borderLeft: '3px solid var(--color-secondary)' }}>
          <h3 className="text-lg font-semibold mb-3" >
            Otras guías
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <Link href="/flexispot-eg1-opiniones" className="underline" style={{ color: 'var(--verde-estructura)' }}>FLEXISPOT EG1: ficha completa</Link> — Datos, nota desglosada y alternativas del marco de Flexispot.
            </p>
            <p>
              <Link href="/mejor-escritorio-elevable" className="underline" style={{ color: 'var(--verde-estructura)' }}>Los mejores escritorios elevables de 2026</Link> — Comparativa completa con todas las marcas.
            </p>
            <p>
              <Link href="/escritorio-elevable-barato" className="underline" style={{ color: 'var(--verde-estructura)' }}>Escritorios elevables baratos</Link> — La gama de entrada analizada a fondo.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* FAQ */}
      <section className="mt-12 max-w-3xl">
        <FadeIn>
          <div className="p-8" style={{ background: 'var(--bs-superficie)' }}>
            <h2 className="text-2xl mb-2 heading-accent" >
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
