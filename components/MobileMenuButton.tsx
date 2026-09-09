"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileMenuButtonProps {
  items: { label: string; href: string }[];
}

/** Menu de la cabecera por debajo del punto de corte de 700px. */
export function MobileMenuButton({ items }: MobileMenuButtonProps) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="bs-menu">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="bs-menu-boton"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={abierto}
      >
        {abierto ? "Cerrar" : "Menú"}
      </button>

      {abierto && (
        <nav className="bs-menu-panel">
          {items.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setAbierto(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
