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
.marcado{background:linear-gradient(${MARCADOR},${MARCADOR}) 0 62%/100% 74% no-repeat;padding:0 .1em;margin:0 -.04em;border-radius:.08em;-webkit-box-decoration-break:clone;box-decoration-break:clone;color:inherit}
.seleccion{position:relative;white-space:nowrap;background:#D9E0FF;padding:0 .06em;box-shadow:-4px 0 0 ${C.acento},4px 0 0 ${C.acento};-webkit-box-decoration-break:clone;box-decoration-break:clone}
.seleccion::before,.seleccion::after{content:"";position:absolute;width:.17em;height:.17em;border-radius:50%;background:${C.acento}}
.seleccion::before{left:-.1em;top:-.12em}.seleccion::after{right:-.1em;bottom:-.12em}
.pegatina{display:inline-block;padding:.28em .7em;border-radius:999px;background:${MARCADOR};color:${C.tinta};font-weight:600;letter-spacing:-0.01em;box-shadow:0 .12em .3em rgba(20,20,19,.16);white-space:nowrap}
.cejilla{display:flex;gap:.9em;align-items:center;font-size:30px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${C.gris}}
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
 * Alzado acotado de un puesto, de perfil y sin persona: el escritorio de pie
 * (sólido), la posición sentado (en discontinua), la silla y la pantalla,
 * con una regla a la izquierda y las tres alturas que importan. Como un
 * plano: las piezas, con su nombre entre paréntesis.
 */
export function alzado(m: { sentado: number; dePie: number; pantalla: number; silla: number }, ancho = 900): string {
  const suelo = 490;
  const k = 2.75; // px por cm
  const Y = (cm: number) => suelo - cm * k;
  const regla = 118;
  const tinta = "#2B2D33";
  const ticks = Array.from({ length: 17 }, (_, i) => i * 10)
    .map((cm) => `<line x1="${regla}" x2="${regla + (cm % 50 ? 8 : 16)}" y1="${Y(cm)}" y2="${Y(cm)}" stroke="${tinta}" stroke-width="2"/>`)
    .join("");
  const cota = (cm: number, rotulo: string, hasta: number) => `
    <line x1="${regla}" x2="${hasta}" y1="${Y(cm)}" y2="${Y(cm)}" stroke="${C.acento}" stroke-width="2.5" stroke-dasharray="7 6"/>
    <circle cx="${regla}" cy="${Y(cm)}" r="6" fill="${C.acento}"/>
    <text x="${regla - 16}" y="${Y(cm) + 4}" text-anchor="end" font-size="27" font-weight="800" fill="${C.tinta}" font-family="Inter Tight">${cm} cm</text>
    <text x="${regla - 16}" y="${Y(cm) + 27}" text-anchor="end" font-size="16" font-weight="500" fill="${C.gris}" font-family="Inter">${rotulo}</text>`;
  const pieza = (x: number, y: number, s: string, anchor = "start") =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="17" font-weight="500" fill="${C.gris}" font-family="Inter">(${s})</text>`;
  const x0 = 300;
  const x1 = 568;
  const monAlto = 30 * k;
  const monX = 400;
  return `<svg width="${ancho}" height="${Math.round((ancho * 520) / 600)}" viewBox="0 0 600 520" aria-hidden="true" style="overflow:visible">
    <line x1="${regla}" x2="${regla}" y1="${suelo}" y2="${Y(165)}" stroke="${tinta}" stroke-width="2.5"/>${ticks}
    <line x1="${regla}" x2="596" y1="${suelo}" y2="${suelo}" stroke="${tinta}" stroke-width="3"/>
    <!-- silla -->
    <rect x="200" y="${Y(m.silla)}" width="78" height="11" rx="5" fill="${PASTEL.lavanda}" filter="url(#acuarela)"/>
    <rect x="198" y="${Y(m.silla + 40)}" width="11" height="${40 * k}" rx="5" fill="${PASTEL.lavanda}" filter="url(#acuarela)"/>
    <line x1="240" x2="240" y1="${Y(m.silla) + 11}" y2="${suelo - 8}" stroke="${tinta}" stroke-width="6"/>
    <line x1="208" x2="272" y1="${suelo - 5}" y2="${suelo - 5}" stroke="${tinta}" stroke-width="6" stroke-linecap="round"/>
    ${pieza(232, Y(m.silla) + 40, "silla", "end")}
    <!-- sentado, en discontinua -->
    <rect x="${x0}" y="${Y(m.sentado)}" width="${x1 - x0}" height="12" rx="3" fill="none" stroke="${tinta}" stroke-width="2.5" stroke-dasharray="9 7"/>
    ${pieza((x0 + x1) / 2, Y(m.sentado) + 40, "sentado", "middle")}
    <!-- de pie -->
    <rect x="${x0 + 30}" y="${Y(m.dePie) + 12}" width="20" height="${(m.dePie - 60) * k}" rx="3" fill="${tinta}"/>
    <rect x="${x0 + 33}" y="${Y(60)}" width="14" height="${60 * k - 10}" rx="3" fill="#55596A"/>
    <rect x="${x1 - 50}" y="${Y(m.dePie) + 12}" width="20" height="${(m.dePie - 60) * k}" rx="3" fill="${tinta}"/>
    <rect x="${x1 - 47}" y="${Y(60)}" width="14" height="${60 * k - 10}" rx="3" fill="#55596A"/>
    <rect x="${x0 + 4}" y="${suelo - 12}" width="72" height="10" rx="5" fill="${tinta}"/>
    <rect x="${x1 - 76}" y="${suelo - 12}" width="72" height="10" rx="5" fill="${tinta}"/>
    <rect x="${x0}" y="${Y(m.dePie)}" width="${x1 - x0}" height="14" rx="3" fill="#D9B68C" filter="url(#acuarela)"/>
    ${pieza(x0 + 64, Y(m.dePie) + 44, "columna")}
    <!-- pantalla: el borde de arriba, a la altura de los ojos -->
    <rect x="${monX + 70}" y="${Y(m.pantalla) + monAlto}" width="10" height="${Y(m.dePie) - Y(m.pantalla) - monAlto}" fill="${tinta}"/>
    <rect x="${monX + 40}" y="${Y(m.dePie) - 6}" width="70" height="6" rx="3" fill="${tinta}"/>
    <rect x="${monX}" y="${Y(m.pantalla)}" width="150" height="${monAlto}" rx="6" fill="${PASTEL.azul}" filter="url(#acuarela)"/>
    ${pieza(monX + 75, Y(m.pantalla) - 14, "pantalla", "middle")}
    ${pieza(x0 + 4, Y(m.dePie) - 12, "tablero")}
    ${cota(m.pantalla, "borde de la pantalla", monX)}
    ${cota(m.dePie, "de pie", x0)}
    ${cota(m.sentado, "sentado", x0)}
  </svg>`;
}

/** Color del fluorescente: el de las palabras marcadas y las pegatinas. */
export const MARCADOR = "#CFF24E";

/**
 * Texto con marcas, ya escapado: ==así== va en fluorescente y [[así]] como
 * texto seleccionado en un editor. Sirve para titulares; en la descripción
 * se quitan con sinMarcas().
 */
export const rico = (s: string) =>
  t(s)
    .replace(/==(.+?)==/g, '<span class="marcado">$1</span>')
    .replace(/\[\[(.+?)\]\]/g, '<span class="seleccion">$1</span>');
export const sinMarcas = (s: string) => s.replace(/==|\[\[|\]\]/g, "");

/** Pegatinas: etiquetas cortas, un poco torcidas, como en una libreta. */
export function pegatinas(textos: string[], tam = 36): string {
  const giros = [-4, 3, -2, 4];
  return `<div style="display:flex;flex-wrap:wrap;gap:18px 22px">${textos
    .map((s, i) => `<span class="pegatina" style="font-size:${tam}px;transform:rotate(${giros[i % giros.length]}deg)">${t(s)}</span>`)
    .join("")}</div>`;
}

/** Escapa texto que viene del catálogo antes de meterlo en el HTML. */
export const t = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
