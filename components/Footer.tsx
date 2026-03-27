import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer-editorial">
      {/* Thin editorial rule at top */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(196, 122, 58, 0.4), transparent)' }} />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="4" y="20" width="24" height="3" rx="1.5" fill="#c47a3a" />
                <path d="M16 5L21 12H11L16 5Z" fill="rgba(255,255,255,0.5)" />
                <rect x="15" y="11" width="2" height="9" rx="1" fill="#c47a3a" />
              </svg>
              <span className="text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'white' }}>
                Elevable
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Analisis independientes de escritorios elevables.
              Datos reales y opiniones contrastadas.
            </p>
            <p className="mt-4 editorial-mark" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Est. 2025 &middot; Madrid
            </p>
          </div>

          <div>
            <h3 className="section-label mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Contenido</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Mejores escritorios 2026", href: "/mejor-escritorio-elevable" },
                { label: "Escritorios baratos", href: "/escritorio-elevable-barato" },
                { label: "Flexispot E7 review", href: "/flexispot-e7-opiniones" },
                { label: "Flexispot vs Maidesite", href: "/flexispot-vs-maidesite" },
                { label: "Comparador", href: "/comparador" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-label mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Legal</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/aviso-legal" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Aviso legal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Editorial rule */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

        <div className="pt-8">
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Participamos en el Programa de Afiliados de Amazon EU. Los enlaces a Amazon generan
            una comision sin coste adicional para ti. Nuestras recomendaciones son independientes.
            Precios orientativos — consulta Amazon para el precio final.
          </p>
        </div>
      </div>
    </footer>
  );
}
