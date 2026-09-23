/**
 * Donde vive la ficha de cada modelo.
 *
 * Tres reviews largas tienen ruta propia y ya indexada, con un nombre que no
 * sale del slug (PLAN.md §7.2): se conservan tal cual. El resto de modelos
 * usa la plantilla de app/[ficha] en `/{slug}-opiniones`.
 *
 * Un modelo solo tiene ficha de plantilla cuando tiene `titular`: es el H1
 * de la pagina y, por CLAUDE.md, necesita visto bueno antes de entrar en el
 * JSON. Sin titular aprobado no se publica la pagina.
 */
import type { Product } from "./types";
import { getAllProducts } from "./products";

export const RUTAS_FIJAS: Record<string, string> = {
  "flexispot-e7": "/flexispot-e7-opiniones",
  "fezibo-120": "/fezibo-opiniones",
  "maidesite-t2-pro-max": "/maidesite-t2-pro-opiniones",
};

const SUFIJO = "-opiniones";

/** Ruta de la ficha del modelo, o null si no tiene ninguna publicada. */
export function rutaFicha(p: Product): string | null {
  if (RUTAS_FIJAS[p.slug]) return RUTAS_FIJAS[p.slug];
  if (p.disponible && p.titular) return `/${p.slug}${SUFIJO}`;
  return null;
}

/** Modelos que se sirven con la plantilla, con el segmento de su ruta. */
export function fichasDePlantilla(): { segmento: string; asin: string; producto: Product }[] {
  return getAllProducts()
    .filter(([, p]) => !RUTAS_FIJAS[p.slug] && rutaFicha(p))
    .map(([asin, p]) => ({ segmento: `${p.slug}${SUFIJO}`, asin, producto: p }));
}

/** El modelo de una ruta de plantilla, a partir del segmento de la URL. */
export function fichaPorSegmento(segmento: string) {
  return fichasDePlantilla().find((f) => f.segmento === segmento);
}
