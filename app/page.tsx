import Link from "next/link";
import Image from "next/image";
import { AffiliateButton } from "@/components/AffiliateButton";
import { getAllProducts } from "@/lib/products";

export default function Home() {
  const allProducts = getAllProducts()
    .filter(([, p]) => p.disponible)
    .sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total);

  const totalReviews = allProducts.reduce((sum, [, p]) => sum + p.num_reviews, 0);
  const totalReviewsRounded = Math.floor(totalReviews / 1000) * 1000;

  const budgetPicks = allProducts.filter(([, p]) => p.precio < 135).sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total).slice(0, 3);
  const midPicks = allProducts.filter(([, p]) => p.precio >= 135 && p.precio <= 200).sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total).slice(0, 3);
  const premiumPicks = allProducts.filter(([, p]) => p.precio > 200).sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total).slice(0, 3);

  return (
    <>
      {/* Hero — Conversion focused */}
      <section className="relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.25) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative">
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-4" style={{ color: 'var(--accent)' }}>
              Analisis independiente · Marzo 2026
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl leading-none" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)' }}>
              Los mejores escritorios
              <br />
              <span style={{ color: 'var(--accent)' }}>elevables</span> de 2026
            </h1>
          </div>
          <p className="mt-6 text-base md:text-lg max-w-xl leading-relaxed animate-fade-up stagger-2" style={{ color: 'var(--text-secondary)' }}>
            {allProducts.length} modelos analizados. Desde 110 EUR hasta gama premium.
            Datos reales y opiniones contrastadas de cada modelo.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-up stagger-3">
            <Link href="/mejor-escritorio-elevable" className="btn-primary">
              Ver los {allProducts.length} mejores
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/escritorio-elevable-barato" className="btn-outline">
              Opciones baratas (desde 110€)
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-14 grid grid-cols-3 gap-8 pt-8 animate-fade-up stagger-4" style={{ borderTop: '1px solid var(--border)' }}>
            {[
              { value: String(allProducts.length), label: "Escritorios analizados" },
              { value: `${totalReviewsRounded}+`, label: "Opiniones verificadas" },
              { value: "Mar 2026", label: "Ultima actualizacion" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="mono text-2xl md:text-3xl font-bold" style={{ color: 'var(--accent)' }}>
                  {stat.value}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick comparison table — THE MONEY MAKER */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
            Resumen rapido
          </p>
          <h2 className="text-3xl md:text-4xl mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            Top 7 de un vistazo
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: 'var(--bg-dark)', color: 'var(--text-inverse)' }}>
                <th className="text-left p-3 rounded-tl" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>#</th>
                <th className="text-left p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Modelo</th>
                <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Motor</th>
                <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Carga</th>
                <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Nota</th>
                <th className="text-center p-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Precio</th>
                <th className="text-center p-3 rounded-tr" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}></th>
              </tr>
            </thead>
            <tbody>
              {allProducts.slice(0, 7).map(([asin, product], i) => (
                <tr key={asin} className="transition-colors" style={{ borderBottom: '1px solid var(--border)', background: 'transparent' }} onMouseEnter={undefined}>
                  <td className="p-3">
                    <span className="mono text-xs font-bold" style={{ color: 'var(--accent)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                        <Image src={product.imagen} alt={product.imagen_alt} width={40} height={40} className="object-contain" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{product.marca} {product.modelo}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {product.rating}★ ({product.num_reviews})
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: product.specs.tipo_motor === 'doble' ? 'rgba(46, 139, 62, 0.12)' : 'var(--border)', color: product.specs.tipo_motor === 'doble' ? 'var(--pro)' : 'var(--text-muted)' }}>
                      {product.specs.tipo_motor === 'doble' ? 'Doble' : 'Simple'}
                    </span>
                  </td>
                  <td className="p-3 text-center mono text-sm">{product.specs.peso_max_carga_kg} kg</td>
                  <td className="p-3 text-center">
                    <span className="mono font-bold" style={{ color: product.puntuacion.total >= 8 ? 'var(--pro)' : 'var(--text-primary)' }}>
                      {product.puntuacion.total}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="mono font-bold text-base">{product.precio}€</span>
                    {product.precio_habitual && (
                      <span className="mono text-xs line-through ml-1" style={{ color: 'var(--text-muted)' }}>{product.precio_habitual}€</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <AffiliateButton asin={asin} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <Link href="/mejor-escritorio-elevable" className="text-xs font-semibold uppercase tracking-wider transition-colors" style={{ color: 'var(--accent)' }}>
            Ver analisis completo de los {allProducts.length} modelos →
          </Link>
        </div>
      </section>

      <div className="divider max-w-6xl mx-auto" />

      {/* By budget — HIGH CONVERSION SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
            Por presupuesto
          </p>
          <h2 className="text-3xl md:text-4xl mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            Encuentra el tuyo
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Baratos */}
          <div className="rounded p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="mono text-2xl font-bold" style={{ color: 'var(--accent)' }}>&lt;200€</span>
              <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Baratos</span>
            </div>
            <div className="space-y-3">
              {budgetPicks.map(([asin, product]) => (
                <div key={asin} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="w-10 h-10 rounded flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                    <Image src={product.imagen} alt={product.imagen_alt} width={40} height={40} className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{product.marca} {product.modelo}</p>
                    <p className="mono text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}★ · {product.specs.tipo_motor}</p>
                  </div>
                  <span className="mono font-bold text-sm">{product.precio}€</span>
                </div>
              ))}
            </div>
            <Link href="/escritorio-elevable-barato" className="mt-4 block text-center text-xs font-semibold uppercase tracking-wider py-2 rounded transition-colors" style={{ color: 'var(--accent)', border: '1px solid var(--accent)' }}>
              Ver baratos →
            </Link>
          </div>

          {/* Gama media */}
          <div className="rounded p-6 relative" style={{ background: 'var(--bg-card)', border: '2px solid var(--accent)' }}>
            <span className="absolute -top-3 left-4 text-xs font-bold uppercase tracking-wider px-2 py-0.5" style={{ background: 'var(--accent)', color: 'white' }}>
              Mejor opcion
            </span>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="mono text-2xl font-bold" style={{ color: 'var(--accent)' }}>135–200€</span>
              <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Calidad-precio</span>
            </div>
            <div className="space-y-3">
              {midPicks.map(([asin, product]) => (
                <div key={asin} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="w-10 h-10 rounded flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                    <Image src={product.imagen} alt={product.imagen_alt} width={40} height={40} className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{product.marca} {product.modelo}</p>
                    <p className="mono text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}★ · {product.specs.tipo_motor}</p>
                  </div>
                  <span className="mono font-bold text-sm">{product.precio}€</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <AffiliateButton asin={midPicks[0]?.[0] || ''} text="Ver ganador calidad-precio" size="lg" />
            </div>
          </div>

          {/* Premium */}
          <div className="rounded p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="mono text-2xl font-bold" style={{ color: 'var(--accent)' }}>&gt;200€</span>
              <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Premium doble motor</span>
            </div>
            <div className="space-y-3">
              {premiumPicks.map(([asin, product]) => (
                <div key={asin} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="w-10 h-10 rounded flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                    <Image src={product.imagen} alt={product.imagen_alt} width={40} height={40} className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{product.marca} {product.modelo}</p>
                    <p className="mono text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}★ · {product.specs.tipo_motor}</p>
                  </div>
                  <span className="mono font-bold text-sm">{product.precio}€</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <AffiliateButton asin={premiumPicks[0]?.[0] || ''} text="Ver mejor premium" size="lg" />
            </div>
          </div>
        </div>
      </section>

      <div className="divider max-w-6xl mx-auto" />

      {/* Quick links to content pages */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
            Guias y comparativas
          </p>
          <h2 className="text-3xl md:text-4xl mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            Contenido util
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Escritorios baratos", desc: "Los 6 mejores por menos de 200€", href: "/escritorio-elevable-barato", tag: "Guia" },
            { title: "Flexispot E7: review", desc: "Analisis completo del mas vendido", href: "/flexispot-e7-opiniones", tag: "Review" },
            { title: "Flexispot vs Maidesite", desc: "Comparativa directa marca a marca", href: "/flexispot-vs-maidesite", tag: "Comparativa" },
            { title: "Comparador", desc: "Filtra y compara por specs", href: "/comparador", tag: "Herramienta" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card-lift group p-5 rounded"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--accent)' }}>{item.tag}</span>
              <h3 className="text-base font-semibold mt-1" style={{ fontFamily: 'var(--font-display)' }}>{item.title}</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              <span className="mt-3 block text-xs font-semibold uppercase tracking-wider transition-colors" style={{ color: 'var(--accent)' }}>
                Leer →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
