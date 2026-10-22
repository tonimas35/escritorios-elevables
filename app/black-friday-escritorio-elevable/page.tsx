import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAvailableProducts } from "@/lib/products";
import { rutaFicha } from "@/lib/rutas";
import { nota } from "@/lib/format";
import { NOMBRE_FRANJA, posicionEnFranja, type Franja } from "@/lib/nota";
import { FECHA_EN_FRASE } from "@/lib/fecha";
import { franjaPrecio, notaFranjas } from "@/lib/ficha";
import { productSchema } from "@/lib/schema";
import type { Product } from "@/lib/types";
import { Cta } from "@/components/broadsheet/Cta";
import { Afiliado } from "@/components/broadsheet/Afiliado";
import { Firma } from "@/components/broadsheet/Firma";

/**
 * Black Friday 2026 (SEO-PLAN.md §0, P5): cómo saber si la oferta de un
 * escritorio elevable es de verdad.
 *
 * La página no anuncia descuentos: no sabemos cuáles habrá. Lo que aporta es
 * la referencia que Amazon no da, la franja en la que vimos cada modelo, con
 * su fecha. El precio solo aparece en el formato de `franjaPrecio()`
 * (CLAUDE.md, «Precios») y las notas no se comparan entre franjas
 * (METODO.md §5). Las franjas se revisan la semana del 16/11, antes del
 * Black Friday, y esta página se actualiza sola con ellas.
 */

const SITE = "https://elevable.es";
const RUTA = "/black-friday-escritorio-elevable";
const ORDEN_FRANJAS: Franja[] = ["A", "B", "C", "M1", "M2"];

export const metadata: Metadata = {
  title: "Escritorio elevable en Black Friday 2026: cómo saber si la oferta es real",
  description:
    "El precio de referencia de cada escritorio elevable del catálogo, con la fecha en que lo comprobamos, para saber en Black Friday si una oferta en Amazon es una rebaja de verdad o su precio de siempre.",
  alternates: { canonical: RUTA },
};

