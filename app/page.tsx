import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { coma } from "@/lib/format";
import {
  carga,
  caminos,
  dudas,
  etiquetasSpec,
  fichaTecnica,
  metaFila,
  motorCorto,
  exclusion,
  publicable,
  recorrido,
  garantia,
  tablero,
  standfirst,
  tituloModelo,
} from "@/lib/ficha";
import { Cifra } from "@/components/broadsheet/Cifra";
import { Cta } from "@/components/broadsheet/Cta";
import { Afiliado } from "@/components/broadsheet/Afiliado";
import { Firma } from "@/components/broadsheet/Firma";
import { Comparativa, type FilaComparativa } from "@/components/broadsheet/Comparativa";
import { CRITERIOS } from "@/lib/metodologia";
import { CtaFijo } from "@/components/broadsheet/CtaFijo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const catalogo = getAllProducts()
    .filter(([, p]) => p.disponible)
    .sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total);

  const [asinTop, top] = catalogo[0];
  const tresCaminos = caminos(catalogo);
  const podio = catalogo.slice(1, 3);
  const prosTop = top.pros.filter(publicable).slice(0, 3);
  const exclusionTop = exclusion(top);

  const tresDudas = dudas(catalogo);

  const filas: FilaComparativa[] = catalogo.map(([asin, p]) => ({
    asin,
    nombre: `${p.marca} ${p.modelo}`,
    imagen: p.imagen,
    alt: p.imagen_alt,
    nota: coma(p.puntuacion.total),
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
  }));

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

            {exclusionTop && (
              <p className="bs-exclusion bs-cuerpo" style={{ marginTop: 20 }}>
                {exclusionTop.arranque && <strong>{exclusionTop.arranque}</strong>}{" "}
                {exclusionTop.motivo}
              </p>
            )}

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

      {/* ============================================================
          Nº 03 · El podio
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 03 · El podio</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            La recomendación, en detalle
          </h2>

          <div className="bs-tarjeta" style={{ marginTop: 32 }}>
            <div className="flex items-center gap-4" style={{ marginBottom: 22 }}>
              <Cifra valor="01" tamano="40px" fondo="var(--bs-superficie)" />
              <span className="bs-sello">Recomendado</span>
            </div>

            <div className="flex flex-wrap" style={{ gap: "clamp(20px, 3vw, 36px)" }}>
              <div style={{ flex: "0 1 250px" }}>
                <div className="bs-marco" style={{ padding: 14 }}>
                  <div style={{ height: 190 }}>
                    <Image
                      src={top.imagen}
                      alt={top.imagen_alt}
                      width={250}
                      height={190}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                </div>
                <div className="flex items-end gap-3" style={{ marginTop: 18 }}>
                  <Cifra valor={top.puntuacion.total} tamano="54px" fondo="var(--bs-superficie)" />
                  <span style={{ fontSize: 14, paddingBottom: 5, color: "var(--bs-neutro-700)" }}>
                    sobre 10
                    <br />
                    {coma(top.rating)}★ en Amazon
                  </span>
                </div>
              </div>

              <div style={{ flex: "1 1 340px" }}>
                <p
                  style={{
                    fontSize: 12,
                    letterSpacing: "var(--bs-track-riel)",
                    textTransform: "uppercase",
                    color: "var(--bs-neutro-700)",
                  }}
                >
                  {top.marca}
                </p>
                <h3 className="bs-h3" style={{ marginTop: 6 }}>
                  {tituloModelo(top)}
                </h3>

                {/* El campo `veredicto` de este modelo lleva un precio dentro,
                    asi que no se publica. En su lugar va el resumen compuesto
                    con specs, que dice lo mismo sin cifras que caducan. */}
                <p
                  style={{
                    fontSize: "clamp(16px, 1.6vw, 18px)",
                    lineHeight: 1.55,
                    marginTop: 14,
                  }}
                >
                  {publicable(top.veredicto) ? top.veredicto : standfirst(top, true)}
                </p>

                <div className="flex flex-wrap" style={{ gap: 7, marginTop: 18 }}>
                  {etiquetasSpec(top).map((e) => (
                    <span key={e} className="bs-spec">
                      {e}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col" style={{ gap: 8, marginTop: 20 }}>
                  {prosTop.map((pro) => (
                    <p key={pro} className="bs-pro">
                      <span aria-hidden="true">✓</span>
                      <span>{pro}</span>
                    </p>
                  ))}
                </div>

                {exclusionTop && (
                  <p className="bs-exclusion" style={{ marginTop: 18, fontSize: 15 }}>
                    {exclusionTop.arranque && <strong>{exclusionTop.arranque}</strong>}{" "}
                    {exclusionTop.motivo}
                  </p>
                )}

                <div style={{ marginTop: 24 }}>
                  <Cta asin={asinTop} ancho />
                </div>
                <div style={{ marginTop: 10 }}>
                  <Afiliado />
                </div>
              </div>
            </div>
          </div>

          <p className="bs-kicker" style={{ marginTop: 44, marginBottom: 6 }}>
            Y si no, estos dos
          </p>
          {podio.map(([asin, p], i) => (
            <div key={asin} className="bs-fila">
              <Cifra valor={String(i + 2).padStart(2, "0")} tamano="26px" />
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
              <div style={{ flex: "1 1 220px" }}>
                <p style={{ fontSize: 16, fontWeight: 600 }}>
                  {p.marca} {p.modelo}
                </p>
                <p style={{ fontSize: 13, color: "var(--bs-neutro-700)" }}>{metaFila(p)}</p>
                {p.define && (
                  <p style={{ fontSize: 14, marginTop: 4 }}>{p.define}</p>
                )}
              </div>
              <span style={{ fontSize: 22, fontWeight: 700 }}>{coma(p.puntuacion.total)}</span>
              <Cta asin={asin} mini />
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          Nº 04 · Comparativa
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 04 · Comparativa</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Los {catalogo.length} modelos analizados
          </h2>

          <Comparativa filas={filas} />

          <p className="bs-afiliado" style={{ marginTop: 20, maxWidth: "66ch" }}>
            Nota sobre 10 según nuestra <a href="#metodologia">metodología</a>. Todos
            los enlaces son de afiliado: si compras, Amazon nos paga una comisión y
            tú pagas lo mismo.
          </p>
        </div>
      </section>

      {/* ============================================================
          Nº 05 · Antes de comprar
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 05 · Antes de comprar</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Las tres dudas de siempre
          </h2>

          <div
            className="flex flex-col"
            style={{ gap: "var(--bs-hueco-bloques)", marginTop: 36 }}
          >
            {tresDudas.map((duda) => (
              <div
                key={duda.pregunta}
                className="flex flex-wrap"
                style={{ gap: "clamp(12px, 3vw, 40px)" }}
              >
                <h3 className="bs-h3" style={{ flex: "1 1 260px" }}>
                  {duda.pregunta}
                </h3>
                <div style={{ flex: "1 1 380px" }}>
                  {duda.parrafos.map((parrafo, i) => (
                    <p
                      key={i}
                      className="bs-cuerpo"
                      style={{
                        marginTop: i === 0 ? 0 : 14,
                        color: i === 0 ? "var(--bs-tinta)" : "var(--bs-neutro-800)",
                      }}
                    >
                      {parrafo}
                    </p>
                  ))}
                  {duda.enlace && (
                    <p className="bs-cuerpo" style={{ marginTop: 14, color: "var(--bs-neutro-800)" }}>
                      {duda.enlace.previo}{" "}
                      <Link href={duda.enlace.href}>{duda.enlace.texto}</Link>{" "}
                      {duda.enlace.posterior}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Nº 06 · Metodología
          ============================================================ */}
      <section className="bs-contenido bs-seccion" id="metodologia">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 06 · Metodología</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Cómo analizamos los escritorios
          </h2>

          <p
            className="bs-standfirst"
            style={{ marginTop: 18, fontWeight: 600, color: "var(--bs-tinta)" }}
          >
            No probamos los escritorios físicamente. Conviene decirlo antes que nada.
          </p>
          <p className="bs-cuerpo" style={{ maxWidth: "62ch", marginTop: 14, color: "var(--bs-neutro-800)" }}>
            Elevable es un trabajo de análisis de datos, no un laboratorio.
            Reunimos las especificaciones de {catalogo.length} escritorios, las
            contrastamos con lo que declara cada fabricante en Amazon y las
            ordenamos con un criterio explícito. Nos parece más útil eso que una
            reseña que finge haber usado quince escritorios distintos.
          </p>

          <div className="flex flex-wrap" style={{ gap: "var(--bs-hueco-columnas)", marginTop: 40 }}>
            <div style={{ flex: "1 1 320px" }}>
              <h3 className="bs-h3">Cómo puntuamos</h3>
              <p className="bs-cuerpo" style={{ marginTop: 12, color: "var(--bs-neutro-800)" }}>
                Cada modelo recibe una nota sobre 10 en cinco apartados.
              </p>
              <div className="flex flex-col" style={{ gap: 16, marginTop: 20 }}>
                {CRITERIOS.map((c) => (
                  <div
                    key={c.nombre}
                    style={{ paddingLeft: 14, borderLeft: "2px solid var(--bs-verde-botella)" }}
                  >
                    <p style={{ fontSize: 16, fontWeight: 600 }}>{c.nombre}</p>
                    <p style={{ fontSize: 15, color: "var(--bs-neutro-800)", marginTop: 2 }}>
                      {c.base}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: "1 1 320px" }}>
              <h3 className="bs-h3">De dónde salen los datos</h3>
              <ul className="flex flex-col" style={{ gap: 12, marginTop: 14, fontSize: 15 }}>
                <li>
                  <strong>Especificaciones:</strong> ficha del fabricante en Amazon
                  España. Altura, carga, motor, velocidad, ruido, memorias y garantía.
                </li>
                <li>
                  <strong>Valoraciones:</strong> nota media de Amazon España,
                  redondeada a la baja porque solo puede subir.
                </li>
                <li>
                  <strong>Precios:</strong> no los publicamos. Amazon los cambia a
                  diario y una cifra escrita hoy engaña en una semana; el importe
                  exacto lo ves en Amazon, que es el único sitio donde siempre es
                  correcto.
                </li>
              </ul>

              <h3 className="bs-h3" style={{ marginTop: 30 }}>
                Cómo se financia esto
              </h3>
              <p style={{ fontSize: 15, marginTop: 12, color: "var(--bs-neutro-800)" }}>
                Con comisiones de afiliado de Amazon. Si compras a través de un
                enlace de la web, Amazon nos paga un porcentaje y tú pagas lo mismo.
                No cobramos de ninguna marca ni aceptamos productos a cambio de
                reseñas, entre otras cosas porque no hacemos reseñas de uso. El
                orden de los modelos sale de la puntuación, no de la comisión.
              </p>

              <div style={{ marginTop: 26 }}>
                <Firma total={catalogo.length} />
              </div>
            </div>
          </div>

          {/* La matriz de notas por apartado queda fuera de alcance por
              decision del proyecto (design-ref/README.md). */}
        </div>
      </section>

      <CtaFijo asin={asinTop} nombre={`${top.marca} ${top.modelo}`} />
    </div>
  );
}
