/**
 * Plantilla «Mide tu hueco antes de comprar»: el fondo del tablero, dibujado
 * a escala y visto desde arriba, con lo que suele ir encima. Cuántos modelos
 * hay de cada fondo sale del catálogo; el teclado y el pie del monitor son
 * una referencia fija, no un dato de ningún modelo, y la diapositiva lo dice.
 */
import { catalogo, nombre } from "../catalogo.ts";
import { C, PASTEL, pagina, marca, t, rico, sinMarcas, cuadros, leyenda, esCarrusel } from "../diseno.ts";
import { portada, cierre, descripcion, AVISO } from "./comun.ts";
import type { Fotograma, Video } from "./franja.ts";

const PIE = 20; // cm de fondo del pie de un monitor de referencia
const TECLADO = 15; // cm de fondo de un teclado
const MARGEN = 8; // cm entre el borde y el teclado, para apoyar las muñecas

/** Un tablero visto desde arriba, a escala, con teclado, monitor y la distancia al borde. */
function planta(fondo: number, escala: number): string {
  const ancho = 120;
  const w = ancho * escala;
  const h = fondo * escala;
  const cx = w / 2;
  const pantallaY = (PIE / 2) * escala; // la pantalla queda sobre el centro del pie
  const libre = fondo - PIE / 2;
  return `<svg width="${w + 210}" height="${h + 8}" viewBox="0 0 ${w + 210} ${h + 8}" aria-hidden="true">
    <rect x="2" y="2" width="${w}" height="${h}" rx="8" fill="#D9B68C" filter="url(#acuarela)"/>
    <rect x="${cx - 13 * escala}" y="${4}" width="${26 * escala}" height="${PIE * escala - 4}" rx="6" fill="#2B2D33" opacity=".8"/>
    <rect x="${cx - 27 * escala}" y="${pantallaY - 5}" width="${54 * escala}" height="10" rx="5" fill="${PASTEL.azul}"/>
    <rect x="${cx - 22 * escala}" y="${h - (MARGEN + TECLADO) * escala}" width="${44 * escala}" height="${TECLADO * escala}" rx="6" fill="${PASTEL.lavanda}" filter="url(#acuarela)"/>
    <line x1="${w + 30}" x2="${w + 30}" y1="${pantallaY}" y2="${h + 2}" stroke="${C.tinta}" stroke-width="3"/>
    <line x1="${w + 20}" x2="${w + 40}" y1="${pantallaY}" y2="${pantallaY}" stroke="${C.tinta}" stroke-width="3"/>
    <line x1="${w + 20}" x2="${w + 40}" y1="${h + 2}" y2="${h + 2}" stroke="${C.tinta}" stroke-width="3"/>
    <text x="${w + 52}" y="${(pantallaY + h) / 2 + 12}" font-family="Inter Tight, sans-serif" font-weight="800" font-size="40" fill="${C.tinta}">${libre} cm</text>
  </svg>`;
}

