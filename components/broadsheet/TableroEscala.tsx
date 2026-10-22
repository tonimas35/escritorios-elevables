/**
 * El tablero del modelo visto desde arriba, a escala, con lo que cabe
 * encima. La escala es la misma en todas las fichas (4 px por cm, sobre un
 * lienzo de 180 × 80 cm), así que un 100 cm se ve más pequeño que un 160.
 *
 * Lo de encima no es dato del modelo, es una referencia fija: un monitor
 * de 24" (unos 54 cm de ancho), un teclado de 44 cm y un portátil de 32 cm.
 * Qué se dibuja sigue la misma regla que los carruseles: por debajo de
 * 120 cm, portátil; de 120 a 139, un monitor; de 140 en adelante, dos.
 */
const S = 4; // px por cm
const MARGEN_IZQ = 70;
const MARGEN_SUP = 56;
const W = 180 * S + MARGEN_IZQ + 20;
const H = 80 * S + MARGEN_SUP + 40;
const TINTA = "#2B2D33";
const GRIS = "#5F6570";

function Rotulo({ x, y, texto }: { x: number; y: number; texto: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={20} fontWeight={500} fill={GRIS} fontFamily="var(--bs-familia)">
      ({texto})
    </text>
  );
}

export function TableroEscala({ ancho, fondo }: { ancho: number; fondo: number }) {
  const x0 = MARGEN_IZQ;
  const y0 = MARGEN_SUP;
  const w = ancho * S;
  const h = fondo * S;
  const cx = x0 + w / 2;
  const monitores = ancho >= 140 ? 2 : ancho >= 120 ? 1 : 0;

  const monitor = (x: number) => (
    <g key={x}>
      <rect x={x - 27 * S} y={y0 + 6 * S} width={54 * S} height={4 * S} rx={6} fill="#7FAEEB" filter="url(#tablero-acuarela)" />
      <rect x={x - 11 * S} y={y0 + 10 * S} width={22 * S} height={9 * S} rx={6} fill={TINTA} opacity={0.75} />
    </g>
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label={`Tablero de ${ancho} × ${fondo} cm visto desde arriba, a escala, con ${
        monitores === 0 ? "un portátil" : monitores === 1 ? "un monitor y un teclado" : "dos monitores y un teclado"
      } como referencia.`}
      style={{ maxWidth: 760, display: "block", overflow: "visible" }}
    >
      <defs>
        <filter id="tablero-acuarela" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={3} seed={7} result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale={6} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* El hueco del tablero más grande, para comparar */}
      <rect x={x0} y={y0} width={180 * S} height={80 * S} rx={6} fill="none" stroke="#C7CAD1" strokeWidth={2} strokeDasharray="8 8" />

      {/* El tablero del modelo */}
      <rect x={x0} y={y0} width={w} height={h} rx={8} fill="#D9B68C" filter="url(#tablero-acuarela)" />

      {/* Lo de encima */}
      {monitores === 2 && [cx - 28 * S, cx + 28 * S].map(monitor)}
      {monitores === 1 && monitor(cx)}
      {monitores > 0 && (
        <>
          <rect x={cx - 22 * S} y={y0 + h - 22 * S} width={44 * S} height={13 * S} rx={6} fill="#AE9CF0" filter="url(#tablero-acuarela)" />
          <Rotulo x={cx} y={y0 + h - 22 * S - 10} texto="teclado" />
          <Rotulo x={cx} y={y0 + 19 * S + 24} texto={monitores === 2 ? "dos monitores de 24″" : "monitor de 24″"} />
        </>
      )}
      {monitores === 0 && (
        <>
          <rect x={cx - 16 * S} y={y0 + h / 2 - 11 * S} width={32 * S} height={22 * S} rx={8} fill="#AE9CF0" filter="url(#tablero-acuarela)" />
          <Rotulo x={cx} y={y0 + h / 2 - 11 * S - 10} texto="portátil" />
        </>
      )}

      {/* Cotas */}
      <line x1={x0} x2={x0 + w} y1={y0 - 26} y2={y0 - 26} stroke={TINTA} strokeWidth={2} />
      <line x1={x0} x2={x0} y1={y0 - 34} y2={y0 - 18} stroke={TINTA} strokeWidth={2} />
      <line x1={x0 + w} x2={x0 + w} y1={y0 - 34} y2={y0 - 18} stroke={TINTA} strokeWidth={2} />
      <text x={x0 + w / 2} y={y0 - 36} textAnchor="middle" fontSize={28} fontWeight={800} fill="#0B0B0C" fontFamily="var(--bs-familia-titulo)">
        {ancho} cm
      </text>
      <line x1={x0 - 26} x2={x0 - 26} y1={y0} y2={y0 + h} stroke={TINTA} strokeWidth={2} />
      <line x1={x0 - 34} x2={x0 - 18} y1={y0} y2={y0} stroke={TINTA} strokeWidth={2} />
      <line x1={x0 - 34} x2={x0 - 18} y1={y0 + h} y2={y0 + h} stroke={TINTA} strokeWidth={2} />
      <text
        x={x0 - 36}
        y={y0 + h / 2}
        textAnchor="middle"
        fontSize={24}
        fontWeight={800}
        fill="#0B0B0C"
        fontFamily="var(--bs-familia-titulo)"
        transform={`rotate(-90 ${x0 - 36} ${y0 + h / 2})`}
      >
        {fondo} cm
      </text>
      {ancho < 180 && <Rotulo x={x0 + 180 * S - 70} y={y0 + 80 * S + 28} texto="180 × 80 cm" />}
    </svg>
  );
}
