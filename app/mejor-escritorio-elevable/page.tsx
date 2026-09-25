import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAvailableProducts } from "@/lib/products";
import { rutaFicha } from "@/lib/rutas";
import { coma, nota } from "@/lib/format";
import { NOMBRE_FRANJA, posicionEnFranja, type Franja } from "@/lib/nota";
import { FECHA_EN_FRASE } from "@/lib/fecha";
import {
  carga,
  etiquetasSpec,
  exclusion,
  franjaCorta,
  franjaPrecio,
  garantia,
  motorCorto,
  notaFranjas,
  publicable,
  recorrido,
  tablero,
} from "@/lib/ficha";
import { casos } from "@/lib/casos";
import { productSchema } from "@/lib/schema";
import type { Product } from "@/lib/types";
import { Cta } from "@/components/broadsheet/Cta";
import { Afiliado } from "@/components/broadsheet/Afiliado";
import { Firma } from "@/components/broadsheet/Firma";
import { PosicionNota } from "@/components/broadsheet/PosicionNota";
import { Comparativa, type FilaComparativa } from "@/components/broadsheet/Comparativa";

/**
 * La guía de compra: la página que cita ChatGPT y la que más clics a Amazon
 * genera (SEO-PLAN.md §0, P2). Responde arriba y en corto —el nº 1 de cada
 * franja y qué modelo encaja con cada caso— y después va modelo a modelo.
 *
 * Todo sale del catálogo. Las notas no se comparan entre franjas (METODO.md
 * §5), así que la página se ordena por franja, no por nota global.
 */

// El numero sale del catalogo: cuando un modelo se retira, el titulo no
// sigue prometiendo los que habia.
const N = getAvailableProducts().length;
const SITE = "https://elevable.es";
const RUTA = "/mejor-escritorio-elevable";

export const metadata: Metadata = {
  title: `${N} mejores escritorios elevables 2026 — Guía de compra`,
  description: `Los ${N} escritorios elevables del catálogo, por franja de precio y con una nota calculada con método público. Cuál comprar si eres alto, tienes poco espacio o vas a poner dos monitores.`,
  alternates: { canonical: RUTA },
};

