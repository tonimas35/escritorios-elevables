import type { ProductScore } from "@/lib/types";
import { nota } from "@/lib/format";

// Los apartados de `calcularNota()` (lib/nota.ts), en el orden de su peso.
const RATING_LABELS: Record<string, string> = {
  estabilidad: "Estabilidad",
  funciones: "Funciones",
  recorrido: "Recorrido",
  garantia: "Garantía",
  valoracion: "Compradores",
};

/**
 * Sin semaforo de color: el sistema no tiene ambar ni rojo, y pintar de
 * rojo un 6,9 sobre 10 exagera la diferencia. La cifra va en tinta y el
 * total, destacado por tamaño.
 */
function ratingColor(): string {
  return "var(--bs-tinta)";
}

interface CompactRatingsProps {
  puntuacion: ProductScore;
}

export function CompactRatings({ puntuacion }: CompactRatingsProps) {
  const entries = Object.entries(puntuacion).filter(([key]) => key !== "total");

  return (
    <div className="space-y-3">
      {/* Compact grid: 2 columns */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
              {RATING_LABELS[key] || key}
            </span>
            <span
              className="tabular-nums text-sm font-bold flex-shrink-0"
              style={{ color: ratingColor() }}
            >
              {/* Sin volumen de valoraciones el apartado no cuenta (METODO.md §5). */}
              {value === null ? "—" : nota(value as number)}
            </span>
          </div>
        ))}
      </div>
      {/* Total */}
      <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
          Total
        </span>
        <span
          className="tabular-nums text-lg font-bold"
          style={{ color: ratingColor() }}
        >
          {nota(puntuacion.total)}
        </span>
      </div>
    </div>
  );
}
