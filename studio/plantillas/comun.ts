/**
 * Piezas que comparten las plantillas: portada, cierre y la descripción con
 * el aviso de afiliado. Las de «el mejor de la franja» van en franja.ts.
 */
import { C, pagina, marca, t, esCarrusel } from "../diseno.ts";
import type { Fotograma } from "./franja.ts";

export const AVISO = "Enlaces de afiliado: si compras, Amazon nos paga una comisión y tú pagas lo mismo.";

/** Portada: etiqueta, titular con una parte en acento y una línea debajo. */
export function portada(etiqueta: string, antes: string, acento: string, sub: string, ilustracion = ""): Fotograma {
  const desliza = esCarrusel()
    ? `<p style="align-self:flex-start;padding:14px 26px;border-radius:999px;background:${C.tinta};color:#fff;font-size:36px;font-weight:600">Desliza →</p>`
    : "";
  return {
    nombre: "portada",
    segundos: 2.4,
    html: pagina(`<div class="lienzo" style="justify-content:space-between">
  ${marca()}
  <div style="display:flex;flex-direction:column;gap:36px">
    <p style="align-self:flex-start;padding:14px 26px;border-radius:18px;background:${C.acentoTinte};color:${C.acento};font-weight:600;font-size:40px">${t(etiqueta)}</p>
    <h1 class="titular" style="font-size:112px;line-height:1.02;letter-spacing:-0.03em">${t(antes)} <span style="color:${C.acento}">${t(acento)}</span></h1>
    <p style="font-size:48px;line-height:1.3;color:${C.gris}">${t(sub)}</p>
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
    <h2 class="titular" style="font-size:112px;line-height:1.08;letter-spacing:-0.03em">${t(llamada)} <span style="background:#fff;color:${C.acento};padding:0 20px;border-radius:24px">${t(palabra)}</span> ${t(resto)}</h2>
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
