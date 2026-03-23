import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { AffiliateButton } from "@/components/AffiliateButton";
import { ProsConsBox } from "@/components/ProsConsBox";
import { RatingBar } from "@/components/RatingBar";

export const metadata: Metadata = {
  title: "Mejores escritorios elevables baratos 2026 (desde 110€)",
  description:
    "Los 6 mejores escritorios elevables baratos en Amazon. Comparativa actualizada con precios desde 110 EUR. Analizamos calidad, motor, estabilidad y relacion calidad-precio.",
};

const RATING_LABELS: Record<string, string> = {
  calidad_construccion: "Calidad de construccion",
  estabilidad: "Estabilidad",
  facilidad_montaje: "Facilidad de montaje",
  relacion_calidad_precio: "Relacion calidad-precio",
  funcionalidades: "Funcionalidades",
};

export default function EscritorioBaratoPage() {
  const cheapProducts = getAllProducts()
    .filter(([, p]) => p.disponible && p.precio < 220)
    .sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total);

  const winner = cheapProducts[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Inicio</Link>
        {" "}&gt;{" "}Escritorios elevables baratos
      </nav>

      <h1 className="text-3xl md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
        Mejores escritorios elevables <span style={{ color: 'var(--accent)' }}>baratos</span> 2026
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        Actualizado: marzo 2026 · {cheapProducts.length} modelos analizados por debajo de 220 EUR
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        Este articulo contiene enlaces de afiliado. Si compras a traves de ellos, recibimos una pequena comision sin coste adicional para ti.
      </p>

      {/* Winner callout */}
      {winner && (
        <div className="mt-8 p-6 rounded" style={{ background: 'var(--accent-light)', border: '2px solid var(--accent)' }}>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: 'white' }}>
              <Image src={winner[1].imagen} alt={winner[1].imagen_alt} width={96} height={96} className="object-contain" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Ganador calidad-precio</p>
              <h2 className="text-xl font-semibold mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                {winner[1].nombre}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{winner[1].veredicto}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="mono text-2xl font-bold">{winner[1].precio}€</span>
                <span className="mono font-bold px-2 py-0.5 rounded text-sm" style={{ background: 'var(--pro)', color: 'white' }}>
                  {winner[1].puntuacion.total}/10
                </span>
                <AffiliateButton asin={winner[0]} size="sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick comparison table */}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: 'var(--bg-dark)', color: 'var(--text-inverse)' }}>
              <th className="text-left p-3 rounded-tl" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>#</th>
              <th className="text-left p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Modelo</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Tablero</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Carga</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Anticolision</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Nota</th>
              <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Precio</th>
              <th className="text-center p-3 rounded-tr" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}></th>
            </tr>
          </thead>
          <tbody>
            {cheapProducts.map(([asin, product], i) => (
              <tr key={asin} className="transition-colors hover:bg-[var(--accent-light)]" style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="p-3">
                  <span className="mono text-xs font-bold" style={{ color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                      <Image src={product.imagen} alt={product.imagen_alt} width={32} height={32} className="object-contain" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{product.marca} {product.modelo}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}★ ({product.num_reviews})</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-center mono text-sm">{product.specs.ancho_tablero_cm}x{product.specs.profundidad_tablero_cm}</td>
                <td className="p-3 text-center mono text-sm">{product.specs.peso_max_carga_kg} kg</td>
                <td className="p-3 text-center text-sm">{product.specs.sistema_anticolision ? '✓' : '✗'}</td>
                <td className="p-3 text-center mono font-bold">{product.puntuacion.total}</td>
                <td className="p-3 text-center mono font-bold">{product.precio}€</td>
                <td className="p-3 text-center">
                  <AffiliateButton asin={asin} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Intro text for SEO */}
      <div className="mt-12 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Como elegir un escritorio elevable barato
        </h2>
        <p className="leading-relaxed">
          Un escritorio elevable barato no tiene por que ser malo. La clave esta en saber que sacrificas: los modelos por
          debajo de 200 EUR suelen tener motor simple (mas lento), menos carga maxima y tableros mas pequenos. Pero si tu
          setup es un portatil y un monitor, cualquiera de esta lista te servira perfectamente.
        </p>
        <p className="mt-4 leading-relaxed">
          Lo mas importante en un escritorio barato: que tenga <strong>memorias de altura</strong> (para no ajustar cada vez),
          un <strong>tablero de al menos 120 cm</strong> si usas monitor externo, y si puedes, <strong>sistema anticolision</strong>.
          La garantia tambien importa: algunos ofrecen 5 anos incluso en gama baja.
        </p>
      </div>

      {/* Detailed analysis of each product */}
      <div className="mt-12 space-y-16">
        {cheapProducts.map(([asin, product], i) => (
          <section key={asin} id={product.slug}>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="mono text-sm font-bold" style={{ color: 'var(--accent)' }}>#{String(i + 1).padStart(2, '0')}</span>
              <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
                {product.nombre}
              </h2>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{product.veredicto}</p>

            <div className="mt-4 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-48 rounded overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                <Image src={product.imagen} alt={product.imagen_alt} width={180} height={180} className="object-contain p-2" />
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Precio", value: `${product.precio}€` },
                    { label: "Motor", value: product.specs.tipo_motor === 'doble' ? 'Doble' : 'Simple' },
                    { label: "Carga max", value: `${product.specs.peso_max_carga_kg} kg` },
                    { label: "Tablero", value: `${product.specs.ancho_tablero_cm}x${product.specs.profundidad_tablero_cm} cm` },
                  ].map((spec) => (
                    <div key={spec.label} className="p-2 rounded" style={{ background: 'var(--bg-secondary)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{spec.label}</p>
                      <p className="mono text-sm font-semibold">{spec.value}</p>
                    </div>
                  ))}
                </div>
                <ProsConsBox pros={product.pros} cons={product.contras} />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {Object.entries(product.puntuacion)
                .filter(([key]) => key !== "total")
                .map(([key, value]) => (
                  <RatingBar key={key} label={RATING_LABELS[key] || key} value={value as number} />
                ))}
              <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <RatingBar label="TOTAL" value={product.puntuacion.total} />
              </div>
            </div>

            <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong>Ideal para:</strong> {product.ideal_para}
            </p>

            <div className="mt-4">
              <AffiliateButton asin={asin} showPrice={product.precio} size="lg" />
            </div>
          </section>
        ))}
      </div>

      {/* FAQ for SEO */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Preguntas frecuentes
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "Cual es el escritorio elevable mas barato que merece la pena?",
              a: `El ${winner?.[1].marca} ${winner?.[1].modelo} por ${winner?.[1].precio} EUR es nuestra recomendacion. Ofrece la mejor relacion entre precio, funcionalidades y opiniones de usuarios.`,
            },
            {
              q: "Motor simple o doble para un escritorio barato?",
              a: "Los escritorios baratos suelen tener motor simple. Es mas lento (2.5 cm/s vs 3.8 cm/s) y soporta menos peso, pero para un setup basico es mas que suficiente. Si necesitas doble motor por debajo de 300 EUR, mira el Maidesite T2 Pro Plus.",
            },
            {
              q: "Cuanto dura un escritorio elevable barato?",
              a: "Con uso normal, entre 3 y 5 anos. La garantia varia de 2 a 5 anos segun el modelo. Los de Flexispot y Maidesite ofrecen 5 anos incluso en gama de entrada.",
            },
            {
              q: "Necesito herramientas especiales para montarlo?",
              a: "No. Todos los modelos incluyen las herramientas necesarias. El montaje suele llevar entre 20 y 45 minutos. Los mas pesados (>22 kg) es recomendable montarlos entre dos personas.",
            },
          ].map((faq) => (
            <div key={faq.q}>
              <h3 className="text-base font-semibold">{faq.q}</h3>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
