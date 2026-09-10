import type { ProductScore } from "@/lib/types";

const RATING_LABELS: Record<string, string> = {
  calidad_construccion: "Construcción",
  estabilidad: "Estabilidad",
  facilidad_montaje: "Montaje",
  relacion_calidad_precio: "Calidad/precio",
  funcionalidades: "Funciones",
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
              {value as number}
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
          {puntuacion.total}
        </span>
      </div>
    </div>
  );
}
