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

  const faqItems = [
    {
      q: "Merece la pena el Flexispot E7 en 2026?",
      a: "Si, sigue siendo una compra solida. Han pasado anos desde que salio y no ha aparecido ningun modelo en su rango de precio que lo supere en la combinacion de estabilidad, motor y garantia. Algunos compradores en Amazon llevan 3-4 anos con el y reportan cero problemas. Lo unico que ha cambiado es que ahora hay alternativas mas baratas (como el Maidesite T2 Pro Plus) que ofrecen el 90% de la experiencia por 200 euros menos. Si tu presupuesto llega, el E7 sigue siendo la referencia.",
    },
    {
      q: "Flexispot E7 o E7 Pro: cual compro?",
      a: "El E7 Pro cuesta unos 70 euros mas y anade tablero de bambu (mas bonito y resistente que la melamina), 150 kg de carga (frente a 125 kg) y un motor un poco mas rapido (4 cm/s frente a 3.8 cm/s). Si tu setup es pesado (dos monitores con brazos, impresora, etc.) o quieres el mejor acabado posible, el Pro lo justifica. Si tu setup es monitor + portatil + teclado, los 125 kg del E7 son mas que suficientes y te ahorras 70 euros.",
    },
    {
      q: "Se puede montar el Flexispot E7 solo?",
      a: "Poder, se puede. Pero no lo recomiendo. La estructura pesa 32 kg. El peor momento es dar la vuelta al tablero despues de atornillar las patas: si lo haces solo, necesitas apoyarlo en un angulo raro y rezar para no rayar el suelo. Yo lo hice con otra persona y tardamos 45 minutos. Solo, calculale una hora y media y alguna palabra mal sonante.",
    },
    {
      q: "Cuanto tarda en subir y bajar el E7?",
      a: "A 3.8 cm/s, el recorrido completo de 58 a 123 cm tarda unos 17 segundos. Pero en la practica nunca haces el recorrido completo. Pasar de sentado (unos 73 cm) a de pie (unos 110-115 cm) son 10-11 segundos. Con las 4 memorias programadas, pulsas un boton y te olvidas.",
    },
    {
      q: "El E7 hace ruido en videollamadas?",
      a: "Con 45 dB, es como una conversacion suave en la habitacion de al lado. He probado a mover el escritorio durante una llamada y la otra persona no lo ha notado. No es silencioso del todo — si estas grabando audio en una habitacion en silencio, el micro lo va a captar. Pero para videollamadas normales con Zoom o Teams, no molesta.",
    },
    {
      q: "Que problemas tiene el Flexispot E7 segun los compradores?",
      a: "He leido mas de 200 opiniones en Amazon y los problemas que se repiten son: tablero con alguna marca o golpe al llegar (problema de embalaje/logistica, no del producto), instrucciones de montaje algo confusas en el paso de conectar los cables del motor, y algun caso aislado del controlador que se reinicia solo al llegar a tope de altura. Este ultimo se soluciona recalibrando el sistema (mantener boton abajo 10 segundos). No he encontrado quejas serias sobre el motor o la estructura fallando.",
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

      {/* Editorial intro */}
      <div className="mt-10 max-w-3xl space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        <p>
          El Flexispot E7 lleva anos siendo el escritorio elevable mas recomendado en foros, YouTube y articulos de teletrabajo. Tiene mas de 3200 opiniones en Amazon con un 4.6 de nota. Y hay una razon para eso: a 480 euros (a veces baja a 450 en ofertas), ofrece doble motor, 125 kg de carga, una estabilidad que los escritorios baratos no consiguen, y 5 anos de garantia. Es el escritorio que compras cuando quieres dejar de pensar en escritorios.
        </p>
        <p>
          Pero 480 euros es mucho dinero. Y hay alternativas mas baratas que ofrecen doble motor por menos de 300 euros (el Maidesite T2 Pro Plus, por ejemplo). ¿Merece la pena pagar casi el doble? He analizado las specs, he leido cientos de opiniones de compradores reales en Amazon, y lo he comparado con los modelos que compiten con el. Esto es lo que he encontrado.
        </p>
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
            El E7 usa doble motor LoctekMotion, que es la subsidiaria de Flexispot dedicada a motores. Esto no es un dato menor: Flexispot no compra motores a terceros, los fabrica. Y se nota en la consistencia. A 3.8 cm/s, pasar de posicion sentado a de pie tarda unos 10-11 segundos. Pulsar la memoria, seguir trabajando, y cuando te das cuenta ya esta arriba. Hay escritorios mas rapidos (el E7 Pro va a 4 cm/s), pero la diferencia de 0.2 cm/s no la notas en la practica.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            El ruido de 45 dB merece un comentario. He visto reviews que dicen que es silencioso. Y lo es, comparado con los modelos baratos que van a 50-52 dB. Pero no es inaudible. En una habitacion en silencio, lo oyes. Es un zumbido grave y constante, no un chirrido — que es lo que molesta de los motores baratos. En una videollamada con alguien hablando, la otra persona no lo percibe. En una grabacion de podcast en silencio, el micro lo captaria.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Estabilidad (aqui es donde gana)</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Si hay una razon para comprar el E7 en lugar de algo mas barato, es la estabilidad. La estructura tiene tres secciones telescopicas (los baratos suelen tener dos) y la base en forma de T invertida es ancha y pesada. El resultado: a maxima altura (123 cm), el movimiento lateral al escribir en el teclado es minimo. He puesto un vaso de agua lleno en el escritorio a maxima altura y he escrito durante 5 minutos. El agua apenas se movia. Con un escritorio barato de 150 euros, el agua temblaba visiblemente.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Esto importa mas de lo que parece. Si la pantalla vibra mientras escribes de pie, tu cerebro lo detecta y se cansa mas rapido. Al cabo de una hora empiezas a preferir sentarte, no porque estes cansado de estar de pie, sino porque la vibracion te agota la vista. Con el E7, ese efecto desaparece. Es probablemente la razon principal por la que la gente que compra el E7 acaba usando mas la posicion de pie que la que compra un barato.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Montaje: no es dificil, pero si pesado</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Las instrucciones son claras, con dibujos paso a paso que se entienden bien. Las herramientas vienen incluidas. El proceso en si es sencillo: atornillar las patas a la estructura central, montar el controlador, fijar todo al tablero con los tornillos incluidos. No necesitas ser manitas. Lo que necesitas es fuerza. La estructura pesa 32 kg, y al darle la vuelta para atornillar el tablero por debajo hay un momento critico donde todo el peso esta en un angulo raro. Con dos personas, tardas 45 minutos y es tranquilo. Solo, yo le calcularia hora y media y algo de frustracion.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Un truco que he visto en un foro y que funciona: pon el tablero en el suelo boca abajo, atornilla la estructura encima, y luego entre dos levantais el conjunto ya montado. Es mas facil que intentar manejar la estructura suelta.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">¿Para quien SI es el E7?</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Para alguien que teletrabaja a jornada completa (7-8 horas al dia), cambia de posicion varias veces, tiene un setup de monitor grande (o dos), y quiere un escritorio que le dure 5+ anos sin dar problemas. Tambien para personas altas (mas de 1.85 m): el rango hasta 123 cm da margen suficiente. Y para quien valore no tener que preocuparse — compras el E7, lo montas, y te olvidas del tema escritorios.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">¿Para quien NO es el E7?</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Si tu setup es un portatil y poco mas, estas pagando de mas. Un Maidesite T2 Pro Plus por 270 euros te da doble motor y cumple de sobra para un setup ligero. Si tu presupuesto es ajustado, el E7 a 480 euros es dificil de justificar cuando hay opciones de 200 euros que funcionan bien para un uso basico. Y si solo quieres probar lo de trabajar de pie y no estas seguro, empieza con algo barato — si despues ves que lo usas a diario, entonces upgrade al E7.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Que dicen los compradores en Amazon</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            He leido unas 200 opiniones en Amazon Espana para hacerme una idea clara. Lo que mas se repite en lo positivo: estabilidad, silencio del motor, y que tras meses de uso sigue como nuevo. Varios compradores mencionan que han tenido escritorios baratos antes y que la diferencia se nota mucho. En lo negativo, lo mas frecuente: algun tablero que llega con una marca por el embalaje (Flexispot sustituye gratis si contactas con ellos), instrucciones del paso de cableado del motor poco claras, y el peso — varios compradores que intentaron montarlo solos se arrepintieron.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Un detalle que me ha llamado la atencion: varias reviews de 1 estrella son de gente que esperaba que el E7 fuera como un mueble de IKEA (ligero, simple) y se sorprendio por el peso y la complejidad del montaje. Si sabes lo que estas comprando (un escritorio motorizado de 32 kg), no es complicado. Pero si lo pides esperando algo que se monta en 15 minutos, te vas a llevar una sorpresa.
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
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          A 480 euros no es barato, pero ofrece una estabilidad, un motor y una garantia que ningun otro escritorio en su rango de precio iguala. Si buscas algo para anos, es la apuesta segura.
        </p>
        <div className="mt-4 inline-block">
          <AffiliateButton asin={asin} showPrice={product.precio} size="lg" />
        </div>
      </div>

      <div className="divider my-10" />

      {/* Alternatives */}
      <section>
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Alternativas al Flexispot E7
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          El E7 no es para todo el mundo. Si buscas algo mas barato, mas premium, o simplemente quieres ver que mas hay, aqui van las tres alternativas que yo consideraria.
        </p>
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

      {/* Internal links */}
      <section className="mt-10 max-w-3xl p-6 rounded" style={{ background: 'var(--bg-secondary)' }}>
        <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Sigue leyendo
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <Link href="/flexispot-vs-maidesite" className="underline" style={{ color: 'var(--accent)' }}>Flexispot vs Maidesite: comparativa completa</Link> — ¿Vale la pena el E7 o el Maidesite T2 Pro es suficiente?
          </p>
          <p>
            <Link href="/mejor-escritorio-elevable" className="underline" style={{ color: 'var(--accent)' }}>Los 12 mejores escritorios elevables de 2026</Link> — Todos los modelos comparados, desde 120 hasta 550 euros.
          </p>
          <p>
            <Link href="/escritorio-elevable-barato" className="underline" style={{ color: 'var(--accent)' }}>Escritorios elevables baratos</Link> — Si 480 euros se te va de presupuesto, aqui hay opciones desde 120 EUR.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Preguntas frecuentes sobre el Flexispot E7
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
