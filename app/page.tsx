import Link from "next/link";
import Image from "next/image";
import { AffiliateButton } from "@/components/AffiliateButton";
import { FadeIn } from "@/components/FadeIn";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { getAllProducts } from "@/lib/products";

export default function Home() {
  const allProducts = getAllProducts()
    .filter(([, p]) => p.disponible)
    .sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total);

  const totalReviews = allProducts.reduce((sum, [, p]) => sum + p.num_reviews, 0);
  const totalReviewsRounded = Math.floor(totalReviews / 1000) * 1000;

  const [topAsin, topProduct] = allProducts[0];

  const budgetPicks = allProducts.filter(([, p]) => p.precio < 135).sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total).slice(0, 3);
  const midPicks = allProducts.filter(([, p]) => p.precio >= 135 && p.precio <= 200).sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total).slice(0, 3);
  const premiumPicks = allProducts.filter(([, p]) => p.precio > 200).sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total).slice(0, 3);

  return (
    <>
      {/* Hero — Editorial split layout with gradient mesh */}
      <section className="relative overflow-hidden hero-mesh" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left: Title + CTA */}
            <div className="flex-1 animate-fade-up">
              <p className="editorial-mark mb-6" style={{ color: 'var(--color-secondary)' }}>
                No. 01 &middot; Marzo 2026 &middot; Analisis independiente
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl leading-none" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)' }}>
                Los mejores escritorios
                <br />
                <span style={{ color: 'var(--accent)' }}>elevables</span> de 2026
              </h1>
              <p className="mt-6 text-base md:text-lg max-w-xl leading-relaxed animate-fade-up stagger-2" style={{ color: 'var(--text-secondary)' }}>
                {allProducts.length} modelos analizados. Desde 80&nbsp;EUR con tablero incluido.
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
                  Opciones baratas (desde 80&euro;)
                </Link>
              </div>
            </div>

            {/* Right: #1 product showcase */}
            <div className="hidden md:block w-[320px] flex-shrink-0 animate-fade-up stagger-3">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full rounded" style={{ background: 'var(--color-secondary)', opacity: 0.06 }} />
                <div className="relative p-6 rounded" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-editorial)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-secondary)' }}>
                    #01 Recomendado
                  </p>
                  <div className="w-full h-[180px] rounded-lg overflow-hidden flex items-center justify-center product-image-container">
                    <Image src={topProduct.imagen} alt={topProduct.imagen_alt} width={180} height={180} className="object-contain p-2" />
                  </div>
                  <h3 className="text-sm font-semibold mt-3" style={{ fontFamily: 'var(--font-display)' }}>
                    {topProduct.marca} {topProduct.modelo}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="mono text-lg font-bold">{topProduct.precio}&euro;</span>
                    <span className="mono font-bold text-xs px-1.5 py-0.5 rounded text-white" style={{ background: 'var(--color-secondary)' }}>
                      {topProduct.puntuacion.total}
                    </span>
                  </div>
                  <div className="mt-3">
                    <AffiliateButton asin={topAsin} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar — with secondary color background */}
          <div className="mt-14 p-6 rounded animate-fade-up stagger-4" style={{ background: 'var(--color-secondary)', color: 'white' }}>
            <div className="grid grid-cols-3 gap-8">
              <FadeIn delay={400}>
                <div>
                  <p className="mono text-2xl md:text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>
                    <AnimatedCounter value={allProducts.length} duration={800} />
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Escritorios analizados</p>
                </div>
              </FadeIn>
              <FadeIn delay={520}>
                <div>
                  <p className="mono text-2xl md:text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>
                    <AnimatedCounter value={totalReviewsRounded} suffix="+" duration={1500} />
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Opiniones verificadas</p>
                </div>
              </FadeIn>
              <FadeIn delay={640}>
                <div>
                  <p className="mono text-2xl md:text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>
                    Mar 2026
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Ultima actualizacion</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Quick comparison table */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <FadeIn>
          <div className="mb-8">
            <p className="editorial-mark" style={{ color: 'var(--color-secondary)' }}>
              No. 02 &middot; Resumen rapido
            </p>
            <h2 className="text-3xl md:text-4xl mt-2 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
              Top 7 de un vistazo
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'var(--color-secondary)', color: 'white' }}>
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
                  <tr key={asin} className="transition-colors" style={{ borderBottom: '1px solid var(--border)', background: 'transparent' }}>
                    <td className="p-3">
                      <span className="mono text-xs font-bold" style={{ color: 'var(--color-secondary)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded flex-shrink-0 overflow-hidden flex items-center justify-center product-image-container">
                          <Image src={product.imagen} alt={product.imagen_alt} width={40} height={40} className="object-contain" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{product.marca} {product.modelo}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {product.rating}&#9733; ({product.num_reviews})
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: product.specs.tipo_motor === 'doble' ? 'var(--color-secondary-subtle)' : 'var(--bg-secondary)', color: product.specs.tipo_motor === 'doble' ? 'var(--color-secondary)' : 'var(--text-muted)' }}>
                        {product.specs.tipo_motor === 'doble' ? 'Doble' : 'Simple'}
                      </span>
                    </td>
                    <td className="p-3 text-center mono text-sm">{product.specs.peso_max_carga_kg} kg</td>
                    <td className="p-3 text-center">
                      <span className="mono font-bold" style={{ color: product.puntuacion.total >= 8.5 ? 'var(--color-secondary)' : 'var(--text-primary)' }}>
                        {product.puntuacion.total}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="mono font-bold text-base">{product.precio}&euro;</span>
                      {product.precio_habitual && (
                        <span className="mono text-xs line-through ml-1" style={{ color: 'var(--text-muted)' }}>{product.precio_habitual}&euro;</span>
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
              Ver analisis completo de los {allProducts.length} modelos &rarr;
            </Link>
          </div>
        </FadeIn>
      </section>

      <div className="editorial-rule max-w-6xl mx-auto" />

      {/* By budget */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <FadeIn>
          <div className="mb-10">
            <p className="editorial-mark" style={{ color: 'var(--color-secondary)' }}>
              No. 03 &middot; Por presupuesto
            </p>
            <h2 className="text-3xl md:text-4xl mt-2 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
              Encuentra el tuyo
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Baratos */}
          <FadeIn delay={0}>
            <div className="rounded p-6 relative product-card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: '2px solid var(--color-secondary)' }}>
              <span className="decorative-number">01</span>
              <div className="relative">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="mono text-2xl font-bold" style={{ color: 'var(--color-secondary)' }}>&lt;135&euro;</span>
                  <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Baratos</span>
                </div>
                <div className="space-y-3">
                  {budgetPicks.map(([asin, product]) => (
                    <div key={asin} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="w-10 h-10 rounded flex-shrink-0 overflow-hidden flex items-center justify-center product-image-container">
                        <Image src={product.imagen} alt={product.imagen_alt} width={40} height={40} className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{product.marca} {product.modelo}</p>
                        <p className="mono text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}&#9733; &middot; {product.specs.tipo_motor}</p>
                      </div>
                      <span className="mono font-bold text-sm">{product.precio}&euro;</span>
                    </div>
                  ))}
                </div>
                <Link href="/escritorio-elevable-barato" className="mt-4 block text-center text-xs font-semibold uppercase tracking-wider py-2 rounded transition-colors" style={{ color: 'var(--color-secondary)', border: '1px solid var(--color-secondary)' }}>
                  Ver baratos &rarr;
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Gama media */}
          <FadeIn delay={120}>
            <div className="rounded p-6 relative product-card-hover" style={{ background: 'var(--bg-card)', border: '2px solid var(--accent)' }}>
              <span className="decorative-number">02</span>
              <span className="absolute -top-3 left-4 text-xs font-bold uppercase tracking-wider px-2 py-0.5" style={{ background: 'var(--accent)', color: 'white' }}>
                Mejor opcion
              </span>
              <div className="relative">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="mono text-2xl font-bold" style={{ color: 'var(--accent)' }}>135&ndash;200&euro;</span>
                  <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Calidad-precio</span>
                </div>
                <div className="space-y-3">
                  {midPicks.map(([asin, product]) => (
                    <div key={asin} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="w-10 h-10 rounded flex-shrink-0 overflow-hidden flex items-center justify-center product-image-container">
                        <Image src={product.imagen} alt={product.imagen_alt} width={40} height={40} className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{product.marca} {product.modelo}</p>
                        <p className="mono text-xs" style={{ color: 'var(--text-muted)' }}>{product.rating}&#9733; &middot; {product.specs.tipo_motor}</p>
                      </div>
                      <span className="mono font-bold text-sm">{product.precio}&euro;</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <AffiliateButton asin={midPicks[0]?.[0] || ''} text="Ver ganador calidad-precio" size="lg" />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Ver todos */}
          <FadeIn delay={240}>
            <Link href="/mejor-escritorio-elevable" className="rounded p-6 relative product-card-hover block" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', textDecoration: 'none' }}>
              <span className="decorative-number">03</span>
              <div className="relative">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="mono text-2xl font-bold" style={{ color: 'var(--color-secondary)' }}>9 modelos</span>
                </div>
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Todas las opciones analizadas con puntuacion, pros, contras y enlace directo a Amazon.
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                  Desde 80€ hasta 160€. Todos en stock y con envio gratis.
                </p>
                <div className="mt-4">
                  <span className="btn-secondary inline-flex items-center gap-2">
                    Ver comparativa completa
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </FadeIn>
        </div>
      </section>

      <div className="editorial-rule max-w-6xl mx-auto" />

      {/* Quick links to content pages */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <FadeIn>
          <div className="mb-8">
            <p className="editorial-mark" style={{ color: 'var(--color-secondary)' }}>
              No. 04 &middot; Guias y comparativas
            </p>
            <h2 className="text-3xl md:text-4xl mt-2 heading-accent" style={{ fontFamily: 'var(--font-display)' }}>
              Contenido util
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Escritorios baratos", desc: "Los mejores por menos de 200\u20AC", href: "/escritorio-elevable-barato", tag: "Guia" },
            { title: "Flexispot E7: review", desc: "Analisis completo del mas vendido", href: "/flexispot-e7-opiniones", tag: "Review" },
            { title: "Flexispot vs Maidesite", desc: "Comparativa directa marca a marca", href: "/flexispot-vs-maidesite", tag: "Comparativa" },
            { title: "Comparador", desc: "Filtra y compara por specs", href: "/comparador", tag: "Herramienta" },
          ].map((item, i) => (
            <FadeIn key={item.href} delay={i * 80}>
              <Link
                href={item.href}
                className="card-lift group p-5 rounded block"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderLeft: '3px solid var(--color-secondary)' }}
              >
                <span className="tag-secondary">{item.tag}</span>
                <h3 className="text-base font-semibold mt-2" style={{ fontFamily: 'var(--font-display)' }}>{item.title}</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                <span className="mt-3 block text-xs font-semibold uppercase tracking-wider transition-colors" style={{ color: 'var(--accent)' }}>
                  Leer &rarr;
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
