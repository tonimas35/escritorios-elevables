/**
 * El catálogo, leído igual que la web: data/productos.json con la nota
 * calculada por lib/nota.ts (METODO.md §5). Los vídeos no tienen datos
 * propios: si cambia el JSON, cambia el vídeo.
 */
import { readFileSync } from "node:fs";
import type { Product, ProductMap } from "../lib/types";
import { calcularNota, posicionEnFranja, type Franja } from "../lib/nota.ts";

const json = JSON.parse(
  readFileSync(new URL("../data/productos.json", import.meta.url), "utf8"),
) as ProductMap;

export const catalogo: Product[] = Object.values(json)
  .map((p) => ({ ...p, puntuacion: calcularNota(p) }))
  .filter((p) => p.disponible);

/** Los modelos de una franja, en el orden de la web (nº 1 primero). */
export function modelosDeFranja(f: Franja): Product[] {
  return catalogo
    .map((p) => ({ p, pos: posicionEnFranja(p, catalogo) }))
    .filter((x) => x.pos?.franja === f)
    .sort((a, b) => a.pos!.posicion - b.pos!.posicion)
    .map((x) => x.p);
}

/** Nota con coma decimal, como en la web: 9,3. */
export const nota = (n: number) => n.toFixed(1).replace(".", ",");

/**
 * La franja de precio en el mismo formato que franjaPrecio() de
 * lib/ficha.ts (CLAUDE.md, «Precios»). Se repite aquí porque ficha.ts
 * importa sin extensión y Node no lo resuelve fuera de Next.
 */
export function franjaPrecio(p: Product): string | null {
  const { precio_min: min, precio_max: max, precio_verificado: fecha } = p;
  if (min === null || max === null || !fecha) return null;
  const [aaaa, mm, dd] = fecha.split("-");
  return `Entre ${min} y ${max} € en Amazon · verificado el ${dd}/${mm}/${aaaa}`;
}

/** «VASAGLE 100x60». */
export const nombre = (p: Product) => `${p.marca} ${p.modelo}`;
