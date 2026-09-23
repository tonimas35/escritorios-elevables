import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Qué escritorio elevable comprar: test de 4 preguntas",
  description:
    "Responde 4 preguntas sobre uso, motor, peso del setup y ruido, y te decimos qué escritorio elevable encaja contigo. Sin registro.",
  alternates: { canonical: "/que-escritorio-elevable-comprar" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
    { "@type": "ListItem", position: 2, name: "Qué escritorio elevable comprar", item: "https://elevable.es/que-escritorio-elevable-comprar" },
  ],
};

/**
 * El test vive en un componente de cliente: hasta que alguien pulsa, el HTML
 * servido son cuatro frases. Google lo habia descubierto y no lo indexaba.
 *
 * Esta explicacion va en el layout, que si se renderiza en el servidor, y
 * describe lo que el test hace de verdad: las cuatro preguntas, el criterio
 * de puntuacion de `scoreProduct()` y de donde sale el catalogo. Es
 * documentacion de la herramienta, no relleno.
 */
export default function QueComprarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}

      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="divider my-8" />

        <section className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <h2 className="text-xl mb-4" style={{ color: "var(--text-primary)" }}>
            Qué hace este test
          </h2>
          <p style={{ color: "var(--text-primary)", fontWeight: 500 }}>
            Cuatro preguntas, ningún registro y ningún correo. La recomendación
            sale al terminar, en la misma pantalla.
          </p>
          <p>
            No es un cuestionario de personalidad ni una excusa para pedirte el
            correo. Son cuatro decisiones que de verdad cambian qué escritorio te
            conviene, y el test las cruza con las especificaciones de los doce
            modelos del catálogo para dejarte los tres que mejor encajan.
          </p>
        </section>

        <div className="divider my-8" />

        <section>
          <h2 className="text-xl mb-4" style={{ color: "var(--text-primary)" }}>
            Las cuatro preguntas, y por qué importan
          </h2>
          <ul className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            <li>
              <strong style={{ color: "var(--text-primary)" }}>Uso principal.</strong>{" "}
              Teletrabajo, gaming o un poco de todo. Un escritorio de gaming
              prioriza superficie y estabilidad; uno de oficina, el rango de
              altura y el silencio. Si marcas &laquo;un poco de todo&raquo;, el
              test deja de filtrar por ahí y decide con el resto.
            </li>
            <li>
              <strong style={{ color: "var(--text-primary)" }}>Motor, simple o doble.</strong>{" "}
              El doble sube más rápido, hace menos ruido y aguanta más peso. El
              simple cuesta menos y cumple de sobra si mueves la mesa dos veces al
              día. Es la decisión que más separa el precio.
            </li>
            <li>
              <strong style={{ color: "var(--text-primary)" }}>Peso de tu setup.</strong>{" "}
              Ligero si llevas solo un portátil, medio si hay un monitor, pesado si
              son dos o más. El test exige 70 kg de carga para un setup medio y
              100 kg para uno pesado. La mayoría de escritorios van sobrados: un
              equipo normal pesa entre 12 y 15 kg.
            </li>
            <li>
              <strong style={{ color: "var(--text-primary)" }}>Ruido.</strong>{" "}
              Si contestas que necesitas silencio, solo puntúan los modelos de 46
              dB o menos. Importa si cambias de altura durante una videollamada;
              si no, no condiciona nada.
            </li>
          </ul>
        </section>

        <div className="divider my-8" />

        <section className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <h2 className="text-xl mb-4" style={{ color: "var(--text-primary)" }}>
            Cómo se ordenan los resultados
          </h2>
          <p>
            Cada modelo suma puntos por cada respuesta que encaja con sus
            especificaciones, y a eso se le añade una parte de su nota global,
            para que entre dos que cumplen lo mismo gane el mejor valorado. Se
            muestran los tres primeros.
          </p>
          <p>
            Los datos salen de la ficha del fabricante en Amazon España, los
            mismos que alimentan el resto del sitio. Puedes ver el criterio
            completo en la{" "}
            <Link href="/metodologia" style={{ color: "var(--verde-estructura)", textDecoration: "underline" }}>
              metodología
            </Link>{" "}
            o filtrar tú mismo los doce modelos en el{" "}
            <Link href="/comparador" style={{ color: "var(--verde-estructura)", textDecoration: "underline" }}>
              comparador
            </Link>
            .
          </p>
          <p>
            Y una cosa que este test no hace: adivinar tu presupuesto. No pregunta
            cuánto te quieres gastar porque el precio en Amazon cambia a diario y
            una recomendación basada en el precio de hoy caduca mañana. Cada
            modelo lleva su franja de precio con la fecha en que se comprobó.
          </p>
        </section>
      </div>
    </>
  );
}