export function videoFondo(): Video {
  const carrusel = esCarrusel();
  const completos = catalogo.filter((p) => p.incluye_tablero);
  const fondos = [...new Set(completos.map((p) => p.specs.profundidad_tablero_cm))].sort((a, b) => a - b);
  const porFondo = fondos.map((f) => ({ f, modelos: completos.filter((p) => p.specs.profundidad_tablero_cm === f) }));
  const colores = [PASTEL.arena, PASTEL.azul, PASTEL.lavanda, PASTEL.verde];
  const hondos = completos.filter((p) => p.specs.profundidad_tablero_cm >= 70);
  const escala = carrusel ? 3.4 : 4;

  const dibujo: Fotograma = {
    nombre: "planta",
    segundos: 5,
    html: pagina(`<div class="lienzo" style="gap:${carrusel ? 22 : 34}px">
  ${marca()}
  <h2 class="titular" style="font-size:${carrusel ? 68 : 80}px;line-height:1.05">${rico("Del borde a la pantalla: ==lo que da cada fondo==")}</h2>
  <div style="display:flex;flex-direction:column;gap:${carrusel ? 18 : 30}px">${[60, 70, 80]
    .map(
      (f) => `<div style="display:flex;align-items:center;gap:24px"><p style="width:150px;font-size:34px;font-weight:700">${f} cm<br><span style="font-size:24px;font-weight:500;color:${C.gris}">de fondo</span></p>${planta(f, escala)}</div>`,
    )
    .join("")}</div>
  <p style="font-size:${carrusel ? 26 : 30}px;line-height:1.35;color:${C.gris}">${t(
    `A escala. Referencia: monitor con un pie de ${PIE} cm contra la pared y teclado de ${TECLADO} cm a ${MARGEN} cm del borde. Con brazo de monitor, ganas casi todo el pie.`,
  )}</p>
</div>`),
  };

  const recuento: Fotograma = {
    nombre: "catalogo",
    segundos: 4.5,
    html: pagina(`<div class="lienzo" style="gap:${carrusel ? 30 : 44}px">
  ${marca()}
  <h2 class="titular" style="font-size:${carrusel ? 76 : 88}px;line-height:1.05">${rico(
    hondos.length * 2 < completos.length ? `La mayoría se quedan en ==60 cm==` : "Fondo de los escritorios ==del catálogo==",
  )}</h2>
  <p style="font-size:${carrusel ? 38 : 44}px;line-height:1.3;font-weight:600">${t(
    `De los ${completos.length} escritorios completos del catálogo, ${hondos.length} tienen 70 cm de fondo o más.`,
  )}</p>
  <div style="flex:1 1 auto;display:flex;flex-direction:column;justify-content:center;gap:30px">${cuadros(
    porFondo.map((x, i) => ({ n: x.modelos.length, color: colores[i % colores.length] })),
    5,
    carrusel ? 120 : 140,
  )}${leyenda(porFondo.map((x, i) => ({ color: colores[i % colores.length], texto: `${x.f} cm (${x.modelos.length})` })))}</div>
</div>`),
  };

  const consejos = [
    { titulo: "Portátil o un monitor pequeño", texto: "Con 60 cm vas bien, y son los más fáciles de encajar en casa." },
    { titulo: "Monitor grande o dos", texto: "Busca 70 u 80 cm: ganas entre 10 y 20 cm de distancia a la pantalla." },
    { titulo: "Mide también detrás", texto: "Al subir, los cables suben con la mesa: deja holgura hasta la pared o la ventana." },
  ];
  const veredicto: Fotograma = {
    nombre: "veredicto",
    segundos: 4.5,
    html: pagina(`<div class="lienzo" style="gap:${carrusel ? 30 : 44}px">
  ${marca()}
  <h2 class="titular" style="font-size:${carrusel ? 84 : 96}px;line-height:1.04">Lo que haría yo</h2>
  <div style="display:flex;flex-direction:column;gap:${carrusel ? 22 : 30}px">${consejos
    .map(
      (it, i) => `<div style="display:flex;gap:26px;align-items:flex-start;padding:28px 30px;border-radius:24px;background:#FFFFFF;border:3px solid ${C.borde}">
    <p style="flex:0 0 auto;width:62px;height:62px;border-radius:16px;background:${C.acentoTinte};color:${C.acento};font-weight:700;font-size:36px;display:flex;align-items:center;justify-content:center">${i + 1}</p>
    <div style="display:flex;flex-direction:column;gap:10px"><p style="font-size:${carrusel ? 42 : 46}px;font-weight:700;line-height:1.15">${t(it.titulo)}</p><p style="font-size:${carrusel ? 32 : 36}px;line-height:1.3;color:${C.gris}">${t(it.texto)}</p></div>
  </div>`,
    )
    .join("")}</div>
</div>`),
  };

  const titular = "Antes de mirar el ancho, ==mide el fondo==";
  const fotogramas: Fotograma[] = [
    portada(
      ["Antes de comprar"],
      titular,
      "El fondo decide a qué distancia te queda la pantalla. Esto es lo que da cada uno.",
      ["60, 70 u 80 cm", "Guárdalo para cuando compres"],
    ),
    dibujo,
    recuento,
    veredicto,
    cierre("Comenta", "FONDO", "y te paso los de 70 y 80", "Los escritorios del catálogo con fondo de sobra, con su nota.", "elevable.es"),
  ];

  const texto = descripcion([
    `${sinMarcas(titular)}: decide a qué distancia te queda la pantalla 👇`,
    "",
    ...[60, 70, 80].map((f) => `${f} cm de fondo → unos ${f - PIE / 2} cm del borde a la pantalla`),
    "",
    `(Con un monitor de pie de ${PIE} cm. Con brazo de monitor, ganas casi todo el pie.)`,
    `De los ${completos.length} completos del catálogo, ${hondos.length} tienen 70 cm o más: ${hondos.map(nombre).join(", ")}.`,
    "",
    "Comenta FONDO y te paso los de 70 y 80 con su nota.",
    AVISO,
    "",
    "#escritorioelevable #teletrabajo #homeoffice #setup #oficinaencasa",
  ]);

  return { slug: "fondo", fotogramas, descripcion: texto };
}
