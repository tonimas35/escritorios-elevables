/**
 * Genera un vídeo vertical (1080×1920, H.264, sin audio) y su descripción.
 *
 *   node generar.ts franja A              → vídeo: el mejor de «Completos hasta 120 €»
 *   node generar.ts franja A --carrusel   → lo mismo en carrusel de fotos (1080×1350)
 *   node generar.ts franja M1             → la mejor base hasta 250 €
 *   node generar.ts altura                → ¿a qué altura debe estar tu mesa?
 *   node generar.ts verdades              → lo que nadie te dice antes de comprar
 *   node generar.ts ikea                  → IKEA o Amazon: qué gana cada uno
 *
 * Sale en studio/salida/<fecha>-<plantilla>/: los fotogramas en PNG, el
 * vídeo (video.mp4) y la descripción (descripcion.txt) para pegar en TikTok
 * o Instagram. La música se elige al publicar, de la biblioteca de la app:
 * es la única que una cuenta de empresa puede usar sin problemas.
 *
 * Necesita ffmpeg y un Chromium. Por defecto usa el de Playwright en
 * /opt/pw-browsers; otro, con CHROMIUM=/ruta/al/chrome.
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright-core";
import type { Franja } from "../lib/nota.ts";
import { videoFranja, type Video } from "./plantillas/franja.ts";
import { videoAltura } from "./plantillas/altura.ts";
import { videoVerdades } from "./plantillas/verdades.ts";
import { videoIkea } from "./plantillas/ikea.ts";
import { usarFormato, medidas } from "./diseno.ts";

const FRANJAS = ["A", "B", "C", "M1", "M2"];
const TRANSICION = 0.35; // segundos que dura el paso de un fotograma al siguiente
const FPS = 30;

function plantilla(args: string[]): Video {
  const [tipo, valor] = args;
  if (tipo === "franja" && FRANJAS.includes(valor?.toUpperCase())) {
    return videoFranja(valor.toUpperCase() as Franja);
  }
  if (tipo === "altura") return videoAltura();
  if (tipo === "verdades") return videoVerdades();
  if (tipo === "ikea") return videoIkea();
  console.error(`Uso: node generar.ts franja <${FRANJAS.join("|")}> | altura | verdades | ikea  [--carrusel]`);
  process.exit(1);
}

function chromiumPath(): string {
  if (process.env.CHROMIUM) return process.env.CHROMIUM;
  const local = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
  if (existsSync(local)) return local;
  throw new Error("No encuentro Chromium: indica la ruta con CHROMIUM=/ruta/al/chrome");
}

const args = process.argv.slice(2);
const carrusel = args.includes("--carrusel");
usarFormato(carrusel ? "carrusel" : "video");
const video = plantilla(args.filter((a) => !a.startsWith("--")));
const hoy = new Date().toISOString().slice(0, 10);
const carpeta = new URL(`./salida/${hoy}-${video.slug}${carrusel ? "-carrusel" : ""}/`, import.meta.url).pathname;
mkdirSync(carpeta, { recursive: true });

// 1 · Cada fotograma, a PNG
const navegador = await chromium.launch({ executablePath: chromiumPath() });
const pagina = await navegador.newPage({ viewport: { width: 1080, height: medidas().alto } });
const pngs: string[] = [];
for (const [i, f] of video.fotogramas.entries()) {
  const html = `${carpeta}${String(i + 1).padStart(2, "0")}-${f.nombre}.html`;
  const png = html.replace(/\.html$/, ".png");
  writeFileSync(html, f.html);
  await pagina.goto(`file://${html}`);
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.screenshot({ path: png });
  pngs.push(png);
}
await navegador.close();
writeFileSync(`${carpeta}descripcion.txt`, `${video.descripcion}\n`);

if (carrusel) {
  // El carrusel son las fotos, en orden: no hay vídeo que montar.
  console.log(`Hecho: ${pngs.length} fotos en ${carpeta}\nDescripción: ${carpeta}descripcion.txt`);
  process.exit(0);
}

// 2 · Los fotogramas, unidos con un deslizamiento corto
const entradas = video.fotogramas.flatMap((f, i) => [
  "-loop", "1", "-framerate", String(FPS), "-t", String(f.segundos), "-i", pngs[i],
]);
let filtro = "";
let anterior = "[0:v]";
let offset = 0;
for (let i = 1; i < pngs.length; i++) {
  offset += video.fotogramas[i - 1].segundos - TRANSICION;
  const salida = i === pngs.length - 1 ? "[v]" : `[x${i}]`;
  filtro += `${anterior}[${i}:v]xfade=transition=slideleft:duration=${TRANSICION}:offset=${offset.toFixed(2)}${salida};`;
  anterior = salida;
}
filtro = filtro.replace(/;$/, ",format=yuv420p[out]").replace(/\[v\],format/, "[v];[v]format");

const mp4 = `${carpeta}video.mp4`;
execFileSync(
  "ffmpeg",
  ["-y", "-loglevel", "error", ...entradas, "-filter_complex", filtro, "-map", "[out]",
   "-r", String(FPS), "-c:v", "libx264", "-preset", "medium", "-crf", "18",
   "-movflags", "+faststart", mp4],
  { stdio: "inherit" },
);
const total = video.fotogramas.reduce((s, f) => s + f.segundos, 0) - TRANSICION * (pngs.length - 1);
console.log(`Hecho: ${mp4} (${total.toFixed(1)} s)\nDescripción: ${carpeta}descripcion.txt`);
