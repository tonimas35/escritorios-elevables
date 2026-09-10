import { franjaPrecio } from "@/lib/ficha";
import type { Product } from "@/lib/types";

/**
 * Franja de precio con fecha de verificacion, en gris pequeno sobre el CTA.
 *
 * Va donde haya datos estructurados que la declaren: Google exige que el
 * precio del schema se pueda ver en la pagina, y si no se ve retira el
 * resultado enriquecido. Si al modelo le falta alguno de los tres campos de
 * precio, no se pinta nada.
 */
export function FranjaPrecio({ product }: { product: Product }) {
  const franja = franjaPrecio(product);
  if (!franja) return null;
  return (
    <p className="text-xs mb-2" style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
      {franja}
    </p>
  );
}
