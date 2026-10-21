/**
 * Plantilla «¿A qué altura debe estar tu mesa?»: la tabla de alturas por
 * estatura de la calculadora de la web (lib/calculator.ts) y si los
 * escritorios del catálogo llegan.
 *
 * La fórmula es una aproximación por proporciones corporales medias, y así
 * se dice en la diapositiva: no se presenta como norma.
 */
import { calculateErgonomicHeight } from "../../lib/calculator.ts";
import { catalogo } from "../catalogo.ts";
import { C, PASTEL, pagina, marca, t, esCarrusel, postura } from "../diseno.ts";
import { portada, cierre, descripcion, AVISO } from "./comun.ts";
import type { Video } from "./franja.ts";

const ESTATURAS = [155, 160, 165, 170, 175, 180, 185, 190, 195];
const metros = (cm: number) => `${Math.floor(cm / 100)},${String(cm % 100).padStart(2, "0")}`;

/**
 * La altura que necesita cada estatura, sentado y de pie, sobre la franja
 * de alturas que cubren los escritorios completos del catálogo: la oscura
 * la cubren todos; la clara, solo algunos.
 */
function grafico(
  filas: { e: number; alturaSentado: number; alturaDePie: number }[],
  minBajo: number,
  minAlto: number,
  maxBajo: number,
  maxAlto: number,
): string {
  const W = 904;
  const H = esCarrusel() ? 560 : 760;
  const izq = 96;
  const abajo = 64;
  const arriba = 20;
  const y0 = 55;
  const y1 = 130;
  const Y = (cm: number) => arriba + ((y1 - cm) / (y1 - y0)) * (H - arriba - abajo);
  const X = (i: number) => izq + 30 + (i * (W - izq - 60)) / (filas.length - 1);
  const banda = (desde: number, hasta: number, color: string, op: number) =>
    `<rect x="${izq}" y="${Y(hasta)}" width="${W - izq}" height="${Y(desde) - Y(hasta)}" fill="${color}" opacity="${op}" filter="url(#acuarela)"/>`;
  const marcas = [60, 70, 80, 90, 100, 110, 120, 130];
  const punto = (x: number, y: number, color: string) =>
    `<rect x="${x - 15}" y="${y - 15}" width="30" height="30" rx="5" fill="${color}" filter="url(#acuarela)"/>`;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true" style="overflow:visible">
    ${banda(minBajo, maxAlto, PASTEL.verde, 0.35)}
    ${banda(minAlto, maxBajo, PASTEL.verde, 0.7)}
    ${marcas
      .map(
        (m) => `<line x1="${izq}" x2="${W}" y1="${Y(m)}" y2="${Y(m)}" stroke="rgba(20,20,19,.18)" stroke-dasharray="6 8"/>
      <text x="${izq - 14}" y="${Y(m) + 9}" text-anchor="end" font-size="26" fill="${C.gris}" font-family="Inter">${m}</text>`,
      )
      .join("")}
    ${filas
      .map(
        (f, i) => `${punto(X(i), Y(f.alturaDePie), PASTEL.azul)}${punto(X(i), Y(f.alturaSentado), PASTEL.lavanda)}
      <text x="${X(i)}" y="${H - abajo + 44}" text-anchor="middle" font-size="26" font-weight="600" fill="${C.tinta}" font-family="Inter">${metros(f.e)}</text>`,
      )
      .join("")}
    <text x="${izq + 16}" y="${Y(maxBajo) + 40}" font-size="26" font-weight="600" fill="#3E6B2C" font-family="Inter">Llegan todos</text>
    <text x="0" y="${Y(130) + 9}" font-size="22" fill="${C.gris}" font-family="Inter">cm</text>
  </svg>
  <div style="display:flex;gap:36px;font-size:30px;font-weight:500">
    <p style="display:flex;align-items:center;gap:12px"><span style="width:30px;height:30px;border-radius:6px;background:${PASTEL.azul}"></span>De pie</p>
    <p style="display:flex;align-items:center;gap:12px"><span style="width:30px;height:30px;border-radius:6px;background:${PASTEL.lavanda}"></span>Sentado</p>
    <p style="display:flex;align-items:center;gap:12px"><span style="width:30px;height:30px;border-radius:6px;background:${PASTEL.verde}"></span>Lo que alcanzan</p>
  </div>`;
}

export function videoAltura(): Video {
  const filas = ESTATURAS.map((e) => ({ e, ...calculateErgonomicHeight(e) }));

  // Lo que hacen los escritorios completos del catálogo, calculado.
  const completos = catalogo.filter((p) => p.incluye_tablero);
  const minimos = completos.map((p) => p.specs.rango_altura_min_cm);
  const maximos = completos.map((p) => p.specs.rango_altura_max_cm);
  const bajaHasta = Math.min(...minimos);
  const bajaHastaMax = Math.max(...minimos);
  const subeTodos = Math.min(...maximos);
  // Hasta qué estatura llegan todos de pie, y desde cuál bajan lo bastante sentado.
  const llegaDePie = Math.max(...ESTATURAS.filter((e) => calculateErgonomicHeight(e).alturaDePie <= subeTodos));
  const bajaSentado = Math.min(...ESTATURAS.filter((e) => calculateErgonomicHeight(e).alturaSentado >= bajaHasta));
  const coma = (n: number) => String(n).replace(".", ",");

  const fotogramas = [
    portada(
      "Ergonomía",
      "¿A qué altura debe estar",
      "tu mesa?",
      "Busca tu estatura: sentado y de pie, en centímetros.",
      `<div style="display:flex;justify-content:center">${postura(esCarrusel() ? 560 : 760)}</div>`,
    ),
    {
      nombre: "como",
      segundos: 4,
      html: pagina(`<div class="lienzo" style="gap:${esCarrusel() ? 22 : 36}px">
  ${marca()}
  <h2 class="titular" style="font-size:${esCarrusel() ? 80 : 96}px;line-height:1.02">La regla: codos a 90°</h2>
  <div style="display:flex;justify-content:center">${postura(esCarrusel() ? 760 : 900)}</div>
  <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px">
  ${[
    ["Codos", "En ángulo recto, a la altura de la mesa."],
    ["Pantalla", "El borde de arriba, a la altura de los ojos."],
    ["Hombros", "Relajados, sin subirlos para teclear."],
    ["Pies", "Planos en el suelo. Si no, reposapiés."],
  ]
    .map(
      ([titulo, texto]) => `<div style="padding:22px 26px;border:3px solid ${C.borde};border-radius:26px;background:#fff">
    <p style="font-family:'Inter Tight',sans-serif;font-weight:800;font-size:36px;color:${C.acento}">${t(titulo)}</p>
    <p style="margin-top:6px;font-size:30px;line-height:1.3;font-weight:500">${t(texto)}</p></div>`,
    )
    .join("")}
  </div>
</div>`),
    },
    {
      nombre: "tabla",
      segundos: 5,
      html: pagina(`<div class="lienzo" style="gap:24px">
  ${marca()}
  <h2 class="titular" style="font-size:80px;line-height:1.02">Busca tu estatura</h2>
  <div style="border:3px solid ${C.borde};border-radius:32px;overflow:hidden">
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));background:${C.superficie};font-size:34px;font-weight:600;color:${C.gris}">
      <p style="padding:20px 32px">Estatura</p><p style="padding:20px 32px;text-align:right">Sentado</p><p style="padding:20px 32px;text-align:right">De pie</p>
    </div>
    ${filas
      .map(
        (f, i) => `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));font-size:44px;${i ? `border-top:2px solid ${C.borde};` : ""}">
      <p style="padding:16px 32px;font-weight:700">${metros(f.e)} m</p>
      <p style="padding:16px 32px;text-align:right">${f.alturaSentado} cm</p>
      <p style="padding:16px 32px;text-align:right;font-weight:700;color:${C.acento}">${f.alturaDePie} cm</p></div>`,
      )
      .join("")}
  </div>
  <p style="font-size:32px;line-height:1.35;color:${C.gris}">Aproximación con proporciones corporales medias. Ajusta hasta tener los codos a 90°.</p>
