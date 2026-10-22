import Image from "next/image";
import Link from "next/link";
import { nota } from "@/lib/format";
import { carga, franjaPrecio, garantiaFrase, motorCorto } from "@/lib/ficha";
import { NOMBRE_FRANJA, posicionEnFranja } from "@/lib/nota";
import { rutaFicha } from "@/lib/rutas";
import type { Product } from "@/lib/types";
import { Cta } from "./Cta";

/**
 * El modelo de una marca que hoy tiene mejor posición en su franja.
 *
 * Es para las comparativas «marca vs marca» que siguen comparando un modelo
 * que ya salió del catálogo: la comparación se queda tal cual (es la que
 * posiciona en Google) y este bloque dice qué modelo de esa marca
 * recomendamos hoy. Sale del catálogo, no de una lista escrita a mano: si
 * entra o sale un modelo, el bloque cambia solo.
 *
 * Gana el de mejor posición dentro de su franja; a igual posición, el de
 * nota más alta. Si la marca no tiene ningún modelo disponible del tipo
 * pedido, no se pinta nada.
 */
export function mejorDeMarca(
  catalogo: [string, Product][],
  marca: string,
  conTablero: boolean,
): [string, Product] | null {
  const productos = catalogo.map(([, p]) => p);
  const candidatos = catalogo
    .filter(([, p]) => p.disponible && p.marca === marca && p.incluye_tablero === conTablero)
    .map(([asin, p]) => ({ asin, p, pos: posicionEnFranja(p, productos) }))
    .filter((x) => x.pos !== null)
    .sort((a, b) => a.pos!.posicion - b.pos!.posicion || b.p.puntuacion.total - a.p.puntuacion.total);
  return candidatos.length ? [candidatos[0].asin, candidatos[0].p] : null;
}

export function MejorDeMarcaHoy({
  catalogo,
  marca,
  conTablero,
  titulo,
  contexto,
}: {
  catalogo: [string, Product][];
  marca: string;
  conTablero: boolean;
  /** El titular del bloque, p. ej. «El FLEXISPOT completo que recomendamos hoy». */
  titulo: string;
  /** Una frase de por qué aparece este bloque en la página. */
  contexto: string;
}) {
  const elegido = mejorDeMarca(catalogo, marca, conTablero);
  if (!elegido) return null;
  const [asin, p] = elegido;
  const pos = posicionEnFranja(p, catalogo.map(([, q]) => q));
  const ruta = rutaFicha(p);
  const nombre = `${p.marca} ${p.modelo}`;
  const tablero =
    p.incluye_tablero && p.specs.ancho_tablero_cm && p.specs.profundidad_tablero_cm
      ? `Tablero de ${p.specs.ancho_tablero_cm}x${p.specs.profundidad_tablero_cm}`
      : null;
  const datos = [tablero, motorCorto(p), carga(p), garantiaFrase(p)].filter(Boolean);

  return (
    <aside
      className="bs-tarjeta"
      aria-label={titulo}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
        gap: "20px 32px",
        alignItems: "center",
        padding: "clamp(18px, 3vw, 28px)",
        marginTop: 36,
      }}
    >
      <div className="bs-marco" style={{ padding: 10, height: 170 }}>
        <Image
          src={p.imagen}
          alt={p.imagen_alt}
          width={320}
          height={150}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div className="flex flex-col" style={{ gap: 12 }}>
        <p>
          <span className="bs-sello" style={{ display: "inline-block", transform: "none" }}>
            {titulo}
          </span>
        </p>
        <h2 className="bs-h3">{ruta ? <Link href={ruta}>{nombre}</Link> : nombre}</h2>
        {pos && (
          <p style={{ fontSize: 15, fontWeight: 600 }}>
            Nº {pos.posicion} de {pos.de} en {NOMBRE_FRANJA[pos.franja].toLowerCase()} · nota {nota(p.puntuacion.total)}
          </p>
        )}
        <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--bs-neutro-800)" }}>
          {contexto} {datos.join(" · ")}.
        </p>
        {franjaPrecio(p) && <p className="bs-afiliado bs-afiliado-mini">{franjaPrecio(p)}</p>}
        <div>
          <Cta asin={asin} mini />
        </div>
      </div>
    </aside>
  );
}
