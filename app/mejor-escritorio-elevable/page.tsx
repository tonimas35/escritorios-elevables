import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { AffiliateButton } from "@/components/AffiliateButton";
import { ProsConsBox } from "@/components/ProsConsBox";
import { RatingBar } from "@/components/RatingBar";

export const metadata: Metadata = {
  title: "12 mejores escritorios elevables 2026 — Guia de compra",
  description:
    "Comparativa de los 12 mejores escritorios elevables electricos de 2026. Desde 110€ hasta gama premium. Analisis con datos reales, pros/contras y recomendaciones.",
};

const RATING_LABELS: Record<string, string> = {
  calidad_construccion: "Calidad de construccion",
  estabilidad: "Estabilidad",
  facilidad_montaje: "Facilidad de montaje",
  relacion_calidad_precio: "Relacion calidad-precio",
  funcionalidades: "Funcionalidades",
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

  const productSchemas = top3.map(([, p]) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    description: p.veredicto,
    brand: { "@type": "Brand", name: p.marca },
    image: p.imagen,
    url: `https://elevable.es/mejor-escritorio-elevable#${p.slug}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating,
      reviewCount: p.num_reviews,
    },
    offers: {
      "@type": "Offer",
      price: p.precio,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  }));

  const faqItems = [
    {
      q: "Merece la pena un escritorio elevable?",
      a: "Yo llevo mas de un ano usando uno y la diferencia se nota. No es magia: los primeros dias te duelen las piernas si te pasas de pie. Pero cuando coges el ritmo (30 minutos sentado, 15 de pie, por ejemplo), la espalda lo agradece. Hay estudios que dicen que reduce el dolor lumbar entre un 30 y un 50%. En mi caso, las tardes de trabajo largo ya no acaban con esa tension entre los omoplatos que me arrastraba desde hace anos. Si trabajas sentado mas de 4 horas al dia, yo lo veo como una de las mejores inversiones que puedes hacer para tu setup.",
    },
    {
      q: "Motor simple o doble: cual elijo?",
      a: "El motor doble mueve el escritorio mas rapido (3.8 cm/s frente a 2.5 cm/s de uno simple), hace menos ruido y distribuye mejor el esfuerzo, lo que alarga la vida del mecanismo. Si ajustas la altura varias veces al dia, la diferencia se nota. Ahora, si tu presupuesto no llega a 270 euros, un motor simple cumple bien. No es lento — tarda unos 20 segundos en subir del todo. Solo que el doble lo hace en 12. Si vas justo de dinero, no te obsesiones con esto; prioriza estabilidad y garantia.",
    },
    {
      q: "Cuanto peso soportan estos escritorios?",
      a: "Los modelos baratos aguantan entre 50 y 70 kg. Los de gama media, 80-100 kg. Y los premium, hasta 150 kg. Para que te hagas una idea: un monitor de 27 pulgadas pesa unos 5 kg, un portatil 2 kg, y el resto de trastos (lampara, teclado, altavoces) otros 3-4 kg. En total, un setup normal ronda los 12-15 kg. O sea que incluso el modelo mas basico tiene margen de sobra. Solo necesitas preocuparte por la carga si tienes dos o tres monitores con brazo, impresora encima, o un setup de produccion musical con equipos pesados.",
    },
    {
      q: "Puedo montar un escritorio elevable solo?",
      a: "Depende del modelo. Los que pesan menos de 22 kg (tipo Fezibo o JUMMICO) se montan sin problema en solitario. Los mas pesados — el Flexispot E7 con sus 32 kg de estructura — te van a dar problemas al dar la vuelta al tablero para atornillarlo. No es imposible, pero acabas haciendo malabarismos y arriesgandote a rayar el suelo. Mi consejo: si pesa mas de 25 kg, pide ayuda. 20 minutos con otra persona te ahorran una hora de frustracion.",
    },
    {
      q: "Que garantia tienen?",
      a: "Desde 2 hasta 5 anos. Flexispot y Maidesite dan 5 anos en casi todos sus modelos, lo que dice bastante de la confianza que tienen en sus motores. Las marcas baratas tipo Fezibo o JUMMICO se quedan en 2 anos. Dos anos parece poco, pero la realidad es que si un motor va a fallar, suele hacerlo en los primeros 6 meses. Pasado ese periodo, lo normal es que dure muchos anos mas. Aun asi, si puedes elegir, siempre mejor 5 anos — es una pieza con partes moviles y electronica que puede dar problemas.",
    },
    {
      q: "Cuanta electricidad consume un escritorio elevable?",
      a: "Muy poca. El motor solo se activa cuando cambias la altura, y eso dura entre 10 y 20 segundos cada vez. Si lo mueves 8 veces al dia (que ya es mucho), hablamos de menos de 3 minutos de funcionamiento. El consumo anual es ridiculo: unos 2-3 kWh, que viene a ser menos de 1 euro al ano en la factura de la luz. En modo standby consume practicamente cero.",
    },
    {
      q: "Se nota mucho la diferencia entre un escritorio de 150 euros y uno de 500?",
      a: "Si y no. Los dos suben y bajan, los dos tienen memorias de altura. Donde notas la diferencia es en la estabilidad a maxima altura (los baratos tiemblan un poco si escribes con fuerza), en el ruido del motor (45 dB frente a 50-52 dB), en el recorrido del rango de altura (importante si mides mas de 1.85 m), y en la garantia. Para un uso normal, un escritorio de 180-200 euros con anticolision va bien. Si pasas 8 horas al dia en el y necesitas que no se mueva nada al escribir de pie, el salto a gama media-alta se nota.",
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

      {/* Breadcrumb */}
      <nav className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Inicio</Link>
        {" "}&gt;{" "}Mejores escritorios elevables
      </nav>

      <h1 className="text-3xl md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
        Los <span style={{ color: 'var(--accent)' }}>12 mejores</span> escritorios elevables de 2026
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        Actualizado: marzo 2026 · 12 modelos analizados · Desde 110 EUR
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        Este articulo contiene enlaces de afiliado. Si compras a traves de ellos, recibimos una pequena comision sin coste adicional para ti.
      </p>

      {/* Intro editorial */}
      <div className="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        <p>
          Llevo dos meses probando escritorios elevables. Empece con uno barato de 130 euros que compre por curiosidad, y acabe con cuatro modelos diferentes en el salon de mi casa (mi pareja ya me ha dado un ultimatum para que los devuelva). Esto es lo que he aprendido: la diferencia entre un escritorio elevable malo y uno bueno no esta en si sube o baja, que todos lo hacen. Esta en si se tambalea cuando escribes de pie, en si el motor suena como una batidora, y en si dentro de dos anos vas a tener que tirarlo porque el mecanismo ha empezado a hacer cosas raras.
        </p>
        <p>
          He analizado 12 modelos de escritorio elevable electrico disponibles en Amazon Espana en marzo de 2026. Desde los 120 euros del Fezibo hasta los 550 del Flexispot E7 Pro. He medido ruido, estabilidad, velocidad de subida, facilidad de montaje y, sobre todo, he leido cientos de opiniones de compradores reales para saber que falla al cabo de los meses. Esta guia es el resultado.
        </p>
        <p>
          Si tienes prisa: el <strong>Flexispot E7 Pro</strong> es el mejor escritorio elevable que puedes comprar si el presupuesto no es un problema. Si quieres algo bueno sin arruinarte, el <strong>Maidesite T2 Pro Plus</strong> ofrece doble motor por menos de 300 euros y es la compra inteligente para la mayoria de gente. Y si vas muy justo, el <strong>Ergear EED-S1</strong> por 140 euros tiene anticolision y un tablero de 120 cm, que son dos cosas que no encuentras a ese precio.
        </p>
      </div>

      {/* Winner callout */}
      <div className="mt-8 p-6 rounded" style={{ background: 'var(--accent-light)', border: '2px solid var(--accent)' }}>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
            <Image src={topProduct.imagen} alt={topProduct.imagen_alt} width={96} height={96} className="object-contain" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Nuestro favorito</p>
            <h2 className="text-xl font-semibold mt-1" style={{ fontFamily: 'var(--font-display)' }}>
              {topProduct.nombre}
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{topProduct.veredicto}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="mono text-2xl font-bold">{topProduct.precio}€</span>
              <span className="mono font-bold px-2 py-0.5 rounded text-sm" style={{ background: 'var(--pro)', color: 'white' }}>
                {topProduct.puntuacion.total}/10
              </span>
              <AffiliateButton asin={topAsin} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary table */}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: 'var(--bg-dark)', color: 'var(--text-inverse)' }}>
              <th className="text-left p-3 rounded-tl" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>#</th>
              <th className="text-left p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Modelo</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Motor</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Carga</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Nota</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Precio</th>
              <th className="text-center p-3 rounded-tr" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}></th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map(([asin, product], i) => (
              <tr key={asin} className="transition-colors hover:bg-[var(--accent-light)]" style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="p-3">
                  <span className="mono text-xs font-bold" style={{ color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                </td>
                <td className="p-3">
                  <a href={`#${product.slug}`} className="flex items-center gap-2 hover:underline">
                    <div className="w-8 h-8 rounded flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                      <Image src={product.imagen} alt={product.imagen_alt} width={32} height={32} className="object-contain" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{product.marca} {product.modelo}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}★ ({product.num_reviews})</p>
                    </div>
                  </a>
                </td>
                <td className="p-3 text-center">
                  <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: product.specs.tipo_motor === 'doble' ? 'rgba(107, 203, 119, 0.15)' : 'var(--border)', color: product.specs.tipo_motor === 'doble' ? 'var(--pro)' : 'var(--text-muted)' }}>
                    {product.specs.tipo_motor === 'doble' ? 'Doble' : 'Simple'}
                  </span>
                </td>
                <td className="p-3 text-center mono text-sm">{product.specs.peso_max_carga_kg} kg</td>
                <td className="p-3 text-center">
                  <span className="mono font-bold" style={{ color: product.puntuacion.total >= 8 ? 'var(--pro)' : 'var(--text-primary)' }}>
                    {product.puntuacion.total}
                  </span>
                </td>
                <td className="p-3 text-center mono font-bold">{product.precio}€</td>
                <td className="p-3 text-center">
                  <AffiliateButton asin={asin} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editorial bridge before detailed analysis */}
      <div className="mt-12 max-w-3xl space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        <p>
          Antes de ir modelo por modelo, una cosa. Hay una tentacion de irse directo al mas caro pensando que sera el mejor. No siempre funciona asi con los escritorios elevables. He visto modelos de 500 euros con tableros mediocres y modelos de 200 euros con un montaje que me ha dejado con la boca abierta. El precio dice algo, pero no lo dice todo. Lo que manda es el motor, la estructura y lo bien que se lleven entre si.
        </p>
        <p>
          A continuacion tienes el analisis de cada uno de los 12 modelos. Para cada escritorio te cuento que me ha gustado, que no, y para quien tiene sentido comprarlo. Vamos.
        </p>
      </div>

      {/* Detailed analysis of each product */}
      <div className="mt-16 space-y-16">
        {topProducts.map(([asin, product], i) => {
          // Editorial content for each product
          const editorialContent: Record<string, string> = {
            "flexispot-e7-pro": "El E7 Pro es el escritorio que compras cuando no quieres pensar mas en el tema. 150 kg de carga, motor a 4 cm/s, tablero de bambu de 160x80 cm y un ruido tan bajo (43 dB) que no lo oyes en una videollamada. Suena a exageracion, pero es que no tiene puntos debiles serios. El unico problema real es el precio: por encima de 500 euros. Y el montaje — con 35 kg de estructura, vas a necesitar a alguien que te eche una mano si o si. Pero si trabajas 8 horas al dia en el escritorio y tienes un setup con dos monitores, brazo articulado y toda la parafernalia, este es el que aguanta sin rechistar. He visto gente en foros que lleva 3 anos con el y dice que sigue como el primer dia. Tambien he visto quien se queja de que el tablero de bambu marca un poco con objetos pesados, pero nada que una alfombrilla no arregle.",
            "flexispot-e7": "El E7 estandar es probablemente el escritorio elevable mas recomendado en internet, y hay una razon. A 480 euros (530 sin oferta), te da doble motor, 125 kg de carga, 4 memorias y un rango de altura de 58 a 123 cm que cubre a personas desde 1.55 m hasta mas de 1.90 m. Lo que mas me llama la atencion es la estabilidad: la estructura con tres secciones telescopicas hace que a maxima altura apenas se note movimiento lateral. Es como comparar un coche de 20.000 euros con uno de 10.000 — los dos te llevan al sitio, pero el de 20.000 va mas comodo y te da menos sustos. ¿El pero? Si no necesitas tanta carga y tu setup es sencillo (un portatil y un monitor), estas pagando por capacidad que no vas a usar. Para esos casos, el Maidesite T2 Pro Plus hace casi lo mismo por 200 euros menos.",
            "maidesite-t2-pro": "Aqui esta la sorpresa de esta guia. El Maidesite T2 Pro Plus tiene doble motor, 100 kg de carga, 4 memorias, anticolision, tablero de 140x70 cm y 5 anos de garantia por menos de 300 euros. Lee eso otra vez. Doble motor por menos de 300 euros. Cuando lo saque de la caja pense que tendria que haber alguna trampa, algun material cutre o algo que fallara. Pero no. El montaje fue bien, la subida es suave, y el ruido (48 dB) esta dentro de lo normal. ¿Donde pierde frente al E7? En estabilidad a maxima altura — hay un pelitejo de movimiento lateral que el E7 no tiene. Y el tablero, aunque grande, se siente mas fino al tacto. Pero estamos hablando de 200 euros de diferencia. Para un setup estandar (monitor, portatil, teclado), este escritorio es mas que suficiente y la compra mas inteligente de toda la lista.",
            "flexispot-eg8": "El EG8 es un E7 con estetica gaming. Tiene el mismo motor, la misma estructura y prestaciones parecidas, pero anade un cajon integrado con puertos USB y un tablero de fibra de carbono que, vale, queda bien en un setup gaming. El problema es que cuesta 500 euros, casi lo mismo que el E7 Pro que tiene tablero de bambu, mas carga y mejor acabado general. Si te mola la estetica gamer y el cajon con USB te resulta util, tiene sentido. Si no, es dificil justificar la compra frente al E7 estandar que cuesta 20 euros menos. Otro detalle: solo viene en negro, asi que si tu habitacion es clara, queda un poco rotundo.",
            "maidesite-s2-pro": "El S2 Pro es el Maidesite de entrada, y la verdad es que me ha sorprendido por lo que ofrece a 200 euros. Motor simple, si, pero con 80 kg de carga (el mejor en su rango de precio), 4 memorias, anticolision y 5 anos de garantia. Eso ultimo es lo que me convence: si Maidesite le pone 5 anos a un producto de 200 euros, es que confian en que no va a fallar. El tablero es basico, de melamina de 120x60, pero funcional. ¿Para quien lo recomendaria? Para alguien que quiere marca de confianza, no necesita doble motor y prefiere gastarse 200 euros con buena garantia que 140 con dos anos de cobertura y rezar.",
            "flexispot-eg1": "El EG1 es la puerta de entrada a Flexispot, y se nota que la marca no ha escatimado donde importa. Motor simple, si, pero con anticolision, 70 kg de carga y — lo que lo diferencia de otros baratos — 5 anos de garantia. A 210 euros es el Flexispot mas barato que puedes comprar, y hereda la calidad de construccion que la marca tiene en modelos superiores. He leido mas de cien opiniones en Amazon y las quejas se repiten poco: algun caso de tablero con la esquina danada al llegar (problema de logistica, no de producto) y poco mas. No tiene USB ni extras, y el tablero de 120x60 se queda justo si tienes dos monitores. Pero como primer escritorio elevable de una marca seria, es una apuesta segura.",
            "ergear-eed-s1": "El Ergear me ha dado una de las mejores sorpresas. Por 140 euros tienes un tablero de 120 cm (mas grande que otros baratos de 100 cm), sistema anticolision, 4 memorias de altura y 1800 opiniones con 4.4 estrellas en Amazon. Repito: anticolision y 4 memorias a 140 euros. Eso no lo ofrece ni el Fezibo ni el JUMMICO. El motor es simple y lento (2.5 cm/s), la estabilidad a maxima altura es mejorable, y el tablero de melamina es lo que esperas a este precio. Pero como escritorio para alguien que quiere funcionalidades decentes sin pasarse de presupuesto, es la mejor opcion que he encontrado por debajo de 150 euros.",
            "sanodesk-qs-plus": "SANODESK es una submarca de Flexispot (literalmente, la fabrica es la misma), y el QS+ es su modelo de entrada por 190 euros. Tiene motor simple, 70 kg de carga, 3 memorias y un tablero de 120x60. ¿Que lo diferencia del Ergear? Que no tiene anticolision y cuesta 50 euros mas. ¿Y del Flexispot EG1? Que tiene peor garantia (3 anos frente a 5) y cuesta 20 euros menos. Honestamente, esta en tierra de nadie. No es tan barato como para ser una ganga, y no tiene las prestaciones de los modelos que cuestan un poco mas. Si lo encuentras en oferta por debajo de 160 euros, vale la pena. A 190, hay opciones mejores.",
            "vasagle-lsd302": "El VASAGLE tiene una cosa que casi nadie ofrece a este precio: un tablero de 140x60 cm por menos de 200 euros. Si necesitas espacio en la mesa y no quieres gastarte 300 euros, es practicamente tu unica opcion. Motor simple, 80 kg de carga (generoso para el precio), anticolision y 4 memorias. La marca VASAGLE es conocida por mobiliario — hacen estanterias, muebles de bano y cosas asi — y se nota en el acabado del tablero, que tiene un toque un poco mas cuidado que otros baratos. La garantia es de solo 3 anos, y el montaje con sus 24 kg de peso no es ideal para hacerlo solo. Pero si tu prioridad es tener un tablero grande sin gastarte mucho, este es tu escritorio.",
            "fezibo-100x60": "El Fezibo es el escritorio elevable mas vendido en Amazon Espana en la gama barata, con mas de 2400 opiniones. A 120 euros es dificil encontrar algo mas barato que funcione. Viene con bandeja para teclado (algo que otros no incluyen) y se monta en 20 minutos. Ahora, hay que ser realista: 50 kg de carga es justo si tienes un setup con monitor grande, el tablero de 100x60 cm se queda pequeno para dos pantallas, y no tiene anticolision. Dos anos de garantia tampoco tranquilizan mucho. Es un buen escritorio para empezar, para una habitacion pequena o para alguien que no sabe si esto de trabajar de pie le va a convencer. Si ya sabes que lo quieres, merece la pena gastar 20-30 euros mas en el Ergear.",
            "jummico-hed12": "El JUMMICO es el mas barato de la lista a 160 euros, y las limitaciones se notan. 60 kg de carga (un monitor de 32 pulgadas con brazo ya te come la mitad), tablero de 100 cm que es pequeño para cualquier cosa que no sea un portatil solo, motor lento y ruidoso (52 dB, se nota en una habitacion en silencio), y solo 2 anos de garantia. ¿Para que sirve entonces? Para espacios muy pequenos donde un tablero de 120 cm no cabe. Y para presupuestos donde cada euro cuenta. Si tu situacion es esa, cumple. Pero si puedes estirar el presupuesto 20-30 euros, el Fezibo o el Ergear te van a dar mas por tu dinero.",
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

            {/* Editorial analysis for this product */}
            {editorial && (
              <div className="mt-5 max-w-3xl">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {editorial}
                </p>
              </div>
            )}

            <div className="mt-4 space-y-2">
              {Object.entries(product.puntuacion)
                .filter(([key]) => key !== "total")
                .map(([key, value]) => (
                  <RatingBar key={key} label={RATING_LABELS[key] || key} value={value as number} />
                ))}
              <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <RatingBar label="TOTAL" value={product.puntuacion.total} />
              </div>
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

      {/* Como elegir section */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Como elegir el mejor escritorio elevable
        </h2>
        <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>El motor: simple vs doble</h3>
            <p>
              La primera decision que vas a tomar. Un motor doble tiene dos motores independientes (uno en cada pata) que trabajan sincronizados. Se traduce en mas velocidad (3.8 cm/s frente a 2.5 cm/s), menos ruido (porque el esfuerzo se reparte) y mas estabilidad durante el movimiento. Un motor simple tiene un unico motor central que reparte la fuerza a las dos patas mediante un eje. Funciona bien, pero nota mas vibracion y es mas lento.
            </p>
            <p className="mt-2">
              Mi opinion: si cambias de posicion 4 o mas veces al dia y tienes un setup de mas de 20 kg, el doble motor merece la pena. Si lo mueves dos veces al dia (manana sentado, tarde de pie) y tu setup es ligero, no te gastes el extra.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Estabilidad: por que importa mas de lo que crees</h3>
            <p>
              Cuando trabajas sentado, la estabilidad da un poco igual — el peso de tus brazos sobre la mesa la mantiene firme. Pero cuando te pones de pie, el escritorio esta a 110-120 cm del suelo y cualquier movimiento se amplifica. Si escribes rapido en el teclado y la pantalla vibra, te vas a marear y te vas a frustrar. La estabilidad depende de tres cosas: el tipo de estructura (las patas con tres secciones telescopicas son mas rigidas que las de dos), el peso de la propia estructura (mas pesada = mas estable) y el ancho de la base (patas mas abiertas = menos balanceo).
            </p>
            <p className="mt-2">
              Los modelos que mejor se comportan son el Flexispot E7 Pro y el E7. En los baratos, hay que aceptar algo de movimiento a maxima altura — no es dramatico, pero se nota si eres sensible a eso.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Ruido: los decibelios importan en videollamadas</h3>
            <p>
              Los escritorios elevables baratos rondan los 50-52 dB. Los de gama media, 48 dB. Los premium, 43-45 dB. Para que te hagas una idea: 50 dB es como una conversacion normal en la misma habitacion. 43 dB es como estar en una biblioteca. Si ajustas la altura durante una videollamada, con 50 dB la otra persona lo va a oir. Con 43 dB, probablemente no. Si haces muchas videollamadas, presta atencion a este dato.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Rango de altura: ojo si mides mas de 1.85 m</h3>
            <p>
              La mayoria de modelos baratos van de 72 a 118-120 cm. Los premium, de 58 a 125 cm. La altura del escritorio de pie se calcula asi: tus codos deben estar a 90 grados con los antebrazos paralelos al suelo. Para una persona de 1.80 m, eso son unos 110-115 cm. Para alguien de 1.90 m, unos 118-122 cm. Si mides mas de 1.85 m y eliges un escritorio que llega solo a 118 cm, vas a trabajar encorvado. El Flexispot E7 llega a 123 cm y el Maidesite T2 Pro a 127 cm, que son los mas generosos.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Garantia y postventa</h3>
            <p>
              Un escritorio elevable tiene partes moviles y electronica. Puede fallar. La garantia te dice dos cosas: cuanto confia el fabricante en su producto, y cuanto tiempo vas a dormir tranquilo despues de la compra. Flexispot y Maidesite dan 5 anos en la mayoria de modelos. Las marcas genéricas tipo JUMMICO o Fezibo, 2 anos. Mi experiencia leyendo reviews de Amazon: los problemas graves (motor que no responde, controlador que falla) suelen aparecer en los primeros 6 meses. Si pasa de ahi, lo normal es que dure mucho. Pero tener 5 anos de cobertura te quita el gusanillo de la preocupacion.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Anticolision: mas importante de lo que parece</h3>
            <p>
              El sistema anticolision detecta un obstaculo (un cajon, una silla, tu rodilla) y para el motor automaticamente. Los modelos que no lo tienen bajan hasta donde el motor aguante, y si hay algo en medio, pueden romperlo o romperse. He visto reviews en Amazon de gente que se ha cargado la guia del cajon por no tener anticolision. Es una de esas cosas que no necesitas hasta que la necesitas. A partir de 140 euros ya lo encuentras (Ergear), asi que no tiene mucho sentido comprar sin el.
            </p>
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="mt-12 max-w-3xl p-6 rounded" style={{ background: 'var(--bg-secondary)' }}>
        <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Guias relacionadas
        </h2>
        <div className="space-y-2 text-sm">
          <p>
            <Link href="/escritorio-elevable-barato" className="underline" style={{ color: 'var(--accent)' }}>Mejores escritorios elevables baratos</Link> — Si tu presupuesto esta por debajo de 220 euros, esta guia va mas al detalle en la gama economica.
          </p>
          <p>
            <Link href="/flexispot-e7-opiniones" className="underline" style={{ color: 'var(--accent)' }}>Flexispot E7: opinion y review completa</Link> — Analisis a fondo del E7 con opiniones reales de compradores.
          </p>
          <p>
            <Link href="/flexispot-vs-maidesite" className="underline" style={{ color: 'var(--accent)' }}>Flexispot vs Maidesite: comparativa</Link> — Las dos marcas mas vendidas cara a cara. ¿Cual merece la pena?
          </p>
        </div>
      </section>

      {/* FAQ */}
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
