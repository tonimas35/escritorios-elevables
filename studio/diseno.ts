/**
 * El aspecto de los vídeos: el tema «Ficha técnica» de la web (blanco, Inter
 * Tight en titulares, acento azul) en 1080×1920.
 *
 * Zona segura: TikTok e Instagram tapan con su interfaz unos 400 px abajo y
 * los botones de la derecha, así que el contenido va arriba y centrado.
 */
import type { Product } from "../lib/types";

const fuente = (familia: string, peso: number, fichero: string) =>
  `@font-face{font-family:'${familia}';font-weight:${peso};src:url('${new URL(
    `./node_modules/@fontsource/${fichero}`,
    import.meta.url,
  ).href}') format('woff2')}`;

const FUENTES = [
  fuente("Inter", 500, "inter/files/inter-latin-500-normal.woff2"),
  fuente("Inter", 600, "inter/files/inter-latin-600-normal.woff2"),
  fuente("Inter", 700, "inter/files/inter-latin-700-normal.woff2"),
  fuente("Inter Tight", 700, "inter-tight/files/inter-tight-latin-700-normal.woff2"),
  fuente("Inter Tight", 800, "inter-tight/files/inter-tight-latin-800-normal.woff2"),
].join("\n");

export const C = {
  tinta: "#0B0B0C",
  gris: "#4A505B",
  grisClaro: "#C7CAD1",
  superficie: "#F3F4F6",
  superficieOscura: "#23252B",
  borde: "#E6E8EC",
  acento: "#2447D6",
  acentoTinte: "#EEF2FF",
  acentoSobreOscuro: "#7E9BFF",
};

