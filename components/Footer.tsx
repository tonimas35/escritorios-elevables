import Link from "next/link";
import { getAvailableProducts } from "@/lib/products";
import { firmaMetodologia } from "@/lib/metodologia";

export function Footer() {
  // Solo los disponibles: un modelo retirado sigue en el JSON (METODO.md §6)
  // pero ya no esta "analizado" en la web.
  const total = getAvailableProducts().length;

  return (
    <footer className="footer-editorial">
      <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            {/* La marca del pie es la unica via de vuelta a la home desde el
                final de la pagina. Sin logo dibujado: el nombre es la marca. */}
            <Link href="/" className="inline-block mb-4">
              <span
                style={{
                  fontSize: 'var(--bs-etiqueta)',
                  letterSpacing: 'var(--bs-track-etiqueta)',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: 'white',
                }}
              >
                Elevable
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {firmaMetodologia(total)}
            </p>

          </div>

          <div>
            <h3 className="section-label mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Contenido</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Mejores escritorios 2026", href: "/mejor-escritorio-elevable" },
                { label: "Escritorios baratos", href: "/escritorio-elevable-barato" },
                { label: "Bases elevables", href: "/bases-elevables" },
                { label: "Flexispot EG1", href: "/flexispot-eg1-opiniones" },
                { label: "Flexispot vs Maidesite", href: "/flexispot-vs-maidesite" },
                { label: "SANODESK vs Flexispot", href: "/sanodesk-vs-flexispot" },
                { label: "MAIDeSITe T2 Pro Plus", href: "/maidesite-t2-pro-plus-opiniones" },
                { label: "Fezibo review", href: "/fezibo-opiniones" },
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
            <h3 className="section-label mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Herramientas</h3>
            <ul className="space-y-2.5 mb-8">
              {[
                { label: "Comparador", href: "/comparador" },
                { label: "Calculadora de altura", href: "/calculadora-altura" },
                { label: "Qué escritorio comprar", href: "/que-escritorio-elevable-comprar" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="section-label mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Legal</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/metodologia" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Metodología
                </Link>
              </li>
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
            Participamos en el Programa de Afiliados de Amazon EU. El detalle
            completo está en el aviso legal y en la metodología.
          </p>
        </div>
      </div>
    </footer>
  );
}
