/**
 * Plantilla «Lo que nadie te dice antes de comprar un escritorio elevable»:
 * cinco verdades incómodas, cada una con su cifra y su gráfico sacados del
 * catálogo. Si cambia el catálogo, cambian las cifras y los dibujos.
 */
import { catalogo, nombre } from "../catalogo.ts";
import { C, PASTEL, pagina, marca, t, rico, sinMarcas, cuadros, leyenda, esCarrusel } from "../diseno.ts";
import { portada, cierre, descripcion, AVISO } from "./comun.ts";
import type { Fotograma, Video } from "./franja.ts";

interface Verdad {
  titular: string;
  dato: string;
  consejo: string;
  grafico: string;
}

function diapositiva(v: Verdad, n: number, total: number): Fotograma {
  const carrusel = esCarrusel();
  return {
    nombre: `verdad-${n}`,
    segundos: 4.5,
    html: pagina(`<div class="lienzo" style="gap:${carrusel ? 26 : 40}px">
  <div style="display:flex;justify-content:space-between;align-items:center">${marca()}<p style="font-size:36px;font-weight:600;color:${C.gris}">${n}/${total}</p></div>
  <div style="display:flex;gap:28px;align-items:flex-start">
    <p style="flex:0 0 auto;font-family:'Inter Tight',sans-serif;font-weight:800;font-size:${carrusel ? 120 : 150}px;line-height:.85;color:${C.acento}">${String(n).padStart(2, "0")}</p>
    <h2 class="titular" style="font-size:${carrusel ? (sinMarcas(v.titular).length > 45 ? 56 : 64) : 76}px;line-height:1.05">${rico(v.titular)}</h2>
  </div>
  <p style="font-size:${carrusel ? 38 : 44}px;line-height:1.3;font-weight:600">${t(v.dato)}</p>
  <div style="flex:1 1 auto;display:flex;flex-direction:column;justify-content:center;gap:24px">${v.grafico}</div>
  <div style="position:relative;margin-top:18px;padding:40px 32px 26px;border-radius:28px;background:#FFFFFF;border:3px solid ${C.borde}">
    <span class="pegatina" style="position:absolute;left:24px;top:-30px;font-size:32px;transform:rotate(-3deg)">Lo que haría yo</span>
    <p style="font-size:${carrusel ? 34 : 38}px;line-height:1.3">${t(v.consejo.charAt(0).toUpperCase() + v.consejo.slice(1))}</p>
  </div>
</div>`),
  };
}

/** Barras horizontales a escala, una por modelo. */
function barras(filas: { etiqueta: string; valor: number; texto: string; color: string }[], max: number): string {
  return `<div style="display:flex;flex-direction:column;gap:12px">${filas
    .map(
      (f) => `<div style="display:grid;grid-template-columns:300px 1fr;align-items:center;gap:20px">
    <p style="font-size:28px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t(f.etiqueta)}</p>
    <div style="display:flex;align-items:center;gap:14px">
      <svg width="${Math.round((f.valor / max) * 460)}" height="40" aria-hidden="true"><rect x="2" y="2" width="${Math.round((f.valor / max) * 460) - 4}" height="36" rx="6" fill="${f.color}" filter="url(#acuarela)"/></svg>
      <p style="font-size:30px;font-weight:700">${t(f.texto)}</p>
    </div></div>`,
    )
    .join("")}</div>`;
}

