/**
 * Plantilla «El mejor de la franja»: portada, qué mirar, los tres primeros
 * de la franja del nº 3 al nº 1 (para que se vea hasta el final) y el
 * cierre con «Comenta ELEVABLE».
 *
 * Todo sale del catálogo: la posición y la nota (lib/nota.ts), las specs y
 * la franja de precio con su fecha. Lo que distingue a cada modelo se
 * calcula comparándolo con los otros dos; si no hay nada que lo distinga,
 * se usa su primer «pro» publicable. No se escribe nada a mano.
 */
import type { Product } from "../../lib/types";
import { NOMBRE_FRANJA, type Franja } from "../../lib/nota.ts";
import { publicable } from "../../lib/cifras.ts";
import { modelosDeFranja, nombre, nota, franjaPrecio } from "../catalogo.ts";
import { C, pagina, marca, dibujo, t } from "../diseno.ts";

export interface Fotograma {
  nombre: string;
  html: string;
  segundos: number;
}

export interface Video {
  slug: string;
  fotogramas: Fotograma[];
  descripcion: string;
}

const TITULO: Record<Franja, { antes: string; cifra: string; corto: string; largo: string; base: boolean }> = {
  A: { antes: "El mejor por menos de", cifra: "120 €", corto: "Hasta 120 €", largo: "El mejor escritorio elevable por menos de 120 €", base: false },
  B: { antes: "El mejor entre", cifra: "120 y 250 €", corto: "De 120 a 250 €", largo: "El mejor escritorio elevable entre 120 y 250 €", base: false },
  C: { antes: "El mejor entre", cifra: "250 y 500 €", corto: "De 250 a 500 €", largo: "El mejor escritorio elevable entre 250 y 500 €", base: false },
  M1: { antes: "La mejor base por menos de", cifra: "250 €", corto: "Bases hasta 250 €", largo: "La mejor base elevable por menos de 250 €", base: true },
  M2: { antes: "La mejor base entre", cifra: "250 y 500 €", corto: "Bases de 250 a 500 €", largo: "La mejor base elevable entre 250 y 500 €", base: true },
};

const medio = (p: Product) =>
  p.precio_min !== null && p.precio_max !== null ? (p.precio_min + p.precio_max) / 2 : p.precio;

/** El único del grupo con el valor más alto (o más bajo) de algo, o nadie. */
function unico(grupo: Product[], valor: (p: Product) => number | null, menor = false): Product | null {
  const conValor = grupo.filter((p) => valor(p) !== null);
  if (conValor.length < 2) return null;
  const extremo = (menor ? Math.min : Math.max)(...conValor.map((p) => valor(p)!));
  const ganadores = conValor.filter((p) => valor(p) === extremo);
  return ganadores.length === 1 ? ganadores[0] : null;
}

/** Una frase por modelo con lo que lo distingue de los otros. */
function rasgos(grupo: Product[]): Map<string, string> {
  const n = grupo.length;
  const de = `de los ${n}`;
  const candidatos: [Product | null, string][] = [];
  const solo = (cond: (p: Product) => boolean) => {
    const ok = grupo.filter(cond);
    return ok.length === 1 ? ok[0] : null;
  };
  const doble = solo((p) => p.specs.tipo_motor === "doble");
  if (doble) candidatos.push([doble, `El único con doble motor ${de}.`]);
  const anti = solo((p) => p.specs.sistema_anticolision === true);
  if (anti) candidatos.push([anti, `El único ${de} que declara anticolisión.`]);
  const carga = unico(grupo, (p) => p.specs.peso_max_carga_kg);
  if (carga) candidatos.push([carga, `El que más carga aguanta ${de}: ${carga.specs.peso_max_carga_kg}\u00a0kg.`]);
  const alto = unico(grupo, (p) => p.specs.rango_altura_max_cm);
  if (alto) candidatos.push([alto, `El que más sube: hasta ${alto.specs.rango_altura_max_cm}\u00a0cm.`]);
  const memorias = unico(grupo, (p) => p.specs.presets_memoria);
  if (memorias) candidatos.push([memorias, `El que más memorias trae: ${memorias.specs.presets_memoria}.`]);
  const barato = unico(grupo, (p) => medio(p), true);
  if (barato) candidatos.push([barato, `El más barato ${de}.`]);
  const tablero = unico(grupo, (p) => (p.incluye_tablero ? p.specs.ancho_tablero_cm * p.specs.profundidad_tablero_cm : null));
  if (tablero) candidatos.push([tablero, `El tablero más grande: ${tablero.specs.ancho_tablero_cm}x${tablero.specs.profundidad_tablero_cm}\u00a0cm.`]);

  const asignados = new Map<string, string>();
  for (const [p, frase] of candidatos) {
    if (p && !asignados.has(p.slug)) asignados.set(p.slug, frase);
  }
  for (const p of grupo) {
    if (asignados.has(p.slug)) continue;
    // Un «pro» de una o dos palabras («Anticolisión») no se sostiene solo
    // en pantalla: se busca uno que diga algo.
    const pro = p.pros.find((x) => publicable(x) && x.length >= 20) ?? p.pros.find(publicable);
    if (pro) asignados.set(p.slug, pro.endsWith(".") ? pro : `${pro}.`);
  }
  return asignados;
}

