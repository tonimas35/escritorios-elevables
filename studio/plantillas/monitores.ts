/**
 * Plantilla «No compres el más barato si vas a poner dos monitores»: cuánto
 * ocupan dos pantallas, dibujado a escala sobre tableros de distinto ancho,
 * y qué escritorios completos del catálogo llegan, ordenados por precio.
 *
 * El ancho del monitor es una referencia fija (uno de 24 pulgadas con su
 * marco), no un dato de ningún modelo, y la diapositiva lo dice. El umbral de
 * 140 cm es el mismo que da la plantilla de «verdades».
 */
import { catalogo, nombre, nota, franjaPrecio } from "../catalogo.ts";
import { C, PASTEL, pagina, marca, t, rico, sinMarcas, esCarrusel } from "../diseno.ts";
import { portada, cierre, descripcion, AVISO } from "./comun.ts";
import type { Product } from "../../lib/types";
import type { Fotograma, Video } from "./franja.ts";

const MONITOR = 54; // cm de ancho de un monitor de 24 pulgadas, con marco
const DOS = 140; // cm a partir de los que dos monitores caben con holgura

type Veredicto = "no" | "justo" | "si";
const veredicto = (ancho: number): Veredicto => (ancho < 2 * MONITOR ? "no" : ancho < DOS ? "justo" : "si");
const COLOR: Record<Veredicto, string> = { no: PASTEL.rosa, justo: PASTEL.arena, si: PASTEL.verde };
const TEXTO: Record<Veredicto, string> = { no: "No caben", justo: "Caben justos", si: "Caben" };

const medio = (p: Product) => ((p.precio_min ?? 0) + (p.precio_max ?? 0)) / 2;

/** Un tablero de frente, a escala, con dos monitores de 24" encima. */
function frente(ancho: number, escala: number): string {
  const w = ancho * escala;
  const m = MONITOR * escala;
  const total = 2 * m;
  const x0 = (Math.max(w, total) - total) / 2; // los monitores, centrados
  const lienzo = Math.max(w, total) + 4;
  const tx = (lienzo - w) / 2; // el tablero, centrado
  const v = veredicto(ancho);
  const pantalla = (x: number) =>
    `<rect x="${x + 2}" y="0" width="${m - 4}" height="${m * 0.58}" rx="6" fill="${PASTEL.azul}" filter="url(#acuarela)"/><rect x="${x + m / 2 - 7}" y="${m * 0.58}" width="14" height="16" fill="#2B2D33"/>`;
  const alto = m * 0.58 + 16 + 18;
  return `<svg width="${lienzo}" height="${alto}" viewBox="0 0 ${lienzo} ${alto}" aria-hidden="true">
    ${pantalla(x0)}${pantalla(x0 + m)}
    <rect x="${tx}" y="${alto - 18}" width="${w}" height="16" rx="4" fill="${v === "no" ? "#E5A7A0" : "#D9B68C"}" filter="url(#acuarela)"/>
  </svg>`;
}

