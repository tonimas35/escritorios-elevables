import Image from "next/image";
import { AffiliateButton } from "./AffiliateButton";
import type { Product } from "@/lib/types";

interface QuickVerdictProps {
  asin: string;
  product: Product;
  texto?: string;
}

export function QuickVerdict({ asin, product, texto }: QuickVerdictProps) {
  const isRemoteImage = product.imagen.startsWith("http");

  const ratingBg =
    product.puntuacion.total >= 8.5
      ? "var(--color-secondary)"
      : product.puntuacion.total >= 7
        ? "var(--rating-okay)"
        : "var(--rating-bad)";

  return (
    <div className="relative p-6 rounded overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-secondary-light), white)', borderLeft: '3px solid var(--accent)' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-secondary)' }}>
        Nuestra recomendacion
      </p>
      <div className="flex items-center gap-4">
        <div className="w-[120px] h-[120px] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden product-image-container">
          {isRemoteImage ? (
            <Image
              src={product.imagen}
              alt={product.imagen_alt}
              width={120}
              height={120}
              className="object-contain p-1"
            />
          ) : (
            <span className="text-3xl">&#128421;</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
            {product.nombre}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.marca}</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="inline-flex items-center justify-center text-white font-bold text-sm rounded px-2 py-0.5 tabular-nums"
              style={{ background: ratingBg }}
            >
              {product.puntuacion.total}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {product.rating}&#9733; ({product.num_reviews})
            </span>
          </div>
          <p className="tabular-nums text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
            {product.precio}{" "}
            <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>EUR</span>
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {texto || product.veredicto}
      </p>
      <div className="mt-4">
        <AffiliateButton asin={asin} size="lg" />
      </div>
    </div>
  );
}
