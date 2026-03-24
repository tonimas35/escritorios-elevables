import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getAllProducts } from "@/lib/products";
import { AffiliateButton } from "@/components/AffiliateButton";
import { ProsConsBox } from "@/components/ProsConsBox";
import { CompactRatings } from "@/components/CompactRatings";

export const metadata: Metadata = {
  title: "Maidesite T2 Pro Plus opiniones y review 2026 — Merece la pena?",
  description:
    "Review honesta del Maidesite T2 Pro Plus: doble motor por menos de 300 EUR. Analizamos estabilidad, montaje, calidad y si merece la pena frente al Flexispot E7.",
};

export default function MaidesiteT2ProReviewPage() {
  const result = getProductBySlug("maidesite-t2-pro");
  if (!result) return <p>Producto no encontrado</p>;
  const [asin, product] = result;

  const alternatives = getAllProducts()
    .filter(([, p]) => p.slug !== "maidesite-t2-pro" && p.disponible)
    .sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total)
    .slice(0, 3);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
      { "@type": "ListItem", position: 2, name: "Mejores Escritorios", item: "https://elevable.es/mejor-escritorio-elevable" },
      { "@type": "ListItem", position: 3, name: "Maidesite T2 Pro Plus Opiniones", item: "https://elevable.es/maidesite-t2-pro-opiniones" },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nombre,
    image: product.imagen,
    description: product.veredicto,
    brand: { "@type": "Brand", name: product.marca },
    review: {
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: product.puntuacion.total, bestRating: 10 },
      author: { "@type": "Organization", name: "Elevable.es" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.num_reviews,
      bestRating: 5,
    },
    offers: {
      "@type": "Offer",
      price: product.precio,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `https://www.amazon.es/dp/${asin}?tag=escritoriosel-21`,
    },
  };

  const faqItems = [
    {
      q: "Maidesite T2 Pro Plus o Flexispot E7: cual es mejor?",
      a: "Depende de tu presupuesto. El E7 es mejor en estabilidad y acabados, pero cuesta 200 euros mas. El T2 Pro Plus ofrece el 85-90% de la experiencia por 270 euros. Si tu setup es un monitor y portatil, el Maidesite es mas que suficiente. Si tienes dos monitores con brazo y quieres maxima rigidez, el E7 lo justifica.",
    },
    {
      q: "El Maidesite T2 Pro Plus es estable de pie?",
      a: "Es estable para uso normal. Escribiendo en el teclado a maxima altura (127 cm), se nota un ligero movimiento lateral — menos que los escritorios de motor simple, pero mas que el Flexispot E7. Para la mayoria de personas con un setup estandar, la estabilidad es perfectamente aceptable.",
    },
    {
      q: "Cuanto tarda en montarse?",
      a: "Entre 40 minutos y una hora con dos personas. La estructura pesa 27 kg, asi que es manejable para una persona, pero no lo recomiendo. Las instrucciones son claras y las herramientas vienen incluidas.",
    },
    {
      q: "El tablero del T2 Pro Plus es bueno?",
      a: "Es melamina estandar. Cumple su funcion pero no es un tablero premium. No se raya facilmente en uso normal, pero si apoyas objetos puntiagudos o metalicos directamente, puede marcarse. Si quieres un tablero mejor, puedes comprar la estructura sola y poner tu propio tablero de IKEA o similar.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
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
        {" "}&gt;{" "}Maidesite T2 Pro Plus opiniones
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
          Llevo semanas viendo como el Maidesite T2 Pro Plus se cuela en todas las listas de mejores escritorios elevables. Y tiene sentido: a 270 euros te da doble motor, 100 kg de carga, 127 cm de altura maxima y 5 anos de garantia. Es lo que ofrecian escritorios de 450 euros hace dos anos. El mercado ha cambiado y Maidesite lo ha aprovechado mejor que nadie.
        </p>
        <p>
          Pero no todo son maravillas. He revisado cientos de opiniones en Amazon, he comparado sus specs con el Flexispot E7 (que cuesta casi el doble), y tengo claro donde brilla y donde se queda corto. Si estas dudando entre este y algo mas caro — o mas barato — esto te va a ahorrar horas de busqueda.
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
            { label: "Motor", value: "Doble motor", detail: "Mejor traccion" },
            { label: "Rango de altura", value: `${product.specs.rango_altura_min_cm}–${product.specs.rango_altura_max_cm} cm`, detail: "65 cm de recorrido" },
            { label: "Velocidad", value: `${product.specs.velocidad_cm_s} cm/s`, detail: "Rapido para su precio" },
            { label: "Carga maxima", value: `${product.specs.peso_max_carga_kg} kg`, detail: "Setup completo" },
            { label: "Tablero", value: `${product.specs.ancho_tablero_cm}x${product.specs.profundidad_tablero_cm} cm`, detail: product.specs.material_tablero || '' },
            { label: "Peso estructura", value: `${product.specs.peso_estructura_kg} kg`, detail: "Manejable" },
            { label: "Ruido", value: `${product.specs.ruido_db} dB`, detail: "Aceptable" },
            { label: "Garantia", value: `${product.specs.garantia_anos} anos`, detail: "Maidesite oficial" },
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

      {/* Detailed review */}
      <section className="max-w-3xl space-y-8">
        <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
          Analisis detallado
        </h2>

        <div>
          <h3 className="text-lg font-semibold">Doble motor por 270 euros: donde esta el truco?</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            La pregunta obvia. Si el Flexispot E7 cobra 480 euros por doble motor, como puede Maidesite ofrecer lo mismo por 270? He investigado un poco. Maidesite fabrica en China con menos intermediarios que Flexispot, y su estrategia es clara: volumen alto y margen bajo. Los motores no son LoctekMotion (la subsidiaria de Flexispot), sino genéricos chinos de buena calidad. Funcionan bien, pero la diferencia se nota en los detalles: el movimiento del E7 es mas suave, mas silencioso, y el motor arranca sin el leve tiron que el Maidesite da al comenzar a moverse.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            A 48 dB de ruido (frente a 45 del E7), la diferencia no es enorme pero existe. En una llamada de Zoom no molesta. En una grabacion de audio, el micro lo captaria. Para el 90% de los usuarios, irrelevante.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Estabilidad: bien, pero no excelente</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            A 127 cm de altura maxima, el T2 Pro Plus llega mas alto que el E7 (123 cm). Eso es bueno para personas altas. Pero mas alto significa mas palanca, y aqui se nota la diferencia de precio. Escribiendo de pie a maxima altura, el tablero tiene un ligero balanceo lateral que el E7 no tiene. No es preocupante — no se te va a caer el cafe — pero si eres de los que nota la pantalla temblando mientras teclea, te va a molestar un poco.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            A alturas normales de trabajo de pie (105-115 cm), la estabilidad es buena. Mas que suficiente para un monitor y portatil. Con dos monitores de 27 pulgadas en brazo, yo le pondria una barra estabilizadora transversal (hay compatibles por 15 euros en Amazon) para ir tranquilo.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">El tablero: funcional, no bonito</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Melamina estandar de 140x70 cm. Hace su trabajo. Los bordes estan bien sellados, no se astilla, y el color es uniforme. Pero comparado con el tablero del E7 (que tampoco es premium) se siente mas fino y mas ligero. Si apoyas el codo con fuerza durante horas, notas que cede ligeramente. Es un detalle menor, pero real.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Una opcion que algunos compradores usan: comprar solo la estructura Maidesite y ponerle un tablero de IKEA LAGKAPTEN (40 euros). La combinacion sale por unos 260 euros y el resultado es mejor que el tablero incluido.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Para quien SI es el T2 Pro Plus</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Si tu presupuesto esta entre 200 y 350 euros y quieres doble motor, no hay nada mejor ahora mismo. Punto. Tambien para quien teletrabaja a jornada completa pero no necesita la maxima estabilidad del mercado. Y para personas altas (mas de 1.85 m): el rango hasta 127 cm da mas margen que la mayoria de competidores.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Para quien NO es</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Si necesitas la maxima estabilidad posible (setup pesado, dos monitores con brazo, videoconferencias donde se note la vibracion), el E7 es mejor inversion. Si tu presupuesto es menor de 200 euros, mira los modelos de motor simple como el Flexispot EG1 o el Ergear EED-S1. Y si apenas cambias de posicion, un escritorio manual de manivela por 100 euros te puede servir igual.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Que dicen los compradores</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            He revisado mas de 150 opiniones en Amazon ES. Lo positivo que mas se repite: la relacion calidad-precio. Muchos compradores comparan con escritorios de 400+ euros y dicen que la diferencia no justifica el precio extra. El montaje lo valoran como sencillo, aunque un par de personas mencionan que las instrucciones del paso del cableado podrian ser mas claras.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            En lo negativo: el tablero fino es la queja mas comun. Varios compradores lo han sustituido por uno de IKEA. Algun caso aislado de chirrido al subir a maxima velocidad, que se soluciona apretando los tornillos de union. Y dos o tres opiniones de 1 estrella por tableros que llegaron con marcas de transporte — algo que Maidesite repone sin problema si contactas con ellos.
          </p>
        </div>
      </section>

      <div className="divider my-10" />

      {/* Ratings */}
      <section>
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>Puntuacion</h2>
        <div className="max-w-md">
          <CompactRatings puntuacion={product.puntuacion} />
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 p-6 rounded text-center" style={{ background: 'var(--accent-light)', border: '2px solid var(--accent)' }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Veredicto</p>
        <p className="text-xl mt-2" style={{ fontFamily: 'var(--font-display)' }}>{product.veredicto}</p>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          A 270 euros, ofrece doble motor y prestaciones que hace dos anos costaban 450. No es perfecto, pero es la compra inteligente de 2026.
        </p>
        <div className="mt-4 inline-block">
          <AffiliateButton asin={asin} showPrice={product.precio} size="lg" />
        </div>
      </div>

      <div className="divider my-10" />

      {/* Alternatives */}
      <section>
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Alternativas al Maidesite T2 Pro Plus
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Si el Maidesite no te convence del todo, estas son las tres opciones que yo consideraria segun presupuesto y necesidades.
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
                <td className="p-3 font-semibold">Maidesite T2 Pro Plus (este)</td>
                <td className="p-3 text-center">Doble</td>
                <td className="p-3 text-center mono font-bold" style={{ color: 'var(--pro)' }}>{product.puntuacion.total}</td>
                <td className="p-3 text-center mono font-bold">{product.precio}€</td>
                <td className="p-3 text-center"><AffiliateButton asin={asin} size="sm" /></td>
              </tr>
              {alternatives.map(([altAsin, alt]) => (
                <tr key={altAsin} className="hover:bg-[var(--accent-light)]" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="p-3 font-semibold">{alt.marca} {alt.modelo}</td>
                  <td className="p-3 text-center">{alt.specs.tipo_motor === 'doble' ? 'Doble' : alt.specs.tipo_motor === 'manual' ? 'Manual' : 'Simple'}</td>
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
            <Link href="/flexispot-e7-opiniones" className="underline" style={{ color: 'var(--accent)' }}>Flexispot E7: review completa</Link> — La referencia premium. Merece la pena pagar casi el doble?
          </p>
          <p>
            <Link href="/flexispot-vs-maidesite" className="underline" style={{ color: 'var(--accent)' }}>Flexispot vs Maidesite: comparativa</Link> — Enfrentamos las dos marcas cara a cara.
          </p>
          <p>
            <Link href="/mejor-escritorio-elevable" className="underline" style={{ color: 'var(--accent)' }}>Los 12 mejores escritorios elevables de 2026</Link> — Todos los modelos comparados.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Preguntas frecuentes sobre el Maidesite T2 Pro Plus
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
