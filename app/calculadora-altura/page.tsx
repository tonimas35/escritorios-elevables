"use client";

import { useState, useMemo } from "react";
import { calculateErgonomicHeight } from "@/lib/calculator";
import { ProductCard } from "@/components/ProductCard";
import { AvisoAfiliadoPagina } from "@/components/AvisoAfiliado";
import { FadeIn } from "@/components/FadeIn";
import { getProductsInHeightRange } from "@/lib/products";
import { AlzadoPuesto } from "@/components/broadsheet/AlzadoPuesto";

const TABLA = Array.from({ length: 11 }, (_, i) => 150 + i * 5).map((estatura) => ({
  estatura,
  ...calculateErgonomicHeight(estatura),
}));

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
      <FadeIn>
        <div className="mb-10">
          <p className="editorial-mark" style={{ color: 'var(--color-secondary)' }}>
            Calculadora de altura
          </p>
          <h1 className="text-3xl md:text-5xl mt-1 heading-accent" >
            ¿A qué altura debe estar tu escritorio?
          </h1>
          <AvisoAfiliadoPagina />
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
            Depende de tu estatura. Muévela abajo y verás la altura de la mesa
            sentado y de pie, la de la silla y la del borde de arriba del monitor.
          </p>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Aproximación con proporciones corporales medias. Ajusta hasta tener los
            codos a 90°.
          </p>
        </div>
      </FadeIn>

      {/* Slider */}
      <FadeIn delay={100}>
        <div className="p-6 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-baseline justify-between mb-4">
            <label htmlFor="estatura-slider" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Tu estatura
            </label>
            <span className="text-3xl font-bold" style={{ color: 'var(--color-secondary)' }}>
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
      </FadeIn>

      {/* Dibujo: el puesto acotado con tus medidas */}
      <div className="p-6 rounded-lg mt-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
        <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
          Así queda tu puesto con {estatura} cm de estatura
        </p>
        <AlzadoPuesto
          sentado={result.alturaSentado}
          dePie={result.alturaDePie}
          pantalla={result.alturaMonitor}
          silla={result.alturaSilla}
        />
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={200 + i * 80}>
            <div className="p-4 rounded-lg text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              <p className="text-2xl font-bold mt-1"
                style={{ color: stat.highlight ? 'var(--verde-estructura)' : 'var(--text-primary)' }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.unit}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        Rango necesario: <span className="font-semibold">{result.alturaSentado}</span> cm (sentado) —
        <span className="font-semibold"> {result.alturaDePie}</span> cm (de pie)
      </p>

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="mt-12">
          <div className="divider mb-8" />
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-1" style={{ color: 'var(--verde-estructura)' }}>
              Compatibles
            </p>
            <h2 className="text-2xl mb-6 heading-accent" >
              Escritorios que cubren tu rango
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommended.map(([productAsin, product], i) => (
              <FadeIn key={productAsin} delay={i * 100}>
                <ProductCard asin={productAsin} product={product} />
              </FadeIn>
            ))}
          </div>
        </div>
      )}

      {/* Tabla por estatura: la respuesta a «altura de la mesa de escritorio» sin mover nada */}
      <div className="mt-12">
        <div className="divider mb-8" />
        <h2 className="text-2xl mb-3 heading-accent" >
          Altura de la mesa de escritorio por estatura
        </h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)', maxWidth: '65ch' }}>
          Sentado o de pie, la mesa tiene que quedar a la altura de los codos, con
          los brazos relajados y doblados a 90°. La tabla sale de la misma
          aproximación que la calculadora; los últimos centímetros los ajustas tú.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {["Estatura", "Mesa sentado", "Mesa de pie", "Silla"].map((h) => (
                  <th key={h} scope="col" className="text-left py-2 pr-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLA.map((fila) => (
                <tr key={fila.estatura} style={{ borderBottom: '1px solid var(--border)' }}>
                  <th scope="row" className="text-left py-2 pr-4 font-semibold whitespace-nowrap">{fila.estatura} cm</th>
                  <td className="py-2 pr-4 whitespace-nowrap">{fila.alturaSentado} cm</td>
                  <td className="py-2 pr-4 whitespace-nowrap">{fila.alturaDePie} cm</td>
                  <td className="py-2 pr-4 whitespace-nowrap">{fila.alturaSilla} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="text-xl mt-10 mb-3" >
          Lo que dice el INSST
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '65ch' }}>
          La nota técnica{" "}
          <a href="https://www.insst.es/documentacion/colecciones-tecnicas/ntp-notas-tecnicas-de-prevencion/17-serie-ntp-numeros-576-a-610-ano-2001/ntp-602-el-diseno-ergonomico-del-puesto-de-trabajo-con-pantallas-de-visualizacion-el-equipo-de-trabajo-2001" target="_blank" rel="noopener" className="underline">
            NTP 602
          </a>{" "}
          del Instituto Nacional de Seguridad y Salud en el Trabajo recomienda que
          la mesa tenga altura ajustable, con un rango que cubra a casi todos los
          usuarios, del percentil 5 de las mujeres al 95 de los hombres, y una
          superficie de al menos unos 80 × 120 cm. No da una altura fija en
          centímetros: depende de cada persona, y por eso esta calculadora parte
          de tu estatura.
        </p>
      </div>
    </div>
  );
}