/** Los tableros dibujados a escala, de frente, con lo que cabe encima. */
function tableros(anchos: number[]): string {
  const escala = 4.1; // px por cm
  return `<div style="display:flex;flex-direction:column;gap:22px">${anchos
    .map((a) => {
      const w = Math.round(a * escala);
      const monitores = a >= 140 ? 2 : a >= 120 ? 1 : 0;
      const pantalla = (x: number) =>
        `<rect x="${x}" y="0" width="150" height="88" rx="6" fill="${PASTEL.azul}" filter="url(#acuarela)"/><rect x="${x + 68}" y="88" width="14" height="14" fill="#2B2D33"/>`;
      const encima =
        monitores === 0
          ? `<rect x="${w / 2 - 70}" y="62" width="140" height="40" rx="6" fill="${PASTEL.lavanda}" filter="url(#acuarela)"/>`
          : monitores === 1
            ? pantalla(w / 2 - 75)
            : `${pantalla(w / 2 - 165)}${pantalla(w / 2 + 15)}`;
      return `<div style="display:grid;grid-template-columns:${Math.round(180 * escala) + 10}px 1fr;align-items:end;gap:20px">
      <svg width="${w}" height="122" viewBox="0 0 ${w} 122" aria-hidden="true">${encima}<rect x="0" y="104" width="${w}" height="16" rx="4" fill="#D9B68C" filter="url(#acuarela)"/></svg>
      <p style="font-size:32px;font-weight:700;padding-bottom:4px;white-space:nowrap">${a} cm<br><span style="font-weight:500;color:${C.gris};font-size:26px">${
        monitores === 0 ? "portátil" : monitores === 1 ? "1 monitor" : "2 monitores"
      }</span></p></div>`;
    })
    .join("")}</div>`;
}

