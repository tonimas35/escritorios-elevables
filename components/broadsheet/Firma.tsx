import { firmaMetodologia } from "@/lib/metodologia";

/**
 * Firma del autor: monograma tipografico, sin foto. La frase de
 * metodologia acompaña a la firma en todos los sitios donde aparece.
 */
export function Firma({ total }: { total: number }) {
  return (
    <div className="flex items-start gap-3">
      <span className="bs-avatar" aria-hidden="true">
        T
      </span>
      <p style={{ fontSize: 15, lineHeight: 1.45 }}>
        Por <strong>Toni</strong>
        <br />
        <span style={{ color: "var(--bs-neutro-700)" }}>{firmaMetodologia(total)}</span>
      </p>
    </div>
  );
}
