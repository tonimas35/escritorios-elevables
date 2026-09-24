import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { rutaFicha } from "@/lib/rutas";
import { coma, nota } from "@/lib/format";
import { NOMBRE_FRANJA, posicionEnFranja, type Franja } from "@/lib/nota";
import { FECHA, FECHA_EN_FRASE } from "@/lib/fecha";
import { AffiliateButton } from "@/components/AffiliateButton";
import { AvisoAfiliadoPagina, AvisoAfiliadoTabla } from "@/components/AvisoAfiliado";
import { FranjaPrecio } from "@/components/FranjaPrecio";
import { ProsConsBox } from "@/components/ProsConsBox";
import { CompactRatings } from "@/components/CompactRatings";
import { FadeIn } from "@/components/FadeIn";
import { productSchema, itemListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "12 mejores escritorios elevables 2026 — Guía de compra",
  description:
    "Comparativa de los 12 mejores escritorios elevables eléctricos de 2026. De la gama de entrada a la premium. Análisis con datos reales, pros/contras y recomendaciones.",
  alternates: { canonical: "/mejor-escritorio-elevable" },
};

export default function MejorEscritorioPage() {
  const topProducts = getAllProducts()
    .filter(([, p]) => p.disponible)
    .sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total);

  // Las notas de gamas distintas no se comparan (METODO.md §5): el favorito
  // es el nº 1 de la franja B, como el podio de la home, y la entradilla
  // nombra el primero de cada franja.
  const productos = topProducts.map(([, p]) => p);
  const primeroDe = (f: Franja) =>
    topProducts.find(([, p]) => {
      const pos = posicionEnFranja(p, productos);
      return pos?.franja === f && pos.posicion === 1;
    });
  const [topAsin, topProduct] = primeroDe("B") ?? topProducts[0];
  const nombre = (x: (typeof topProducts)[number] | undefined) => (x ? `${x[1].marca} ${x[1].modelo}` : null);

  // Cifras de la guia, calculadas del catalogo y solo con lo declarado.
  const rango = (xs: number[]) => {
    const [a, b] = [Math.min(...xs), Math.max(...xs)];
    return a === b ? coma(a) : `${coma(a)} y ${coma(b)}`;
  };
  const dobles = productos.filter((p) => p.specs.tipo_motor === "doble");
  const simples = productos.filter((p) => p.specs.tipo_motor === "simple");
  const cargas = productos.map((p) => p.specs.peso_max_carga_kg);
  const ruidos = (g: typeof productos) => g.map((p) => p.specs.ruido_db).filter((r): r is number => r !== null);
  const alturas = (g: typeof productos) => g.map((p) => p.specs.rango_altura_max_cm);
  const masAlto = [...productos].sort((a, b) => b.specs.rango_altura_max_cm - a.specs.rango_altura_max_cm)[0];
  const anticolisionBarato = [...productos]
    .filter((p) => p.specs.sistema_anticolision && p.incluye_tablero && p.precio_min !== null)
    .sort((a, b) => (a.precio_min! + a.precio_max!) - (b.precio_min! + b.precio_max!))[0];

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
      q: "¿Merece la pena un escritorio elevable?",
      a: "Depende de si vas a usarlo. Un escritorio elevable solo aporta algo si de verdad lo subes: el patrón habitual es alternar unos 30 minutos sentado y 15 de pie. Si trabajas sentado más de cuatro horas al día y sabes que vas a cambiar de postura, compensa. Si sospechas que lo vas a dejar siempre a la misma altura, te sale más barato una mesa normal.",
    },
    {
      q: "Motor simple o doble: ¿cuál elijo?",
      a: `El doble reparte el esfuerzo entre las dos patas: en el catálogo, los de doble motor declaran entre ${rango(dobles.map((p) => p.specs.peso_max_carga_kg))} kg de carga en movimiento, y los de uno, entre ${rango(simples.map((p) => p.specs.peso_max_carga_kg))}. Si cambias de posición varias veces al día con un setup pesado, se nota. Si el presupuesto manda, un motor simple cumple bien \u2014 prioriza estabilidad y garantía antes que esto.`,
    },
    {
      q: "¿Cuánto peso soportan estos escritorios?",
      a: `De ${Math.min(...cargas)} a ${Math.max(...cargas)} kg según el modelo. Un setup normal (monitor + portátil + trastos) pesa unos 12-15 kg, así que incluso el más básico va sobrado. Solo preocúpate si tienes varios monitores con brazo o equipos pesados encima.`,
    },
    {
      q: "¿Puedo montar un escritorio elevable solo?",
      a: "Depende del peso del paquete, y muchas fichas no lo declaran. Como referencia: por encima de 25 kg, mejor entre dos, y con un tablero de 160 cm cuesta darle la vuelta en solitario.",
    },
    {
      q: "¿Qué garantía tienen?",
      a: "En España la garantía legal mínima son tres años para cualquier producto nuevo, así que ese es el suelo de todo el catálogo. Por encima de eso, el MAIDeSITe S2 Pro declara cinco años, y los Flexispot, cinco en la estructura y tres en el motor. Varias fichas de Amazon no dicen cuántos años dan: en esos casos cuenta la legal.",
    },
    {
      q: "¿Cuánta electricidad consume un escritorio elevable?",
      a: "Prácticamente nada. El motor funciona 10-20 segundos cada vez que cambias de altura. Consumo anual: unos 2-3 kWh, menos de 1 euro al año en la factura.",
    },
    {
      q: "¿Se nota mucho la diferencia entre la gama de entrada y la premium?",
      a: "En estabilidad de pie, ruido y rango de altura, sí. Para uso normal, uno de gama media con anticolisión va bien. Si pasas 8 horas diarias y necesitas que no vibre nada al escribir de pie, el salto a gama media-alta se nota.",
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
          <Link href="/" className="hover:underline" style={{ color: 'var(--verde-estructura)' }}>Inicio</Link>
          {" "}&gt;{" "}Mejores escritorios elevables
        </nav>

        <FadeIn>
          {/* Editorial header with rules */}
          <div className="editorial-rule mb-6" />
          <p className="editorial-mark mb-3" style={{ color: 'var(--color-secondary)' }}>
            Guía de compra &middot; {FECHA}
          </p>
          <h1 className="text-3xl md:text-5xl heading-accent" >
            Los 12 mejores escritorios elevables de 2026
          </h1>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            Actualizado: {FECHA_EN_FRASE} &middot; 12 modelos analizados
          </p>
          <div className="mt-1">
            <AvisoAfiliadoPagina />
          </div>
          <div className="editorial-rule mt-6" />
        </FadeIn>

        {/* Intro editorial */}
        <FadeIn delay={100}>
          <div className="mt-8 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              Hemos reunido las especificaciones de {topProducts.length} escritorios elevables a la venta en Amazon España, de la gama de entrada a la premium, y cada uno se mide contra lo que se puede esperar por su precio. En corto, el primero de cada franja:{" "}
              {(Object.keys(NOMBRE_FRANJA) as Franja[])
                .map((f) => [f, nombre(primeroDe(f))] as const)
                .filter(([, n]) => n)
                .map(([f, n], i, xs) => (
                  <span key={f}>
                    <strong>{n}</strong> ({NOMBRE_FRANJA[f].toLowerCase()}){i < xs.length - 2 ? ", " : i === xs.length - 2 ? " y " : "."}
                  </span>
                ))}{" "}
              Cómo puntuamos y qué no hacemos está en la <Link href="/metodologia" style={{ textDecoration: 'underline' }}>metodología</Link>.
            </p>
          </div>
        </FadeIn>

        {/* Winner callout */}
        <FadeIn delay={200}>
          <div className="mt-8 p-6 rounded" style={{ background: 'linear-gradient(135deg, var(--color-secondary-light), white)', borderLeft: '3px solid var(--verde-estructura)' }}>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-[160px] h-[160px] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center product-image-container">
                <Image src={topProduct.imagen} alt={topProduct.imagen_alt} width={160} height={160} className="object-contain p-1" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary)' }}>Nº 1 · {NOMBRE_FRANJA.B}</p>
                <h2 className="text-xl font-semibold mt-1" style={{  color: 'var(--text-primary)' }}>
                  {topProduct.nombre}
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{topProduct.veredicto}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="tabular-nums text-2xl font-bold">
                    {nota(topProduct.puntuacion.total)}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>sobre 10</span>
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
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{coma(product.rating)}&#9733;</p>
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
                        style={{ color: 'var(--bs-tinta)' }}
                      >
                        {nota(product.puntuacion.total)}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <AffiliateButton asin={asin} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              <AvisoAfiliadoTabla />
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
                <p className="editorial-mark" style={{ color: 'rgba(255,255,255,0.5)' }}>Sección I</p>
                <p className="text-lg mt-1" style={{  color: 'white' }}>
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
          // El texto editorial sale del catálogo: una sola fuente de verdad,
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
                      <p className="editorial-mark" style={{ color: 'rgba(255,255,255,0.5)' }}>Sección II</p>
                      <p className="text-lg mt-1" style={{  color: 'white' }}>
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
                      <p className="editorial-mark" style={{ color: 'rgba(255,255,255,0.5)' }}>Sección III</p>
                      <p className="text-lg mt-1" style={{  color: 'white' }}>
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
                className={`py-12 ${hasBand ? '' : ''}`}
                style={hasBand ? { background: 'var(--bg-secondary)' } : {}}
              >
                <div className="max-w-5xl mx-auto px-6">
                  <FadeIn delay={i * 50}>
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="editorial-number text-5xl" style={{ opacity: 0.12 }}>{String(i + 1).padStart(2, '0')}</span>
                      <h2 className="text-2xl" style={{  color: 'var(--text-primary)' }}>
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
                            { label: "Tablero", value: product.incluye_tablero ? `${product.specs.ancho_tablero_cm}x${product.specs.profundidad_tablero_cm} cm` : "Sin tablero" },
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
                      <div className="mt-5 max-w-3xl pl-6" style={{ borderLeft: '2px solid var(--verde-estructura)', opacity: 0.9 }}>
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

                    {rutaFicha(product) && (
                      <p className="mt-3 text-sm">
                        <Link href={rutaFicha(product)!} className="underline" style={{ color: 'var(--verde-estructura)' }}>
                          Ficha completa del {product.marca} {product.modelo}
                        </Link>
                      </p>
                    )}

                    <div className="mt-4">
                      <FranjaPrecio product={product} />
                      <AffiliateButton asin={asin} size="lg" />
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
            <h2 className="text-2xl mb-8 heading-accent" style={{  color: 'var(--text-primary)' }}>
              Como elegir el mejor escritorio elevable
            </h2>
            <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {[
                { title: "El motor: simple vs doble", text: `El doble reparte el esfuerzo entre las dos patas: en el catálogo, los de doble motor mueven entre ${rango(dobles.map((p) => p.specs.peso_max_carga_kg))} kg, y los de uno, entre ${rango(simples.map((p) => p.specs.peso_max_carga_kg))}. Si cambias de posición 4+ veces al día con un setup pesado, merece la pena. Si lo mueves dos veces al día con un portátil, el simple cumple.` },
                { title: "Estabilidad: importa más de lo que crees", text: "De pie, el escritorio está a 110-120 cm y cualquier vibración se amplifica. Si la pantalla tiembla al teclear, te cansas la vista. Busca doble motor y una estructura robusta. En los baratos hay que aceptar algo de movimiento." },
                { title: "Ruido: ojo si haces videollamadas", text: `No todas las fichas lo declaran. Las que sí: entre ${rango(ruidos(simples))} dB los de un motor y entre ${rango(ruidos(dobles))} dB los de doble motor. Si cambias de altura durante una llamada, 50 dB se oyen.` },
                { title: "Rango de altura: ojo si eres alto", text: `Los de un motor del catálogo suben hasta entre ${rango(alturas(simples))} cm; los de doble motor, entre ${rango(alturas(dobles))} cm. Si eres alto y trabajas de pie, un escritorio que se queda corto te obliga a encorvarte. El que más sube es el ${masAlto.marca} ${masAlto.modelo}, hasta ${coma(masAlto.specs.rango_altura_max_cm)} cm. La calculadora de altura te dice cuánto necesitas.` },
                { title: "Garantía y postventa", text: "Pocas fichas declaran los años: el MAIDeSITe S2 Pro da cinco; los Flexispot, cinco en la estructura y tres en el motor; el SANODESK, tres. En el resto cuenta la garantía legal. Si puedes elegir, más años siempre \u2014 tiene electrónica y partes móviles." },
                { title: "Anticolisión: no te la juegues", text: `Para el motor si detecta un obstáculo al bajar. Sin anticolisión, el motor sigue y puede romper cajones o el propio mecanismo.${anticolisionBarato ? ` Entre los que vienen con tablero, el más asequible que la declara es el ${anticolisionBarato.marca} ${anticolisionBarato.modelo}.` : ""} Si la ficha no la menciona, no des por hecho que la tiene.` },
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
            <h2 className="text-lg font-semibold mb-3" style={{  color: 'var(--text-primary)' }}>
              Guias relacionadas
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <Link href="/escritorio-elevable-barato" className="underline" style={{ color: 'var(--verde-estructura)' }}>Mejores escritorios elevables baratos</Link> &mdash; Si vas a la gama de entrada, esta guía entra más al detalle.
              </p>
              <p>
                <Link href="/flexispot-eg1-opiniones" className="underline" style={{ color: 'var(--verde-estructura)' }}>FLEXISPOT EG1: ficha completa</Link> &mdash; El marco más asequible del catálogo, con su nota desglosada.
              </p>
              <p>
                <Link href="/flexispot-vs-maidesite" className="underline" style={{ color: 'var(--verde-estructura)' }}>Flexispot vs Maidesite: comparativa</Link> &mdash; Las dos marcas más vendidas cara a cara. ¿Cuál merece la pena?
              </p>
            </div>
          </section>
        </FadeIn>

        {/* FAQ */}
        <section className="mt-16 mb-8 max-w-3xl">
          <FadeIn>
            <div className="p-8 rounded" style={{ background: 'var(--bg-secondary)' }}>
              <h2 className="text-2xl mb-2 heading-accent" style={{  color: 'var(--text-primary)' }}>
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
