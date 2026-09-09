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
