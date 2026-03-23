import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de altura de escritorio — Altura ideal segun tu estatura",
  description:
    "Calcula la altura ideal de tu escritorio elevable segun tu estatura. Basado en la norma ergonomica EN 527-1.",
};

export default function CalculadoraLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
