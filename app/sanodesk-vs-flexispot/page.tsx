import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAvailableProducts, getProductBySlug } from "@/lib/products";
import { rutaFicha } from "@/lib/rutas";
import { coma, nota } from "@/lib/format";
import { FECHA_EN_FRASE } from "@/lib/fecha";
import { NOMBRE_FRANJA, posicionEnFranja } from "@/lib/nota";
import {
  anticolision,
  carga,
  franjaCorta,
  franjaPrecio,
  garantia,
  motorCorto,
  motorLargo,
  notaFranjas,
  recorrido,
  SIN_DATO,
  tablero,
} from "@/lib/ficha";
import { productSchema } from "@/lib/schema";
import type { Product } from "@/lib/types";
import { Cta } from "@/components/broadsheet/Cta";
import { Afiliado } from "@/components/broadsheet/Afiliado";
import { Firma } from "@/components/broadsheet/Firma";
import { PosicionNota } from "@/components/broadsheet/PosicionNota";

/**
 * SANODESK vs FLEXISPOT (SEO-PLAN.md §0, P3). Las comparativas "marca vs
 * marca" son el único tipo de página que ya está en la primera página de
 * Google, y esta consulta tenía búsquedas y ninguna página que la respondiera.
 *
 * Solo compara lo que declaran las fichas. Las notas no se comparan entre
 * franjas (METODO.md §5): cada modelo dice su posición dentro de la suya.
 */

const SITE = "https://elevable.es";
const RUTA = "/sanodesk-vs-flexispot";

export const metadata: Metadata = {
  title: "SANODESK vs FLEXISPOT 2026: cuál comprar",
  description:
    "SANODESK o FLEXISPOT: el SANODESK 140x60 frente al marco FLEXISPOT EG1 y al FLEXISPOT 160x80. Motor, carga, altura, tablero, garantía y franja de precio, con los datos de cada ficha.",
  alternates: { canonical: RUTA },
};

const SLUGS = ["sanodesk-140", "flexispot-eg1", "flexispot-160x80"];

