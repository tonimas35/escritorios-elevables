import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                <span className="text-xs font-bold" style={{ color: 'var(--bg-primary)', fontFamily: 'var(--font-display)', fontWeight: 900 }}>E</span>
              </div>
              <span className="text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-primary)' }}>
                Elevable
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Analisis independientes de escritorios elevables.
              Sin contenido patrocinado, sin hype.
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
