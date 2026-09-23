/**
 * Nota y franja de cada modelo, calculadas con la regla publicada en
 * METODO.md §2 y §5. Sustituyen a la nota puesta a mano.
 *
 * Umbrales absolutos: la nota de un modelo no cambia porque entre o salga
 * otro del catalogo. Cambiar un peso o un umbral es cambiar el metodo: se
 * cambia primero en METODO.md, con fecha, y despues aqui.
 *
 * Sin alias de rutas: lo importan tambien el validador y los tests, que se
 * ejecutan con Node fuera de Next.
 */
import type { Product, ProductScore } from "./types";

export type Franja = "A" | "B" | "C" | "M";

export const NOMBRE_FRANJA: Record<Franja, string> = {
  A: "Completos hasta 120 €",
  B: "Completos de 120 a 250 €",
  C: "Completos de 250 a 500 €",
  M: "Marcos sin tablero",
};

/** Pesos de METODO.md §5. Suman 1. */
export const PESOS = {
  estabilidad: 0.35,
  funciones: 0.25,
  recorrido: 0.15,
  garantia: 0.1,
  valoracion: 0.15,
} as const;

/** Por debajo de estas valoraciones la nota de Amazon no cuenta (§3 y §5). */
export const MIN_VALORACIONES = 100;

/** Recta entre dos umbrales, recortada a 0-10. `de` puede ser mayor que `a`. */
function escala(valor: number, de: number, a: number): number {
  const x = ((valor - de) / (a - de)) * 10;
  return Math.max(0, Math.min(10, x));
}

const media = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
const decimal = (x: number) => Math.round(x * 10) / 10;

export function calcularNota(p: Product): ProductScore {
  const s = p.specs;

  const estabilidad =
    0.5 * escala(s.peso_max_carga_kg, 40, 150) +
    0.3 * (s.tipo_motor === "doble" ? 10 : 5) +
    0.2 * escala(s.peso_estructura_kg, 15, 40);

  // El ruido falta en algunas fichas: si no hay dato, no cuenta, en vez
  // de inventar un valor que baje o suba la media.
  const funciones = media([
    escala(s.presets_memoria, 0, 4),
    s.sistema_anticolision ? 10 : 0,
    escala(s.velocidad_cm_s, 2, 4),
    ...(s.ruido_db !== null ? [escala(s.ruido_db, 55, 42)] : []),
  ]);

  const recorrido = media([
    escala(s.rango_altura_min_cm, 75, 60),
    escala(s.rango_altura_max_cm, 115, 130),
  ]);

  const garantia = escala(s.garantia_anos, 1, 5);

  const valoracion =
    p.num_reviews >= MIN_VALORACIONES ? escala(p.rating, 4.0, 4.8) : null;

  // Sin volumen de valoraciones, ese apartado sale y los demas se reescalan.
  const partes: [number, number][] = [
    [estabilidad, PESOS.estabilidad],
    [funciones, PESOS.funciones],
    [recorrido, PESOS.recorrido],
    [garantia, PESOS.garantia],
    ...(valoracion !== null ? [[valoracion, PESOS.valoracion] as [number, number]] : []),
  ];
  const peso = partes.reduce((t, [, w]) => t + w, 0);
  const total = partes.reduce((t, [v, w]) => t + v * w, 0) / peso;

  return {
    estabilidad: decimal(estabilidad),
    funciones: decimal(funciones),
    recorrido: decimal(recorrido),
    garantia: decimal(garantia),
    valoracion: valoracion === null ? null : decimal(valoracion),
    total: decimal(total),
  };
}

/**
 * Franja del modelo (METODO.md §2). Se asigna por el punto medio de la
 * franja de precio verificada. Sin franja verificada, o por encima de
 * 500 €, no tiene franja: `null`.
 */
export function franja(p: Pick<Product, "incluye_tablero" | "precio_min" | "precio_max">): Franja | null {
  if (!p.incluye_tablero) return "M";
  if (p.precio_min == null || p.precio_max == null) return null;
  const medio = (p.precio_min + p.precio_max) / 2;
  if (medio <= 120) return "A";
  if (medio <= 250) return "B";
  if (medio <= 500) return "C";
  return null;
}

/**
 * Posicion del modelo dentro de su franja entre los disponibles, por nota.
 * Empate: gana la valoracion de Amazon; si sigue, el orden alfabetico del
 * slug, para que el resultado no dependa del orden del JSON.
 */
export function posicionEnFranja(
  p: Product,
  catalogo: Product[],
): { franja: Franja; posicion: number; de: number } | null {
  const f = franja(p);
  if (!f) return null;
  const grupo = catalogo
    .filter((q) => q.disponible && franja(q) === f)
    .sort(
      (a, b) =>
        b.puntuacion.total - a.puntuacion.total ||
        b.rating - a.rating ||
        a.slug.localeCompare(b.slug),
    );
  const i = grupo.findIndex((q) => q.slug === p.slug);
  return i === -1 ? null : { franja: f, posicion: i + 1, de: grupo.length };
}