/** Una pega que conviene decir, si la hay. */
function pega(p: Product): string | null {
  if (p.incluye_tablero && p.specs.ancho_tablero_cm <= 100) {
    return `Ojo: solo ${p.specs.ancho_tablero_cm}\u00a0cm de ancho, para portátil o un monitor.`;
  }
  return null;
}

function chips(p: Product, oscuro: boolean): string {
  const fondo = oscuro ? C.superficieOscura : C.superficie;
  const s = p.specs;
  const lista = [
    s.tipo_motor === "doble" ? "Doble motor" : "Motor simple",
    `${s.peso_max_carga_kg} kg`,
    `${s.rango_altura_min_cm}–${s.rango_altura_max_cm} cm`,
    s.presets_memoria !== null ? `${s.presets_memoria} memorias` : null,
    p.incluye_tablero ? `${s.ancho_tablero_cm}x${s.profundidad_tablero_cm}` : "Sin tablero",
  ].filter((x): x is string => x !== null);
  return lista
    .map((c) => `<span class="chip" style="background:${fondo}">${t(c.replace(".", ","))}</span>`)
    .join("");
}

function fotogramaModelo(p: Product, posicion: number, total: number, rasgo: string | undefined, f: Franja): Fotograma {
  const esPrimero = posicion === 1;
  const fondo = esPrimero ? C.tinta : "#FFFFFF";
  const texto = esPrimero ? "#FFFFFF" : C.tinta;
  const acento = esPrimero ? C.acentoSobreOscuro : C.acento;
  const secundario = esPrimero ? C.grisClaro : C.gris;
  const cabecera = esPrimero
    ? `<p style="padding:12px 24px;border-radius:999px;background:${C.acento};color:#fff;font-size:40px;font-weight:700">${
        TITULO[f].base ? "La mejor" : "El mejor"
      } · ${t(TITULO[f].corto)}</p>`
    : `<p style="font-size:40px;font-weight:600;color:${C.gris}">${t(TITULO[f].corto)}</p>`;
  const extra = esPrimero ? pega(p) : null;
  const precio = esPrimero ? franjaPrecio(p) : null;
  const cuerpo = `<div class="lienzo">
  <div style="display:flex;justify-content:space-between;align-items:center">${marca(acento)}${cabecera}</div>
  <div style="flex:0 0 auto;display:flex;align-items:center;justify-content:center;height:560px;border-radius:48px;background:${C.superficie};color:${
    esPrimero ? C.gris : "#8A909C"
  }">${dibujo(p)}</div>
  <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px">
    <div><p style="font-size:44px;font-weight:700;color:${acento}">Nº ${posicion}${total < 3 ? ` de ${total}` : ""}</p>
    <h2 class="titular" style="margin-top:8px;font-size:${nombre(p).length > 16 ? 88 : 104}px;line-height:1">${t(nombre(p))}</h2></div>
    <p style="text-align:right"><span style="display:block;font-family:'Inter Tight',sans-serif;font-weight:800;font-size:150px;line-height:.9;color:${acento}">${nota(
      p.puntuacion.total,
    )}</span><span style="font-size:36px;color:${secundario}">nota</span></p>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:16px">${chips(p, esPrimero)}</div>
  ${rasgo ? `<p style="font-size:48px;line-height:1.3;font-weight:600">${t(rasgo)}</p>` : ""}
  ${extra ? `<p style="font-size:42px;line-height:1.3;color:${secundario}">${t(extra)}</p>` : ""}
  ${precio ? `<p style="font-size:36px;color:${secundario}">${t(precio)}</p>` : ""}
</div>`;
  return { nombre: `n${posicion}`, html: pagina(cuerpo, fondo, texto), segundos: esPrimero ? 5 : 4 };
}

