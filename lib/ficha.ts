import type { Product } from "./types";
import { coma } from "./format";

/**
 * Etiquetas de especificacion para las pantallas del rediseño.
 *
 * Todo sale de `specs`. Ninguna de estas funciones inventa un dato: si el
 * campo no esta, devuelven null y quien las llama decide si oculta la fila.
 */

export function motorLargo(p: Product): string {
  const tipo = p.specs.tipo_motor === "doble" ? "Doble" : p.specs.tipo_motor === "simple" ? "Simple" : "Manual";
  return `${tipo} · ${coma(p.specs.velocidad_cm_s)} cm/s`;
}

export function motorCorto(p: Product): string {
  if (p.specs.tipo_motor === "doble") return "Doble motor";
  if (p.specs.tipo_motor === "simple") return "Motor simple";
  return "Manual";
}

export function recorrido(p: Product): string {
  return `${p.specs.rango_altura_min_cm}–${p.specs.rango_altura_max_cm} cm`;
}

export function carga(p: Product): string {
  return `${p.specs.peso_max_carga_kg} kg`;
}

export function memorias(p: Product): string {
  const base = `${p.specs.presets_memoria}`;
  return p.specs.sistema_anticolision ? `${base} · anticolisión` : base;
}

export function ruido(p: Product): string | null {
  return p.specs.ruido_db === null ? null : `${p.specs.ruido_db} dB`;
}

export function garantia(p: Product): string {
  return `${p.specs.garantia_anos} años`;
}

export function tablero(p: Product): string {
  return p.incluye_tablero
    ? `${p.specs.ancho_tablero_cm}x${p.specs.profundidad_tablero_cm} cm`
    : "No incluido";
}

/** Las filas de la ficha tecnica, ya sin las que no tienen dato. */
export function fichaTecnica(p: Product): [string, string][] {
  const filas: [string, string | null][] = [
    ["Motor", motorLargo(p)],
    ["Carga", carga(p)],
    ["Recorrido", recorrido(p)],
    ["Memorias", memorias(p)],
    ["Ruido", ruido(p)],
    ["Estructura", `${p.specs.peso_estructura_kg} kg`],
    ["Garantía", garantia(p)],
    ["Tablero", tablero(p)],
  ];
  return filas.filter((f): f is [string, string] => f[1] !== null);
}

/**
 * Standfirst del veredicto, compuesto con los datos de `specs`.
 *
 * No usa `veredicto` del JSON a proposito: hoy varios llevan precios y
 * recuentos de reseñas dentro del texto, y no pueden publicarse.
 */
export function standfirst(p: Product, esElMejor: boolean): string {
  const nota = `Nota ${coma(p.puntuacion.total)} sobre 10${esElMejor ? ", la más alta del catálogo" : ""}.`;
  const ficha = `${motorCorto(p)}, ${carga(p)} de carga y ${garantia(p)} de garantía.`;
  const cierre = p.incluye_tablero
    ? `Tablero de ${p.specs.ancho_tablero_cm}x${p.specs.profundidad_tablero_cm} incluido.`
    : "No incluye tablero: ese lo eliges tú.";
  return `${nota} ${ficha} ${cierre}`;
}

export interface Camino {
  etiqueta: string;
  subtitulo: string;
  asin: string;
  producto: Product;
  texto: string;
}

/**
 * Los tres caminos de la seccion 2, por necesidad y no por presupuesto.
 *
 * Se derivan del catalogo en vez de fijar los ASIN a mano: el mejor marco,
 * el mejor modelo con tablero y el de mas carga. Con el catalogo actual
 * salen los mismos tres modelos que marca el diseño, y si el catalogo
 * cambia la seccion sigue diciendo la verdad.
 */
export function caminos(catalogo: [string, Product][]): Camino[] {
  const porNota = [...catalogo].sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total);

  const marco = porNota.find(([, p]) => !p.incluye_tablero);
  const conTablero = porNota.find(([, p]) => p.incluye_tablero);
  const usados = new Set([marco?.[0], conTablero?.[0]]);
  const masCarga = [...catalogo]
    .filter(([a]) => !usados.has(a))
    .sort(([, a], [, b]) => b.specs.peso_max_carga_kg - a.specs.peso_max_carga_kg)[0];

  const salida: Camino[] = [];

  if (marco) {
    const [asin, p] = marco;
    salida.push({
      etiqueta: "Solo el marco",
      subtitulo: "El tablero lo eliges tú",
      asin,
      producto: p,
      texto: `${motorCorto(p)}, ${carga(p)} y recorrido de ${p.specs.rango_altura_min_cm} a ${p.specs.rango_altura_max_cm} cm. El tablero, a tu medida.`,
    });
  }
  if (conTablero) {
    const [asin, p] = conTablero;
    const material = p.specs.material_tablero ? ` (${p.specs.material_tablero})` : "";
    salida.push({
      etiqueta: "Con tablero incluido",
      subtitulo: "Montar y usar, sin más compras",
      asin,
      producto: p,
      texto: `Tablero de ${p.specs.ancho_tablero_cm}x${p.specs.profundidad_tablero_cm}${material}, ${motorCorto(p).toLowerCase()} y ${garantia(p)} de garantía.`,
    });
  }
  if (masCarga) {
    const [asin, p] = masCarga;
    salida.push({
      etiqueta: "Dos monitores o setup grande",
      subtitulo: "Cuando manda la carga",
      asin,
      producto: p,
      texto: `${carga(p)} de carga y recorrido de ${p.specs.rango_altura_min_cm} a ${p.specs.rango_altura_max_cm} cm, lo más amplio del catálogo. ${p.incluye_tablero ? `Tablero de ${p.specs.ancho_tablero_cm}x${p.specs.profundidad_tablero_cm} incluido.` : "Tampoco incluye tablero."}`,
    });
  }
  return salida;
}