export default function BlackFridayPage() {
  const todos = getAvailableProducts();
  const catalogo = todos.map(([, p]) => p);
  const asinDe = new Map(todos.map(([asin, p]) => [p.slug, asin]));
  const nombre = (p: Product) => `${p.marca} ${p.modelo}`;

  // Solo los modelos con franja verificada: sin ella no hay referencia que
  // dar, que es el sentido de la página.
  const enFranja = (f: Franja) =>
    catalogo
      .filter((p) => franjaPrecio(p))
      .map((p) => ({ p, pos: posicionEnFranja(p, catalogo) }))
      .filter((x) => x.pos?.franja === f)
      .sort((a, b) => a.pos!.posicion - b.pos!.posicion);
  const grupos = ORDEN_FRANJAS.map((f) => ({ f, filas: enFranja(f) })).filter((g) => g.filas.length);
  const conReferencia = grupos.flatMap((g) => g.filas.map((x) => x.p));
  const primeros = grupos.map((g) => g.filas[0]);
  const fechaFranjas = notaFranjas(conReferencia);

  const reglas: { titulo: string; texto: string }[] = [
    {
      titulo: "Por debajo de su franja",
      texto:
        "Es más barato que cuando lo comprobamos: una rebaja de verdad. Si el modelo encaja con lo que necesitas, es el momento.",
    },
    {
      titulo: "Dentro de su franja",
      texto:
        "Es un precio que ya tenía antes, aunque lleve etiqueta de oferta. No es un mal precio, pero tampoco hay prisa.",
    },
    {
      titulo: "Por encima de su franja",
      texto:
        "Está más caro que cuando lo comprobamos. Espera, o mira otro modelo de la misma franja.",
    },
  ];

  const consejos: { titulo: string; texto: string; enlace?: { texto: string; href: string } }[] = [
    {
      titulo: "El precio tachado no siempre es el anterior",
      texto:
        "Cuando una tienda anuncia una rebaja en España, el precio anterior que puede tachar es el más bajo de los últimos 30 días. Pero el precio recomendado del fabricante es otra cosa: muchos escritorios casi nunca se venden a ese precio, y un descuento sobre él dice poco. Compáralo siempre con la franja.",
    },
    {
      titulo: "Quién lo vende y quién lo envía",
      texto:
        "En Amazon, el mismo escritorio puede venderlo la propia Amazon, la marca u otra tienda. Mira «Enviado por» y «Vendido por» antes de pagar: de eso dependen el plazo de entrega y cómo se gestiona una devolución o una garantía.",
    },
    {
      titulo: "Las devoluciones de noviembre",
      texto:
        "Amazon suele ampliar el plazo de devolución de las compras de final de año. Compruébalo en la página de pago antes de comprar: un escritorio elevable pesa y abulta, y conviene saber hasta cuándo puedes devolverlo.",
    },
    {
      titulo: "No subas de gama por un descuento",
      texto:
        "Un buen descuento en un escritorio de gama alta puede seguir siendo más de lo que necesitas. Para teletrabajar con portátil y monitor, la gama de entrada va de sobra. Decide primero qué necesitas y después mira el precio.",
      enlace: { texto: "Qué escritorio elevable comprar según el uso", href: "/que-escritorio-elevable-comprar" },
    },
    {
      titulo: "Mide antes de que llegue la oferta",
      texto:
        "La altura mínima y máxima, el tamaño del tablero y la carga no cambian con el precio. Si los tienes claros antes, el día de la oferta solo te queda comprobar el precio.",
      enlace: { texto: "Calcula la altura que necesitas", href: "/calculadora-altura" },
    },
  ];

  const faqItems: { q: string; a: string }[] = [
    {
      q: "¿Cuándo es el Black Friday de 2026?",
      a: "El viernes 27 de noviembre de 2026. El Cyber Monday es el lunes 30 de noviembre. Amazon suele adelantar parte de sus ofertas a los días anteriores.",
    },
    {
      q: "¿Cómo sé si una oferta de escritorio elevable es buena?",
      a: "Compara el precio que ves en Amazon con la franja en la que vimos el modelo, que aparece en esta página junto a la fecha en que la comprobamos. Por debajo de la franja, es una rebaja de verdad. Dentro, es un precio que ya tenía antes.",
    },
    {
      q: "¿Merece la pena esperar al Black Friday para comprar un escritorio elevable?",
      a: "Si no tienes prisa, esperar no cuesta nada. Si lo necesitas ya, comprarlo dentro de su franja es pagar su precio normal, no un mal precio. No sabemos de antemano qué modelos rebajará Amazon.",
    },
    {
      q: "¿Qué escritorio elevable comprar en Black Friday?",
      a: `Primero decide cuánto quieres gastar, porque cada modelo se mide contra lo que se puede esperar por su precio. ${primeros
        .map(({ p, pos }) => `En ${NOMBRE_FRANJA[pos!.franja].toLowerCase()}, el primero es el ${nombre(p)} (nota ${nota(p.puntuacion.total)}).`)
        .join(" ")}`,
    },
    {
      q: "¿Estarán actualizados los precios de referencia en Black Friday?",
      a: "Revisamos las franjas de precio de todo el catálogo la semana anterior al Black Friday. Cada franja lleva la fecha en que se comprobó, para que sepas cuánto tiene.",
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
          { "@type": "ListItem", position: 2, name: "Black Friday", item: `${SITE}${RUTA}` },
        ],
      },
      {
        "@type": "ItemList",
        name: "Precios de referencia de escritorios elevables por franja",
        // Franjas distintas no se ordenan entre sí (METODO.md §5).
        itemListOrder: "https://schema.org/ItemListUnordered",
        numberOfItems: conReferencia.length,
        itemListElement: conReferencia.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: nombre(p),
          url: `${SITE}${RUTA}#${p.slug}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="bs-pagina">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {conReferencia.map((p) => (
        <script
          key={p.slug}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema(asinDe.get(p.slug)!, p, RUTA)) }}
        />
      ))}

      {/* ============================================================
          Nº 01 · La respuesta corta
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <p className="bs-kicker">Nº 01 · Black Friday 2026</p>
        <h1 className="bs-h1" style={{ marginTop: 14, maxWidth: "24ch" }}>
          Escritorio elevable en Black Friday: cómo saber si la oferta{" "}
          <span className="bs-fluor">es real</span>
        </h1>
        <p className="bs-standfirst" style={{ maxWidth: "54ch", marginTop: 18 }}>
          El Black Friday es el viernes 27 de noviembre. Antes de comprar,
          compara el precio que veas en Amazon con la franja en la que vimos
          cada modelo: si está por debajo, es una rebaja de verdad; si está
          dentro, es su precio de siempre con etiqueta de oferta.
        </p>
        <p style={{ fontSize: 14, marginTop: 14, color: "var(--bs-neutro-700)" }}>
          Actualizado en {FECHA_EN_FRASE}.{fechaFranjas && ` ${fechaFranjas}`} Las revisamos de nuevo la semana anterior al Black Friday.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: "20px var(--bs-hueco-columnas)",
            marginTop: 36,
          }}
        >
          {reglas.map((r) => (
            <div key={r.titulo} style={{ paddingLeft: 14, borderLeft: "2px solid var(--bs-verde-botella)" }}>
              <h2 className="bs-h3">{r.titulo}</h2>
              <p className="bs-cuerpo" style={{ marginTop: 8, color: "var(--bs-neutro-800)" }}>
                {r.texto}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-end" style={{ gap: "16px 40px", marginTop: 32 }}>
          <div style={{ flex: "1 1 320px", maxWidth: "62ch" }}>
            <Afiliado />
          </div>
          <Firma total={catalogo.length} />
        </div>
      </section>

      {/* ============================================================
          Nº 02 · Precios de referencia
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 02 · Precios de referencia</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            La franja de cada modelo, para comparar con la oferta
          </h2>
          <p className="bs-cuerpo" style={{ marginTop: 12, maxWidth: "62ch", color: "var(--bs-neutro-800)" }}>
            Ordenados por franja y, dentro de cada una, por nota. Abre el
            enlace, mira el precio de ese momento y compáralo con la franja.
          </p>

          {grupos.map((g) => (
            <div key={g.f} style={{ marginTop: 44 }}>
              {/* Sin filete propio: la primera fila ya trae el suyo. */}
              <h3 className="bs-h3" style={{ paddingBottom: 4 }}>
                {NOMBRE_FRANJA[g.f]}
              </h3>
              <div>
                {g.filas.map(({ p, pos }) => {
                  const ruta = rutaFicha(p);
                  return (
                    <div key={p.slug} id={p.slug} className="bs-fila" style={{ scrollMarginTop: 80 }}>
                      <div className="bs-marco" style={{ padding: 6, flex: "0 0 auto" }}>
                        <div style={{ width: 62, height: 56 }}>
                          <Image
                            src={p.imagen}
                            alt={p.imagen_alt}
                            width={62}
                            height={56}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        </div>
                      </div>
                      <div style={{ flex: "1 1 300px" }}>
                        <p className="bs-etiqueta">
                          Nº {pos!.posicion} de {pos!.de} en su franja
                        </p>
                        <h4 style={{ fontSize: 17, fontWeight: 600, marginTop: 4 }}>
                          {ruta ? <Link href={ruta}>{nombre(p)}</Link> : nombre(p)}
                          <span style={{ fontWeight: 400, color: "var(--bs-neutro-700)" }}>
                            {" "}· nota {nota(p.puntuacion.total)}
                          </span>
                        </h4>
                        <p className="bs-afiliado bs-afiliado-mini" style={{ marginTop: 6 }}>
                          {franjaPrecio(p)}
                        </p>
                      </div>
                      <Cta asin={asinDe.get(p.slug)!} mini />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          Nº 03 · Antes de comprar
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 03 · Antes de comprar</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Cinco cosas que mirar antes de pulsar «comprar»
          </h2>
          <div className="flex flex-col" style={{ gap: 28, marginTop: 32, maxWidth: "66ch" }}>
            {consejos.map((c) => (
              <div key={c.titulo} style={{ paddingLeft: 14, borderLeft: "2px solid var(--bs-verde-botella)" }}>
                <h3 className="bs-h3">{c.titulo}</h3>
                <p className="bs-cuerpo" style={{ marginTop: 8, color: "var(--bs-neutro-800)" }}>
                  {c.texto}
                  {c.enlace && (
                    <>
                      {" "}
                      <Link href={c.enlace.href}>{c.enlace.texto}</Link>.
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Nº 04 · Preguntas frecuentes
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 04 · Preguntas frecuentes</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Black Friday, en corto
          </h2>
          <div className="flex flex-col" style={{ gap: "var(--bs-hueco-bloques)", marginTop: 36 }}>
            {faqItems.map((f) => (
              <div key={f.q} className="flex flex-wrap" style={{ gap: "clamp(12px, 3vw, 40px)" }}>
                <h3 className="bs-h3" style={{ flex: "1 1 260px" }}>
                  {f.q}
                </h3>
                <p className="bs-cuerpo" style={{ flex: "1 1 380px" }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>

          <h3 className="bs-h3" style={{ marginTop: 56 }}>
            Sigue leyendo
          </h3>
          <ul className="flex flex-col" style={{ gap: 10, marginTop: 14, fontSize: 16 }}>
            <li>
              <Link href="/mejor-escritorio-elevable">Los mejores escritorios elevables de 2026</Link>: todo el catálogo, modelo a modelo.
            </li>
            <li>
              <Link href="/escritorio-elevable-barato">Escritorios elevables baratos</Link>: los de las franjas más bajas.
            </li>
            <li>
              <Link href="/bases-elevables">Bases elevables</Link>: si ya tienes tablero.
            </li>
            <li>
              <Link href="/metodologia">Metodología</Link>: cómo se calcula la nota y cómo comprobamos los precios.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