export function videoFranja(f: Franja): Video {
  const todos = modelosDeFranja(f);
  if (todos.length < 2) throw new Error(`La franja ${f} tiene ${todos.length} modelo(s): hacen falta al menos 2.`);
  const top = todos.slice(0, 3);
  const n = top.length;
  const T = TITULO[f];
  const frases = rasgos(top);
  const fotogramas: Fotograma[] = [];

  // 1 · Portada
  fotogramas.push({
    nombre: "portada",
    segundos: 2.2,
    html: pagina(`<div class="lienzo" style="justify-content:space-between">
  ${marca()}
  <div style="display:flex;flex-direction:column;gap:40px">
    <p style="align-self:flex-start;padding:14px 26px;border-radius:18px;background:${C.acentoTinte};color:${C.acento};font-weight:600;font-size:40px">${
      T.base ? "Bases elevables" : "Escritorios elevables"
    }</p>
    <h1 class="titular" style="font-size:${T.cifra.length > 6 ? 116 : 132}px;line-height:1;letter-spacing:-0.03em">${t(T.antes)} <span style="color:${C.acento};white-space:nowrap">${t(T.cifra)}</span></h1>
    <p style="font-size:50px;line-height:1.3;color:${C.gris}">Los ${n} mejores de la franja, con sus datos. Sin opiniones inventadas.</p>
  </div>
  <div style="display:flex;align-items:center;justify-content:center;height:460px;border-radius:48px;background:${C.superficie};color:#8A909C">${dibujo(top[0], 480)}</div>
</div>`),
  });

  // 2 · Qué mirar
  const items = T.base
    ? ["La carga incluye el tablero", "Las medidas de tablero que admite", "El recorrido de altura"]
    : ["Memorias de altura", "120 cm de tablero si usas monitor", "Anticolisión: que pare si choca"];
  const conAnti = top.filter((p) => p.specs.sistema_anticolision === true).length;
  const aviso =
    conAnti === 0
      ? `Ojo: <strong>ninguno de los ${n} que vienen la declara</strong> en su ficha.`
      : conAnti === n
        ? `Buena noticia: <strong>los ${n} que vienen la declaran</strong>.`
        : `Ojo: <strong>solo ${conAnti} de los ${n} que vienen la declara${conAnti > 1 ? "n" : ""}</strong>.`;
  fotogramas.push({
    nombre: "que-mirar",
    segundos: 4,
    html: pagina(`<div class="lienzo" style="gap:56px">
  ${marca()}
  <h2 class="titular" style="margin-top:60px;font-size:104px;line-height:1">Antes de comprar, mira 3 cosas</h2>
  <div style="display:flex;flex-direction:column;gap:28px">${items
    .map(
      (txt, i) => `<div style="display:flex;gap:32px;align-items:center;padding:36px 40px;border:3px solid ${C.borde};border-radius:36px">
      <span style="flex:0 0 auto;width:96px;height:96px;border-radius:28px;background:${C.acentoTinte};color:${C.acento};display:flex;align-items:center;justify-content:center;font-family:'Inter Tight',sans-serif;font-weight:800;font-size:52px">${i + 1}</span>
      <p style="font-size:50px;line-height:1.2;font-weight:600">${t(txt)}</p></div>`,
    )
    .join("")}</div>
  ${T.base ? "" : `<p style="font-size:44px;line-height:1.35;color:${C.gris}">${aviso.replace("<strong>", `<strong style="color:${C.tinta}">`)}</p>`}
</div>`),
  });

  // 3 · Del último al nº 1
  for (let i = n - 1; i >= 0; i--) {
    fotogramas.push(fotogramaModelo(top[i], i + 1, todos.length < 3 ? n : 3, frases.get(top[i].slug), f));
  }

  // 4 · Cierre
  fotogramas.push({
    nombre: "cierre",
    segundos: 3.2,
    html: pagina(
      `<div class="lienzo" style="justify-content:space-between">
  ${marca(C.tinta)}
  <div style="display:flex;flex-direction:column;gap:48px">
    <h2 class="titular" style="font-size:120px;line-height:1.08;letter-spacing:-0.03em">Comenta <span style="background:#fff;color:${C.acento};padding:0 20px;border-radius:24px">ELEVABLE</span> y te paso la comparativa</h2>
    <p style="font-size:50px;line-height:1.3;color:#DCE3FF">Todo el catálogo, con la nota de cada modelo dentro de su franja de precio.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:20px">
    <p style="font-family:'Inter Tight',sans-serif;font-weight:800;font-size:72px">elevable.es</p>
    <p style="font-size:34px;color:#DCE3FF">Enlaces de afiliado: si compras, Amazon nos paga una comisión y tú pagas lo mismo.</p>
  </div>
</div>`,
      C.acento,
      "#FFFFFF",
    ),
  });

  const lineas = [...top]
    .reverse()
    .map((p) => `${top.indexOf(p) + 1}. ${nombre(p)} · nota ${nota(p.puntuacion.total)}`);
  const precio1 = franjaPrecio(top[0]);
  const descripcion = [
    `${T.largo}: ${T.base ? "las" : "los"} ${n} primer${T.base ? "as" : "os"} de la franja «${NOMBRE_FRANJA[f]}», con sus datos.`,
    "",
    ...lineas,
    "",
    precio1 ? `El nº 1: ${precio1.charAt(0).toLowerCase()}${precio1.slice(1)}.` : "",
    "Notas calculadas con las fichas de fabricante y las valoraciones de Amazon. Método público en elevable.es.",
    "",
    "Comenta ELEVABLE y te paso la comparativa completa.",
    "Enlaces de afiliado: si compras, Amazon nos paga una comisión y tú pagas lo mismo.",
    "",
    `#escritorioelevable #teletrabajo #homeoffice #setup #standingdesk${T.base ? " #mesaelevable" : ""}`,
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");

  return { slug: `franja-${f.toLowerCase()}`, fotogramas, descripcion };
}
