import Image from "next/image";
import { AffiliateButton } from "./AffiliateButton";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  asin: string;
  product: Product;
  badge?: string;
  size?: "compact" | "full";
  hideButton?: boolean;
  rank?: number;
}

function RatingBadge({ score }: { score: number }) {
  const bg =
    score >= 8.5
      ? "var(--color-secondary)"
      : score >= 7
        ? "var(--rating-okay)"
        : "var(--rating-bad)";
  return (
    <span
      className="inline-flex items-center justify-center text-white font-bold text-sm rounded px-2 py-0.5 tabular-nums"
      style={{ background: bg, fontFamily: 'var(--font-mono)' }}
    >
      {score}
    </span>
  );
}

function SpecBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium rounded px-2 py-1" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
      {children}
    </span>
  );
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

  // Short pros/cons for card display (max 3 pros, 2 cons, trimmed to ~8 words)
  const shortPros = product.pros.slice(0, 3).map((p) => {
    const words = p.split(" ");
    return words.length > 8 ? words.slice(0, 8).join(" ") + "..." : p;
  });
  const shortCons = product.contras.slice(0, 2).map((c) => {
    const words = c.split(" ");
    return words.length > 8 ? words.slice(0, 8).join(" ") + "..." : c;
  });

  if (size === "compact") {
    return (
      <div className="flex items-center gap-4 p-4 rounded product-card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: '2px solid var(--accent)' }}>
        <div className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden product-image-container">
          {isRemoteImage ? (
            <Image
              src={product.imagen}
              alt={product.imagen_alt}
              width={80}
              height={80}
              className="object-contain"
            />
          ) : (
            <span className="text-2xl">&#128421;</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
            {product.nombre}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.marca}</p>
          <div className="flex items-center gap-2 mt-1">
            <RatingBadge score={product.puntuacion.total} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {product.rating}&#9733; ({product.num_reviews})
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="tabular-nums text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {product.precio}{" "}
            <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>EUR</span>
          </p>
          {!hideButton && <AffiliateButton asin={asin} size="sm" />}
        </div>
      </div>
    );
  }

  const motorLabel =
    product.specs.tipo_motor === "doble" ? "Doble motor" : "Motor simple";
  const cargaLabel = `${product.specs.peso_max_carga_kg} kg`;
  const tableroLabel = `${product.specs.ancho_tablero_cm}x${product.specs.profundidad_tablero_cm} cm`;

  return (
    <div className="relative overflow-hidden rounded product-card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: '2px solid var(--accent)' }}>
      {(badge || rank) && (
        <div className="flex items-center gap-2 px-5 pt-4">
          {rank !== undefined && rank > 0 && (
            <span className="editorial-number text-3xl" style={{ opacity: 0.15 }}>
              {String(rank).padStart(2, "0")}
            </span>
          )}
          {badge && (
            <span className="tag-secondary">
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="p-5">
        {/* Image - large, centered, on gradient background */}
        <div className="flex justify-center mb-4">
          <div className="w-[180px] h-[180px] rounded-lg flex items-center justify-center overflow-hidden product-image-container">
            {isRemoteImage ? (
              <Image
                src={product.imagen}
                alt={product.imagen_alt}
                width={180}
                height={180}
                className="object-contain p-2"
              />
            ) : (
              <span className="text-5xl">&#128421;</span>
            )}
          </div>
        </div>

        {/* Name and brand */}
        <div className="mb-2">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {product.marca}
          </p>
          <h3 className="text-base font-semibold mt-0.5 leading-tight" style={{ color: 'var(--text-primary)' }}>
            {product.modelo || product.nombre}
          </h3>
        </div>

        {/* Rating badge + stars */}
        <div className="flex items-center gap-2 mb-3">
          <RatingBadge score={product.puntuacion.total} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {product.rating}&#9733; ({product.num_reviews})
          </span>
        </div>

        {/* Spec badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <SpecBadge>
            {product.specs.tipo_motor === "doble" ? "\u26A1" : "\u{1F50C}"} {motorLabel}
          </SpecBadge>
          <SpecBadge>{cargaLabel}</SpecBadge>
          <SpecBadge>{tableroLabel}</SpecBadge>
        </div>

        {/* Quick pros/cons */}
        <div className="mb-4 py-3 space-y-1.5" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          {shortPros.map((pro, i) => (
            <p key={`pro-${i}`} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex-shrink-0 mt-px" style={{ color: 'var(--color-secondary)' }}>&#10003;</span>
              <span>{pro}</span>
            </p>
          ))}
          {shortCons.map((con, i) => (
            <p key={`con-${i}`} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <span className="flex-shrink-0 mt-px" style={{ color: 'var(--rating-bad)' }}>&#10007;</span>
              <span>{con}</span>
            </p>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          {product.precio_habitual && (
            <span className="tabular-nums text-sm line-through" style={{ color: 'var(--text-muted)' }}>
              {product.precio_habitual}&euro;
            </span>
          )}
          <span className="tabular-nums text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {product.precio}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>EUR</span>
        </div>

        {/* Affiliate button */}
        {!hideButton && (
          <div className="mt-4">
            <AffiliateButton asin={asin} size="lg" />
          </div>
        )}
      </div>
    </div>
  );
}
