/**
 * El aspecto de los vídeos: el tema «Ficha técnica» de la web (blanco, Inter
 * Tight en titulares, acento azul) en 1080×1920.
 *
 * Zona segura: TikTok e Instagram tapan con su interfaz unos 400 px abajo y
 * los botones de la derecha, así que el contenido va arriba y centrado.
 */
import { existsSync } from "node:fs";
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
  papel: "#FAF8F3",
};

/**
 * Colores para los datos: tonos suaves que se distinguen también por la
 * luminosidad, no solo por el tono.
 */
export const PASTEL = {
  azul: "#7FAEEB",
  lavanda: "#AE9CF0",
  rosa: "#EFA2BF",
  verde: "#9FCB86",
  arena: "#E2DCCB",
};

/**
 * Dos formatos con el mismo contenido: el vídeo vertical (1080×1920, con la
 * franja de abajo libre para la interfaz de TikTok e Instagram) y el
 * carrusel de fotos (1080×1350, el 4:5 que Instagram enseña más grande en
 * el feed).
 */
export type Formato = "video" | "carrusel";
let formato: Formato = "video";
export function usarFormato(f: Formato) {
  formato = f;
}
export const esCarrusel = () => formato === "carrusel";
export const medidas = () =>
  formato === "video"
    ? { alto: 1920, relleno: "140px 96px 420px", hueco: 44, imgModelo: 560, dibModelo: 600, imgPortada: 460, dibPortada: 480, aire: 60, chip: 40 }
    : { alto: 1350, relleno: "72px 88px 72px", hueco: 22, imgModelo: 330, dibModelo: 400, imgPortada: 400, dibPortada: 420, aire: 0, chip: 34 };

