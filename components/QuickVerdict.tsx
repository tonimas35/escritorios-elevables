import { ProductCard } from "./ProductCard";
import { AffiliateButton } from "./AffiliateButton";
import type { Product } from "@/lib/types";

interface QuickVerdictProps {
  asin: string;
  product: Product;
  texto?: string;
}

export function QuickVerdict({ asin, product, texto }: QuickVerdictProps) {
  return (
    <div className="relative p-6 rounded" style={{ background: 'var(--accent-light)', borderLeft: '3px solid var(--accent)' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
        Nuestra recomendacion
      </p>
      <ProductCard asin={asin} product={product} size="compact" hideButton />
      <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {texto || product.veredicto}
      </p>
      <div className="mt-4">
        <AffiliateButton asin={asin} size="lg" />
      </div>
    </div>
  );
}
