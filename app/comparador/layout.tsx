import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparador de escritorios elevables — Filtra y compara",
  description:
    "Compara escritorios elevables por precio, motor, carga y altura. Encuentra el modelo perfecto con nuestro comparador interactivo.",
};

export default function ComparadorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
