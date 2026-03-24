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

  return (
    <div className="relative p-6 rounded-lg" style={{ background: 'var(--accent-subtle)', borderLeft: '4px solid var(--accent)' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
        Nuestra recomendacion
      </p>
      <div className="flex items-center gap-4">
        <div className="w-[120px] h-[120px] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-white">
          {isRemoteImage ? (
            <Image
              src={product.imagen}
              alt={product.imagen_alt}
              width={120}
              height={120}
              className="object-contain p-1"
            />
          ) : (
            <span className="text-3xl">🖥️</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-neutral-800 truncate">
            {product.nombre}
          </p>
          <p className="text-xs text-neutral-500">{product.marca}</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center justify-center text-white font-bold text-sm rounded px-2 py-0.5 tabular-nums ${
                product.puntuacion.total >= 8.5
                  ? "bg-green-500"
                  : product.puntuacion.total >= 7
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
            >
              {product.puntuacion.total}
            </span>
            <span className="text-xs text-neutral-500">
              {product.rating}★ ({product.num_reviews})
            </span>
          </div>
          <p className="tabular-nums text-lg font-bold text-neutral-800 mt-1">
            {product.precio}{" "}
            <span className="text-xs font-normal text-neutral-500">EUR</span>
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-neutral-600">
        {texto || product.veredicto}
      </p>
      <div className="mt-4">
        <AffiliateButton asin={asin} size="lg" />
      </div>
    </div>
  );
}