/** Una página del formato en uso, con las fuentes del tema. */
export function pagina(cuerpo: string, fondo: string = C.papel, texto: string = C.tinta): string {
  const m = medidas();
  // Papel cuadriculado: el fondo claro lleva una retícula fina.
  const reticula =
    fondo === C.papel
      ? "background-image:linear-gradient(rgba(20,20,19,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(20,20,19,.055) 1px,transparent 1px);background-size:40px 40px;background-position:-1px -1px;"
      : "";
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
${FUENTES}
*{box-sizing:border-box}
body{margin:0;width:1080px;height:${m.alto}px;overflow:hidden;background-color:${fondo};${reticula}color:${texto};font-family:'Inter',sans-serif}
.lienzo{width:1080px;height:${m.alto}px;padding:${m.relleno};display:flex;flex-direction:column;gap:${m.hueco}px}
.titular{font-family:'Inter Tight',sans-serif;font-weight:800;letter-spacing:-0.025em;margin:0}
.marca{margin:0;font-family:'Inter Tight',sans-serif;font-weight:700;font-size:52px;letter-spacing:-0.02em}
.chip{padding:12px 22px;border-radius:18px;font-size:${m.chip}px;font-weight:500}
p{margin:0}
</style></head><body>${ACUARELA}${cuerpo}</body></html>`;
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

/**
 * La foto del modelo, si hay una en studio/fotos/<slug>.(jpg|jpeg|png|webp).
 * Esa carpeta no se sube al repo (es público y las fotos son de cada
 * fabricante): vive solo en el ordenador donde se generan los vídeos.
 */
function foto(p: Product): string | null {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const ruta = new URL(`./fotos/${p.slug}.${ext}`, import.meta.url);
    if (existsSync(ruta)) return ruta.href;
  }
  return null;
}

/**
 * La imagen del recuadro: la foto del modelo si la hay y, si no, la
 * ilustración. multiply funde el fondo blanco de la foto con el gris del
 * recuadro, como en la web.
 */
export function imagen(p: Product, ancho: number): string {
  const f = foto(p);
  if (!f) return dibujo(p, ancho);
  return `<img src="${f}" alt="" style="width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply;padding:28px">`;
}

/**
 * Textura de acuarela para las piezas de color: un ruido que deforma un poco
 * el borde y otro que mancha el relleno. Va una vez por página.
 */
export const ACUARELA = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <filter id="acuarela" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="ruido"/>
    <feDisplacementMap in="SourceGraphic" in2="ruido" scale="7" xChannelSelector="R" yChannelSelector="G" result="borde"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="grano"/>
    <feColorMatrix in="grano" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -0.9 0.75" result="grano2"/>
    <feComposite in="grano2" in2="borde" operator="in" result="manchas"/>
    <feBlend in="borde" in2="manchas" mode="screen"/>
  </filter></defs></svg>`;

/**
 * Cuadraditos: uno por modelo, coloreados por grupo, en el orden de los
 * grupos. Es la forma de enseñar «7 de 13» de un vistazo.
 */
export function cuadros(grupos: { n: number; color: string }[], columnas = 7, lado = 104): string {
  const hueco = 14;
  const piezas = grupos.flatMap((g) => Array.from({ length: g.n }, () => g.color));
  const filas = Math.ceil(piezas.length / columnas);
  const ancho = columnas * lado + (columnas - 1) * hueco;
  const alto = filas * lado + (filas - 1) * hueco;
  return `<svg width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}" aria-hidden="true">${piezas
    .map((color, i) => {
      const x = (i % columnas) * (lado + hueco);
      const y = Math.floor(i / columnas) * (lado + hueco);
      return `<rect x="${x + 3}" y="${y + 3}" width="${lado - 6}" height="${lado - 6}" rx="6" fill="${color}" filter="url(#acuarela)"/>`;
    })
    .join("")}</svg>`;
}

/** Leyenda de los cuadraditos: muestra de color y texto. */
export const leyenda = (items: { color: string; texto: string }[]) =>
  `<div style="display:flex;flex-direction:column;gap:14px">${items
    .map(
      (i) => `<p style="display:flex;align-items:center;gap:18px;font-size:38px;font-weight:500"><span style="flex:0 0 auto;width:40px;height:40px;border-radius:8px;background:${i.color}"></span>${t(i.texto)}</p>`,
    )
    .join("")}</div>`;

/**
 * Persona sentada a la mesa, de perfil: codos y rodillas a 90°, pies en el
 * suelo y el borde de la pantalla a la altura de los ojos. Es un esquema,
 * no un retrato.
 */
export function postura(ancho = 900): string {
  const alto = Math.round((ancho * 300) / 420);
  const linea = `stroke="${C.tinta}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  const angulo = (x: number, y: number, dx: number, dy: number) =>
    `<path d="M${x + dx} ${y} L${x + dx} ${y + dy} L${x} ${y + dy}" stroke="${C.acento}" stroke-width="3" fill="none"/>`;
  return `<svg width="${ancho}" height="${alto}" viewBox="0 0 420 300" aria-hidden="true" style="overflow:visible">
    <line x1="10" y1="290" x2="410" y2="290" stroke="rgba(20,20,19,.25)" stroke-width="3"/>
    <rect x="80" y="104" width="10" height="88" rx="4" fill="${PASTEL.lavanda}" filter="url(#acuarela)"/>
    <rect x="84" y="180" width="92" height="12" rx="5" fill="${PASTEL.lavanda}" filter="url(#acuarela)"/>
    <line x1="130" y1="192" x2="130" y2="284" stroke="#2B2D33" stroke-width="7"/>
    <line x1="100" y1="286" x2="160" y2="286" stroke="#2B2D33" stroke-width="7" stroke-linecap="round"/>
    <rect x="186" y="150" width="190" height="12" rx="4" fill="#D9B68C" filter="url(#acuarela)"/>
    <line x1="352" y1="162" x2="352" y2="288" stroke="#2B2D33" stroke-width="8"/>
    <line x1="330" y1="286" x2="374" y2="286" stroke="#2B2D33" stroke-width="7" stroke-linecap="round"/>
    <rect x="292" y="58" width="78" height="52" rx="5" fill="${PASTEL.azul}" filter="url(#acuarela)"/>
    <rect x="327" y="110" width="8" height="40" fill="#2B2D33"/>
    <line x1="146" y1="62" x2="292" y2="62" stroke="${C.acento}" stroke-width="3" stroke-dasharray="8 7"/>
    <circle cx="132" cy="62" r="19" fill="${C.papel}" ${linea}/>
    <path d="M124 84 L118 176 L196 178 L198 282 L222 282" ${linea}/>
    <path d="M122 98 L126 146 L206 146" ${linea}/>
    ${angulo(126, 146, 14, -14)}
    ${angulo(198, 178, -14, 14)}
    <text x="150" y="132" font-size="17" font-weight="700" fill="${C.acento}" font-family="Inter">90°</text>
    <text x="214" y="206" font-size="17" font-weight="700" fill="${C.acento}" font-family="Inter">90°</text>
  </svg>`;
}

/** Escapa texto que viene del catálogo antes de meterlo en el HTML. */
export const t = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
