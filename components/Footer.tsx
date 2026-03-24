import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="4" y="20" width="24" height="3" rx="1.5" fill="#c47a3a" />
                <path d="M16 5L21 12H11L16 5Z" fill="#c47a3a" />
                <rect x="15" y="11" width="2" height="9" rx="1" fill="#c47a3a" />
              </svg>
              <span className="text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-primary)' }}>
                Elevable
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Analisis independientes de escritorios elevables.
              Datos reales y opiniones contrastadas.
            </p>
          </div>

          <div>
            <h3 className="section-label mb-4">Contenido</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Mejores escritorios 2026", href: "/mejor-escritorio-elevable" },
                { label: "Escritorios baratos", href: "/escritorio-elevable-barato" },
                { label: "Flexispot E7 review", href: "/flexispot-e7-opiniones" },
                { label: "Flexispot vs Maidesite", href: "/flexispot-vs-maidesite" },
                { label: "Comparador", href: "/comparador" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-secondary)' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-label mb-4">Legal</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/aviso-legal" className="text-sm transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-secondary)' }}>
                  Aviso legal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Participamos en el Programa de Afiliados de Amazon EU. Los enlaces a Amazon generan
            una comision sin coste adicional para ti. Nuestras recomendaciones son independientes.
            Precios orientativos — consulta Amazon para el precio final.
          </p>
        </div>
      </div>
    </footer>
  );
}
