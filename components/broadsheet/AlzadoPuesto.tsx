/**
 * Alzado acotado del puesto, de perfil y sin persona: el escritorio de pie
 * (sólido), la altura sentado (en discontinua), la silla y la pantalla, con
 * una regla y las tres alturas que importan. Es el mismo dibujo que los
 * carruseles de Instagram y TikTok (studio/diseno.ts, `alzado`), aquí con las
 * cifras de la calculadora, así que cambia al mover la estatura.
 */
const SUELO = 490;
const K = 2.75; // px por cm
const Y = (cm: number) => SUELO - cm * K;
const REGLA = 150;
const TINTA = "#2B2D33";
const ACENTO = "#2447D6";
const GRIS = "#5F6570";

function Cota({ cm, rotulo, hasta }: { cm: number; rotulo: string; hasta: number }) {
  return (
    <g>
      <line x1={REGLA} x2={hasta} y1={Y(cm)} y2={Y(cm)} stroke={ACENTO} strokeWidth={2.5} strokeDasharray="7 6" />
      <circle cx={REGLA} cy={Y(cm)} r={6} fill={ACENTO} />
      <text x={REGLA - 16} y={Y(cm) + 4} textAnchor="end" fontSize={31} fontWeight={800} fill="#0B0B0C" fontFamily="var(--bs-familia-titulo)">
        {cm} cm
      </text>
      <text x={REGLA - 16} y={Y(cm) + 30} textAnchor="end" fontSize={19} fontWeight={500} fill={GRIS} fontFamily="var(--bs-familia)">
        {rotulo}
      </text>
    </g>
  );
}
function Pieza({ x, y, texto, anchor = "start" }: { x: number; y: number; texto: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={20} fontWeight={500} fill={GRIS} fontFamily="var(--bs-familia)">
      ({texto})
    </text>
  );
}

export function AlzadoPuesto({
  sentado,
  dePie,
  pantalla,
  silla,
}: {
  sentado: number;
  dePie: number;
  pantalla: number;
  silla: number;
}) {
  const x0 = 300;
  const x1 = 568;
  const monAlto = 30 * K;
  const monX = 400;
  const ticks = Array.from({ length: 17 }, (_, i) => i * 10);

  return (
    <svg
      viewBox="0 0 600 520"
      width="100%"
      role="img"
      aria-label={`Puesto de trabajo acotado: mesa a ${sentado} cm sentado y a ${dePie} cm de pie, borde de arriba de la pantalla a ${pantalla} cm, a la altura de los ojos, y silla a ${silla} cm.`}
      style={{ maxWidth: 640, overflow: "visible", display: "block" }}
    >
      <defs>
        <filter id="alzado-acuarela" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={3} seed={7} result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale={7} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      {/* Regla y suelo */}
      <line x1={REGLA} x2={REGLA} y1={SUELO} y2={Y(165)} stroke={TINTA} strokeWidth={2.5} />
      {ticks.map((cm) => (
        <line key={cm} x1={REGLA} x2={REGLA + (cm % 50 ? 8 : 16)} y1={Y(cm)} y2={Y(cm)} stroke={TINTA} strokeWidth={2} />
      ))}
      <line x1={REGLA} x2={596} y1={SUELO} y2={SUELO} stroke={TINTA} strokeWidth={3} />

      {/* Silla */}
      <rect x={200} y={Y(silla)} width={78} height={11} rx={5} fill="#AE9CF0" filter="url(#alzado-acuarela)" />
      <rect x={198} y={Y(silla + 40)} width={11} height={40 * K} rx={5} fill="#AE9CF0" filter="url(#alzado-acuarela)" />
      <line x1={240} x2={240} y1={Y(silla) + 11} y2={SUELO - 8} stroke={TINTA} strokeWidth={6} />
      <line x1={208} x2={272} y1={SUELO - 5} y2={SUELO - 5} stroke={TINTA} strokeWidth={6} strokeLinecap="round" />
      <Pieza x={232} y={Y(silla) + 40} texto="silla" anchor="end" />

      {/* Sentado, en discontinua */}
      <rect x={x0} y={Y(sentado)} width={x1 - x0} height={12} rx={3} fill="none" stroke={TINTA} strokeWidth={2.5} strokeDasharray="9 7" />
      <Pieza x={(x0 + x1) / 2} y={Y(sentado) + 40} texto="sentado" anchor="middle" />

      {/* De pie */}
      {[x0 + 30, x1 - 50].map((x) => (
        <g key={x}>
          <rect x={x} y={Y(dePie) + 12} width={20} height={(dePie - 60) * K} rx={3} fill={TINTA} />
          <rect x={x + 3} y={Y(60)} width={14} height={60 * K - 10} rx={3} fill="#55596A" />
        </g>
      ))}
      <rect x={x0 + 4} y={SUELO - 12} width={72} height={10} rx={5} fill={TINTA} />
      <rect x={x1 - 76} y={SUELO - 12} width={72} height={10} rx={5} fill={TINTA} />
      <rect x={x0} y={Y(dePie)} width={x1 - x0} height={14} rx={3} fill="#D9B68C" filter="url(#alzado-acuarela)" />
      <Pieza x={x0 + 64} y={Y(dePie) + 44} texto="columna" />

      {/* Pantalla: el borde de arriba, a la altura de los ojos */}
      <rect x={monX + 70} y={Y(pantalla) + monAlto} width={10} height={Math.max(0, Y(dePie) - Y(pantalla) - monAlto)} fill={TINTA} />
      <rect x={monX + 40} y={Y(dePie) - 6} width={70} height={6} rx={3} fill={TINTA} />
      <rect x={monX} y={Y(pantalla)} width={150} height={monAlto} rx={6} fill="#7FAEEB" filter="url(#alzado-acuarela)" />
      <Pieza x={monX + 75} y={Y(pantalla) - 14} texto="pantalla" anchor="middle" />
      <Pieza x={x0 + 4} y={Y(dePie) - 12} texto="tablero" />

      <Cota cm={pantalla} rotulo="altura de los ojos" hasta={monX} />
      <Cota cm={dePie} rotulo="de pie" hasta={x0} />
      <Cota cm={sentado} rotulo="sentado" hasta={x0} />
    </svg>
  );
}
