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
      ? "bg-green-500"
      : score >= 7
        ? "bg-amber-500"
        : "bg-red-500";
  return (
    <span
      className={`inline-flex items-center justify-center ${bg} text-white font-bold text-sm rounded px-2 py-0.5 tabular-nums`}
    >
      {score}
    </span>
  );
}

function SpecBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded px-2 py-1">
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
      <div className="flex items-center gap-4 p-4 rounded-lg bg-white border border-neutral-200">
        <div className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-neutral-50">
          {isRemoteImage ? (
            <Image
              src={product.imagen}
              alt={product.imagen_alt}
              width={80}
              height={80}
              className="object-contain"
            />
          ) : (
            <span className="text-2xl">🖥️</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-neutral-800 truncate">
            {product.nombre}
          </p>
          <p className="text-xs text-neutral-500">{product.marca}</p>
          <div className="flex items-center gap-2 mt-1">
            <RatingBadge score={product.puntuacion.total} />
            <span className="text-xs text-neutral-500">
              {product.rating}★ ({product.num_reviews})
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="tabular-nums text-lg font-bold text-neutral-800">
            {product.precio}{" "}
            <span className="text-xs font-normal text-neutral-500">EUR</span>
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
    <div className="relative overflow-hidden rounded-lg bg-white border border-neutral-200 transition-shadow hover:shadow-md">
      {(badge || rank) && (
        <div className="flex items-center gap-2 px-5 pt-4">
          {rank !== undefined && rank > 0 && (
            <span className="tabular-nums text-xs font-bold" style={{ color: 'var(--accent)' }}>
              #{String(rank).padStart(2, "0")}
            </span>
          )}
          {badge && (
            <span className="tag">
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="p-5">
        {/* Image - large, centered */}
        <div className="flex justify-center mb-4">
          <div className="w-[180px] h-[180px] rounded-lg flex items-center justify-center overflow-hidden bg-neutral-50">
            {isRemoteImage ? (
              <Image
                src={product.imagen}
                alt={product.imagen_alt}
                width={180}
                height={180}
                className="object-contain p-2"
              />
            ) : (
              <span className="text-5xl">🖥️</span>
            )}
          </div>
        </div>

        {/* Name and brand */}
        <div className="mb-2">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            {product.marca}
          </p>
          <h3 className="text-base font-semibold mt-0.5 leading-tight text-neutral-800">
            {product.modelo || product.nombre}
          </h3>
        </div>

        {/* Rating badge + stars */}
        <div className="flex items-center gap-2 mb-3">
          <RatingBadge score={product.puntuacion.total} />
          <span className="text-xs text-neutral-500">
            {product.rating}★ ({product.num_reviews})
          </span>
        </div>

        {/* Spec badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <SpecBadge>
            {product.specs.tipo_motor === "doble" ? "⚡" : "🔌"} {motorLabel}
          </SpecBadge>
          <SpecBadge>🏋️ {cargaLabel}</SpecBadge>
          <SpecBadge>📐 {tableroLabel}</SpecBadge>
        </div>

        {/* Quick pros/cons */}
        <div className="mb-4 border-t border-b border-neutral-200 py-3 space-y-1.5">
          {shortPros.map((pro, i) => (
            <p key={`pro-${i}`} className="text-xs text-neutral-700 flex items-start gap-1.5">
              <span className="text-green-500 flex-shrink-0 mt-px">✓</span>
              <span>{pro}</span>
            </p>
          ))}
          {shortCons.map((con, i) => (
            <p key={`con-${i}`} className="text-xs text-neutral-500 flex items-start gap-1.5">
              <span className="text-red-400 flex-shrink-0 mt-px">✗</span>
              <span>{con}</span>
            </p>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          {product.precio_habitual && (
            <span className="tabular-nums text-sm line-through text-neutral-400">
              {product.precio_habitual}€
            </span>
          )}
          <span className="tabular-nums text-2xl font-bold text-neutral-800">
            {product.precio}
          </span>
          <span className="text-sm text-neutral-500">EUR</span>
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