export default function MejorEscritorioPage() {
  const catalogo = getAvailableProducts().sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total);
  const productos = catalogo.map(([, p]) => p);
  const asinDe = new Map(catalogo.map(([asin, p]) => [p.slug, asin]));
  const franjas = Object.keys(NOMBRE_FRANJA) as Franja[];

  // Cada franja con sus modelos en orden de posicion; los que no tienen
  // franja verificada van al final.
  const enFranja = (f: Franja) =>
    catalogo
      .map(([asin, p]) => ({ asin, p, pos: posicionEnFranja(p, productos) }))
      .filter((x) => x.pos?.franja === f)
      .sort((a, b) => a.pos!.posicion - b.pos!.posicion);
  const grupos = franjas.map((f) => ({ f, modelos: enFranja(f) })).filter((g) => g.modelos.length);
  const sinFranja = catalogo.filter(([, p]) => !posicionEnFranja(p, productos));
  const primeros = grupos.map((g) => g.modelos[0]);
  const fechaFranjas = notaFranjas(productos);
  const losCasos = casos(productos);

  // Cifras de la guia, calculadas del catalogo y solo con lo declarado.
  const rango = (xs: number[]) => {
    const [a, b] = [Math.min(...xs), Math.max(...xs)];
    return a === b ? coma(a) : `${coma(a)} y ${coma(b)}`;
  };
  const dobles = productos.filter((p) => p.specs.tipo_motor === "doble");
  const simples = productos.filter((p) => p.specs.tipo_motor === "simple");
  const cargas = productos.map((p) => p.specs.peso_max_carga_kg);
  const ruidos = (g: Product[]) => g.map((p) => p.specs.ruido_db).filter((r): r is number => r !== null);
  const alturas = (g: Product[]) => g.map((p) => p.specs.rango_altura_max_cm);
  const masAlto = [...productos].sort((a, b) => b.specs.rango_altura_max_cm - a.specs.rango_altura_max_cm)[0];
  const anticolisionBarato = losCasos.find((c) => c.id === "anticolision")?.producto;

  const filas: FilaComparativa[] = catalogo.map(([asin, p]) => ({
    asin,
    nombre: `${p.marca} ${p.modelo}`,
    imagen: p.imagen,
    alt: p.imagen_alt,
    nota: nota(p.puntuacion.total),
    notaNum: p.puntuacion.total,
    rating: coma(p.rating),
    motor: motorCorto(p),
    carga: p.specs.peso_max_carga_kg,
    cargaTxt: carga(p),
    ancho: p.specs.ancho_tablero_cm,
    tablero: p.incluye_tablero,
    tableroTxt: tablero(p),
    recorrido: recorrido(p),
    garantia: garantia(p),
    franja: franjaCorta(p),
  }));

  const guia = [
    { title: "El motor: simple o doble", text: `El doble reparte el esfuerzo entre las dos patas: en el catálogo, los de doble motor mueven entre ${rango(dobles.map((p) => p.specs.peso_max_carga_kg))} kg, y los de uno, entre ${rango(simples.map((p) => p.specs.peso_max_carga_kg))}. Si cambias de posición varias veces al día con un setup pesado, merece la pena. Si lo mueves dos veces al día con un portátil, el simple cumple.` },
    { title: "Estabilidad: importa más de lo que crees", text: "De pie, el tablero está mucho más alto y cualquier vibración se amplifica. Si la pantalla tiembla al teclear, te cansas la vista. El doble motor y una estructura robusta ayudan. En los baratos hay que aceptar algo de movimiento." },
    { title: "Ruido: ojo si haces videollamadas", text: `No todas las fichas lo declaran. Las que sí: entre ${rango(ruidos(simples))} dB los de un motor y entre ${rango(ruidos(dobles))} dB los de doble motor. Si cambias de altura durante una llamada, se oye.` },
    { title: "Rango de altura: ojo si eres alto", text: `Los de un motor del catálogo suben hasta entre ${rango(alturas(simples))} cm; los de doble motor, entre ${rango(alturas(dobles))} cm. Si eres alto y trabajas de pie, un escritorio que se queda corto te obliga a encorvarte. El que más sube es el ${masAlto.marca} ${masAlto.modelo}, hasta ${coma(masAlto.specs.rango_altura_max_cm)} cm.`, enlace: { texto: "Calcula la altura que necesitas", href: "/calculadora-altura" } },
    { title: "Garantía y postventa", text: "Pocas fichas declaran los años: el MAIDeSITe S2 Pro da cinco; los Flexispot, cinco en la estructura y tres en el motor; el SANODESK, tres. En el resto cuenta la garantía legal. Si puedes elegir, más años siempre: tiene electrónica y partes móviles." },
    { title: "Anticolisión: no te la juegues", text: `Para el motor si detecta un obstáculo al bajar. Sin anticolisión, el motor sigue y puede romper cajones o el propio mecanismo.${anticolisionBarato ? ` Entre los que vienen con tablero, el más asequible que la declara es el ${anticolisionBarato.marca} ${anticolisionBarato.modelo}.` : ""} Si la ficha no la menciona, no des por hecho que la tiene.` },
  ];

  const faqItems = [
    {
      q: "¿Cuál es el mejor escritorio elevable?",
      a: `Depende de lo que quieras gastar, porque cada escritorio se mide contra lo que se puede esperar por su precio. El primero de cada franja: ${primeros.map(({ p, pos }) => `${NOMBRE_FRANJA[pos!.franja].toLowerCase()}, el ${p.marca} ${p.modelo} (nota ${nota(p.puntuacion.total)})`).join("; ")}.`,
    },
    {
      q: "¿Merece la pena un escritorio elevable?",
      a: "Depende de si vas a usarlo. Un escritorio elevable solo aporta algo si de verdad lo subes y alternas entre sentado y de pie a lo largo del día. Si sospechas que lo vas a dejar siempre a la misma altura, te sale más barato una mesa normal.",
    },
    {
      q: "Motor simple o doble: ¿cuál elijo?",
      a: `El doble reparte el esfuerzo entre las dos patas: en el catálogo, los de doble motor declaran entre ${rango(dobles.map((p) => p.specs.peso_max_carga_kg))} kg de carga en movimiento, y los de uno, entre ${rango(simples.map((p) => p.specs.peso_max_carga_kg))}. Si cambias de posición varias veces al día con un setup pesado, se nota. Si el presupuesto manda, un motor simple cumple bien: prioriza estabilidad y garantía antes que esto.`,
    },
    {
      q: "¿Cuánto peso soportan estos escritorios?",
      a: `De ${Math.min(...cargas)} a ${Math.max(...cargas)} kg según el modelo, y el dato incluye todo lo que va encima, tablero incluido si lo compras aparte. Un monitor, un portátil y accesorios quedan lejos del mínimo; la carga solo decide con varios monitores con brazo o equipo pesado.`,
    },
    {
      q: "¿Puedo montar un escritorio elevable solo?",
      a: "Depende del peso del paquete, y muchas fichas no lo declaran. Con un tablero de 160 cm cuesta darle la vuelta en solitario: mejor entre dos.",
    },
    {
      q: "¿Qué garantía tienen?",
      a: "En España la garantía legal mínima son tres años para cualquier producto nuevo, así que ese es el suelo de todo el catálogo. Por encima de eso, el MAIDeSITe S2 Pro declara cinco años, y los Flexispot, cinco en la estructura y tres en el motor. Varias fichas de Amazon no dicen cuántos años dan: en esos casos cuenta la legal.",
    },
    {
      q: "¿Se nota mucho la diferencia entre la gama de entrada y la alta?",
      a: "En carga, doble motor y garantía, sí: los datos lo muestran. Para uso normal, uno de gama media con anticolisión va bien. Si pasas muchas horas al día de pie y necesitas que no vibre nada al escribir, el salto se nota.",
    },
  ];

  // Datos estructurados de lo que la pagina ensena, en el mismo orden.
  const ordenPagina = [...grupos.flatMap((g) => g.modelos.map(({ asin, p }) => [asin, p] as [string, Product])), ...sinFranja];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
          { "@type": "ListItem", position: 2, name: "Mejores escritorios elevables", item: `${SITE}${RUTA}` },
        ],
      },
      {
        "@type": "ItemList",
        name: `Los ${N} mejores escritorios elevables de 2026, por franja de precio`,
        // Franjas distintas no se ordenan entre si (METODO.md §5).
        itemListOrder: "https://schema.org/ItemListUnordered",
        numberOfItems: ordenPagina.length,
        itemListElement: ordenPagina.map(([, p], i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${p.marca} ${p.modelo}`,
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
  const productSchemas = ordenPagina.map(([a, p]) => productSchema(a, p, RUTA));

  return (
    <div className="bs-pagina">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {productSchemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* ============================================================
          Nº 01 · La respuesta corta
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <p className="bs-kicker">Nº 01 · Guía de compra</p>
        <h1 className="bs-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>
          Los {N} mejores escritorios elevables de 2026
        </h1>
        <p className="bs-standfirst" style={{ maxWidth: "50ch", marginTop: 18 }}>
          Cuál comprar según tu presupuesto y tu caso. Cada escritorio se mide
          contra lo que se puede esperar por su precio; estos son los primeros
          de cada franja.
        </p>
        <p style={{ fontSize: 14, marginTop: 14, color: "var(--bs-neutro-700)" }}>
          Actualizado en {FECHA_EN_FRASE}.{fechaFranjas && ` ${fechaFranjas}`}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "32px var(--bs-hueco-columnas)",
            marginTop: 36,
          }}
        >
          {primeros.map(({ asin, p }) => (
            <div key={asin} className="bs-camino">
              <div className="bs-marco" style={{ padding: 10 }}>
                <div style={{ height: 130 }}>
                  <Image
                    src={p.imagen}
                    alt={p.imagen_alt}
                    width={280}
                    height={130}
                    priority
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
              </div>
              <h2 className="bs-h3">
                <a href={`#${p.slug}`}>
                  {p.marca} {p.modelo}
                </a>
              </h2>
              <PosicionNota producto={p} catalogo={productos} tamano="44px" />
              {franjaPrecio(p) && <p className="bs-afiliado bs-afiliado-mini">{franjaPrecio(p)}</p>}
              <Cta asin={asin} ancho mini />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-end" style={{ gap: "16px 40px", marginTop: 28 }}>
          <div style={{ flex: "1 1 320px", maxWidth: "62ch" }}>
            <Afiliado />
          </div>
          <Firma total={N} />
        </div>
      </section>

      {/* ============================================================
          Nº 02 · Según tu caso
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 02 · Según tu caso</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Cuál comprar si…
          </h2>
          <p className="bs-cuerpo" style={{ maxWidth: "58ch", marginTop: 16, color: "var(--bs-neutro-800)" }}>
            Lo que decide la compra casi nunca es la nota: es tu altura, tu
            espacio o lo que vas a poner encima. Cada respuesta sale de lo que
            declara la ficha del fabricante.
          </p>

          <div style={{ marginTop: 32 }}>
            {losCasos.map((c) => {
              const asin = asinDe.get(c.producto.slug)!;
              const ruta = rutaFicha(c.producto);
              return (
                <div key={c.id} className="bs-fila">
                  <div className="bs-marco" style={{ padding: 6, flex: "0 0 auto" }}>
                    <div style={{ width: 62, height: 56 }}>
                      <Image
                        src={c.producto.imagen}
                        alt={c.producto.imagen_alt}
                        width={62}
                        height={56}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>
                  </div>
                  <div style={{ flex: "1 1 300px" }}>
                    <p className="bs-etiqueta">{c.situacion}</p>
                    <h3 style={{ fontSize: 17, fontWeight: 600, marginTop: 4 }}>
                      {ruta ? <Link href={ruta}>{c.producto.marca} {c.producto.modelo}</Link> : `${c.producto.marca} ${c.producto.modelo}`}
                      <span style={{ fontWeight: 400, color: "var(--bs-neutro-700)" }}>
                        {" "}· nota {nota(c.producto.puntuacion.total)}
                      </span>
                    </h3>
                    <p style={{ fontSize: 15, marginTop: 4, color: "var(--bs-neutro-800)" }}>{c.motivo}</p>
                  </div>
                  <Cta asin={asin} mini />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          Nº 03 · Comparativa
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 03 · Comparativa</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Los {N} modelos, lado a lado
          </h2>
          <Comparativa filas={filas} />
          <p className="bs-afiliado" style={{ marginTop: 20, maxWidth: "66ch" }}>
            Nota sobre 10 según nuestra <Link href="/metodologia">metodología</Link>, medida
            dentro de cada franja de precio.{fechaFranjas && ` ${fechaFranjas}`} Todos los
            enlaces son de afiliado: si compras, Amazon nos paga una comisión y tú
            pagas lo mismo.
          </p>
        </div>
      </section>

      {/* ============================================================
          Nº 04 · Modelo a modelo
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 04 · Modelo a modelo</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Cada escritorio, franja a franja
          </h2>

          {[...grupos.map((g) => ({ titulo: NOMBRE_FRANJA[g.f], modelos: g.modelos.map(({ asin, p }) => [asin, p] as [string, Product]) })),
            ...(sinFranja.length ? [{ titulo: "Sin franja de precio verificada", modelos: sinFranja }] : []),
          ].map((grupo) => (
            <div key={grupo.titulo} style={{ marginTop: 48 }}>
              <h3 className="bs-h3" style={{ paddingBottom: 10, borderBottom: "var(--bs-filete-fino)" }}>
                {grupo.titulo}
              </h3>
              <div className="flex flex-col" style={{ gap: 24, marginTop: 24 }}>
                {grupo.modelos.map(([asin, p]) => {
                  const pros = p.pros.filter(publicable).slice(0, 3);
                  const contras = p.contras.filter(publicable).slice(0, 2);
                  const excl = exclusion(p);
                  const ruta = rutaFicha(p);
                  return (
                    <article key={asin} id={p.slug} className="bs-tarjeta" style={{ scrollMarginTop: 80 }}>
                      <div className="flex flex-wrap" style={{ gap: "clamp(20px, 3vw, 36px)" }}>
                        <div style={{ flex: "0 1 230px" }}>
                          <div className="bs-marco" style={{ padding: 12 }}>
                            <div style={{ height: 170 }}>
                              <Image
                                src={p.imagen}
                                alt={p.imagen_alt}
                                width={230}
                                height={170}
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                              />
                            </div>
                          </div>
                        </div>

                        <div style={{ flex: "1 1 340px" }}>
                          <h4 className="bs-h3">
                            {p.marca} {p.modelo}
                          </h4>
                          <div style={{ marginTop: 10 }}>
                            <PosicionNota producto={p} catalogo={productos} tamano="40px" />
                          </div>
                          {publicable(p.veredicto) && (
                            <p style={{ fontSize: "clamp(16px, 1.6vw, 18px)", lineHeight: 1.55, marginTop: 12 }}>
                              {p.veredicto}
                            </p>
                          )}
                          <div className="flex flex-wrap" style={{ gap: 7, marginTop: 16 }}>
                            {etiquetasSpec(p).map((e) => (
                              <span key={e} className="bs-spec">
                                {e}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-col" style={{ gap: 8, marginTop: 18 }}>
                            {pros.map((t) => (
                              <p key={t} className="bs-pro">
                                <span aria-hidden="true">✓</span>
                                <span>{t}</span>
                              </p>
                            ))}
                            {contras.map((t) => (
                              <p key={t} className="bs-pro">
                                <span aria-hidden="true" style={{ color: "var(--bs-neutro-700)" }}>×</span>
                                <span>{t}</span>
                              </p>
                            ))}
                          </div>
                          {excl && (
                            <p className="bs-exclusion" style={{ marginTop: 16, fontSize: 15 }}>
                              {excl.arranque && <strong>{excl.arranque}</strong>} {excl.motivo}
                            </p>
                          )}
                          {franjaPrecio(p) && (
                            <p className="bs-afiliado bs-afiliado-mini" style={{ marginTop: 18 }}>
                              {franjaPrecio(p)}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center" style={{ gap: "12px 24px", marginTop: 12 }}>
                            <div style={{ flex: "1 1 260px", maxWidth: 340 }}>
                              <Cta asin={asin} ancho />
                            </div>
                            {ruta && (
                              <Link href={ruta} style={{ fontSize: 15 }}>
                                Ficha completa del {p.marca} {p.modelo}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          Nº 05 · Cómo elegir
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 05 · Cómo elegir</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Lo que de verdad importa
          </h2>
          <div className="flex flex-col" style={{ gap: 28, marginTop: 32, maxWidth: "66ch" }}>
            {guia.map((item) => (
              <div key={item.title} style={{ paddingLeft: 14, borderLeft: "2px solid var(--bs-verde-botella)" }}>
                <h3 className="bs-h3">{item.title}</h3>
                <p className="bs-cuerpo" style={{ marginTop: 8, color: "var(--bs-neutro-800)" }}>
                  {item.text}
                  {item.enlace && (
                    <>
                      {" "}
                      <Link href={item.enlace.href}>{item.enlace.texto}</Link>.
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Nº 06 · Preguntas frecuentes
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 06 · Preguntas frecuentes</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Antes de comprar
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
              <Link href="/escritorio-elevable-barato">Escritorios elevables baratos</Link>: la gama de entrada, con más detalle.
            </li>
            <li>
              <Link href="/bases-elevables">Bases elevables</Link>: los marcos sin tablero, para poner el tuyo.
            </li>
            <li>
              <Link href="/flexispot-vs-maidesite">Flexispot vs MAIDeSITe</Link>: las dos marcas cara a cara.
            </li>
            <li>
              <Link href="/sanodesk-vs-flexispot">SANODESK vs FLEXISPOT</Link>: cuál comprar de las dos.
            </li>
            <li>
              <Link href="/comparador">Comparador</Link>: filtra el catálogo por carga, tablero y ancho.
            </li>
            <li>
              <Link href="/calculadora-altura">Calculadora de altura</Link>: la altura de trabajo según tu estatura.
            </li>
            <li>
              <Link href="/metodologia">Metodología</Link>: cómo se calcula la nota y qué no hacemos.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
