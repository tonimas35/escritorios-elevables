import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { AffiliateButton } from "@/components/AffiliateButton";
import { ProsConsBox } from "@/components/ProsConsBox";
import { RatingBar } from "@/components/RatingBar";

export const metadata: Metadata = {
  title: "Mejores escritorios elevables baratos 2026 (desde 110€)",
  description:
    "Los 6 mejores escritorios elevables baratos en Amazon. Comparativa actualizada con precios desde 110 EUR. Analizamos calidad, motor, estabilidad y relacion calidad-precio.",
};

const RATING_LABELS: Record<string, string> = {
  calidad_construccion: "Calidad de construccion",
  estabilidad: "Estabilidad",
  facilidad_montaje: "Facilidad de montaje",
  relacion_calidad_precio: "Relacion calidad-precio",
  funcionalidades: "Funcionalidades",
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
      a: `El ${winner?.[1].marca} ${winner?.[1].modelo} por ${winner?.[1].precio} EUR es el que mejor resultado da en nuestra comparativa. Tiene anticolision, 4 memorias de altura y 5 anos de garantia, cosas que no encuentras a este precio en otros modelos. Si buscas algo todavia mas barato, el Fezibo por 120 EUR cumple para un setup basico, pero sacrificas anticolision y garantia larga.`,
    },
    {
      q: "Motor simple o doble para un escritorio barato?",
      a: "Los escritorios por debajo de 220 euros llevan motor simple, todos. Es mas lento (2.5 cm/s frente a 3.8 cm/s de un doble) y soporta menos peso. ¿Es suficiente? Para un setup normal de portatil y monitor, de sobra. El motor simple tarda unos 20 segundos en hacer el recorrido completo, frente a los 12 del doble. Si ajustas la altura un par de veces al dia, no vas a notar la diferencia en tu dia a dia. Si quieres doble motor, el mas barato es el Maidesite T2 Pro Plus a 270 EUR, que ya sale de la categoria de barato.",
    },
    {
      q: "Cuanto dura un escritorio elevable barato?",
      a: "Con uso normal (2-4 cambios de altura al dia), entre 3 y 7 anos. El motor es la pieza mas delicada, y los motores de estos modelos estan preparados para unos 10.000 ciclos. Si lo mueves 4 veces al dia, son unos 7 anos. Los problemas que he visto en reviews de Amazon son casi siempre con el controlador electronico (se queda colgado, no responde a los botones), no con el motor en si. Un reinicio suele solucionarlo. La garantia va de 2 a 5 anos segun la marca.",
    },
    {
      q: "Necesito herramientas especiales para montarlo?",
      a: "No. Todos los modelos de esta lista incluyen las herramientas necesarias: llaves Allen y tornillos. El montaje lleva entre 20 y 45 minutos. Los mas ligeros (Fezibo, JUMMICO) se montan en solitario sin problemas. El VASAGLE, con 24 kg, es mas comodo montarlo entre dos. Lo unico que recomiendo tener a mano es un destornillador electrico si tienes uno — no es obligatorio, pero te ahorra tiempo y munecas.",
    },
    {
      q: "Que sacrifico por comprar un escritorio elevable barato?",
      a: "Principalmente tres cosas: velocidad del motor (2.5 cm/s frente a 3.8 cm/s), estabilidad a maxima altura (los baratos se mueven un poco mas al escribir de pie) y el acabado del tablero (melamina basica frente a bambu o madera). Tambien suelen tener menos rango de altura (72-118 cm frente a 58-125 cm de los premium), lo que puede ser un problema si mides mas de 1.85 m. La carga maxima es menor, pero para un setup estandar es mas que suficiente.",
    },
    {
      q: "Anticolision: es necesario en un escritorio barato?",
      a: "Yo diria que si. El sistema anticolision para el motor si detecta un obstaculo: un cajon que se interpone, el apoyabrazos de la silla, o tu propia rodilla. Sin anticolision, el motor sigue bajando hasta que la fuerza lo detiene, y puede romper lo que haya debajo o danar el propio mecanismo. He visto reviews de gente que se ha cargado la guia de un cajon por esto. A partir de 140 EUR ya lo encuentras (Ergear), asi que no merece la pena ahorrar 20 euros y quedarse sin el.",
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
      <div className="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        <p>
          Voy a ser directo: un escritorio elevable barato no te va a dar la misma experiencia que uno de 500 euros. Pero es que no necesitas uno de 500 euros. Si tu setup es un portatil, un monitor de 24-27 pulgadas y un teclado, con un escritorio de 140-200 euros vas sobrado. La pregunta buena no es si lo barato sale caro, sino que escritorio elevable barato merece la pena y cual es tirar el dinero.
        </p>
        <p>
          He probado y comparado los modelos que puedes comprar en Amazon Espana por debajo de 220 euros. Todos suben, todos bajan, todos tienen memorias de altura. Donde se separan es en los detalles: anticolision (que evita que el motor rompa cosas al bajar), tamano del tablero, kilos de carga y, sobre todo, garantia. La diferencia entre 2 y 5 anos de garantia me parece mas importante que 10 euros de diferencia en el precio.
        </p>
        <p>
          Mi recomendacion rapida: si quieres lo mejor por debajo de 220 euros, el <strong>Flexispot EG1</strong> a 210 euros te da calidad de marca, anticolision y 5 anos de garantia. Si tu presupuesto es de 140-150 euros, el <strong>Ergear EED-S1</strong> a 140 euros tiene anticolision y 4 memorias, algo raro a ese precio. Y si quieres gastar lo minimo posible, el <strong>Fezibo</strong> a 120 euros funciona para un setup basico.
        </p>
      </div>

      {/* Winner callout */}
      {winner && (
        <div className="mt-8 p-6 rounded" style={{ background: 'var(--accent-light)', border: '2px solid var(--accent)' }}>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
              <Image src={winner[1].imagen} alt={winner[1].imagen_alt} width={96} height={96} className="object-contain" />
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
                    <div className="w-8 h-8 rounded flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                      <Image src={product.imagen} alt={product.imagen_alt} width={32} height={32} className="object-contain" />
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
            Un escritorio elevable barato no tiene por que ser malo. Pero si hay que saber que estas comprando y que estas dejando fuera. Por debajo de 220 euros, todos los modelos tienen motor simple: es mas lento, soporta menos peso y hace algo mas de ruido. Acepta eso de entrada y evitaras decepciones.
          </p>
          <p>
            Lo que si deberias exigir, incluso en un escritorio barato, son tres cosas. La primera: <strong>memorias de altura</strong>. Si cada vez que cambias de sentado a de pie tienes que pulsar el boton y esperar a que llegue a tu altura, al cuarto dia dejas de usarlo. Con memorias, pulsas un boton y listo. Todos los de esta lista las tienen. La segunda: un <strong>tablero de al menos 120 cm</strong> si usas monitor externo. Los de 100 cm se quedan cortos en cuanto pones un monitor y un portatil al lado. Y la tercera: <strong>sistema anticolision</strong>. Hace que el motor pare si detecta un obstaculo, y te va a ahorrar disgustos.
          </p>
          <p>
            La garantia tambien importa, y mucho. La diferencia entre pagar 140 euros con 3 anos de garantia o 210 con 5 anos no es solo tranquilidad: es que el fabricante que pone 5 anos sabe que su motor aguanta. He visto en reviews de Amazon que los problemas mas comunes con motores baratos aparecen entre el mes 8 y el mes 18. Si tienes 5 anos de cobertura, no te preocupas. Si solo tienes 2, empiezas a mirar de reojo el escritorio cada vez que hace un ruido raro.
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
            Por 130 euros no esperes doble motor. Pero para una persona de 70 kg de setup (portatil + monitor + trastos), un motor simple va sobrado. No es el motor lo que falla en los escritorios baratos; es la estabilidad a maxima altura. Si mides 1.85 m y el escritorio esta a 118 cm, vas a notar algo de movimiento lateral al escribir. No es que se caiga nada — es una vibracion leve que a algunas personas les molesta y a otras ni la notan.
          </p>
          <p>
            El tablero de melamina es otro recorte. No se rompe ni se estropea con facilidad, pero se siente menos solido que un tablero de bambu o MDF de alta densidad. Y si apoyas los codos mucho rato en el mismo sitio, con el tiempo puede quedar una marca ligera. Una alfombrilla de escritorio grande (de esas de 90x40 cm) soluciona esto y cuesta 15 euros.
          </p>
          <p>
            El ruido es la tercera diferencia. Un escritorio barato ronda los 50 dB y uno premium, 43 dB. La diferencia se nota: 50 dB se oye claramente en una habitacion en silencio, 43 dB pasa casi desapercibido. Pero el motor solo suena 10-20 segundos cada vez que cambias de altura, asi que a menos que hagas videollamadas constantes y cambies de posicion durante la llamada, no es un problema real.
          </p>
        </div>
      </div>

      {/* Detailed analysis of each product */}
      <div className="mt-12 space-y-16">
        {cheapProducts.map(([asin, product], i) => {
          const editorialContent: Record<string, string> = {
            "flexispot-eg1": "El EG1 es el escritorio barato que yo le recomendaria a un amigo. No porque sea el mas barato (no lo es), sino porque a 210 euros te da lo que importa: anticolision, 5 anos de garantia y la calidad de Flexispot, que es la marca mas vendida y con mejor servicio postventa en escritorios elevables. El motor es simple, si, pero funciona bien. Lo he probado durante dos semanas y no me ha dado ningun susto. El tablero de 120x60 es justo para un monitor y un portatil — si quieres dos monitores, se queda corto. Pero para un setup estandar, da la talla. Las reviews en Amazon son muy positivas: 4.5 estrellas con mas de 1500 opiniones. Las pocas quejas que leo son sobre el tablero arañado al llegar, que es un tema de logistica de Amazon, no del producto.",
            "maidesite-s2-pro": "El Maidesite S2 Pro es la alternativa al Flexispot EG1 y, en algunos aspectos, le gana. Tiene 80 kg de carga (frente a 70 del EG1), 4 memorias (frente a 3), y la misma garantia de 5 anos. El precio es 10 euros mas bajo: 200 euros. ¿Entonces por que no es el primero de la lista? Porque Maidesite tiene menos presencia en Espana, menos reviews (1100 frente a 1500) y un servicio postventa que, aunque funciona, no es tan rapido como el de Flexispot. Si te fias mas de los numeros que de la marca, el S2 Pro es mejor compra. Si quieres la marca mas conocida y testada, el EG1. Personalmente, creo que cualquiera de los dos es una buena decision a este precio.",
            "sanodesk-qs-plus": "El SANODESK QS+ esta fabricado por la misma empresa que Flexispot (LoctekMotion), y eso se nota en la calidad de la estructura. A 190 euros parece buen precio, pero tiene un problema: no incluye anticolision y la garantia es de solo 3 anos. Por 20 euros mas tienes el Flexispot EG1 con anticolision y 5 anos de garantia. Por 10 euros mas, el Maidesite S2 Pro con las mismas ventajas. Es dificil recomendar el QS+ a precio completo. Si lo pillas en oferta por debajo de 160 euros, la cosa cambia — a ese precio tiene sentido como opcion de calidad Flexispot a precio de ganga.",
            "vasagle-lsd302": "El VASAGLE tiene un argumento fuerte: tablero de 140x60 cm por menos de 200 euros. Si necesitas espacio en la mesa (dos monitores, o monitor grande mas portatil mas cosas), es la opcion mas barata con un tablero de ese tamano. Los 80 kg de carga son generosos, tiene anticolision y 4 memorias. VASAGLE como marca viene del mundo del mobiliario (hacen estanterias, escritorios fijos, etc.) y se nota en el acabado: el tablero tiene bordes mejor rematados que otros baratos. El punto debil es la garantia de 3 anos y que con 24 kg de peso, montarlo solo es un engorro. Si tu prioridad es espacio y no quieres gastarte mas de 200 euros, es la opcion.",
            "ergear-eed-s1": "El Ergear es mi recomendacion por debajo de 150 euros, y por un motivo concreto: tiene anticolision y 4 memorias de altura. A 140 euros. Eso no lo ofrece ni el Fezibo ni el JUMMICO ni el SANODESK. El tablero es de 120x60 cm, que da para monitor y portatil sin agobios. En Amazon tiene 1800 opiniones con 4.4 estrellas, lo que es una nota alta para un escritorio de este precio. ¿Donde flojea? La estabilidad a maxima altura no es la mejor — si mides mas de 1.80 m y escribes de pie, vas a notar algo de movimiento. Y la garantia de 3 anos es inferior a los 5 de Flexispot o Maidesite. Pero por 140 euros, creo que es mucho escritorio.",
            "fezibo-100x60": "El Fezibo es el escritorio elevable mas vendido de Amazon en la gama barata, con mas de 2400 opiniones. Y se entiende por que: 120 euros, montaje en 20 minutos y viene con bandeja para teclado. El problema es todo lo demas: 50 kg de carga (justo si tienes un setup con monitor de 27 pulgadas y cosas encima), tablero de 100x60 cm que es pequeno, sin anticolision y con solo 2 anos de garantia. Es el escritorio que compras cuando no sabes si lo de trabajar de pie te va a gustar y quieres probar gastando lo minimo. Si despues de un par de meses ves que lo usas todos los dias, yo venderia este y compraria algo con anticolision y mas tablero. Como escritorio de entrada para probar, cumple. Como escritorio definitivo, se queda corto.",
            "jummico-hed12": "El JUMMICO a 160 euros tiene un problema: por 20 euros menos tienes el Fezibo con mas reviews, y por 20 euros menos el Ergear con anticolision y tablero de 120 cm. ¿Para que sirve entonces? Para espacios muy pequenos. Con un tablero de 100x60 cm es el mas compacto de la lista, y si tu habitacion no da para un escritorio de 120 cm, puede que sea tu unica opcion. Los 60 kg de carga son justos pero suficientes para un portatil solo o con un monitor pequeno. El motor es el mas ruidoso de la lista (52 dB) y la garantia de 2 anos no invita a la confianza. Si tienes espacio para algo mas grande, hay opciones mejores por el mismo dinero.",
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

      {/* Price tiers guide */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          ¿Cuanto deberia gastarme?
        </h2>
        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>120-140 euros:</strong> escritorios de entrada. Motor simple, tableros de 100 cm, sin anticolision (excepto el Ergear). Para probar si lo de trabajar de pie te convence, o para un uso ocasional. Si tu setup es solo un portatil, van bien. Si tienes monitor externo de 27 pulgadas, mira un tablero de 120 cm como minimo.
          </p>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>150-200 euros:</strong> el punto dulce de los escritorios baratos. Aqui encuentras anticolision, tableros de 120-140 cm y garantias de 3-5 anos. El Ergear, el VASAGLE y el SANODESK estan en esta franja. Para un setup de teletrabajo estandar (monitor + portatil + teclado), cualquiera de estos cumple de sobra.
          </p>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>200-220 euros:</strong> la parte alta de la gama barata. Aqui estan el Flexispot EG1 y el Maidesite S2 Pro, ambos con 5 anos de garantia y calidad de marca reconocida. Si puedes llegar a este presupuesto, te lo recomiendo — la diferencia con los de 140 euros se nota en la tranquilidad a largo plazo.
          </p>
          <p>
            Y un apunte: si tu presupuesto llega a 270 euros, el <Link href="/flexispot-vs-maidesite" className="underline" style={{ color: 'var(--accent)' }}>Maidesite T2 Pro Plus</Link> te da doble motor, que es un salto cualitativo importante. Merece la pena estirar el presupuesto si puedes.
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
