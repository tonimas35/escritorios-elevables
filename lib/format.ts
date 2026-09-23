/**
 * Decimales con coma, que es como se escriben en castellano.
 * `9.7` -> `9,7`. Los enteros se quedan como estan.
 */
export function coma(n: number): string {
  return String(n).replace(".", ",");
}

/**
 * Nota sobre 10, siempre con un decimal: `7` -> `7,0`. Una nota sin
 * decimal en una columna de notas con decimal parece otro tipo de dato.
 */
export function nota(n: number): string {
  return n.toFixed(1).replace(".", ",");
}