/** Una página de 1080×1920 con las fuentes del tema. */
export function pagina(cuerpo: string, fondo = "#FFFFFF", texto: string = C.tinta): string {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
${FUENTES}
*{box-sizing:border-box}
body{margin:0;width:1080px;height:1920px;overflow:hidden;background:${fondo};color:${texto};font-family:'Inter',sans-serif}
.lienzo{width:1080px;height:1920px;padding:140px 96px 420px;display:flex;flex-direction:column;gap:44px}
.titular{font-family:'Inter Tight',sans-serif;font-weight:800;letter-spacing:-0.025em;margin:0}
.marca{margin:0;font-family:'Inter Tight',sans-serif;font-weight:700;font-size:52px;letter-spacing:-0.02em}
.chip{padding:14px 24px;border-radius:18px;font-size:40px;font-weight:500}
p{margin:0}
</style></head><body>${cuerpo}</body></html>`;
}

export const marca = (punto: string = C.acento) =>
  `<p class="marca">elevable<span style="color:${punto}">.</span></p>`;

/**
 * Ilustración del escritorio: tablero de madera, patas telescópicas y lo que
 * suele ir encima. No es una foto del modelo, es un dibujo genérico que
 * cambia con sus datos: el ancho del tablero, uno o dos monitores según ese
 * ancho, y el marco solo cuando no incluye tablero.
 *
 * No usamos las fotos de Amazon: sus normas de afiliados no permiten
 * descargarlas y usarlas en archivos propios, como un vídeo.
 */
export function dibujo(p: Product, ancho = 600): string {
  const cx = 200;
  const tableroCm = p.incluye_tablero ? p.specs.ancho_tablero_cm : 140;
  const W = Math.round(190 + (Math.min(Math.max(tableroCm, 100), 180) - 100) * 2.2);
  const x0 = cx - W / 2;
  const x1 = cx + W / 2;
  const ty = 128; // borde delantero del tablero
  const marco = "#2B2D33";
  const columna = "#43464F";
  const suelo = 276;

  const pata = (x: number) => `
    <rect x="${x - 9}" y="${ty + 12}" width="18" height="70" rx="3" fill="${marco}"/>
    <rect x="${x - 7}" y="${ty + 80}" width="14" height="${suelo - ty - 92}" rx="3" fill="${columna}"/>
    <rect x="${x - 40}" y="${suelo - 12}" width="80" height="10" rx="5" fill="${marco}"/>`;
  const patas = `${pata(x0 + 34)}${pata(x1 - 34)}
    <rect x="${x0 + 34}" y="${ty + 14}" width="${W - 68}" height="8" rx="3" fill="${marco}"/>`;
  // El encuadre se ajusta al escritorio para que llene el recuadro.
  const vb = `${x0 - 56} 20 ${W + 112} 272`;
  const alto = Math.round((ancho * 272) / (W + 112));
  const sombra = `<ellipse cx="${cx}" cy="${suelo}" rx="${W / 2 + 30}" ry="10" fill="#000" opacity=".08"/>`;

  if (!p.incluye_tablero) {
    // Marco sin tablero: el hueco del tablero, en discontinua.
    const hueco = `<path d="M${x0} ${ty} L${x1} ${ty} L${x1 - 14} ${ty - 22} L${x0 + 14} ${ty - 22} Z" fill="none" stroke="#9AA0AA" stroke-width="3" stroke-dasharray="10 8"/>`;
    return `<svg viewBox="${vb}" width="${ancho}" height="${alto}" aria-hidden="true">${sombra}${patas}${hueco}
      <rect x="${x0 + 34}" y="${ty + 2}" width="${W - 68}" height="10" rx="3" fill="${marco}"/></svg>`;
  }

  const monitor = (mx: number, w: number) => `
    <rect x="${mx - 4}" y="${ty - 34}" width="8" height="22" fill="${marco}"/>
    <rect x="${mx - 22}" y="${ty - 16}" width="44" height="5" rx="2" fill="${marco}"/>
    <rect x="${mx - w / 2}" y="${ty - 34 - w * 0.6}" width="${w}" height="${w * 0.6}" rx="5" fill="#1F2126"/>
    <rect x="${mx - w / 2 + 5}" y="${ty - 29 - w * 0.6}" width="${w - 10}" height="${w * 0.6 - 10}" rx="2" fill="#2E3D6B"/>
    <rect x="${mx - w / 2 + 12}" y="${ty - 20 - w * 0.6}" width="${(w - 24) * 0.6}" height="5" rx="2" fill="#7E9BFF" opacity=".7"/>
    <rect x="${mx - w / 2 + 12}" y="${ty - 11 - w * 0.6}" width="${(w - 24) * 0.4}" height="5" rx="2" fill="#7E9BFF" opacity=".45"/>`;
  const dosMonitores = tableroCm >= 140;
  const encima = dosMonitores ? `${monitor(cx - 46, 84)}${monitor(cx + 46, 84)}` : monitor(cx - 10, 96);
  const planta = `
    <path d="M${x1 - 40} ${ty - 40} q-14 -22 -2 -40 q8 16 2 40 Z" fill="#4C8C5A"/>
    <path d="M${x1 - 38} ${ty - 40} q18 -18 14 -38 q-14 12 -14 38 Z" fill="#5FA36C"/>
    <path d="M${x1 - 50} ${ty - 38} h24 l-3 26 h-18 Z" fill="#E9E1D6"/>`;
  const tablero = `
    <path d="M${x0} ${ty} L${x1} ${ty} L${x1 - 14} ${ty - 22} L${x0 + 14} ${ty - 22} Z" fill="#D9B68C"/>
    <rect x="${x0}" y="${ty}" width="${W}" height="12" rx="2" fill="#B88A5E"/>
    <rect x="${x0 + 46}" y="${ty + 12}" width="30" height="9" rx="2" fill="#1F2126"/>
    <circle cx="${x0 + 70}" cy="${ty + 16.5}" r="2.2" fill="#7E9BFF"/>`;
  return `<svg viewBox="${vb}" width="${ancho}" height="${alto}" aria-hidden="true">${sombra}${patas}${tablero}${encima}${planta}</svg>`;
}

/** Escapa texto que viene del catálogo antes de meterlo en el HTML. */
export const t = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
