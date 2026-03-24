import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { AffiliateButton } from "@/components/AffiliateButton";
import { ProsConsBox } from "@/components/ProsConsBox";
import { CompactRatings } from "@/components/CompactRatings";

export const metadata: Metadata = {
  title: "Mejores escritorios elevables baratos 2026 (desde 110€)",
  description:
    "Los 6 mejores escritorios elevables baratos en Amazon. Comparativa actualizada con precios desde 110 EUR. Analizamos calidad, motor, estabilidad y relacion calidad-precio.",
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
      q: "Cual es el escritorio elevable mas barato que merece la pena?",
      a: `El ${winner?.[1].marca} ${winner?.[1].modelo} por ${winner?.[1].precio} EUR. Tiene anticolision, 4 memorias y 5 anos de garantia, cosas que no encuentras a este precio. Si quieres gastar menos, el Fezibo por 120 EUR cumple para un setup basico.`,
    },
    {
      q: "Motor simple o doble para un escritorio barato?",
      a: "Por debajo de 220 EUR, todos llevan motor simple. Es mas lento (20 seg el recorrido completo vs 12 del doble), pero para un setup normal de portatil y monitor va de sobra. Si quieres doble motor, el mas barato es el Maidesite T2 Pro Plus a 270 EUR.",
    },
    {
      q: "Cuanto dura un escritorio elevable barato?",
      a: "Entre 3 y 7 anos con uso normal (2-4 cambios al dia). Los motores aguantan unos 10.000 ciclos. Los problemas que se ven en Amazon son casi siempre del controlador electronico, no del motor, y un reinicio suele arreglarlo.",
    },
    {
      q: "Necesito herramientas especiales para montarlo?",
      a: "No, todos incluyen llaves Allen y tornillos. Montaje en 20-45 minutos. Los ligeros (Fezibo, JUMMICO) se montan solo; el VASAGLE (24 kg) mejor entre dos. Un destornillador electrico ayuda pero no es obligatorio.",
    },
    {
      q: "Que sacrifico por comprar un escritorio elevable barato?",
      a: "Velocidad del motor (2.5 vs 3.8 cm/s), estabilidad a maxima altura (algo de vibracion al escribir de pie) y acabado del tablero (melamina basica). Tambien menos rango de altura (72-118 cm vs 58-125 cm), un problema si mides mas de 1.85 m.",
    },
    {
      q: "Anticolision: es necesario en un escritorio barato?",
      a: "Si. Para el motor si detecta un obstaculo (cajon, silla, rodilla). Sin anticolision, el motor sigue y puede romper cosas. A partir de 140 EUR ya lo encuentras (Ergear), asi que no merece la pena ahorrar 20 euros y quedarse sin el.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Inicio</Link>
        {" "}&gt;{" "}Escritorios elevables baratos
      </nav>

      <h1 className="text-3xl md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
        Mejores escritorios elevables <span style={{ color: 'var(--accent)' }}>baratos</span> 2026
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        Actualizado: marzo 2026 · {cheapProducts.length} modelos analizados por debajo de 220 EUR
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        Este articulo contiene enlaces de afiliado. Si compras a traves de ellos, recibimos una pequena comision sin coste adicional para ti.
      </p>

      {/* Intro editorial */}
      <div className="mt-8 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        <p>
          No necesitas gastarte 500 euros. Si tu setup es portatil + monitor + teclado, con 140-200 EUR vas sobrado. Mi recomendacion rapida: el <strong>Flexispot EG1</strong> (210 EUR) si quieres lo mejor barato, el <strong>Ergear EED-S1</strong> (140 EUR) si buscas anticolision por menos de 150, y el <strong>Fezibo</strong> (120 EUR) para probar gastando lo minimo.
        </p>
      </div>

      {/* Winner callout */}
      {winner && (
        <div className="mt-8 p-6 rounded" style={{ background: 'var(--accent-light)', border: '2px solid var(--accent)' }}>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-[140px] h-[140px] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center bg-white">
              <Image src={winner[1].imagen} alt={winner[1].imagen_alt} width={140} height={140} className="object-contain p-1" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Ganador calidad-precio</p>
              <h2 className="text-xl font-semibold mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                {winner[1].nombre}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{winner[1].veredicto}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="mono text-2xl font-bold">{winner[1].precio}€</span>
                <span className="mono font-bold px-2 py-0.5 rounded text-sm" style={{ background: 'var(--pro)', color: 'white' }}>
                  {winner[1].puntuacion.total}/10
                </span>
                <AffiliateButton asin={winner[0]} size="sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick comparison table */}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: 'var(--bg-dark)', color: 'var(--text-inverse)' }}>
              <th className="text-left p-3 rounded-tl" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>#</th>
              <th className="text-left p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Modelo</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Tablero</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Carga</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Anticolision</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Nota</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Precio</th>
              <th className="text-center p-3 rounded-tr" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}></th>
            </tr>
          </thead>
          <tbody>
            {cheapProducts.map(([asin, product], i) => (
              <tr key={asin} className="transition-colors hover:bg-[var(--accent-light)]" style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="p-3">
                  <span className="mono text-xs font-bold" style={{ color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-[80px] h-[80px] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center bg-neutral-50">
                      <Image src={product.imagen} alt={product.imagen_alt} width={80} height={80} className="object-contain p-1" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{product.marca} {product.modelo}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}★ ({product.num_reviews})</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-center mono text-sm">{product.specs.ancho_tablero_cm}x{product.specs.profundidad_tablero_cm}</td>
                <td className="p-3 text-center mono text-sm">{product.specs.peso_max_carga_kg} kg</td>
                <td className="p-3 text-center text-sm">{product.specs.sistema_anticolision ? '✓' : '✗'}</td>
                <td className="p-3 text-center mono font-bold">{product.puntuacion.total}</td>
                <td className="p-3 text-center mono font-bold">{product.precio}€</td>
                <td className="p-3 text-center">
                  <AffiliateButton asin={asin} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* How to choose section */}
      <div className="mt-12 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Como elegir un escritorio elevable barato (sin arrepentirte)
        </h2>
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Por debajo de 220 EUR, todos llevan motor simple: mas lento y algo mas ruidoso. Acepta eso de entrada. Lo que si deberias exigir: <strong>memorias de altura</strong> (si no, al cuarto dia dejas de usarlo), <strong>tablero de al menos 120 cm</strong> si usas monitor externo, y <strong>anticolision</strong> para que el motor pare si hay algo debajo.
          </p>
          <p>
            La garantia importa mucho. Los problemas con motores baratos aparecen entre el mes 8 y el 18. Con 5 anos de cobertura, te despreocupas. Con 2, cada ruido raro te pone nervioso.
          </p>
        </div>
      </div>

      {/* What you sacrifice section */}
      <div className="mt-8 max-w-3xl p-6 rounded" style={{ background: 'var(--bg-secondary)' }}>
        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Que sacrificas por el precio (hablando claro)
        </h3>
        <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <p>
            Motor simple va sobrado para un setup normal. Lo que notas es la estabilidad a maxima altura: si mides 1.85 m, hay algo de vibracion lateral al escribir de pie. No dramatica, pero perceptible.
          </p>
          <p>
            El tablero de melamina se siente menos solido que bambu. Una alfombrilla de escritorio de 15 EUR lo soluciona. El ruido (50 dB vs 43 dB en premium) se nota en una habitacion en silencio, pero solo dura 10-20 segundos cada vez que cambias de altura.
          </p>
        </div>
      </div>

      {/* Detailed analysis of each product */}
      <div className="mt-12 space-y-16">
        {cheapProducts.map(([asin, product], i) => {
          const editorialContent: Record<string, string> = {
            "flexispot-eg1": "El que yo le recomendaria a un amigo. A 210 EUR te da anticolision, 5 anos de garantia y calidad Flexispot. Tablero de 120x60 justo para monitor + portatil. 4.5 estrellas con 1500+ opiniones y quejas minimas.",
            "maidesite-s2-pro": "La alternativa al EG1: 80 kg de carga (vs 70), 4 memorias (vs 3) y misma garantia de 5 anos, por 200 EUR. Menos reviews y servicio postventa algo mas lento que Flexispot. Si te fias de los numeros mas que de la marca, es mejor compra.",
            "sanodesk-qs-plus": "Fabricado por la misma empresa que Flexispot, pero sin anticolision y solo 3 anos de garantia a 190 EUR. Por 20 EUR mas tienes el EG1 con todo. Solo merece la pena en oferta por debajo de 160 EUR.",
            "vasagle-lsd302": "El unico con tablero de 140x60 cm por debajo de 200 EUR. Si necesitas mesa grande, es tu opcion. 80 kg de carga, anticolision, 4 memorias. Garantia de solo 3 anos y montaje pesado (24 kg).",
            "ergear-eed-s1": "Mi favorito por debajo de 150 EUR. Anticolision y 4 memorias a 140 EUR — eso no lo ofrece nadie mas a este precio. Tablero de 120 cm, 1800 opiniones con 4.4 estrellas. La estabilidad a maxima altura es mejorable, pero por el precio es mucho escritorio.",
            "fezibo-100x60": "El mas vendido barato: 120 EUR, montaje en 20 minutos, incluye bandeja para teclado. Pero 50 kg de carga es justo, tablero de 100 cm pequeno, sin anticolision y solo 2 anos de garantia. Bueno para probar; si ya sabes que lo quieres, gasta 20 EUR mas en el Ergear.",
            "jummico-hed12": "A 160 EUR le cuesta justificarse: el Fezibo es mas barato y el Ergear tiene anticolision. Solo tiene sentido para espacios muy pequenos donde 120 cm no cabe. Motor ruidoso (52 dB) y 2 anos de garantia.",
          };
          const editorial = editorialContent[product.slug] || "";

          return (
          <section key={asin} id={product.slug}>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="mono text-sm font-bold" style={{ color: 'var(--accent)' }}>#{String(i + 1).padStart(2, '0')}</span>
              <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
                {product.nombre}
              </h2>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{product.veredicto}</p>

            <div className="mt-4 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-48 rounded overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                <Image src={product.imagen} alt={product.imagen_alt} width={180} height={180} className="object-contain p-2" />
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Precio", value: `${product.precio}€` },
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
          );
        })}
      </div>

      {/* Price tiers guide */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          ¿Cuanto deberia gastarme?
        </h2>
        <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>120-140 EUR:</strong> para probar. Motor simple, tableros de 100 cm, sin anticolision (excepto Ergear). Solo portatil va bien.
          </p>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>150-200 EUR:</strong> el punto dulce. Anticolision, tableros de 120-140 cm, garantias de 3-5 anos. Para teletrabajo estandar, cualquiera cumple.
          </p>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>200-220 EUR:</strong> Flexispot EG1 y Maidesite S2 Pro con 5 anos de garantia. Si llegas, la tranquilidad merece la pena. Y si estiras a 270 EUR, el <Link href="/flexispot-vs-maidesite" className="underline" style={{ color: 'var(--accent)' }}>Maidesite T2 Pro Plus</Link> te da doble motor.
          </p>
        </div>
      </section>

      {/* Internal links */}
      <section className="mt-10 max-w-3xl p-6 rounded" style={{ background: 'var(--bg-secondary)' }}>
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

      {/* FAQ for SEO */}
      <section className="mt-16 max-w-3xl">
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