export function videoMonitores(): Video {
  const carrusel = esCarrusel();
  const completos = catalogo.filter((p) => p.incluye_tablero && p.precio_min !== null).sort((a, b) => medio(a) - medio(b) || a.specs.ancho_tablero_cm - b.specs.ancho_tablero_cm);
  const anchos = [...new Set([100, 120, DOS])];
  const llegan = completos.filter((p) => veredicto(p.specs.ancho_tablero_cm) === "si");
  if (llegan.length === 0) throw new Error("Ningún completo del catálogo llega a 140 cm: la plantilla no tiene sentido.");
  const primero = llegan[0];
  // Los que van antes del primero que llega, en orden de precio.
  const cortos = completos.slice(0, completos.indexOf(primero));
  if (cortos.length < 2) throw new Error("El más barato (o el segundo) ya llega a 140 cm: el titular dejaría de ser cierto.");
  const anchosCortos = [...new Set(cortos.map((p) => p.specs.ancho_tablero_cm))].sort((a, b) => a - b);
  const enumera = (xs: (string | number)[]) => (xs.length === 1 ? `${xs[0]}` : `${xs.slice(0, -1).join(", ")} o ${xs[xs.length - 1]}`);
  const empatados = llegan.filter((p) => medio(p) === medio(primero));
  const cargaMin = Math.min(...completos.map((p) => p.specs.peso_max_carga_kg));
  const escala = carrusel ? 4.4 : 4.8;

  const dibujo: Fotograma = {
    nombre: "a-escala",
    segundos: 5,
    html: pagina(`<div class="lienzo" style="gap:${carrusel ? 26 : 40}px">
  ${marca()}
  <h2 class="titular" style="font-size:${carrusel ? 72 : 84}px;line-height:1.05">${rico(`Dos monitores ocupan ==${2 * MONITOR} cm== antes de poner nada más`)}</h2>
  <div style="flex:1 1 auto;display:flex;flex-direction:column;justify-content:center;gap:${carrusel ? 26 : 40}px">${anchos
    .map((a) => {
      const v = veredicto(a);
      return `<div style="display:grid;grid-template-columns:${Math.round(DOS * escala) + 10}px 1fr;align-items:end;gap:24px">
      ${frente(a, escala)}
      <p style="font-size:34px;font-weight:700;padding-bottom:2px;white-space:nowrap">${a} cm<br><span style="font-size:28px;font-weight:600;padding:4px 14px;border-radius:12px;background:${COLOR[v]}">${TEXTO[v]}</span></p></div>`;
    })
    .join("")}</div>
  <p style="font-size:${carrusel ? 26 : 30}px;line-height:1.35;color:${C.gris}">${t(
    `A escala, vistos de frente. Referencia: monitor de 24 pulgadas, unos ${MONITOR} cm de ancho con el marco. Con 120 cm caben, pero no queda sitio a los lados.`,
  )}</p>
</div>`),
  };

  const filas = completos
    .map((p) => {
      const v = veredicto(p.specs.ancho_tablero_cm);
      return `<div style="display:grid;grid-template-columns:1fr 130px 210px;align-items:center;gap:18px;padding:${carrusel ? 12 : 16}px 0;border-bottom:2px solid ${C.borde}">
    <p style="font-size:${carrusel ? 32 : 36}px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t(nombre(p))}</p>
    <p style="font-size:${carrusel ? 32 : 36}px;font-weight:700;text-align:right">${p.specs.ancho_tablero_cm} cm</p>
    <p style="font-size:26px;font-weight:600;text-align:center;padding:6px 10px;border-radius:12px;background:${COLOR[v]}">${TEXTO[v]}</p>
  </div>`;
    })
    .join("");
  const lista: Fotograma = {
    nombre: "catalogo",
    segundos: 5,
    html: pagina(`<div class="lienzo" style="gap:${carrusel ? 20 : 34}px">
  ${marca()}
  <h2 class="titular" style="font-size:${carrusel ? 66 : 80}px;line-height:1.05">${rico(`Los ${cortos.length} más baratos ==se quedan cortos==`)}</h2>
  <p style="font-size:${carrusel ? 30 : 36}px;line-height:1.3;color:${C.gris}">${t(`Los ${completos.length} escritorios completos del catálogo, del más barato al más caro:`)}</p>
  <div style="display:flex;flex-direction:column">${filas}</div>
</div>`),
  };

  const consejos = [
    { titulo: `${DOS} cm de ancho o más`, texto: "Con 120 caben, pero el teclado, el ratón y lo demás ya no." },
    { titulo: "Y si puedes, 70 u 80 de fondo", texto: "Ganas entre 10 y 20 cm de distancia a las pantallas respecto a uno de 60." },
    { titulo: "La carga no es el problema", texto: `Todos los del catálogo aguantan ${cargaMin} kg o más, de sobra para dos monitores.` },
  ];
  const veredictoFinal: Fotograma = {
    nombre: "veredicto",
    segundos: 4.5,
    html: pagina(`<div class="lienzo" style="gap:${carrusel ? 28 : 44}px">
  ${marca()}
  <h2 class="titular" style="font-size:${carrusel ? 84 : 96}px;line-height:1.04">Lo que haría yo</h2>
  <div style="display:flex;flex-direction:column;gap:${carrusel ? 20 : 30}px">${consejos
    .map(
      (it, i) => `<div style="display:flex;gap:26px;align-items:flex-start;padding:26px 30px;border-radius:24px;background:#FFFFFF;border:3px solid ${C.borde}">
    <p style="flex:0 0 auto;width:62px;height:62px;border-radius:16px;background:${C.acentoTinte};color:${C.acento};font-weight:700;font-size:36px;display:flex;align-items:center;justify-content:center">${i + 1}</p>
    <div style="display:flex;flex-direction:column;gap:10px"><p style="font-size:${carrusel ? 40 : 46}px;font-weight:700;line-height:1.15">${t(it.titulo)}</p><p style="font-size:${carrusel ? 31 : 36}px;line-height:1.3;color:${C.gris}">${t(it.texto)}</p></div>
  </div>`,
    )
    .join("")}</div>
  <p style="font-size:${carrusel ? 30 : 34}px;line-height:1.35"><b>${t(empatados.length > 1 ? "Los más baratos que llegan: " : "El más barato que llega: ")}</b>${t(
    empatados.map(nombre).join(" y "),
  )}<br><span style="color:${C.gris}">${t(franjaPrecio(primero) ?? "")}</span></p>
</div>`),
  };

  const titular = "No compres el más barato si vas a poner ==dos monitores==";
  const fotogramas: Fotograma[] = [
    portada(
      ["Antes de comprar"],
      titular,
      `Dos pantallas piden ${DOS} cm de tablero, y los más baratos se quedan en ${enumera(anchosCortos)}.`,
      ["Medido a escala", "Guárdalo para cuando compres"],
    ),
    dibujo,
    lista,
    veredictoFinal,
    cierre("Comenta", "MONITORES", `y te paso los de ${DOS} cm o más`, "Con su nota y lo que dicen las reseñas malas.", "elevable.es"),
  ];

  const medida = (p: Product) => {
    const m = `${p.specs.ancho_tablero_cm}x${p.specs.profundidad_tablero_cm}`;
    return nombre(p).includes(m) ? nombre(p) : `${nombre(p)} (${m})`;
  };
  const aviso = (p: Product) => p.contras.find((c) => /tambale|error|dañad|rayad/i.test(c));
  const texto = descripcion([
    `${sinMarcas(titular)} 👇`,
    "",
    `Dos monitores de 24" ocupan unos ${2 * MONITOR} cm. Con 120 cm de tablero caben justos; con ${DOS} o más te queda sitio para el teclado y lo demás.`,
    "",
    `De los ${completos.length} completos del catálogo, estos llegan a ${DOS} cm:`,
    ...llegan.map((p) => `· ${medida(p)} · nota ${nota(p.puntuacion.total)}${aviso(p) ? ` · ojo: ${aviso(p)!.charAt(0).toLowerCase()}${aviso(p)!.slice(1)}` : ""}`),
    "",
    `${empatados.length > 1 ? "Los más baratos que llegan" : "El más barato que llega"}: ${empatados.map(nombre).join(" y ")}. ${franjaPrecio(primero)}.`,
    "",
    `Comenta MONITORES y te paso la comparativa.`,
    AVISO,
    "",
    "#escritorioelevable #setup #dosmonitores #teletrabajo #homeoffice",
  ]);

  return { slug: "monitores", fotogramas, descripcion: texto };
}
