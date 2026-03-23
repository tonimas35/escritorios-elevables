import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test: que escritorio elevable necesitas? — 5 preguntas",
  description:
    "Responde 5 preguntas y te recomendamos el escritorio elevable perfecto para ti. Sin registro, resultado inmediato.",
};

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
