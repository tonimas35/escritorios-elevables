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

  const faqItems = [
    {
      q: "Flexispot o Maidesite: cual es mejor marca?",
      a: "Flexispot lleva mas anos en el mercado, tiene mas modelos y muchas mas opiniones en Amazon (mas del doble que Maidesite). Fabrica sus propios motores a traves de LoctekMotion, lo que le da un control total sobre la calidad. Maidesite llego despues pero ha crecido rapido ofreciendo prestaciones similares a precios mas bajos. Ambas dan 5 anos de garantia y tienen servicio postventa en Espana. Si me preguntas como marca global, Flexispot tiene mas recorrido. Pero producto a producto, Maidesite compite bien.",
    },
    {
      q: "Los motores de Flexispot y Maidesite son iguales?",
      a: "No. Flexispot usa motores LoctekMotion, que es su propia subsidiaria — los disenan y fabrican ellos. Maidesite compra motores a proveedores terceros de buena calidad. En las specs, rinden igual: misma velocidad (3.8 cm/s en doble motor) y ruido parecido (45 vs 48 dB). Donde se nota la diferencia es en la durabilidad a largo plazo. Los motores Flexispot tienen mejor historial en reviews de 2-3 anos de uso. Pero no es una diferencia dramatica: ambos motores estan preparados para mas de 10.000 ciclos.",
    },
    {
      q: "Puedo usar un tablero diferente con estas marcas?",
      a: "Si, las dos venden la estructura sola (sin tablero). Si tienes un tablero de IKEA, de madera maciza o uno personalizado, puedes montarlo encima. Las estructuras de Flexispot aceptan tableros de entre 120 y 200 cm de ancho. Las de Maidesite, entre 120 y 180 cm. Asegurate de que el tablero tenga al menos 2 cm de grosor para que los tornillos agarren bien.",
    },
    {
      q: "Cual tiene mejor servicio postventa en Espana?",
      a: "Flexispot tiene un servicio postventa mas rapido, con sede en Europa y respuesta en 24-48 horas por email. Si te llega algo danado, envian recambio sin esperar a que devuelvas el original. Maidesite tambien tiene soporte en Espana, pero las respuestas tardan un poco mas (48-72 horas segun los compradores). Ambas marcas gestionan garantias sin mucho problema, pero Flexispot es mas agil.",
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

      <h1 className="text-3xl md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
        <span style={{ color: 'var(--accent)' }}>Flexispot</span> vs Maidesite
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        Actualizado: marzo 2026 · Las dos marcas mas vendidas en Amazon Espana
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        Este articulo contiene enlaces de afiliado.
      </p>

      {/* Editorial intro */}
      <div className="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        <p>
          Si has buscado escritorios elevables en Amazon Espana, llevas rato viendo estos dos nombres: Flexispot y Maidesite. Son las marcas que mas se venden, las que mas opiniones tienen, y las que aparecen en todas las comparativas. La pregunta que me hacen siempre es la misma: ¿cual de las dos compro?
        </p>
        <p>
          La respuesta corta: depende de cuanto quieras gastarte. La respuesta larga la tienes a continuacion, con datos reales de specs, opiniones de compradores y mi opinion despues de haber probado modelos de ambas marcas.
        </p>
      </div>

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

        {/* Context paragraph */}
        <div className="max-w-3xl mb-8 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <p>
            Estos son los dos modelos con doble motor mas vendidos de cada marca. Sobre el papel, las specs son parecidas: mismo tipo de motor, misma velocidad, mismo tablero de 140x70 cm, misma garantia de 5 anos. La diferencia esta en los detalles y en el precio. 210 euros de diferencia, para ser exactos.
          </p>
        </div>

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

      {/* Analysis by criteria */}
      <section className="mt-12 max-w-3xl space-y-8">
        <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Analisis por criterio
        </h2>

        <div>
          <h3 className="text-lg font-semibold">Motor y velocidad</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Los dos tienen doble motor y van a la misma velocidad: 3.8 cm/s. En la practica, la subida y bajada se siente igual. Donde se diferencian es en quien fabrica el motor. Flexispot usa motores LoctekMotion (su propia filial), asi que controlan todo el proceso. Maidesite compra a proveedores terceros de buena reputacion. ¿Se nota en el dia a dia? No. ¿Podria notarse a los 4-5 anos? Es posible que los motores Flexispot envejezcan algo mejor, pero no tengo datos suficientes para afirmarlo con seguridad.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Estabilidad</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Aqui gana el E7. No es una diferencia enorme, pero se nota. La estructura del E7 tiene tres secciones telescopicas y pesa 32 kg. La del T2 Pro Plus tiene dos secciones y pesa 27 kg. Esos 5 kg extra del E7 son acero que va directo a las patas, y a maxima altura la diferencia es perceptible: el E7 apenas se mueve, el T2 Pro tiene un poco de juego lateral. Si escribes suave, no lo vas a notar. Si tecleas con fuerza o apoyas peso en los bordes de la mesa, si.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Ruido</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            El E7 va a 45 dB y el T2 Pro Plus a 48 dB. Tres decibelios de diferencia. ¿Se nota? En una habitacion completamente silenciosa, un oido atento lo percibe. En una habitacion normal con algo de ruido ambiente, no. Ambos son lo bastante silenciosos para no molestar en videollamadas. Si grabas audio profesional en la misma habitacion, el E7 tiene ventaja. Para el resto de mortales, empate tecnico.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Capacidad de carga</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            125 kg del E7 frente a 100 kg del T2 Pro. 25 kg de diferencia. Suena a mucho, pero recuerda: un setup estandar pesa 12-15 kg. Incluso un setup pesado con dos monitores con brazo, impresora y altavoces no pasa de 35-40 kg. Los 100 kg del Maidesite dan margen de sobra para el 95% de los usuarios. Solo si tienes algo muy pesado encima (un equipo de audio profesional, por ejemplo), esos 25 kg extra del E7 marcan la diferencia.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Rango de altura</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            El E7 va de 58 a 123 cm. El T2 Pro, de 62 a 127 cm. El Maidesite llega 4 cm mas arriba, lo que es mejor para personas altas (mas de 1.90 m). Pero el E7 baja 4 cm mas, lo que importa si usas una silla gaming baja o si mides menos de 1.65 m y necesitas el escritorio bien abajo en posicion sentado. Depende de tu estatura: si mides mas de 1.88 m, el Maidesite tiene ventaja. Si mides menos de 1.70 m, el Flexispot.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Precio (el elefante en la habitacion)</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            480 euros del E7 frente a 270 euros del T2 Pro Plus. 210 euros de diferencia. Esa es la pregunta real: ¿la mejora en estabilidad, los 3 dB menos de ruido, los 25 kg extra de carga y el motor propio justifican 210 euros mas? Mi respuesta honesta: para la mayoria de gente, no. El T2 Pro Plus hace el 90% de lo que hace el E7 por poco mas de la mitad del precio. Pero si trabajas 8 horas al dia, eres sensible a la vibracion y quieres un escritorio que sepas que va a durar 7-8 anos sin achaques, esos 210 euros se reparten en mucho tiempo de uso.
          </p>
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
          <div className="max-w-3xl mb-6 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              Si 270-480 euros se te van de presupuesto, las dos marcas tienen modelos de entrada por unos 200 euros. Motor simple en ambos casos, pero con calidad de marca y 5 anos de garantia. ¿Cual elijo? El EG1 tiene mas opiniones en Amazon (1500 frente a 1100) y una nota un pelitejo mejor (4.5 frente a 4.3). El S2 Pro tiene mas carga (80 kg frente a 70 kg) y una memoria extra (4 frente a 3). Si tu setup pesa lo normal, me iria por el EG1 por la marca. Si tienes un setup mas pesado, el S2 Pro.
            </p>
          </div>
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
          Veredicto: cual comprar
        </h2>
        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>Si tu presupuesto llega a 480 euros</strong> y quieres lo mejor que puedes comprar en Amazon Espana, compra el Flexispot E7. La estabilidad, el motor propio y el historial de la marca lo convierten en una compra que no te va a dar problemas. Es el escritorio que yo tengo y el que recomiendo a quien me dice que quiere uno bueno y olvidarse.
          </p>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>Si tu presupuesto es de 250-300 euros</strong> y quieres doble motor, el Maidesite T2 Pro Plus a 270 euros es la compra mas inteligente. Ofrece el 90% de la experiencia del E7 por 210 euros menos. Para un setup estandar (monitor + portatil), cumple de sobra. Si no eres una persona especialmente exigente con la estabilidad, probablemente nunca notes la diferencia.
          </p>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>Si tu presupuesto es de unos 200 euros</strong>, las opciones de entrada de ambas marcas (EG1 y S2 Pro) son muy parecidas. Motor simple, buena garantia, construcion solida. Me inclino por el Flexispot EG1 por la marca y las reviews, pero el Maidesite S2 Pro tiene mas carga y una memoria extra. Cualquiera de los dos es buena compra.
          </p>
          <p>
            Lo que NO recomendaria: comprar el E7 si solo tienes un portatil encima. Es pagar por una capacidad que no vas a usar. Tampoco recomendaria el Maidesite si vives en una zona donde el servicio postventa te preocupa mucho — Flexispot es mas rapido respondiendo.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <AffiliateButton asin={e7Asin} text={`Flexispot E7 — ${e7Product.precio}€`} size="lg" />
          <AffiliateButton asin={t2Asin} text={`Maidesite T2 — ${t2Product.precio}€`} size="lg" />
        </div>
      </section>

      {/* Internal links */}
      <section className="mt-10 max-w-3xl p-6 rounded" style={{ background: 'var(--bg-secondary)' }}>
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

      {/* FAQ */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Preguntas frecuentes
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
