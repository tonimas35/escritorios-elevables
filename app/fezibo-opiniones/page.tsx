import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getAllProducts } from "@/lib/products";
import { FECHA, FECHA_EN_FRASE } from "@/lib/fecha";
import { coma, nota } from "@/lib/format";
import { AffiliateButton } from "@/components/AffiliateButton";
import { AvisoAfiliadoPagina, AvisoAfiliadoTabla } from "@/components/AvisoAfiliado";
import { FranjaPrecio } from "@/components/FranjaPrecio";
import { ProsConsBox } from "@/components/ProsConsBox";
import { CompactRatings } from "@/components/CompactRatings";
import { productSchema } from "@/lib/schema";
import { anticolision, garantia, SIN_DATO } from "@/lib/ficha";
import { PosicionNota } from "@/components/broadsheet/PosicionNota";

export const metadata: Metadata = {
  title: "Fezibo escritorio elevable opiniones y review 2026 — ¿Merece la pena?",
  description:
    "Review honesta del Fezibo 120x60, un escritorio elevable eléctrico de gama de entrada. Analizamos si merece la pena, para quién es y para quién no.",
  alternates: { canonical: "/fezibo-opiniones" },
};

export default function FeziboReviewPage() {
  const result = getProductBySlug("fezibo-120");
  if (!result) return <p>Producto no encontrado</p>;
  const [asin, product] = result;
  const catalogo = getAllProducts().map(([, p]) => p);

  const alternatives = getAllProducts()
    .filter(([, p]) => p.slug !== "fezibo-120" && p.disponible && p.precio <= 250)
    .sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total)
    .slice(0, 3);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
      { "@type": "ListItem", position: 2, name: "Mejores Escritorios", item: "https://elevable.es/mejor-escritorio-elevable" },
      { "@type": "ListItem", position: 3, name: "Fezibo Opiniones", item: "https://elevable.es/fezibo-opiniones" },
    ],
  };

  const prodSchema = productSchema(asin, product, "/fezibo-opiniones");

  // Cifras derivadas de la ficha, no escritas a mano: si cambia el JSON,
  // el texto cambia con él.
  const s = product.specs;
  const recorridoCm = s.rango_altura_max_cm - s.rango_altura_min_cm;
  const segundos = s.velocidad_cm_s ? Math.round(recorridoCm / s.velocidad_cm_s) : null;

  const faqItems = [
    {
      q: "¿El Fezibo merece la pena?",
      a: "Si tu expectativa es un escritorio elevable básico que sube y baja sin problemas, sí. No esperes la carga ni la velocidad de un doble motor. Pero para un estudiante o alguien que quiere probar un elevable por primera vez, es una forma sencilla de hacerlo con motor eléctrico, aunque en el catálogo hay modelos de un motor más baratos.",
    },
    {
      q: "¿El Fezibo sirve para trabajar 8 horas al día?",
      a: "Puede, pero no lo recomiendo como escritorio principal para jornada completa. Con 70 kg de carga y un tablero de 120x60 cm, el espacio y la capacidad son justos. Si teletrabajas a jornada completa, invierte un poco más en algo con tablero más grande y más carga.",
    },
    {
      q: "¿Qué puedo poner encima del Fezibo?",
      a: "Un monitor de hasta 27 pulgadas, un portátil, teclado y ratón. Eso son unos 15-20 kg. Hasta ahí va perfecto. Si quieres dos monitores con brazo, un altavoz y una lámpara, te pasas de espacio y probablemente de peso. Para setup dual monitor, necesitas al menos 120 cm de tablero.",
    },
    {
      q: "¿El Fezibo es ruidoso?",
      a: `${s.ruido_db !== null ? `El fabricante declara ${s.ruido_db} dB.` : "La ficha del fabricante no declara el nivel de ruido, así que no damos una cifra."}${segundos ? ` El recorrido completo dura unos ${segundos} segundos, así que el ruido, sea cual sea, es breve.` : ""}`,
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
        <Link href="/" className="hover:underline" style={{ color: 'var(--verde-estructura)' }}>Inicio</Link>
        {" "}&gt;{" "}
        <Link href="/mejor-escritorio-elevable" className="hover:underline" style={{ color: 'var(--verde-estructura)' }}>Mejores escritorios</Link>
        {" "}&gt;{" "}Fezibo opiniones
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product image */}
        <div className="w-full md:w-72 h-72 rounded overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-secondary)' }}>
          <Image src={product.imagen} alt={product.imagen_alt} width={280} height={280} className="object-contain p-4" />
        </div>

        {/* Product info */}
        <div className="flex-1">
          <p className="editorial-mark mb-2" style={{ color: 'var(--color-secondary)' }}>Review completa &middot; {FECHA}</p>
          <h1 className="text-3xl md:text-4xl mt-1 heading-accent" >
            {product.titular ?? product.nombre}
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Actualizado: {FECHA_EN_FRASE}
          </p>

          {/* Posicion grande y nota pequeña, como en las fichas nuevas
              (METODO.md §5). */}
          <div className="mt-5">
            <PosicionNota producto={product} catalogo={catalogo} tamano="clamp(52px, 6vw, 68px)" />
          </div>

          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {product.veredicto}
          </p>

          <div className="mt-4">
            <FranjaPrecio product={product} />
            <AvisoAfiliadoPagina />
            <AffiliateButton asin={asin} size="lg" />
          </div>
        </div>
      </div>

      {/* Editorial intro */}
      <div className="mt-10 max-w-3xl space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        <p>
          El Fezibo es un escritorio elevable eléctrico de gama de entrada: un motor, tablero de 120x60 y lo básico para subir y bajar pulsando un botón. No es el más barato del catálogo, y tiene matices importantes que necesitas conocer antes de comprar.
        </p>
        <p>
          He analizado las opiniones en Amazon, he comparado sus specs con los otros modelos baratos del mercado, y tengo claro para quién tiene sentido y para quién no. Si tu presupuesto es ajustado, esto te interesa.
        </p>
      </div>

      <div className="divider my-10" />

      {/* Specs grid */}
      <section>
        <h2 className="text-2xl mb-6" >
          Especificaciones técnicas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Motor", value: "Simple", detail: "Básico pero funcional" },
            { label: "Rango de altura", value: `${product.specs.rango_altura_min_cm}–${product.specs.rango_altura_max_cm} cm`, detail: `${coma(recorridoCm)} cm de recorrido` },
            { label: "Velocidad", value: s.velocidad_cm_s !== null ? `${coma(s.velocidad_cm_s)} cm/s` : "Sin dato", detail: "Estándar" },
            { label: "Carga máxima", value: `${product.specs.peso_max_carga_kg} kg`, detail: "Setup ligero" },
            { label: "Tablero", value: `${product.specs.ancho_tablero_cm}x${product.specs.profundidad_tablero_cm} cm`, detail: product.specs.material_tablero || '' },
            { label: "Peso estructura", value: s.peso_estructura_kg !== null ? `${s.peso_estructura_kg} kg` : "Sin dato", detail: "Ligero" },
            { label: "Ruido", value: s.ruido_db !== null ? `${s.ruido_db} dB` : "Sin dato", detail: s.ruido_db !== null ? "Audible" : "No lo declara el fabricante" },
            { label: "Garantía", value: garantia(product), detail: s.garantia_anos !== null ? "Estándar" : "No la declara el fabricante" },
            { label: "Presets", value: s.presets_memoria !== null ? `${s.presets_memoria} memorias` : SIN_DATO, detail: "Ajuste rápido" },
            { label: "Anticolisión", value: anticolision(product), detail: s.sistema_anticolision === null ? "No lo declara el fabricante" : s.sistema_anticolision ? "Incluido" : "No incluido" },
          ].map((spec) => (
            <div key={spec.label} className="p-4 rounded" style={{ background: 'var(--bg-secondary)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{spec.label}</p>
              <p className="text-lg font-bold mt-0.5">{spec.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{spec.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider my-10" />

      {/* Pros and cons */}
      <section>
        <h2 className="text-2xl mb-6" >
          Pros y contras
        </h2>
        <ProsConsBox pros={product.pros} cons={product.contras} />
      </section>

      <div className="divider my-10" />

      {/* Detailed review */}
      <section className="max-w-3xl space-y-8">
        <h2 className="text-2xl" >
          Análisis detallado
        </h2>

        <div>
          <h3 className="text-lg font-semibold">Un elevable con motor en la gama de entrada: ¿qué sacrificas?</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            El motor simple es más lento que los de doble motor{s.velocidad_cm_s !== null && <> ({coma(s.velocidad_cm_s)} cm/s)</>}.{segundos && <> El recorrido completo tarda unos {segundos} segundos, que se sienten largos cuando vienes de un escritorio eléctrico rápido.</>} Pero si es tu primer elevable, no lo vas a notar.{s.presets_memoria !== null && <> Las {s.presets_memoria} memorias de altura te permiten guardar tus posiciones favoritas y olvidarte.</>}
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {s.sistema_anticolision === null
              ? "La ficha del fabricante no dice si tiene sistema anticolisión."
              : s.sistema_anticolision
              ? "Según la ficha del fabricante, tiene sistema anticolisión: si al bajar choca con algo, se detiene."
              : "No tiene anticolisión. Si la mesa choca con algo al bajar, el motor sigue empujando. Si tienes una cajonera debajo, ojo."}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Estabilidad: lo justo</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Un solo motor y {s.peso_max_carga_kg} kg de carga admitida{s.peso_estructura_kg !== null ? `, con ${s.peso_estructura_kg} kg de estructura` : ""}: dan para un monitor, un portátil y los periféricos, y se quedan cortos para un setup pesado con brazos y varios monitores. Para personas por encima de 1,80 m, la altura máxima de {coma(s.rango_altura_max_cm)} cm puede quedarse justa.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Para quién SÍ es el Fezibo</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Estudiantes que quieren alternar sentado y de pie mientras estudian. Personas que trabajan desde casa unas horas al día (no jornada completa). Quien quiere probar un escritorio elevable sin gastar de más. Y para espacios pequeños: 120x60 cm cabe en cualquier rincon.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Para quién NO es</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Teletrabajadores a jornada completa que necesitan espacio para dual monitor. Personas altas (más de 1.80 m) que necesitan el escritorio por encima de {coma(s.rango_altura_max_cm)} cm. Quien tenga monitores pesados o un setup de más de 30-40 kg. Y si ya tienes un elevable y quieres mejorar, el salto que se nota es a uno de doble motor, como el FLEXISPOT de 160x80 o el MAIDeSITe S2 Pro, que ya vienen con tablero.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Qué dicen los compradores</h3>
          {/* Solo lo que tiene fuente: la media de Amazon y el resumen de la
              revision de reseñas de 1-2 estrellas (METODO.md §3), cuando exista. */}
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {coma(product.rating)} estrellas de media en Amazon España.{" "}
            {product.nota_resenas
              ? product.nota_resenas
              : "Todavía no hemos revisado sus reseñas de una y dos estrellas con nuestro método; cuando lo hagamos, el resumen estará aquí."}
          </p>
        </div>
      </section>

      <div className="divider my-10" />

      {/* Ratings */}
      <section>
        <h2 className="text-2xl mb-6" >Puntuación</h2>
        <div className="max-w-md">
          <CompactRatings puntuacion={product.puntuacion} />
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 p-6 rounded text-center" style={{ background: 'var(--color-secondary-light)', borderLeft: '3px solid var(--verde-estructura)' }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--verde-estructura)' }}>Veredicto</p>
        <p className="text-xl mt-2" >{product.veredicto}</p>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          No es el mejor escritorio elevable. Es una forma sencilla de descubrir si trabajar de pie va contigo.
        </p>
        <div className="mt-4 inline-block">
          <AffiliateButton asin={asin} size="lg" />
        </div>
      </div>

      <div className="divider my-10" />

      {/* Alternatives */}
      <section>
        <h2 className="text-2xl mb-4" >
          Alternativas al Fezibo
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Si puedes estirar un poco el presupuesto, estas opciones ofrecen mejoras significativas por poco dinero más.
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
              <tr style={{ background: 'var(--verde-estructura-claro)', borderBottom: '1px solid var(--border)' }}>
                <td className="p-3 font-semibold">Fezibo 120x60 (este)</td>
                <td className="p-3 text-center">Simple</td>
                <td className="p-3 text-center font-bold" style={{ color: 'var(--pro)' }}>{nota(product.puntuacion.total)}</td>
                <td className="p-3 text-center"><AffiliateButton asin={asin} size="sm" /></td>
              </tr>
              {alternatives.map(([altAsin, alt]) => (
                <tr key={altAsin} className="hover:bg-[var(--verde-estructura-claro)]" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="p-3 font-semibold">{alt.marca} {alt.modelo}</td>
                  <td className="p-3 text-center">{alt.specs.tipo_motor === 'doble' ? 'Doble' : alt.specs.tipo_motor === 'manual' ? 'Manual' : 'Simple'}</td>
                  <td className="p-3 text-center font-bold">{nota(alt.puntuacion.total)}</td>
                  <td className="p-3 text-center"><AffiliateButton asin={altAsin} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
              <AvisoAfiliadoTabla />
        </div>
      </section>

      {/* Internal links */}
      <section className="mt-10 max-w-3xl p-6 rounded" style={{ background: 'var(--color-secondary-light)', borderLeft: '3px solid var(--color-secondary)' }}>
        <h3 className="text-lg font-semibold mb-3" >
          Sigue leyendo
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <Link href="/escritorio-elevable-barato" className="underline" style={{ color: 'var(--verde-estructura)' }}>Escritorios elevables baratos</Link> — Toda la gama de entrada, comparada.
          </p>
          <p>
            <Link href="/mejor-escritorio-elevable" className="underline" style={{ color: 'var(--verde-estructura)' }}>Los mejores escritorios elevables de 2026</Link> — Si puedes estirar el presupuesto, aquí están todos.
          </p>
          <p>
            <Link href="/comparador" className="underline" style={{ color: 'var(--verde-estructura)' }}>Comparador interactivo</Link> — Filtra por precio, altura y motor para encontrar tu escritorio.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl mb-6" >
          Preguntas frecuentes sobre el Fezibo
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