export default function SanodeskVsFlexispotPage() {
  const modelos = SLUGS.map((s) => getProductBySlug(s)).filter(
    (x): x is [string, Product] => !!x && x[1].disponible,
  );
  const catalogo = getAvailableProducts().map(([, p]) => p);
  const de = (slug: string) => modelos.find(([, p]) => p.slug === slug)?.[1];
  const sano = de("sanodesk-140");
  const eg1 = de("flexispot-eg1");
  const fx160 = de("flexispot-160x80");
  const fechaFranjas = notaFranjas(modelos.map(([, p]) => p));
  const nombre = (p: Product) => `${p.marca} ${p.modelo}`;

  // Para quién es cada uno: una frase por modelo, con sus datos.
  const paraQuien = (p: Product): string => {
    if (!p.incluye_tablero) {
      return `Si quieres poner tu propio tablero: marco con ${motorCorto(p).toLowerCase()}, ${carga(p)} y ${recorrido(p)}. El tablero se compra aparte.`;
    }
    return `Si quieres la mesa completa con tablero de ${p.specs.ancho_tablero_cm}x${p.specs.profundidad_tablero_cm}: ${motorCorto(p).toLowerCase()}, ${carga(p)} y ${recorrido(p)}.`;
  };

  const filas: [string, (p: Product) => string][] = [
    ["Franja de precio", (p) => franjaCorta(p) ?? SIN_DATO],
    ["Posición en su franja", (p) => {
      const pos = posicionEnFranja(p, catalogo);
      return pos ? `${pos.posicion} de ${pos.de} · nota ${nota(p.puntuacion.total)}` : `Nota ${nota(p.puntuacion.total)}`;
    }],
    ["Tablero", tablero],
    ["Motor", motorLargo],
    ["Carga", carga],
    ["Recorrido", recorrido],
    ["Memorias", (p) => (p.specs.presets_memoria !== null ? `${p.specs.presets_memoria}` : SIN_DATO)],
    ["Anticolisión", anticolision],
    ["Ruido", (p) => (p.specs.ruido_db !== null ? `${p.specs.ruido_db} dB` : SIN_DATO)],
    ["Garantía", garantia],
    ["Valoración en Amazon", (p) => `${coma(p.rating)}★`],
  ];

  const diferencias: { titulo: string; texto: string; enlace?: { texto: string; href: string } }[] = [];
  const franjaDe = (p: Product) => {
    const x = posicionEnFranja(p, catalogo);
    return x ? NOMBRE_FRANJA[x.franja].toLowerCase() : "una franja sin verificar";
  };
  const masRuidoso =
    fx160?.specs.ruido_db != null &&
    catalogo.every((p) => p.specs.ruido_db === null || p.specs.ruido_db <= fx160.specs.ruido_db!);
  if (sano && eg1 && fx160) {
    diferencias.push(
      {
        titulo: "Tablero: incluido o no",
        texto: `El ${nombre(sano)} trae tablero de ${sano.specs.ancho_tablero_cm}x${sano.specs.profundidad_tablero_cm} y el ${nombre(fx160)}, de ${fx160.specs.ancho_tablero_cm}x${fx160.specs.profundidad_tablero_cm}. El ${nombre(eg1)} es solo el marco: súmale el tablero antes de comparar precios, o la comparación no es justa.`,
      },
      {
        titulo: "Motor y carga",
        texto: `El ${nombre(fx160)} es el único con doble motor de los tres, pero declara ${fx160.specs.peso_max_carga_kg} kg, lo mismo que el ${nombre(eg1)} con uno. El ${nombre(sano)} declara ${sano.specs.peso_max_carga_kg} kg. Para un monitor y un portátil sobran los tres; para dos monitores con brazo, ninguno va holgado.`,
      },
      {
        titulo: "Altura",
        texto: `Los tres suben parecido: ${recorrido(sano)} el SANODESK, ${recorrido(eg1)} el EG1 y ${recorrido(fx160)} el 160x80. Si eres alto, ninguno destaca.`,
        enlace: { texto: "Calcula la altura que necesitas", href: "/calculadora-altura" },
      },
      {
        titulo: "Ruido",
        texto: `Solo el ${nombre(fx160)} declara el ruido: ${fx160.specs.ruido_db} dB${masRuidoso ? ", el más alto del catálogo" : ""}. Las fichas del SANODESK y del EG1 no dan el dato.`,
      },
      {
        titulo: "Precio",
        texto: `El ${nombre(eg1)} está en ${franjaDe(eg1)} y el ${nombre(sano)}, en ${franjaDe(sano)}: los dos en la parte asequible. El ${nombre(fx160)} está en ${franjaDe(fx160)}, otra liga de precio. Las franjas exactas y su fecha están en la tabla de arriba.`,
      },
    );
  }

  const faq: { q: string; a: string }[] = [];
  if (sano && eg1 && fx160) {
    const pos = (p: Product) => posicionEnFranja(p, catalogo);
    const enFranja = (p: Product) => {
      const x = pos(p);
      return x ? `nº ${x.posicion} de ${x.de} en ${NOMBRE_FRANJA[x.franja].toLowerCase()}` : "sin franja verificada";
    };
    faq.push(
      {
        q: "¿Qué es mejor, SANODESK o FLEXISPOT?",
        a: `Depende de qué necesites, porque no compiten en el mismo precio. El ${nombre(sano)} es una mesa completa asequible con anticolisión (${enFranja(sano)}). De FLEXISPOT, el ${nombre(eg1)} es el marco más asequible del catálogo (${enFranja(eg1)}) y el ${nombre(fx160)} es una mesa grande con doble motor (${enFranja(fx160)}).`,
      },
      {
        q: "¿Cuál es más barato?",
        a: `El ${nombre(eg1)}, pero no trae tablero. Con tablero incluido, el ${nombre(sano)} cuesta bastante menos que el ${nombre(fx160)}. Las franjas se comprueban en Amazon con fecha; el precio del día solo es fiable allí.`,
      },
      {
        q: "¿Cuál tiene más garantía?",
        a: `Los tres declaran al menos ${Math.min(sano.specs.garantia_anos ?? 0, eg1.specs.garantia_anos ?? 0, fx160.specs.garantia_anos ?? 0)} años. Los FLEXISPOT declaran cinco en la estructura y tres en el motor; el SANODESK, tres.`,
      },
      {
        q: "¿Cuál es más silencioso?",
        a: `No se puede saber con los datos: solo el ${nombre(fx160)} declara el ruido (${fx160.specs.ruido_db} dB). Preferimos decirlo antes que suponerlo.`,
      },
    );
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
          { "@type": "ListItem", position: 2, name: "SANODESK vs FLEXISPOT", item: `${SITE}${RUTA}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
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
      {modelos.map(([asin, p]) => (
        <script
          key={asin}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema(asin, p, RUTA)) }}
        />
      ))}

      {/* ============================================================
          Nº 01 · La respuesta corta
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <p className="bs-kicker">Nº 01 · Comparativa</p>
        <h1 className="bs-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>
          SANODESK o FLEXISPOT: cuál comprar
        </h1>
        <p className="bs-standfirst" style={{ maxWidth: "52ch", marginTop: 18 }}>
          No compiten en el mismo precio ni en el mismo tipo de mesa. Depende de
          si quieres el tablero incluido, cuánto vas a gastar y si necesitas
          doble motor.
        </p>
        <p style={{ fontSize: 14, marginTop: 14, color: "var(--bs-neutro-700)" }}>
          Actualizado en {FECHA_EN_FRASE}.{fechaFranjas && ` ${fechaFranjas}`}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "32px var(--bs-hueco-columnas)",
            marginTop: 36,
          }}
        >
          {modelos.map(([asin, p]) => {
            const ruta = rutaFicha(p);
            return (
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
                <h2 className="bs-h3">{ruta ? <Link href={ruta}>{nombre(p)}</Link> : nombre(p)}</h2>
                <PosicionNota producto={p} catalogo={catalogo} tamano="44px" />
                <p style={{ fontSize: 16, lineHeight: 1.55 }}>{paraQuien(p)}</p>
                {franjaPrecio(p) && <p className="bs-afiliado bs-afiliado-mini">{franjaPrecio(p)}</p>}
                <Cta asin={asin} ancho mini />
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-end" style={{ gap: "16px 40px", marginTop: 28 }}>
          <div style={{ flex: "1 1 320px", maxWidth: "62ch" }}>
            <Afiliado />
          </div>
          <Firma total={catalogo.length} />
        </div>
      </section>

      {/* ============================================================
          Nº 02 · Cara a cara
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 02 · Cara a cara</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Lo que declara cada ficha
          </h2>
          <div style={{ overflowX: "auto", marginTop: 28 }}>
            <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px 12px 10px 0" }} />
                  {modelos.map(([asin, p]) => (
                    <th key={asin} scope="col" style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>
                      {nombre(p)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map(([etiqueta, valor]) => (
                  <tr key={etiqueta} style={{ borderTop: "var(--bs-filete-fino)" }}>
                    <th scope="row" style={{ textAlign: "left", padding: "10px 12px 10px 0", fontWeight: 400, color: "var(--bs-neutro-700)" }}>
                      {etiqueta}
                    </th>
                    {modelos.map(([asin, p]) => (
                      <td key={asin} style={{ padding: "10px 12px" }}>
                        {valor(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="bs-afiliado" style={{ marginTop: 16, maxWidth: "66ch" }}>
            {fechaFranjas && `${fechaFranjas} `}«Sin dato» significa que la ficha del fabricante no lo declara; no lo
            estimamos. La nota se mide dentro de cada franja de precio, así que
            no se compara entre modelos de franjas distintas.
          </p>
        </div>
      </section>

      {/* ============================================================
          Nº 03 · Las diferencias
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 03 · Las diferencias</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Lo que de verdad los separa
          </h2>
          <div className="flex flex-col" style={{ gap: 28, marginTop: 32, maxWidth: "66ch" }}>
            {diferencias.map((d) => (
              <div key={d.titulo} style={{ paddingLeft: 14, borderLeft: "2px solid var(--bs-verde-botella)" }}>
                <h3 className="bs-h3">{d.titulo}</h3>
                <p className="bs-cuerpo" style={{ marginTop: 8, color: "var(--bs-neutro-800)" }}>
                  {d.texto}
                  {d.enlace && (
                    <>
                      {" "}
                      <Link href={d.enlace.href}>{d.enlace.texto}</Link>.
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
            SANODESK o FLEXISPOT, en corto
          </h2>
          <div className="flex flex-col" style={{ gap: "var(--bs-hueco-bloques)", marginTop: 36 }}>
            {faq.map((f) => (
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
              <Link href="/mejor-escritorio-elevable">Los mejores escritorios elevables de 2026</Link>: todo el catálogo, franja a franja.
            </li>
            <li>
              <Link href="/flexispot-vs-maidesite">Flexispot vs MAIDeSITe</Link>: la otra comparativa de marcas.
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
