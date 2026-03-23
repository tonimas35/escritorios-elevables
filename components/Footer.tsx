import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: 'var(--bg-dark)', color: 'var(--text-inverse)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                <span className="text-white text-xs font-bold">EE</span>
              </div>
              <span className="text-sm font-semibold tracking-tight">
                Escritorios Elevables
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#888' }}>
              Analisis independientes basados en datos reales.
              Sin contenido patrocinado, sin hype.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
              Contenido
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Mejores escritorios 2026", href: "/mejor-escritorio-elevable" },
                { label: "Escritorios baratos", href: "/escritorio-elevable-barato" },
                { label: "Flexispot E7 review", href: "/flexispot-e7-opiniones" },
                { label: "Flexispot vs Maidesite", href: "/flexispot-vs-maidesite" },
                { label: "Comparador", href: "/comparador" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm transition-colors" style={{ color: '#888' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/aviso-legal" className="text-sm" style={{ color: '#888' }}>
                  Aviso legal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8" style={{ borderTop: '1px solid #222' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#555' }}>
            Participamos en el Programa de Afiliados de Amazon EU. Los enlaces a Amazon generan
            una comision sin coste adicional para ti. Nuestras recomendaciones son independientes.
            Precios orientativos — consulta Amazon para el precio final.
          </p>
        </div>
      </div>
    </footer>
  );
}
