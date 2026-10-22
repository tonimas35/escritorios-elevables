/**
 * Cuadraditos: uno por modelo, coloreados por grupo y en el orden de los
 * grupos, con textura de acuarela. Es la forma de enseñar «6 de 13» de un
 * vistazo, la misma que usan los carruseles (studio/diseno.ts, `cuadros`).
 * Los números salen siempre del catálogo; este componente solo los dibuja.
 */
export type GrupoCuadros = { n: number; color: string; texto: string };

export const PASTEL = {
  azul: "#7FAEEB",
  lavanda: "#AE9CF0",
  verde: "#9FCB86",
  arena: "#E2DCCB",
} as const;

export function Cuadros({
  id,
  grupos,
  columnas = 7,
  lado = 34,
}: {
  /** Distinto en cada uso de la página: da nombre al filtro de acuarela. */
  id: string;
  grupos: GrupoCuadros[];
  columnas?: number;
  lado?: number;
}) {
  const hueco = 6;
  const piezas = grupos.flatMap((g) => Array.from({ length: g.n }, () => g.color));
  const filas = Math.ceil(piezas.length / columnas);
  const ancho = columnas * lado + (columnas - 1) * hueco;
  const alto = filas * lado + (filas - 1) * hueco;
  const filtro = `acuarela-${id}`;
  const resumen = grupos.map((g) => `${g.texto}: ${g.n}`).join(", ");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <svg
        viewBox={`0 0 ${ancho} ${alto}`}
        width={ancho}
        height={alto}
        role="img"
        aria-label={resumen}
        style={{ maxWidth: "100%", height: "auto", display: "block" }}
      >
        <defs>
          <filter id={filtro} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves={2} seed={7} result="ruido" />
            <feDisplacementMap in="SourceGraphic" in2="ruido" scale={3} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        {piezas.map((color, i) => (
          <rect
            key={i}
            x={(i % columnas) * (lado + hueco) + 1}
            y={Math.floor(i / columnas) * (lado + hueco) + 1}
            width={lado - 2}
            height={lado - 2}
            rx={4}
            fill={color}
            filter={`url(#${filtro})`}
          />
        ))}
      </svg>
      <ul style={{ display: "flex", flexDirection: "column", gap: 6, margin: 0, padding: 0, listStyle: "none" }}>
        {grupos.map((g) => (
          <li key={g.texto} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
            <span aria-hidden="true" style={{ flex: "0 0 auto", width: 14, height: 14, borderRadius: 3, background: g.color }} />
            <span>
              {g.texto} <strong style={{ fontVariantNumeric: "tabular-nums" }}>({g.n})</strong>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
