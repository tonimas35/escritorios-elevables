/**
 * Declaracion de afiliado: una linea en gris pequeño bajo cada CTA.
 *
 * Sustituye al parrafo grande que habia al final del footer. La
 * declaracion tiene que estar donde esta el enlace, no enterrada al pie.
 */
export function AvisoAfiliado({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs mt-2 ${className}`} style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
      Enlace de afiliado: si compras, Amazon nos paga una comisión y tú pagas lo mismo.
    </p>
  );
}

/** Version para tablas: una sola nota al pie en vez de una por fila. */
export function AvisoAfiliadoTabla() {
  return (
    <p className="text-xs mt-3" style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
      Todos los enlaces son de afiliado: si compras, Amazon nos paga una comisión
      y tú pagas lo mismo.
    </p>
  );
}