</div>`),
    },
    {
      nombre: "llega",
      segundos: 5,
      html: pagina(`<div class="lienzo" style="gap:${esCarrusel() ? 24 : 36}px">
  ${marca()}
  <h2 class="titular" style="font-size:${esCarrusel() ? 80 : 96}px;line-height:1.02">¿Llega tu escritorio?</h2>
  ${grafico(filas, bajaHasta, bajaHastaMax, subeTodos, Math.max(...maximos))}
  <div style="display:flex;flex-direction:column;gap:14px">
    <p style="font-size:${esCarrusel() ? 34 : 40}px;line-height:1.3"><strong>De pie:</strong> hasta ${metros(llegaDePie)} m llegan todos los escritorios completos del catálogo.</p>
    <p style="font-size:${esCarrusel() ? 34 : 40}px;line-height:1.3"><strong>Sentado:</strong> por debajo de ${metros(bajaSentado)} m te quedará algo alta. Sube la silla y usa reposapiés.</p>
  </div>
</div>`),
    },
    cierre(
      "Comenta tu",
      "ALTURA",
      "y te digo tus medidas",
      "O calcúlalas al centímetro en la calculadora de la web.",
      "elevable.es/calculadora-altura",
    ),
  ];

  const texto = descripcion([
    "¿A qué altura debe estar tu mesa? Busca tu estatura 👇",
    "",
    ...filas.filter((_, i) => i % 2 === 1).map((f) => `${metros(f.e)} m → sentado ${f.alturaSentado} cm · de pie ${f.alturaDePie} cm`),
    "",
    "La regla: codos a 90°, hombros relajados y el borde de la pantalla a la altura de los ojos.",
    "Comenta tu altura y te digo tus medidas, o calcúlalas en elevable.es/calculadora-altura",
    "",
    AVISO,
    "",
    "#escritorioelevable #ergonomia #teletrabajo #homeoffice #setup #oficinaencasa",
  ]);

  return { slug: "altura", fotogramas, descripcion: texto };
}
