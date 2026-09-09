import { coma } from "@/lib/format";

/**
 * Nota impresa como cuatro planchas mal registradas sobre el papel.
 * El texto real lo lleva `.papel`, que es lo que leen los lectores de
 * pantalla; las tres planchas son repeticiones decorativas.
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
      <span className="plancha plancha-c" aria-hidden="true">{texto}</span>
      <span className="plancha plancha-m" aria-hidden="true">{texto}</span>
      <span className="plancha plancha-y" aria-hidden="true">{texto}</span>
    </span>
  );
}
