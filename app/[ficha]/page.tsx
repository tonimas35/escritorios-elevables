import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/products";
import { fichaPorSegmento, fichasDePlantilla } from "@/lib/rutas";
import { coma, nota } from "@/lib/format";
import { franjaPrecio, standfirst } from "@/lib/ficha";
import { NOMBRE_FRANJA, posicionEnFranja } from "@/lib/nota";
import { productSchema } from "@/lib/schema";
import { Cifra } from "@/components/broadsheet/Cifra";
import { Cta } from "@/components/broadsheet/Cta";
import { Afiliado } from "@/components/broadsheet/Afiliado";
import { Firma } from "@/components/broadsheet/Firma";

/**
 * Plantilla de ficha de modelo (design-ref/code/README.md, pantalla 2).
 *
 * Sirve `/{slug}-opiniones` para cada modelo con `titular` aprobado que no
 * tenga review propia (lib/rutas.ts). Cualquier otra URL que caiga aqui es
 * un 404: las paginas estaticas del sitio tienen prioridad sobre esta ruta.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return fichasDePlantilla().map((f) => ({ ficha: f.segmento }));
}

type Props = { params: Promise<{ ficha: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = fichaPorSegmento((await params).ficha);
  if (!f) return {};
  const p = f.producto;
  return {
    title: `${p.marca} ${p.modelo} opiniones 2026: ficha y análisis`,
    description: standfirst(p, false),
    alternates: { canonical: `/${f.segmento}` },
  };
}

export default async function FichaModelo({ params }: Props) {
  const f = fichaPorSegmento((await params).ficha);
  if (!f) notFound();
  const { asin, producto: p, segmento } = f;

  const catalogo = getAllProducts().map(([, q]) => q);
  const disponibles = catalogo.filter((q) => q.disponible);
  const enFranja = posicionEnFranja(p, catalogo);
  const franja = franjaPrecio(p);
  const esElMejor = disponibles.every((q) => q.puntuacion.total <= p.puntuacion.total);

  const ruta = `/${segmento}`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
      { "@type": "ListItem", position: 2, name: "Mejores escritorios", item: "https://elevable.es/mejor-escritorio-elevable" },
      { "@type": "ListItem", position: 3, name: `${p.marca} ${p.modelo}`, item: `https://elevable.es${ruta}` },
    ],
  };

  return (
    <div className="bs-pagina">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productSchema(asin, p, ruta), breadcrumb]) }}
      />

      {/* ============================================================
          Veredicto
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="flex flex-wrap" style={{ gap: "var(--bs-hueco-hero)" }}>
          <div style={{ flex: "1 1 400px" }}>
            <p className="bs-kicker">
              {enFranja
                ? `Nº ${enFranja.posicion} de ${enFranja.de} · ${NOMBRE_FRANJA[enFranja.franja]}`
                : p.marca}
            </p>

            {/* Escala de H1 de ficha del diseño, algo menor que la de la home. */}
            <h1
              className="bs-h1"
              style={{
                marginTop: 14,
                fontSize: "var(--bs-h1-ficha)",
                lineHeight: "var(--bs-lh-h1-ficha)",
                fontWeight: 600,
              }}
            >
              {p.titular}
            </h1>

            <p className="bs-standfirst" style={{ maxWidth: "38ch", marginTop: 18 }}>
              {standfirst(p, esElMejor)}
            </p>

            {franja && (
              <p className="bs-afiliado" style={{ marginTop: 22 }}>
                {franja}
              </p>
            )}
            <div style={{ marginTop: franja ? 10 : 24 }}>
              <Afiliado />
            </div>
            <div style={{ marginTop: 10 }}>
              <Cta asin={asin} />
            </div>

            <div style={{ marginTop: 28 }}>
              <Firma total={disponibles.length} />
            </div>
          </div>

          <div style={{ flex: "0 1 340px" }}>
            <div className="bs-marco" style={{ padding: 16 }}>
              <div style={{ height: "clamp(180px, 22vw, 250px)" }}>
                <Image
                  src={p.imagen}
                  alt={p.imagen_alt}
                  width={340}
                  height={250}
                  priority
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            </div>

            {/* La cifra grande es la posicion en la franja; la nota, al lado
                y en pequeño (METODO.md §5). */}
            <div className="flex items-end gap-3" style={{ marginTop: 22 }}>
              {enFranja && (
                <Cifra
                  valor={String(enFranja.posicion).padStart(2, "0")}
                  tamano="clamp(58px, 7vw, 82px)"
                />
              )}
              <span style={{ fontSize: 14, lineHeight: 1.35, paddingBottom: 7, color: "var(--bs-neutro-700)" }}>
                {enFranja && (
                  <>
                    de {enFranja.de} · {NOMBRE_FRANJA[enFranja.franja]}
                    <br />
                  </>
                )}
                Nota <strong style={{ color: "var(--bs-tinta)" }}>{nota(p.puntuacion.total)}</strong> sobre 10 · {coma(p.rating)}★
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
