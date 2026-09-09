"use client";

import { affiliateLink, trackClick } from "@/lib/affiliate";

/**
 * CTA de afiliado del rediseño: tinta sobre crema.
 *
 * Es un componente nuevo en vez de un cambio en AffiliateButton porque ese
 * lo usan siete paginas que todavia llevan el sistema viejo. El contrato de
 * afiliacion es el mismo: affiliateLink, rel y trackClick no se tocan.
 */
export function Cta({
  asin,
  texto = "Ver precio actual en Amazon",
  ancho = false,
  mini = false,
}: {
  asin: string;
  texto?: string;
  ancho?: boolean;
  mini?: boolean;
}) {
  return (
    <a
      href={affiliateLink(asin)}
      onClick={() => trackClick(asin)}
      target="_blank"
      rel="nofollow sponsored noopener"
      className={`bs-cta${ancho ? " bs-cta-ancho" : ""}${mini ? " bs-cta-mini" : ""}`}
    >
      {texto}
      <span aria-hidden="true">→</span>
    </a>
  );
}
