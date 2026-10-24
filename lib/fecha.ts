/**
 * La fecha del sitio. Una sola, escrita a mano: REVISION, mas abajo.
 *
 * Antes convivian tres: un "Marzo 2026" fijo en los kickers, un
 * "septiembre 2026" en las lineas de actualizado y un new Date() que se
 * recalculaba en cada render. Se contradecian entre si y la calculada
 * habria seguido avanzando sola aunque el contenido no se tocara, que es
 * justo lo que no debe pasar en una pagina que dice cuando se reviso.
 *
 * FECHA y FECHA_EN_FRASE salen de REVISION (desde el 15/10/2026). Antes
 * eran dos textos aparte y el sitemap se quedo en septiembre aunque el
 * contenido se cambio en octubre. Al actualizar el contenido de verdad,
 * se cambia REVISION y nada mas.
 */
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** Fecha ISO (AAAA-MM-DD) escrita como DD/MM/AAAA. */
export function fechaCorta(iso: string): string {
  const [aaaa, mm, dd] = iso.split("-");
  return `${dd}/${mm}/${aaaa}`;
}

/**
 * Ultima revision del contenido del sitio, en ISO. Es el `lastmod` del
 * sitemap y la fecha visible de todo el sitio: se cambia a mano cuando se
 * toca contenido de verdad.
 */
export const REVISION = "2026-10-24";

/** "octubre de 2026", para cuando va dentro de una frase. */
export const FECHA_EN_FRASE = `${MESES[Number(REVISION.slice(5, 7)) - 1]} de ${REVISION.slice(0, 4)}`;

/** "Octubre de 2026", para cuando va sola (cabecera, kickers). */
export const FECHA = FECHA_EN_FRASE.charAt(0).toUpperCase() + FECHA_EN_FRASE.slice(1);
