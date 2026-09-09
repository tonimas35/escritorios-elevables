import type { Metadata } from "next";
import Image from "next/image";
import { getAllProducts } from "@/lib/products";
import { coma } from "@/lib/format";
import { caminos, fichaTecnica, standfirst } from "@/lib/ficha";
import { Cifra } from "@/components/broadsheet/Cifra";
import { Cta } from "@/components/broadsheet/Cta";
import { Afiliado } from "@/components/broadsheet/Afiliado";
import { Firma } from "@/components/broadsheet/Firma";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const catalogo = getAllProducts()
    .filter(([, p]) => p.disponible)
    .sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total);

  const [asinTop, top] = catalogo[0];
  const tresCaminos = caminos(catalogo);

  return (
    <div className="bs-pagina">
      {/* ============================================================
          Nº 01 · Veredicto
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="flex flex-wrap" style={{ gap: "var(--bs-hueco-hero)" }}>
          <div style={{ flex: "1 1 400px" }}>
            <p className="bs-kicker">Nº 01 · Veredicto</p>

            <h1 className="bs-h1" style={{ marginTop: 14 }}>
              El mejor escritorio elevable de 2026 es el {top.marca}
              &nbsp;{top.modelo}
            </h1>

            <p
              className="bs-standfirst"
              style={{ maxWidth: "34ch", marginTop: 18 }}
            >
              {standfirst(top, true)}
            </p>

            {/* La linea "No es tu mesa si" necesita un campo que hoy no
                existe en data/productos.json. Se deja sin renderizar en
                lugar de inventarla. */}

            <div style={{ marginTop: 28 }}>
              <Cta asin={asinTop} />
            </div>
            <div style={{ marginTop: 12 }}>
              <Afiliado />
            </div>

            <div style={{ marginTop: 28 }}>
              <Firma total={catalogo.length} />
            </div>
          </div>

          <div style={{ flex: "0 1 340px" }}>
            <div className="bs-marco" style={{ padding: 16 }}>
              <div style={{ height: "clamp(180px, 22vw, 250px)" }}>
                <Image
                  src={top.imagen}
                  alt={top.imagen_alt}
                  width={340}
                  height={250}
                  priority
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            </div>

            <div className="flex items-end gap-3" style={{ marginTop: 22 }}>
              <Cifra valor={top.puntuacion.total} tamano="clamp(58px, 7vw, 82px)" />
              <span
                style={{
                  fontSize: 14,
                  lineHeight: 1.35,
                  paddingBottom: 7,
                  color: "var(--bs-neutro-700)",
                }}
              >
                sobre 10
                <br />
                Nº 1 de {catalogo.length} · {coma(top.rating)}★
              </span>
            </div>

            <div style={{ marginTop: 26, borderTop: "var(--bs-filete-seccion)", paddingTop: 14 }}>
              <p className="bs-etiqueta" style={{ marginBottom: 12 }}>
                Ficha técnica
              </p>
              <dl className="bs-ficha">
                {fichaTecnica(top).map(([etiqueta, valor]) => (
                  <div key={etiqueta} style={{ display: "contents" }}>
                    <dt>{etiqueta}</dt>
                    <dd>{valor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          Nº 02 · Tres caminos
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 02 · Tres caminos</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Según lo que necesites
          </h2>
          <p className="bs-cuerpo" style={{ maxWidth: "58ch", marginTop: 16, color: "var(--bs-neutro-800)" }}>
            No segmentamos por presupuesto porque el presupuesto cambia y el uso
            no. Estas son las tres decisiones reales.
          </p>

          <div className="bs-caminos" style={{ marginTop: 40 }}>
            {tresCaminos.map((camino) => (
              <div key={camino.asin} className="bs-camino">
                <div>
                  <p className="bs-etiqueta">{camino.etiqueta}</p>
                  <p style={{ fontSize: 14, color: "var(--bs-neutro-700)", marginTop: 4 }}>
                    {camino.subtitulo}
                  </p>
                </div>

                <div className="bs-marco" style={{ padding: 10 }}>
                  <div style={{ height: 130 }}>
                    <Image
                      src={camino.producto.imagen}
                      alt={camino.producto.imagen_alt}
                      width={280}
                      height={130}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                </div>

                <h3 className="bs-h3">
                  {camino.producto.marca} {camino.producto.modelo}
                </h3>

                <p style={{ fontSize: 15, color: "var(--bs-neutro-700)" }}>
                  Nota <strong style={{ color: "var(--bs-tinta)" }}>{coma(camino.producto.puntuacion.total)}</strong>
                  {" · "}
                  {coma(camino.producto.rating)}★ en Amazon
                  {camino.asin === asinTop && (
                    <span style={{ color: "var(--bs-tinta)" }}> · el del veredicto</span>
                  )}
                </p>

                <p style={{ fontSize: 16, lineHeight: 1.55 }}>{camino.texto}</p>

                <Cta asin={camino.asin} ancho mini />
                <Afiliado corta />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
