/** Declaracion de afiliado: una linea en gris pequeño bajo cada CTA. */
export function Afiliado({ corta = false }: { corta?: boolean }) {
  return (
    <p className={`bs-afiliado${corta ? " bs-afiliado-mini" : ""}`}>
      {corta
        ? "Enlace de afiliado. Tú pagas lo mismo."
        : "Enlace de afiliado: si compras, Amazon nos paga una comisión y tú pagas lo mismo."}
    </p>
  );
}
