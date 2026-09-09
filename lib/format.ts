/**
 * Decimales con coma, que es como se escriben en castellano.
 * `9.7` -> `9,7`. Los enteros se quedan como estan.
 */
export function coma(n: number): string {
  return String(n).replace(".", ",");
}
