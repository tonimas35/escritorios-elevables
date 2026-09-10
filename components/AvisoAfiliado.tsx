/**
 * Declaracion de afiliado.
 *
 * Va una sola vez por pagina, encima del primer CTA, en vez de repetirse
 * bajo cada enlace. Las tablas comparativas llevan ademas una nota al pie
 * que cubre todas sus filas. El detalle completo esta en /aviso-legal y en
 * /metodologia.
 */
export function AvisoAfiliadoPagina() {
  return (
    <p className="text-xs mb-3" style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
      Los enlaces a Amazon de esta página son de afiliado: si compras, Amazon
      nos paga una comisión y tú pagas lo mismo.
    </p>
  );
}

/** Nota al pie de una tabla: cubre los enlaces de todas sus filas. */
export function AvisoAfiliadoTabla() {
  return (
    <p className="text-xs mt-3" style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
      Todos los enlaces de la tabla son de afiliado: si compras, Amazon nos paga
      una comisión y tú pagas lo mismo.
    </p>
  );
}
