import type { Metadata } from "next";
import Image from "next/image";
import { getAllProducts } from "@/lib/products";
import { coma } from "@/lib/format";
import { fichaTecnica, standfirst } from "@/lib/ficha";
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
    </div>
  );
}
