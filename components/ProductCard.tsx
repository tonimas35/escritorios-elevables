import Image from "next/image";
import { AffiliateButton } from "./AffiliateButton";
import { StarRating } from "./StarRating";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  asin: string;
  product: Product;
  badge?: string;
  size?: "compact" | "full";
  hideButton?: boolean;
  rank?: number;
}

export function ProductCard({
  asin,
  product,
  badge,
  size = "full",
  hideButton = false,
  rank,
}: ProductCardProps) {
  const isRemoteImage = product.imagen.startsWith("http");

  if (size === "compact") {
    return (
      <div className="flex items-center gap-4 p-4 rounded" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="w-14 h-14 md:w-16 md:h-16 rounded flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
          {isRemoteImage ? (
            <Image src={product.imagen} alt={product.imagen_alt} width={64} height={64} className="object-contain" />
          ) : (
            <span className="text-xl">🖥️</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{product.nombre}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.marca}</p>
          <StarRating rating={product.rating} reviews={product.num_reviews} compact />
        </div>
        <div className="text-right flex-shrink-0">
          <p className="mono text-lg font-bold">{product.precio} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>EUR</span></p>
          {!hideButton && <AffiliateButton asin={asin} size="sm" />}
        </div>
      </div>
    );
  }

  const specs = [
    { label: "Altura", value: `${product.specs.rango_altura_min_cm}–${product.specs.rango_altura_max_cm}`, unit: "cm" },
    { label: "Motor", value: product.specs.tipo_motor === "doble" ? "Doble" : "Simple", unit: "" },
    { label: "Carga max", value: `${product.specs.peso_max_carga_kg}`, unit: "kg" },
    { label: "Ruido", value: product.specs.ruido_db ? `${product.specs.ruido_db}` : "—", unit: product.specs.ruido_db ? "dB" : "" },
  ];

  return (
    <div className="card-lift relative overflow-hidden rounded" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      {(badge || rank) && (
        <div className="flex items-center gap-2 px-5 pt-4">
          {rank !== undefined && rank > 0 && (
            <span className="mono text-xs font-bold" style={{ color: 'var(--accent)' }}>
              #{String(rank).padStart(2, '0')}
            </span>
          )}
          {badge && (
            <span className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 rounded flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
            {isRemoteImage ? (
              <Image
                src={product.imagen}
                alt={product.imagen_alt}
                width={128}
                height={128}
                className="object-contain p-1"
              />
            ) : (
              <span className="text-4xl">🖥️</span>
            )}
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {product.marca}
          </p>
          <h3 className="text-base font-semibold mt-0.5 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {product.modelo || product.nombre}
          </h3>
        </div>

        <StarRating rating={product.rating} reviews={product.num_reviews} compact />

        <div className="grid grid-cols-2 gap-2 mt-4 py-3" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          {specs.map((spec) => (
            <div key={spec.label}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{spec.label}</p>
              <p className="mono text-sm font-semibold">
                {spec.value} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>{spec.unit}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          {product.precio_habitual && (
            <span className="mono text-sm line-through" style={{ color: 'var(--text-muted)' }}>
              {product.precio_habitual}€
            </span>
          )}
          <span className="mono text-2xl font-bold">{product.precio}</span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>EUR</span>
        </div>

        <div className="mt-4">
          <AffiliateButton asin={asin} size="lg" />
        </div>
      </div>
    </div>
  );
}
