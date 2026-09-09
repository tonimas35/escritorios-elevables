/**
 * Formateo de datos que caducan.
 *
 * Amazon cambia precios constantemente y el Operating Agreement prohibe
 * mostrar precios desactualizados. Como el sitio no tiene acceso a la API
 * (requiere un volumen de ventas que todavia no alcanzamos), la solucion es
 * no publicar cifras exactas: se muestran bandas de precio, y el importe real
 * lo ve el usuario en Amazon, que es donde siempre es correcto.
 */
export function priceBand(precio: number): string {
  if (precio < 100) return "menos de 100 €";
  if (precio >= 400) return "mas de 400 €";
  const paso = precio < 200 ? 50 : 100;
  const min = Math.floor(precio / paso) * paso;
  return `${min}-${min + paso} €`;
}

/**
 * Las resenas solo suben, asi que redondear a la baja da una cifra que sigue
 * siendo cierta dentro de dos anos. Con los precios no existe este truco.
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
