"use client";

import { useState, useMemo } from "react";
import { calculateErgonomicHeight } from "@/lib/calculator";
import { ProductCard } from "@/components/ProductCard";
import { getProductsInHeightRange } from "@/lib/products";

export default function CalculadoraPage() {
  const [estatura, setEstatura] = useState(170);
  const result = useMemo(() => calculateErgonomicHeight(estatura), [estatura]);
  const recommended = useMemo(
    () => getProductsInHeightRange(result.alturaSentado, result.alturaDePie, 3),
    [result.alturaSentado, result.alturaDePie]
  );

  const stats = [
    { label: "Mesa sentado", value: result.alturaSentado, unit: "cm", highlight: false },
    { label: "Mesa de pie", value: result.alturaDePie, unit: "cm", highlight: true },
    { label: "Monitor", value: result.alturaMonitor, unit: "cm", highlight: false },
    { label: "Silla", value: result.alturaSilla, unit: "cm", highlight: false },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
          Herramienta
        </p>
        <h1 className="text-3xl md:text-5xl mt-1" style={{ fontFamily: 'var(--font-display)' }}>
          Calculadora ergonomica
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Basado en la norma EN 527-1 y recomendaciones OSHA.
        </p>
      </div>

      {/* Slider */}
      <div className="p-6 rounded" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-baseline justify-between mb-4">
          <label htmlFor="estatura-slider" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Tu estatura
          </label>
          <span className="mono text-3xl font-bold" style={{ color: 'var(--accent)' }}>
            {estatura} <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>cm</span>
          </span>
        </div>
        <input id="estatura-slider" type="range" min={150} max={200} step={1}
          value={estatura} onChange={(e) => setEstatura(Number(e.target.value))}
          className="w-full" />
        <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          <span>150 cm</span>
          <span>200 cm</span>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 rounded text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            <p className={`mono text-2xl font-bold mt-1 ${stat.highlight ? '' : ''}`}
              style={{ color: stat.highlight ? 'var(--accent)' : 'var(--text-primary)' }}>
              {stat.value}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.unit}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        Rango necesario: <span className="mono font-semibold">{result.alturaSentado}</span> cm (sentado) —
        <span className="mono font-semibold"> {result.alturaDePie}</span> cm (de pie)
      </p>

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="mt-12">
          <div className="divider mb-8" />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-1" style={{ color: 'var(--accent)' }}>
            Compatibles
          </p>
          <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Escritorios que cubren tu rango
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommended.map(([asin, product]) => (
              <ProductCard key={asin} asin={asin} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
