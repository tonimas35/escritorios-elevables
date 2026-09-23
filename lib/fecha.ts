/**
 * La fecha del sitio. Una sola, escrita a mano.
 *
 * Antes convivian tres: un "Marzo 2026" fijo en los kickers, un
 * "septiembre 2026" en las lineas de actualizado y un new Date() que se
 * recalculaba en cada render. Se contradecian entre si y la calculada
 * habria seguido avanzando sola aunque el contenido no se tocara, que es
 * justo lo que no debe pasar en una pagina que dice cuando se reviso.
 *
 * Al actualizar el contenido de verdad, se cambia aqui.
 */
export const FECHA = "Septiembre de 2026";

/** La misma fecha en minuscula, para cuando va dentro de una frase. */
export const FECHA_EN_FRASE = "septiembre de 2026";

/** Fecha ISO (AAAA-MM-DD) escrita como DD/MM/AAAA. */
export function fechaCorta(iso: string): string {
  const [aaaa, mm, dd] = iso.split("-");
  return `${dd}/${mm}/${aaaa}`;
}

/**
 * Ultima revision del contenido del sitio, en ISO. Es el `lastmod` del
 * sitemap: se cambia a mano, como FECHA, cuando se toca contenido de verdad.
 */
export const REVISION = "2026-09-23";
