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



    </div>
  );
}
