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
