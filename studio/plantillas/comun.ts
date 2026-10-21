/**
 * Piezas que comparten las plantillas: portada, cierre y la descripción con
 * el aviso de afiliado. Las de «el mejor de la franja» van en franja.ts.
 */
import { C, MARCADOR, pagina, marca, t, rico, sinMarcas, pegatinas, esCarrusel } from "../diseno.ts";
import type { Fotograma } from "./franja.ts";

export const AVISO = "Enlaces de afiliado: si compras, Amazon nos paga una comisión y tú pagas lo mismo.";

/**
 * Portada tipográfica: una cejilla en mayúsculas, el titular grande con su
 * parte clave marcada (==fluorescente== o [[selección]], ver rico()), una
 * línea debajo y, si las hay, pegatinas y una ilustración.
 */
export function portada(cejilla: string[], titular: string, sub: string, pegs: string[] = [], ilustracion = ""): Fotograma {
  const carrusel = esCarrusel();
  const desliza = carrusel
    ? `<p style="align-self:flex-end;padding:14px 26px;border-radius:999px;background:${C.tinta};color:#fff;font-size:36px;font-weight:600">Desliza →</p>`
    : "";
  return {
    nombre: "portada",
    segundos: 2.4,
    html: pagina(`<div class="lienzo" style="justify-content:space-between">
  <div style="display:flex;justify-content:space-between;align-items:center">${marca()}<p class="cejilla">${cejilla.map(t).join('<span style="opacity:.4">/</span>')}</p></div>
  <div style="display:flex;flex-direction:column;gap:${carrusel ? 34 : 44}px">
    <h1 class="titular" style="font-size:${sinMarcas(titular).length <= 40 ? (carrusel ? 142 : 150) : carrusel ? 118 : 128}px;line-height:1.04;letter-spacing:-0.035em">${rico(titular)}</h1>
    <p style="font-size:${carrusel ? 44 : 50}px;line-height:1.3;color:${C.gris}">${t(sub)}</p>
    ${pegs.length ? pegatinas(pegs, carrusel ? 36 : 42) : ""}
  </div>
  ${ilustracion}
  ${desliza}
</div>`),
  };
}

/** Cierre azul con la llamada a comentar y la web. */
export function cierre(llamada: string, palabra: string, resto: string, sub: string, web: string): Fotograma {
  return {
    nombre: "cierre",
    segundos: 3.2,
    html: pagina(
      `<div class="lienzo" style="justify-content:space-between">
  ${marca(C.tinta)}
  <div style="display:flex;flex-direction:column;gap:44px">
    <h2 class="titular" style="font-size:112px;line-height:1.08;letter-spacing:-0.03em">${t(llamada)} <span style="background:${MARCADOR};color:${C.tinta};padding:0 20px;border-radius:24px;display:inline-block;transform:rotate(-2deg)">${t(palabra)}</span> ${t(resto)}</h2>
    <p style="font-size:48px;line-height:1.3;color:#DCE3FF">${t(sub)}</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:18px">
    <p style="font-family:'Inter Tight',sans-serif;font-weight:800;font-size:${web.length > 16 ? 46 : 64}px;white-space:nowrap">${t(web)}</p>
    <p style="font-size:32px;color:#DCE3FF">${t(AVISO)}</p>
  </div>
</div>`,
      C.acento,
      "#FFFFFF",
    ),
  };
}

/** Une las líneas de una descripción sin dejar dos vacías seguidas. */
export function descripcion(lineas: string[]): string {
  return lineas.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");
}
