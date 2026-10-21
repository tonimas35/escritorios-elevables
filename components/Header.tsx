import Link from "next/link";
import { MobileMenuButton } from "@/components/MobileMenuButton";

const NAV_ITEMS = [
  { label: "Mejores 2026", href: "/mejor-escritorio-elevable" },
  { label: "Baratos", href: "/escritorio-elevable-barato" },
  { label: "Comparador", href: "/comparador" },
  { label: "Calculadora", href: "/calculadora-altura" },
  { label: "Qué comprar", href: "/que-escritorio-elevable-comprar" },
];

/**
 * Cabecera del tema «Ficha técnica»: una sola fila, la marca a la izquierda
 * (con el punto en acento) y el menú a la derecha. En móvil, el menú se
 * pliega en MobileMenuButton.
 *
 * La fecha del sitio ya no va en la cabecera: cada página dice cuándo se
 * actualizó junto al titular.
 */
export function Header() {
  return (
    <header className="bs-cabecera">
      <div className="bs-contenido">
        <div className="bs-cabecera-fila">
          <Link href="/" className="bs-marca" aria-label="Elevable, inicio">
            elevable<span aria-hidden="true">.</span>
          </Link>
          <nav className="bs-nav" aria-label="Principal">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <MobileMenuButton items={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
