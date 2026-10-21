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
 * Ilustración de línea del escritorio. No usamos las fotos de Amazon: sus
 * condiciones limitan dónde se pueden usar las imágenes de producto.
 */
export function dibujo(p: Product, ancho = 520): string {
  const alto = Math.round(ancho * 0.7);
  const trazo = `fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"`;
  let dentro: string;
  if (!p.incluye_tablero) {
    // Marco sin tablero: el travesaño y las patas.
    dentro = `<path d="M30 46h140M60 46v74M140 46v74M44 120h32M124 120h32M60 84h80"/>`;
  } else if (p.specs.ancho_tablero_cm >= 140) {
    dentro = `<rect x="20" y="52" width="160" height="10" rx="3"/><path d="M52 62v58M148 62v58M36 120h32M132 120h32"/><rect x="62" y="20" width="36" height="28" rx="3"/><rect x="104" y="20" width="36" height="28" rx="3"/>`;
  } else {
    dentro = `<rect x="30" y="52" width="140" height="10" rx="3"/><path d="M60 62v58M140 62v58M44 120h32M124 120h32"/><rect x="82" y="22" width="44" height="26" rx="3"/><path d="M104 48v4"/>`;
  }
  return `<svg viewBox="0 0 200 140" width="${ancho}" height="${alto}" aria-hidden="true" ${trazo}>${dentro}</svg>`;
}

/** Escapa texto que viene del catálogo antes de meterlo en el HTML. */
export const t = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
