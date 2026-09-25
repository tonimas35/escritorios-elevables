import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAvailableProducts } from "@/lib/products";
import { rutaFicha } from "@/lib/rutas";
import { coma, nota } from "@/lib/format";
import { NOMBRE_FRANJA, posicionEnFranja, type Franja } from "@/lib/nota";
import { FECHA_EN_FRASE } from "@/lib/fecha";
import { etiquetasSpec, exclusion, franjaPrecio, notaFranjas, publicable } from "@/lib/ficha";
import { casosMarcos } from "@/lib/casos";
import { productSchema } from "@/lib/schema";
import type { Product } from "@/lib/types";
import { Cta } from "@/components/broadsheet/Cta";
import { Afiliado } from "@/components/broadsheet/Afiliado";
import { Firma } from "@/components/broadsheet/Firma";
import { PosicionNota } from "@/components/broadsheet/PosicionNota";

/**
 * Bases elevables: los marcos sin tablero del catálogo (SEO-PLAN.md §0, P4).
 * «bases elevables» tenía búsquedas y ninguna página que la respondiera.
 *
 * Misma estructura que la guía: la respuesta corta por franja, qué base
 * encaja con cada caso y después base a base. Todo sale del catálogo y las
 * notas no se comparan entre franjas (METODO.md §5).
 */

const SITE = "https://elevable.es";
const RUTA = "/bases-elevables";
const FRANJAS_MARCO: Franja[] = ["M1", "M2"];

export const metadata: Metadata = {
  title: "Bases elevables 2026: qué marco de escritorio elevable comprar",
  description:
    "Las bases (marcos) de escritorio elevable del catálogo, por franja de precio y con nota calculada con método público: cuál elegir si quieres doble motor, más altura, más carga o más garantía.",
  alternates: { canonical: RUTA },
};

export default function BasesElevablesPage() {
  const todos = getAvailableProducts();
  const catalogo = todos.map(([, p]) => p);
  const asinDe = new Map(todos.map(([asin, p]) => [p.slug, asin]));
  const marcos = catalogo.filter((p) => !p.incluye_tablero);
  const completos = catalogo.filter((p) => p.incluye_tablero);

  const enFranja = (f: Franja) =>
    marcos
      .map((p) => ({ p, pos: posicionEnFranja(p, catalogo) }))
      .filter((x) => x.pos?.franja === f)
      .sort((a, b) => a.pos!.posicion - b.pos!.posicion)
      .map((x) => x.p);
  const grupos = FRANJAS_MARCO.map((f) => ({ f, modelos: enFranja(f) })).filter((g) => g.modelos.length);
  const sinFranja = marcos.filter((p) => !posicionEnFranja(p, catalogo));
  const primeros = grupos.map((g) => g.modelos[0]);
  const ordenPagina = [...grupos.flatMap((g) => g.modelos), ...sinFranja];
  const fechaFranjas = notaFranjas(marcos);
  const losCasos = casosMarcos(catalogo);
  const nombre = (p: Product) => `${p.marca} ${p.modelo}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
          { "@type": "ListItem", position: 2, name: "Bases elevables", item: `${SITE}${RUTA}` },
        ],
      },
      {
        "@type": "ItemList",
        name: "Bases elevables por franja de precio",
        // Franjas distintas no se ordenan entre si (METODO.md §5).
        itemListOrder: "https://schema.org/ItemListUnordered",
        numberOfItems: ordenPagina.length,
        itemListElement: ordenPagina.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: nombre(p),
          url: `${SITE}${RUTA}#${p.slug}`,
        })),
      },
    ],
  };

  return (
    <div className="bs-pagina">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {ordenPagina.map((p) => (
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
        <p className="bs-kicker">Nº 01 · Bases elevables</p>
        <h1 className="bs-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>
          Bases elevables: cuál comprar en 2026
        </h1>
        <p className="bs-standfirst" style={{ maxWidth: "52ch", marginTop: 18 }}>
          Una base elevable es la estructura con motor, sin tablero: el tablero
          lo pones tú. Cada base se mide contra lo que se puede esperar por su
          precio; estas son las primeras de cada franja.
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
          {primeros.map((p) => (
            <div key={p.slug} className="bs-camino">
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
                <a href={`#${p.slug}`}>{nombre(p)}</a>
              </h2>
              <PosicionNota producto={p} catalogo={catalogo} tamano="44px" />
              {franjaPrecio(p) && <p className="bs-afiliado bs-afiliado-mini">{franjaPrecio(p)}</p>}
              <Cta asin={asinDe.get(p.slug)!} ancho mini />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-end" style={{ gap: "16px 40px", marginTop: 28 }}>
          <div style={{ flex: "1 1 320px", maxWidth: "62ch" }}>
            <Afiliado />
          </div>
          <Firma total={catalogo.length} />
        </div>
      </section>

      {/* ============================================================
          Nº 02 · Según tu caso
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 02 · Según tu caso</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Qué base elegir si…
          </h2>
          <div style={{ marginTop: 32 }}>
            {losCasos.map((c) => {
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
                      {ruta ? <Link href={ruta}>{nombre(c.producto)}</Link> : nombre(c.producto)}
                      <span style={{ fontWeight: 400, color: "var(--bs-neutro-700)" }}>
                        {" "}· nota {nota(c.producto.puntuacion.total)}
                      </span>
                    </h3>
                    <p style={{ fontSize: 15, marginTop: 4, color: "var(--bs-neutro-800)" }}>{c.motivo}</p>
                  </div>
                  <Cta asin={asinDe.get(c.producto.slug)!} mini />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          Nº 03 · Base a base
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 03 · Base a base</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Las {marcos.length} bases, franja a franja
          </h2>

          {[
            ...grupos.map((g) => ({ titulo: NOMBRE_FRANJA[g.f], modelos: g.modelos })),
            ...(sinFranja.length ? [{ titulo: "Sin franja de precio verificada", modelos: sinFranja }] : []),
          ].map((grupo) => (
            <div key={grupo.titulo} style={{ marginTop: 48 }}>
              <h3 className="bs-h3" style={{ paddingBottom: 10, borderBottom: "var(--bs-filete-fino)" }}>
                {grupo.titulo}
              </h3>
              <div className="flex flex-col" style={{ gap: 24, marginTop: 24 }}>
                {grupo.modelos.map((p) => {
                  const pros = p.pros.filter(publicable).slice(0, 3);
                  const contras = p.contras.filter(publicable).slice(0, 2);
                  const excl = exclusion(p);
                  const ruta = rutaFicha(p);
                  return (
                    <article key={p.slug} id={p.slug} className="bs-tarjeta" style={{ scrollMarginTop: 80 }}>
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
                          <h4 className="bs-h3">{nombre(p)}</h4>
                          <div style={{ marginTop: 10 }}>
                            <PosicionNota producto={p} catalogo={catalogo} tamano="40px" />
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
                              <Cta asin={asinDe.get(p.slug)!} ancho />
                            </div>
                            {ruta && (
                              <Link href={ruta} style={{ fontSize: 15 }}>
                                Ficha completa de la {nombre(p)}
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


    </div>
  );
}
