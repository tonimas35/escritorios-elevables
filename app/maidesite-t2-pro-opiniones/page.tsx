import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getAllProducts } from "@/lib/products";
import { AffiliateButton } from "@/components/AffiliateButton";
import { ProsConsBox } from "@/components/ProsConsBox";
import { CompactRatings } from "@/components/CompactRatings";
import { productSchema } from "@/lib/schema";
import { reviewsAprox } from "@/lib/format";

export const metadata: Metadata = {
  title: "MAIDeSITe T2 Pro MAX opiniones y review 2026 — Merece la pena?",
  description:
    "Review del MAIDeSITe T2 Pro MAX: el marco con más carga del mercado (160 kg) y más recorrido (65-135 cm). No incluye tablero. Analizamos si compensa.",
  alternates: { canonical: "/maidesite-t2-pro-opiniones" },
};

export default function MaidesiteT2ProReviewPage() {
  const result = getProductBySlug("maidesite-t2-pro-max");
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
      { "@type": "ListItem", position: 3, name: "Maidesite T2 Pro MAX Opiniones", item: "https://elevable.es/maidesite-t2-pro-opiniones" },
    ],
  };

  const prodSchema = productSchema(asin, product, "/maidesite-t2-pro-opiniones");

  const faqItems = [
    {
      q: "El MAIDeSITe T2 Pro MAX incluye tablero?",
      a: "No. Es solo la estructura: las patas, el motor y el panel de control. El tablero se compra aparte y admite hasta 200x80 cm. Cuenta con el coste del tablero aparte, y hazte la cuenta total antes de compararlo con modelos que ya vienen con tablero.",
    },
    {
      q: "Cuanto peso aguanta de verdad?",
      a: "160 kg según el fabricante, la cifra más alta de esta comparativa. Para que te hagas una idea, un setup exigente (dos monitores de 27 pulgadas con brazo, torre, altavoces y portatil) ronda los 40 kg. Aquí vas a ir sobrado pase lo que pase, que es justo el argumento de este modelo.",
    },
    {
      q: "Sirve para una persona muy alta?",
      a: "Es de lo mejor que hay para eso. Sube hasta 135 cm, más que cualquier otro modelo del catalogo, que se quedan en 120-123 cm. Si mides más de 1,90 m y has probado escritorios que se te quedan cortos de pie, este resuelve el problema. Recuerda sumar el grosor del tablero a esa altura.",
    },
    {
      q: "Cuanto tarda en montarse?",
      a: "Entre 40 minutos y una hora, y mejor entre dos personas: la estructura pesa 30 kg. Al no incluir tablero, tendras que taladrar los agujeros de fijacion en el tuyo si no vienen ya hechos, así que suma ese rato.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(prodSchema) }}
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
        {" "}&gt;{" "}Maidesite T2 Pro MAX opiniones
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product image */}
        <div className="w-full md:w-72 h-72 rounded overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-secondary)' }}>
          <Image src={product.imagen} alt={product.imagen_alt} width={280} height={280} className="object-contain p-4" />
        </div>

        {/* Product info */}
        <div className="flex-1">
          <p className="editorial-mark mb-2" style={{ color: 'var(--color-secondary)' }}>Review completa &middot; Marzo 2026</p>
          <h1 className="text-3xl md:text-4xl mt-1 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
            {product.nombre}
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Actualizado: septiembre de 2026
          </p>

          <div className="flex items-center gap-4 mt-4">
            <span className="mono font-bold text-sm px-2 py-1 rounded" style={{ background: 'var(--pro)', color: 'white' }}>
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
            El MAIDeSITe T2 Pro MAX no es un escritorio: es un marco. Viene sin tablero, y ese es el primer dato que hay que tener claro antes de seguir leyendo, porque cambia la cuenta. A cambio ofrece dos cifras que ningún otro modelo de esta comparativa alcanza: 160 kg de carga y un recorrido de 65 a 135 cm.
          </p>
        <p>
            Eso lo convierte en una compra muy concreta: tiene sentido si ya tienes tablero, si quieres uno a medida, o si tu setup pesa de verdad. Si buscas algo que llegue montado y listo, hay opciones mejores en el catalogo. Vamos con el detalle.
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
            { label: "Velocidad", value: `${product.specs.velocidad_cm_s} cm/s`, detail: "De los más rápidos del catálogo" },
            { label: "Carga máxima", value: `${product.specs.peso_max_carga_kg} kg`, detail: "Setup completo" },
            { label: "Tablero", value: `${product.specs.ancho_tablero_cm}x${product.specs.profundidad_tablero_cm} cm`, detail: product.specs.material_tablero || '' },
            { label: "Peso estructura", value: `${product.specs.peso_estructura_kg} kg`, detail: "Manejable" },
            { label: "Ruido", value: `${product.specs.ruido_db} dB`, detail: "Aceptable" },
            { label: "Garantía", value: `${product.specs.garantia_anos} años`, detail: "Maidesite oficial" },
            { label: "Presets", value: `${product.specs.presets_memoria} memorias`, detail: "Ajuste rápido" },
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
          Análisis detallado
        </h2>

        <div>
          <h3 className="text-lg font-semibold">Que estas pagando exactamente</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Un marco sin tablero, en la gama alta. Lo que compras es capacidad: doble motor, 160 kg de carga útil y tres secciones telescópicas que permiten bajar hasta 65 cm y subir hasta 135. Para comparar, el resto de modelos del catalogo se mueven entre 50 y 125 kg, y ninguno pasa de 123 cm.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            El panel Piano-Master lleva cuatro memorias de altura y sistema anticolision. A 45 dB, el ruido al subir es discreto: audible en una habitacion en silencio, irrelevante en una videollamada. La velocidad, 3,8 cm/s, esta en la parte alta del catalogo.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Estabilidad: bien, pero no excelente</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Los 135 cm de altura máxima son el mayor recorrido del catalogo, y eso lo hace apto para personas muy altas o para trabajar de pie con teclado elevado. Pero cuanto más sube una estructura, más palanca hay: a máxima altura, cualquier marco de tres secciones tiene más balanceo lateral que a altura de trabajo normal.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            En el rango habitual de trabajo de pie, entre 105 y 115 cm, la estructura de tres secciones y los 30 kg de peso propio juegan a favor. Con 160 kg de carga admitida, un setup de dos monitores en brazo más equipo pesado entra sin acercarse al limite.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">No incluye tablero: cuenta con ese gasto</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Este modelo es solo la estructura. Ni tablero ni tornilleria para uno concreto: hay que comprarlo aparte y elegir medidas. El marco admite tableros de hasta 200x80 cm, así que tienes margen de sobra.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            En la práctica esto suma un coste aparte según lo que elijas, desde un LAGKAPTEN de IKEA hasta un tablero macizo. Merece la pena hacer la cuenta completa antes de decidir: sumando un tablero medio, el total se acerca a los modelos que ya vienen con el suyo.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Para quien SI es el T2 Pro MAX</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Si ya tienes un tablero que te gusta, si quieres unas medidas que nadie vende montadas, o si tu equipo pesa más de lo normal. Los 160 kg y los 135 cm de altura máxima no los da ningún otro modelo de esta comparativa, y para personas por encima de 1,90 m ese recorrido extra se nota.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Para quien NO es</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Si quieres abrir la caja y tenerlo funcionando, porque aquí te falta la mitad del mueble. Si sumas marco y tablero, un modelo con tablero incluido puede dejarte mejor equipado por menos. Y si tu setup es un portatil y un monitor, estas pagando una capacidad de carga que no vas a usar.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Que dicen los compradores</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Acumula 76 valoraciones en Amazon Espana con una media de 4,5 sobre 5. Lo que más se repite en positivo es la solidez de la estructura y lo bien que sube y baja incluso cargada; varios compradores mencionan que lo eligieron precisamente por la capacidad de carga.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            En lo negativo, la queja recurrente es la que cabe esperar: llega sin tablero y no todo el mundo lo tiene claro al comprar. También aparece el peso de la estructura, 30 kg, que hace recomendable montarlo entre dos personas. Con 76 valoraciones, el historial es todavia corto comparado con marcas más veteranas.
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
      <div className="mt-10 p-6 rounded text-center" style={{ background: 'var(--color-secondary-light)', borderLeft: '3px solid var(--accent)' }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Veredicto</p>
        <p className="text-xl mt-2" style={{ fontFamily: 'var(--font-display)' }}>{product.veredicto}</p>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            El marco, más lo que te cueste el tablero. Compensa si necesitas su carga o su recorrido; si no, hay opciones más completas por menos.
          </p>
        <div className="mt-4 inline-block">
          <AffiliateButton asin={asin} showPrice={product.precio} size="lg" />
        </div>
      </div>

      <div className="divider my-10" />

      {/* Alternatives */}
      <section>
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Alternativas al Maidesite T2 Pro MAX
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Si el Maidesite no te convence del todo, estas son las tres opciones que yo consideraria según presupuesto y necesidades.
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
                <td className="p-3 font-semibold">Maidesite T2 Pro MAX (este)</td>
                <td className="p-3 text-center">Doble</td>
                <td className="p-3 text-center mono font-bold" style={{ color: 'var(--pro)' }}>{product.puntuacion.total}</td>
                <td className="p-3 text-center"><AffiliateButton asin={asin} size="sm" /></td>
              </tr>
              {alternatives.map(([altAsin, alt]) => (
                <tr key={altAsin} className="hover:bg-[var(--accent-light)]" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="p-3 font-semibold">{alt.marca} {alt.modelo}</td>
                  <td className="p-3 text-center">{alt.specs.tipo_motor === 'doble' ? 'Doble' : alt.specs.tipo_motor === 'manual' ? 'Manual' : 'Simple'}</td>
                  <td className="p-3 text-center mono font-bold">{alt.puntuacion.total}</td>
                  <td className="p-3 text-center"><AffiliateButton asin={altAsin} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Internal links */}
      <section className="mt-10 max-w-3xl p-6 rounded" style={{ background: 'var(--color-secondary-light)', borderLeft: '3px solid var(--color-secondary)' }}>
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
          Preguntas frecuentes sobre el Maidesite T2 Pro MAX
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
