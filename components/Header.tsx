import Link from "next/link";
import { MobileMenuButton } from "@/components/MobileMenuButton";

const NAV_ITEMS = [
  { label: "Mejores 2026", href: "/mejor-escritorio-elevable" },
  { label: "Baratos", href: "/escritorio-elevable-barato" },
  { label: "Comparador", href: "/comparador" },
  { label: "Reviews", href: "/flexispot-e7-opiniones" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: 'rgba(250, 248, 245, 0.9)' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <span className="text-white text-xs font-bold tracking-tight">EE</span>
          </div>
          <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Escritorios Elevables
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-xs font-medium uppercase tracking-widest transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <MobileMenuButton items={NAV_ITEMS} />
      </div>
      <div className="divider" />
    </header>
  );
}
