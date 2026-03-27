"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { FadeIn } from "@/components/FadeIn";
import { filterProducts } from "@/lib/products";

export default function ComparadorPage() {
  const [precioMax, setPrecioMax] = useState(800);
  const [alturaMax, setAlturaMax] = useState(100);
  const [pesoMax, setPesoMax] = useState(50);
  const [motor, setMotor] = useState<"cualquiera" | "simple" | "doble" | "manual">("cualquiera");
  const [ordenar, setOrdenar] = useState<"recomendado" | "precio" | "rating">("recomendado");

  const filtered = useMemo(
    () => filterProducts({ precioMax, alturaMaxMin: alturaMax, pesoMaxMin: pesoMax, motor, sortBy: ordenar }),
    [precioMax, alturaMax, pesoMax, motor, ordenar]
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <FadeIn>
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
            Herramienta
          </p>
          <h1 className="text-3xl md:text-5xl mt-1 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
            Comparador
          </h1>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Filtra y compara. Encuentra tu escritorio en 30 segundos.
          </p>
        </div>
      </FadeIn>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filtros */}
        <FadeIn delay={100}>
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6 p-5 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
              <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Filtros
              </h2>

              <div>
                <label htmlFor="precio-slider" className="flex items-baseline justify-between text-sm font-medium">
                  <span>Presupuesto</span>
                  <span className="mono text-xs" style={{ color: 'var(--accent)' }}>{precioMax} €</span>
                </label>
                <input id="precio-slider" type="range" min={100} max={800} step={50} value={precioMax}
                  onChange={(e) => setPrecioMax(Number(e.target.value))} className="w-full mt-3" />
              </div>

              <div>
                <label htmlFor="altura-slider" className="flex items-baseline justify-between text-sm font-medium">
                  <span>Altura max min</span>
                  <span className="mono text-xs" style={{ color: 'var(--accent)' }}>{alturaMax} cm</span>
                </label>
                <input id="altura-slider" type="range" min={100} max={130} step={5} value={alturaMax}
                  onChange={(e) => setAlturaMax(Number(e.target.value))} className="w-full mt-3" />
              </div>

              <div>
                <label htmlFor="peso-slider" className="flex items-baseline justify-between text-sm font-medium">
                  <span>Carga min</span>
                  <span className="mono text-xs" style={{ color: 'var(--accent)' }}>{pesoMax} kg</span>
                </label>
                <input id="peso-slider" type="range" min={50} max={150} step={10} value={pesoMax}
                  onChange={(e) => setPesoMax(Number(e.target.value))} className="w-full mt-3" />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Motor</p>
                <div className="flex gap-2">
                  {(["cualquiera", "simple", "doble", "manual"] as const).map((opt) => (
                    <button key={opt} onClick={() => setMotor(opt)}
                      className="px-3 py-1.5 text-xs font-medium rounded-sm capitalize transition-all"
                      style={{
                        background: motor === opt ? 'var(--accent)' : 'transparent',
                        color: motor === opt ? 'white' : 'var(--text-secondary)',
                        border: `1px solid ${motor === opt ? 'var(--accent)' : 'var(--border)'}`,
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setPrecioMax(800); setAlturaMax(100); setPesoMax(50); setMotor("cualquiera"); }}
                className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--accent)' }}
              >
                Resetear
              </button>
            </div>
          </aside>
        </FadeIn>

        {/* Resultados */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="mono font-bold" style={{ color: 'var(--accent)' }}>{filtered.length}</span> resultados
            </p>
            <select value={ordenar} onChange={(e) => setOrdenar(e.target.value as typeof ordenar)}
              className="text-xs font-medium px-3 py-2 rounded-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <option value="recomendado">Recomendado</option>
              <option value="precio">Precio</option>
              <option value="rating">Valoracion</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg" style={{ fontFamily: 'var(--font-display)' }}>Sin resultados</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Amplia los filtros para ver escritorios.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map(([asin, product], i) => (
                <FadeIn key={asin} delay={i * 80}>
                  <ProductCard asin={asin} product={product} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
