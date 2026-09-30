/**
 * Datos de franja para las filas de la comparativa de los 13 modelos.
 *
 * La nota se mide contra lo que se puede esperar por el precio (METODO.md
 * §5), así que dos notas de franjas distintas no se comparan. La tabla se
 * ordena por franja y, dentro de cada una, por nota: así un 6,8 de la gama
 * alta no queda debajo de un 9,3 de la de entrada como si fuera peor.
 */
import type { Product } from "./types";
import { NOMBRE_FRANJA, posicionEnFranja, type Franja } from "./nota";

/** De la más barata a la más cara: primero los completos, luego los marcos. */
export const ORDEN_FRANJAS: Franja[] = ["A", "B", "C", "M1", "M2"];

export interface InfoFranja {
  /** Posición de la franja en ORDEN_FRANJAS; al final si no tiene. */
  franjaOrden: number;
  franjaNombre: string | null;
  /** Puesto dentro de la franja, 1 el mejor; null si no tiene franja. */
  posicion: number | null;
  /** "nº 1 de 3", o null. */
  posicionTxt: string | null;
}

export function infoFranja(p: Product, catalogo: Product[]): InfoFranja {
  const x = posicionEnFranja(p, catalogo);
  if (!x) return { franjaOrden: ORDEN_FRANJAS.length, franjaNombre: null, posicion: null, posicionTxt: null };
  return {
    franjaOrden: ORDEN_FRANJAS.indexOf(x.franja),
    franjaNombre: NOMBRE_FRANJA[x.franja],
    posicion: x.posicion,
    posicionTxt: `nº ${x.posicion} de ${x.de}`,
  };
}
