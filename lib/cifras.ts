/**
 * Cifras que no pueden aparecer en el texto publicado: precios sueltos y
 * recuentos de reseñas (CLAUDE.md, "Precios"). El precio solo se publica
 * como franja con fecha, con `franjaPrecio()` en lib/ficha.ts.
 *
 * Vive aparte y sin alias de rutas para que lo pueda importar tambien el
 * validador del catalogo, que se ejecuta con Node fuera de Next.
 *
 * El numero admite miles con punto y decimales con coma ("2.100", "12,50"),
 * pero no puede acabar en coma: "Flexispot E7, opiniones" no es un
 * recuento de reseñas.
 */
export const CIFRA_PROHIBIDA =
  /\d[\d.]*(?:,\d+)?\s*(€|EUR|euros)|\d[\d.]*(?:,\d+)?\+?\s*(opiniones|valoraciones|reviews|resenas|reseñas)|\(\d+\)/i;

export function publicable(texto: string): boolean {
  return !CIFRA_PROHIBIDA.test(texto);
}
