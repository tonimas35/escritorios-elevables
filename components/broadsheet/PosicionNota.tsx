import { coma, nota } from "@/lib/format";
import { MARGEN_EMPATE, NOMBRE_FRANJA, posicionEnFranja } from "@/lib/nota";
import type { Product } from "@/lib/types";
import { Cifra } from "./Cifra";

/** "A", "A y B", "A, B y C". */
function enumerar(nombres: string[]): string {
  return nombres.length < 2 ? nombres.join("") : `${nombres.slice(0, -1).join(", ")} y ${nombres.at(-1)}`;
}

/**
 * La cifra grande es la posicion en su franja y la nota va al lado, en
 * pequeño (METODO.md §5, "Como se publica la nota"). Si otro modelo de la
 * franja queda a menos de MARGEN_EMPATE, se dice que es un empate tecnico.
 */
export function PosicionNota({
  producto,
  catalogo,
  tamano = "clamp(58px, 7vw, 82px)",
}: {
  producto: Product;
  catalogo: Product[];
  tamano?: string;
}) {
  const enFranja = posicionEnFranja(producto, catalogo);
  const empate = enFranja?.empateCon.map((q) => `${q.marca} ${q.modelo}`) ?? [];

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