export function videoVerdades(): Video {
  const total = catalogo.length;
  const completos = catalogo.filter((p) => p.incluye_tablero);
  const conAnti = catalogo.filter((p) => p.specs.sistema_anticolision === true).length;
  const sinAnti = total - conAnti;
  const simples = catalogo.filter((p) => p.specs.tipo_motor === "simple").length;
  const dobles = total - simples;
  const sinGarantia = catalogo.filter((p) => p.specs.garantia_anos === null).length;
  const garantias = [...new Set(catalogo.map((p) => p.specs.garantia_anos).filter((g): g is number => g !== null))].sort();
  const porGarantia = garantias.map((g) => ({ g, n: catalogo.filter((p) => p.specs.garantia_anos === g).length }));
  const cargas = completos.map((p) => p.specs.peso_max_carga_kg);
  const rango = (xs: number[]) => (Math.min(...xs) === Math.max(...xs) ? `${xs[0]}` : `${Math.min(...xs)} y ${Math.max(...xs)}`);
  const anchos = [...new Set(completos.map((p) => p.specs.ancho_tablero_cm))].sort((a, b) => a - b);
  const de100 = completos.filter((p) => p.specs.ancho_tablero_cm <= 100).length;
  const coloresGarantia = [PASTEL.lavanda, PASTEL.azul, PASTEL.verde];

  const verdades: Verdad[] = [
    {
      titular: "Los kilos que anuncian ==ya cuentan el tablero==",
      dato: `Los completos del catálogo declaran entre ${rango(cargas)} kg, y es todo lo que va encima.`,
      consejo: "resta el peso del tablero antes de contar monitores y equipo.",
      grafico: barras(
        [...completos]
          .sort((a, b) => b.specs.peso_max_carga_kg - a.specs.peso_max_carga_kg)
          .map((p) => ({
            etiqueta: nombre(p),
            valor: p.specs.peso_max_carga_kg,
            texto: `${p.specs.peso_max_carga_kg} kg`,
            color: p.specs.tipo_motor === "doble" ? PASTEL.lavanda : PASTEL.azul,
          })),
        Math.max(...cargas),
      ) + leyenda([
        { color: PASTEL.azul, texto: "Un motor" },
        { color: PASTEL.lavanda, texto: "Doble motor" },
      ]).replace("flex-direction:column", "flex-direction:row;gap:40px"),
    },
    {
      titular: sinAnti * 2 > total ? "¿Para si choca con la silla? Más de la mitad [[ni lo dice]]" : `¿Para si choca con la silla? ${sinAnti} de ${total} [[ni lo dicen]]`,
      dato: `${sinAnti} de ${total} modelos no declaran anticolisión en su ficha.`,
      consejo: "si la ficha no lo dice, no lo des por hecho. Con niños o mascotas, elige uno que la declare.",
      grafico:
        cuadros([
          { n: conAnti, color: PASTEL.azul },
          { n: sinAnti, color: PASTEL.arena },
        ]) +
        leyenda([
          { color: PASTEL.azul, texto: `La declaran (${conAnti})` },
          { color: PASTEL.arena, texto: `No lo dicen (${sinAnti})` },
        ]),
    },
    {
      titular: "100 cm parecen mucho hasta que ==pones el monitor==",
      dato: `${de100 === 1 ? "Hay uno" : `Hay ${de100}`} de 100 cm: para portátil vale, con monitor y teclado va justo.`,
      consejo: "con monitor externo, mínimo 120 cm. Con dos, 140 o más.",
      grafico: tableros(anchos),
    },
    {
      titular: "¿Doble motor? Para portátil y monitor, ==te sobra con uno==",
      dato: `${simples} de ${total} llevan un solo motor, y para portátil y monitor van de sobra.`,
      consejo: "doble motor solo con tableros grandes, mucho peso o si cambias de altura a menudo.",
      grafico:
        cuadros([
          { n: simples, color: PASTEL.azul },
          { n: dobles, color: PASTEL.lavanda },
        ]) +
        leyenda([
          { color: PASTEL.azul, texto: `Un motor (${simples})` },
          { color: PASTEL.lavanda, texto: `Doble motor (${dobles})` },
        ]),
    },
    {
      titular: "¿La ficha no dice garantía? ==La ley te da 3 años==",
      dato: `${sinGarantia} de ${total} no declaran años de garantía. En España, la legal es de 3 años.`,
      consejo: "si dos te convencen igual, elige el que declare más años: tiene motor y electrónica.",
      grafico:
        cuadros([
          { n: sinGarantia, color: PASTEL.arena },
          ...porGarantia.map((x, i) => ({ n: x.n, color: coloresGarantia[i % coloresGarantia.length] })),
        ]) +
        leyenda([
          { color: PASTEL.arena, texto: `No la declaran (${sinGarantia})` },
          ...porGarantia.map((x, i) => ({ color: coloresGarantia[i % coloresGarantia.length], texto: `${x.g} años (${x.n})` })),
        ]),
    },
  ];

  const fotogramas = [
    portada(
      ["Antes de comprar"],
      "Lo que no sale [[en la foto]] de un escritorio elevable",
      `Nos hemos leído la letra pequeña de ${total} fichas. Te ahorramos el trabajo.`,
      [`${total} fichas leídas`, "Guárdalo para cuando compres"],
      `<div style="display:flex;justify-content:flex-start">${cuadros(
        [
          { n: conAnti, color: PASTEL.azul },
          { n: dobles, color: PASTEL.lavanda },
          { n: total * 2 - conAnti - dobles, color: PASTEL.arena },
        ],
        13,
        56,
      )}</div>`,
    ),
    ...verdades.map((v, i) => diapositiva(v, i + 1, verdades.length)),
    cierre(
      "Comenta",
      "ELEVABLE",
      "y te paso la comparativa",
      "Los modelos que sí declaran anticolisión y garantía, con su nota.",
      "elevable.es",
    ),
  ];

  const texto = descripcion([
    `Lo que no sale en la foto de un escritorio elevable: nos hemos leído la letra pequeña de ${total} fichas 👇`,
    "",
    ...verdades.map((v, i) => `${i + 1}. ${sinMarcas(v.titular)}`),
    "",
    "Guárdalo para cuando vayas a comprar.",
    "Comenta ELEVABLE y te paso la comparativa con los modelos que sí lo declaran.",
    "",
    AVISO,
    "",
    "#escritorioelevable #teletrabajo #homeoffice #setup #oficinaencasa",
  ]);

  return { slug: "verdades", fotogramas, descripcion: texto };
}
