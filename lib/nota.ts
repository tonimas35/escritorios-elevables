/**
 * Nota y franja de cada modelo, calculadas con la regla publicada en
 * METODO.md §2 y §5. Sustituyen a la nota puesta a mano.
 *
 * La nota mide cada escritorio contra lo que se puede esperar en su gama de
 * precio: en cada dato, 6 es lo minimo aceptable en la gama y 10 lo mejor
 * esperable. Los umbrales son fijos por gama: la nota de un modelo no cambia
 * porque entre o salga otro del catalogo. Cambiar un peso o un umbral es
 * cambiar el metodo: se cambia primero en METODO.md, con fecha, y despues
 * aqui.
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

export type Gama = "entrada" | "media" | "alta";

/** Pares [minimo aceptable, excelente] de METODO.md §5, por gama. */
type Umbral = [number, number];
interface Umbrales {
  carga: Umbral;
  motor: { simple: number; doble: number; manual: number };
  estructura: Umbral;
  velocidad: Umbral;
  ruido: Umbral;
  alturaMin: Umbral;
  alturaMax: Umbral;
  garantia: Umbral;
}

export const UMBRALES: Record<Gama, Umbrales> = {
  entrada: {
    carga: [50, 75],
    motor: { simple: 8, doble: 10, manual: 0 },
    estructura: [15, 23],
    velocidad: [2, 2.8],
    ruido: [55, 47],
    alturaMin: [74, 71],
    alturaMax: [115, 120],
    garantia: [2, 4],
  },
  media: {
    carga: [70, 95],
    motor: { simple: 8, doble: 10, manual: 0 },
    estructura: [20, 30],
    velocidad: [2, 2.8],
    ruido: [55, 47],
    alturaMin: [74, 69],
    alturaMax: [116, 123],
    garantia: [2, 4],
  },
  alta: {
    carga: [100, 150],
    motor: { simple: 3, doble: 10, manual: 0 },
    estructura: [28, 38],
    velocidad: [3, 3.8],
    ruido: [50, 44],
    alturaMin: [72, 64],
    alturaMax: [118, 128],
    garantia: [3, 5],
  },
};

/** Umbrales comunes a todas las gamas (METODO.md §5). */
export const MEMORIAS: Umbral = [2, 4];
export const VALORACION: Umbral = [4.0, 4.6];

/** Puntos de un dato en su minimo aceptable y en su nivel excelente (§5). */
export const PUNTOS_MINIMO = 6;
export const PUNTOS_EXCELENTE = 10;
/** Anticolision: si la tiene, 10; si no, estos puntos. */
export const SIN_ANTICOLISION = 3;

/**
 * Minimo aceptable -> 6, excelente -> 10, en linea recta y recortado a 0-10.
 * `minimo` puede ser mayor que `excelente` (ruido, altura minima).
 */
function escala(valor: number, [minimo, excelente]: Umbral): number {
  const x =
    PUNTOS_MINIMO + ((PUNTOS_EXCELENTE - PUNTOS_MINIMO) * (valor - minimo)) / (excelente - minimo);
  return Math.max(0, Math.min(10, x));
}

const media = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
const decimal = (x: number) => Math.round(x * 10) / 10;

/**
 * Gama de precio (METODO.md §5): por el punto medio de la franja verificada,
 * sin separar marcos de completos. Sin franja verificada se usa `precio`,
 * el dato interno que ya segmenta las paginas y que no se publica.
 */
export function gama(p: Pick<Product, "precio" | "precio_min" | "precio_max">): Gama {
  const medio =
    p.precio_min != null && p.precio_max != null ? (p.precio_min + p.precio_max) / 2 : p.precio;
  if (medio <= 120) return "entrada";
  if (medio <= 250) return "media";
  return "alta";
}

export function calcularNota(p: Product): ProductScore {
  const s = p.specs;
  const u = UMBRALES[gama(p)];

  // Carga 50 %, motor 30 %, estructura 20 %. Si la ficha no declara el
  // peso de la estructura, no cuenta y los otros dos se reparten su peso.
  const est: [number, number][] = [
    [escala(s.peso_max_carga_kg, u.carga), 0.5],
    [u.motor[s.tipo_motor], 0.3],
    ...(s.peso_estructura_kg !== null ? [[escala(s.peso_estructura_kg, u.estructura), 0.2] as [number, number]] : []),
  ];
  const estabilidad =
    est.reduce((t, [v, w]) => t + v * w, 0) / est.reduce((t, [, w]) => t + w, 0);

  // Velocidad y ruido faltan en algunas fichas: si no hay dato, no cuentan,
  // en vez de inventar un valor que baje o suba la media.
  const funciones = media([
    escala(s.presets_memoria, MEMORIAS),
    s.sistema_anticolision ? 10 : SIN_ANTICOLISION,
    ...(s.velocidad_cm_s !== null ? [escala(s.velocidad_cm_s, u.velocidad)] : []),
    ...(s.ruido_db !== null ? [escala(s.ruido_db, u.ruido)] : []),
  ]);

  const recorrido = media([
    escala(s.rango_altura_min_cm, u.alturaMin),
    escala(s.rango_altura_max_cm, u.alturaMax),
  ]);

  const garantia = escala(s.garantia_anos, u.garantia);

  const valoracion =
    p.num_reviews >= MIN_VALORACIONES ? escala(p.rating, VALORACION) : null;

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
