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
    <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: 'rgba(12, 11, 9, 0.88)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <span className="text-xs font-bold" style={{ color: 'var(--bg-primary)', fontFamily: 'var(--font-display)', fontWeight: 900 }}>E</span>
          </div>
          <span className="text-sm tracking-tight" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 500 }}>
            Elevable
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <MobileMenuButton items={NAV_ITEMS} />
      </div>
    </header>
  );
}
