/**
 * Las resenas solo suben, asi que redondear a la baja da una cifra que sigue
 * siendo cierta dentro de dos anos.
 */
export function reviewsAprox(n: number): string {
  if (n < 50) return `${n}`;
  let paso = 10;
  if (n >= 100) paso = 50;
  if (n >= 500) paso = 100;
  if (n >= 2000) paso = 500;
  return `mas de ${Math.floor(n / paso) * paso}`;
}

/**
 * Decimales con coma, que es como se escriben en castellano.
 * `9.7` -> `9,7`. Los enteros se quedan como estan.
 */
export function coma(n: number): string {
  return String(n).replace(".", ",");
}
