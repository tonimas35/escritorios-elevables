import Link from "next/link";
import { MobileMenuButton } from "@/components/MobileMenuButton";

const NAV_ITEMS = [
  { label: "Mejores 2026", href: "/mejor-escritorio-elevable" },
  { label: "Baratos", href: "/escritorio-elevable-barato" },
  { label: "Comparador", href: "/comparador" },
  { label: "Reviews", href: "/mejor-escritorio-elevable" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: 'rgba(250, 248, 246, 0.92)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="4" y="20" width="24" height="3" rx="1.5" fill="#c47a3a" />
            <path d="M16 5L21 12H11L16 5Z" fill="#c47a3a" />
            <rect x="15" y="11" width="2" height="9" rx="1" fill="#c47a3a" />
          </svg>
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
