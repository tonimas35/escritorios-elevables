import { coma } from "@/lib/format";

/**
 * Nota impresa como cuatro planchas mal registradas sobre el papel.
 * El texto real lo lleva `.papel`. Las tres planchas pintan la cifra con
 * `::before` desde `data-cifra`, no como texto: `aria-hidden` las oculta a
 * los lectores de pantalla, pero no a quien extrae el texto de la página
 * (buscadores y asistentes de IA), que leían «01 01 01 01».
 */
export function Cifra({
  valor,
  tamano,
  fondo,
}: {
  valor: number | string;
  tamano: string;
  fondo?: string;
}) {
  const texto = typeof valor === "number" ? coma(valor) : valor;
  return (
    <span
      className="bs-cifra"
      style={{ fontSize: tamano, ...(fondo ? { ["--bs-cifra-fondo" as string]: fondo } : {}) }}
    >
      <span className="papel">{texto}</span>
      <span className="plancha plancha-c" aria-hidden="true" data-cifra={texto} />
      <span className="plancha plancha-m" aria-hidden="true" data-cifra={texto} />
      <span className="plancha plancha-y" aria-hidden="true" data-cifra={texto} />
    </span>
  );
}
