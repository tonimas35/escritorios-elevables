import { coma, nota } from "@/lib/format";
import { MARGEN_EMPATE, NOMBRE_FRANJA, posicionEnFranja } from "@/lib/nota";
import type { Product } from "@/lib/types";
import { Cifra } from "./Cifra";

/** "A", "A y B", "A, B y C". */
function enumerar(nombres: string[]): string {
  return nombres.length < 2 ? nombres.join("") : `${nombres.slice(0, -1).join(", ")} y ${nombres.at(-1)}`;
}

/**
 * La franja del modelo como rotulo, para ponerlo encima del nombre en los
 * bloques que reunen al primero de cada franja. Ahi la franja es lo que
 * distingue una tarjeta de otra; la posicion es siempre la misma.
 */
export function RotuloFranja({ producto, catalogo }: { producto: Product; catalogo: Product[] }) {
  const enFranja = posicionEnFranja(producto, catalogo);
  if (!enFranja) return null;
  return <p className="bs-etiqueta">{NOMBRE_FRANJA[enFranja.franja]}</p>;
}

/**
 * La cifra grande es la posicion en su franja y la nota va al lado, en
 * pequeño (METODO.md §5, "Como se publica la nota"). Si otro modelo de la
 * franja queda a menos de MARGEN_EMPATE, se dice que es un empate tecnico.
 *
 * `sinCifra`: en los bloques con el primero de cada franja todas las cifras
 * serian "01" y no se entiende. Ahi la posicion va en texto y la franja,
 * en el rotulo de encima (RotuloFranja).
 */
export function PosicionNota({
  producto,
  catalogo,
  tamano = "clamp(58px, 7vw, 82px)",
  sinCifra = false,
}: {
  producto: Product;
  catalogo: Product[];
  tamano?: string;
  sinCifra?: boolean;
}) {
  const enFranja = posicionEnFranja(producto, catalogo);
  const empate = enFranja?.empateCon.map((q) => `${q.marca} ${q.modelo}`) ?? [];

  if (sinCifra) {
    return (
      <div>
        <p style={{ fontSize: 14, lineHeight: 1.45, color: "var(--bs-neutro-700)" }}>
          {enFranja && (
            <>
              Nº {enFranja.posicion} de {enFranja.de} en su franja ·{" "}
            </>
          )}
          Nota <strong style={{ color: "var(--bs-tinta)" }}>{nota(producto.puntuacion.total)}</strong> sobre 10 ·{" "}
          {coma(producto.rating)}★ en Amazon
        </p>
        {empate.length > 0 && (
          <p style={{ fontSize: 13, lineHeight: 1.4, marginTop: 8, color: "var(--bs-neutro-700)" }}>
            Empate técnico con {enumerar(empate)}: menos de {coma(MARGEN_EMPATE)} puntos de diferencia.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end gap-3">
        {enFranja && <Cifra valor={String(enFranja.posicion).padStart(2, "0")} tamano={tamano} />}
        <span style={{ fontSize: 14, lineHeight: 1.35, paddingBottom: 7, color: "var(--bs-neutro-700)" }}>
          {enFranja && (
            <>
              de {enFranja.de} · {NOMBRE_FRANJA[enFranja.franja]}
              <br />
            </>
          )}
          Nota <strong style={{ color: "var(--bs-tinta)" }}>{nota(producto.puntuacion.total)}</strong> sobre 10 ·{" "}
          {coma(producto.rating)}★
        </span>
      </div>
      {empate.length > 0 && (
        <p style={{ fontSize: 13, lineHeight: 1.4, marginTop: 10, color: "var(--bs-neutro-700)" }}>
          Empate técnico con {enumerar(empate)}: menos de {coma(MARGEN_EMPATE)} puntos de diferencia.
        </p>
      )}
    </div>
  );
}
