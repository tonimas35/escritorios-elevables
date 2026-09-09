import Link from "next/link";
import { MobileMenuButton } from "@/components/MobileMenuButton";
import { FECHA } from "@/lib/fecha";

const NAV_ITEMS = [
  { label: "Mejores 2026", href: "/mejor-escritorio-elevable" },
  { label: "Baratos", href: "/escritorio-elevable-barato" },
  { label: "Comparador", href: "/comparador" },
  { label: "Calculadora", href: "/calculadora-altura" },
  { label: "Qué comprar", href: "/que-escritorio-elevable-comprar" },
];

/**
 * Riel de cabecera del sistema Broadsheet.
 *
 * Sustituye a la barra pegajosa con logo en cobre: filete grueso en tinta,
 * fila de identificacion con la fecha unica del sitio, filete fino, y
 * debajo la navegacion. Sin logo dibujado: el nombre en versales es la
 * marca, como en un periodico.
 *
 * Deja de ser sticky a proposito. El riel del diseño se lee una vez, al
 * principio, y no persigue al lector por la pagina.
 */
export function Header() {
  return (
    <header className="bs-cabecera">
      <div className="bs-contenido">
        <p className="bs-riel">
          <span>
            <strong>Elevable</strong> · Análisis independiente
          </span>
          <span>{FECHA}</span>
        </p>

        <div className="bs-nav-fila">
          <nav className="bs-nav">
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
