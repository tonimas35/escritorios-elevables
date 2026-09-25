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



    </div>
  );
}
