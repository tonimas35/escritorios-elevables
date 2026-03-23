"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileMenuButtonProps {
  items: { label: string; href: string }[];
}

export function MobileMenuButton({ items }: MobileMenuButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 text-gray-600"
        aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
        aria-expanded={menuOpen}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {menuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {menuOpen && (
        <nav className="absolute top-16 left-0 right-0 md:hidden border-t border-gray-200 bg-white shadow-lg">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
