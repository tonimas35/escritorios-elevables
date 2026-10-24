/**
 * Plantilla «IKEA o Amazon»: qué gana cada tienda y, para cada eléctrico de
 * IKEA, el primero del catálogo en su misma franja de precio. Sale de los
 * mismos datos que /escritorio-elevable-ikea: data/ikea.json (comprobado en
 * ikea.com/es) y data/productos.json. Si cambian, cambia el carrusel.
 *
 * Precios, solo en franja con fecha (CLAUDE.md, «Precios»): las de IKEA con
 * la fecha de ikea.json; las de Amazon, con franjaPrecio().
 */
import { readFileSync } from "node:fs";
import { catalogo, nombre, nota, franjaPrecio } from "../catalogo.ts";
import { franja, posicionEnFranja, type Franja } from "../../lib/nota.ts";
import { C, pagina, marca, t, rico, esCarrusel } from "../diseno.ts";
import { portada, cierre, descripcion, AVISO } from "./comun.ts";
import type { Fotograma, Video } from "./franja.ts";

interface ModeloIkea {
  nombre: string;
  mecanismo: string;
  motores: number | null;
  carga_kg: number;
  garantia_anos: number | null;
  precio_min: number;
  precio_max: number;
}
const ikea = JSON.parse(readFileSync(new URL("../../data/ikea.json", import.meta.url), "utf8")) as {
  verificado: string;
  devolucion_dias: number;
  modelos: ModeloIkea[];
};

const fecha = (iso: string) => iso.split("-").reverse().join("/");
const franjaIkea = (m: ModeloIkea) =>
  `Entre ${m.precio_min} y ${m.precio_max} € en IKEA · verificado el ${fecha(ikea.verificado)}`;
const lista = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} y ${xs.at(-1)}`);

/** Página de lista: titular y puntos numerados, como «Antes de comprar». */
function puntos(nombreFoto: string, titular: string, items: { titulo: string; texto: string }[], fondo = C.papel): Fotograma {
  const carrusel = esCarrusel();
  return {
    nombre: nombreFoto,
    segundos: 4.5,
    html: pagina(
      `<div class="lienzo" style="gap:${carrusel ? 30 : 44}px">
  ${marca()}
  <h2 class="titular" style="font-size:${carrusel ? 84 : 96}px;line-height:1.04">${rico(titular)}</h2>
  <div style="display:flex;flex-direction:column;gap:${carrusel ? 22 : 30}px">${items
    .map(
      (it, i) => `<div style="display:flex;gap:26px;align-items:flex-start;padding:28px 30px;border-radius:24px;background:#FFFFFF;border:3px solid ${C.borde}">
    <p style="flex:0 0 auto;width:62px;height:62px;border-radius:16px;background:${C.acentoTinte};color:${C.acento};font-weight:700;font-size:36px;display:flex;align-items:center;justify-content:center">${i + 1}</p>
    <div style="display:flex;flex-direction:column;gap:10px"><p style="font-size:${carrusel ? 42 : 46}px;font-weight:700;line-height:1.15">${t(it.titulo)}</p><p style="font-size:${carrusel ? 32 : 36}px;line-height:1.3;color:${C.gris}">${t(it.texto)}</p></div>
  </div>`,
    )
    .join("")}</div>
</div>`,
      fondo,
    ),
  };
}

export function videoIkea(): Video {
  const carrusel = esCarrusel();
  const electricos = ikea.modelos.filter((m) => m.mecanismo === "eléctrico");
  const conDiez = electricos.filter((m) => (m.garantia_anos ?? 0) >= 10).map((m) => m.nombre);
  const completos = catalogo.filter((p) => p.incluye_tablero);
  const conAnti = catalogo.filter((p) => p.specs.sistema_anticolision === true).length;
  const maxGarantia = Math.max(...catalogo.map((p) => p.specs.garantia_anos ?? 0));
  const maxIkea = Math.max(...electricos.map((m) => m.carga_kg));
  const masCargaP = [...completos].sort((a, b) => b.specs.peso_max_carga_kg - a.specs.peso_max_carga_kg)[0];

  const primeroDe = (f: Franja) =>
    catalogo.find((p) => {
      const pos = posicionEnFranja(p, catalogo);
      return pos?.franja === f && pos.posicion === 1;
    }) ?? null;
  // Para cada eléctrico de IKEA, el primero del catálogo en su franja. Si dos
  // de IKEA comparten alternativa, sale solo el primero: no se repite modelo.
  const vistos = new Set<string>();
  const parejas = electricos
    .map((m) => {
      const f = franja({ incluye_tablero: true, precio_min: m.precio_min, precio_max: m.precio_max });
      return { m, p: f ? primeroDe(f) : null };
    })
    .filter((x) => x.p && !vistos.has(x.p.slug) && vistos.add(x.p.slug));

  const dobleBarato = [...completos]
    .filter((p) => p.specs.tipo_motor === "doble" && p.precio_max !== null)
    .sort((a, b) => a.precio_max! - b.precio_max!)[0];
  const ganaIkea = [
    { titulo: `${ikea.devolucion_dias} días para devolverlo`, texto: "En un mueble que pesa y abulta, es mucho margen para probarlo en casa." },
    { titulo: "10 años de garantía", texto: `La declaran ${lista(conDiez)}. En nuestro catálogo de Amazon, la más larga es de ${maxGarantia} años.` },
    { titulo: "Lo puedes probar antes", texto: "Si tu tienda lo tiene expuesto, lo subes, lo bajas y ves cuánto se mueve de pie." },
  ];
  const ganaAmazon = [
    {
      titulo: "Más carga por el mismo dinero",
      texto: `El ${parejas[0].m.nombre} aguanta ${parejas[0].m.carga_kg} kg; el primero de nuestro catálogo en su franja de precio, ${parejas[0].p!.specs.peso_max_carga_kg}.`,
    },
    { titulo: "Anticolisión declarada", texto: `${conAnti} de los ${catalogo.length} modelos del catálogo la declaran. Ninguna ficha de IKEA la menciona.` },
    {
      titulo: "Doble motor más barato",
      texto: `En IKEA solo lo declara el MITTZON, el segundo más caro de sus eléctricos. En nuestro catálogo lo lleva el ${nombre(dobleBarato)}, por bastante menos.`,
    },
  ];

  // Comprobación: la tercera ventaja de Amazon depende de los datos.
  const dobles = electricos.filter((m) => m.motores === 2);
  const dobleAmazonMasBarato = dobleBarato !== undefined && dobles.every((m) => dobleBarato.precio_max! < m.precio_min);
  if (parejas[0].p!.specs.peso_max_carga_kg <= parejas[0].m.carga_kg) {
    throw new Error("La ventaja «más carga por el mismo dinero» ya no cuadra con los datos: revisa el texto.");
  }
  const porPrecio = [...electricos].sort((a, b) => b.precio_min - a.precio_min).map((m) => m.nombre);
  if (dobles.length !== 1 || dobles[0].nombre !== "MITTZON" || porPrecio[1] !== "MITTZON" || !dobleAmazonMasBarato) {
    throw new Error("La ventaja «doble motor más barato» ya no cuadra con los datos: revisa el texto.");
  }

  const diferencias = (m: ModeloIkea, p: (typeof catalogo)[number]): string[] => {
    const d: string[] = [];
    const kg = p.specs.peso_max_carga_kg - m.carga_kg;
    if (kg > 0) d.push(`${kg} kg más de carga en el ${p.marca}.`);
    if (kg < 0) d.push(`${-kg} kg más de carga en el ${m.nombre}.`);
    const g = (m.garantia_anos ?? 0) - (p.specs.garantia_anos ?? 0);
    if (m.garantia_anos && g > 0) d.push(`${g} años más de garantía en IKEA.`);
    if (p.specs.garantia_anos && g < 0) d.push(`${-g} años más de garantía en el ${p.marca}.`);
    if (p.specs.sistema_anticolision === true) d.push(`Anticolisión declarada solo en el ${p.marca}.`);
    if (p.specs.tipo_motor === "doble" && m.motores !== 2) d.push(`Doble motor solo en el ${p.marca}.`);
    return d;
  };

  const cara = (m: ModeloIkea, p: (typeof catalogo)[number]): Fotograma => ({
    nombre: `par-${m.nombre.toLowerCase().replace(/[^a-z]/g, "")}`,
    segundos: 4.5,
    html: pagina(`<div class="lienzo" style="gap:${carrusel ? 24 : 36}px">
  ${marca()}
  <h2 class="titular" style="font-size:${carrusel ? 72 : 84}px;line-height:1.05">${rico(`Si miras el ${m.nombre}, ==mira también este==`)}</h2>
  <p style="font-size:${carrusel ? 32 : 36}px;line-height:1.3;color:${C.gris}">${t("El primero de nuestro catálogo en su misma franja de precio.")}</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:stretch">
    ${[
      {
        cab: "IKEA",
        nom: m.nombre,
        filas: [
          ["Motores", m.motores === null ? "No lo dice" : m.motores === 1 ? "Uno" : "Dos"],
          ["Carga", `${m.carga_kg} kg`],
          ["Garantía", m.garantia_anos ? `${m.garantia_anos} años` : "No la declara"],
          ["Anticolisión", "No lo dice"],
        ],
        precio: franjaIkea(m),
        fondo: "#FFFFFF",
        texto: C.tinta,
        sec: C.gris,
      },
      {
        cab: `Amazon · nota ${nota(p.puntuacion.total)}`,
        nom: nombre(p),
        filas: [
          ["Motores", p.specs.tipo_motor === "doble" ? "Dos" : p.specs.tipo_motor === "simple" ? "Uno" : "Manual"],
          ["Carga", `${p.specs.peso_max_carga_kg} kg`],
          ["Garantía", p.specs.garantia_anos ? `${p.specs.garantia_anos} años` : "No la declara"],
          ["Anticolisión", p.specs.sistema_anticolision === true ? "Sí" : p.specs.sistema_anticolision === false ? "No" : "No lo dice"],
        ],
        precio: franjaPrecio(p) ?? "",
        fondo: C.superficieOscura,
        texto: "#FFFFFF",
        sec: "#B9BEC8",
      },
    ]
      .map(
        (c) => `<div style="display:flex;flex-direction:column;gap:16px;padding:30px 28px;border-radius:28px;background:${c.fondo};color:${c.texto};border:3px solid ${c.fondo === "#FFFFFF" ? C.borde : c.fondo}">
      <p style="font-size:26px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:${c.sec}">${t(c.cab)}</p>
      <p class="titular" style="font-size:${c.nom.length > 18 ? 42 : 52}px;line-height:1.05">${t(c.nom)}</p>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:6px">${c.filas
        .map(([k, v]) => `<div style="display:flex;justify-content:space-between;gap:12px;font-size:30px;border-top:2px solid ${c.fondo === "#FFFFFF" ? C.borde : "#3A3D45"};padding-top:12px"><span style="color:${c.sec}">${t(k)}</span><strong>${t(v)}</strong></div>`)
        .join("")}</div>
      <p style="margin-top:auto;padding-top:14px;font-size:24px;line-height:1.3;color:${c.sec}">${t(c.precio)}</p>
    </div>`,
      )
      .join("")}
  </div>
  <div style="position:relative;margin-top:22px;padding:38px 32px 26px;border-radius:28px;background:#FFFFFF;border:3px solid ${C.borde}">
    <span class="pegatina" style="position:absolute;left:24px;top:-28px;font-size:30px;transform:rotate(-3deg)">Lo que cambia</span>
    <div style="display:flex;flex-direction:column;gap:10px">${diferencias(m, p)
      .map((d) => `<p style="font-size:${carrusel ? 32 : 36}px;line-height:1.3">· ${t(d)}</p>`)
      .join("")}</div>
  </div>
</div>`),
  });

  const veredicto = puntos("veredicto", "Lo que haría yo", [
    { titulo: "Portátil y un monitor", texto: `IKEA cumple, y te llevas ${ikea.devolucion_dias} días para devolverlo y hasta 10 años de garantía.` },
    { titulo: `Más de ${maxIkea} kg encima`, texto: `Amazon. Ningún eléctrico de IKEA pasa de ${maxIkea} kg; el ${nombre(masCargaP)} declara ${masCargaP.specs.peso_max_carga_kg}.` },
    { titulo: "Niños, mascotas o una silla cerca", texto: "Uno que declare anticolisión. En IKEA no la menciona ninguna ficha." },
  ]);

  const fotogramas: Fotograma[] = [
    portada(
      ["IKEA o Amazon"],
      "¿Escritorio elevable de IKEA o de Amazon? ==Depende de esto==",
      `Con los datos de las fichas de IKEA, comprobados el ${fecha(ikea.verificado)}, y los de nuestro catálogo de Amazon.`,
      [`${electricos.length} eléctricos de IKEA`, `${catalogo.length} modelos de Amazon`],
    ),
    puntos("gana-ikea", "Lo que ==gana IKEA==", ganaIkea),
    puntos("gana-amazon", "Lo que ==gana Amazon==", ganaAmazon),
    ...parejas.slice(0, 2).map((x) => cara(x.m, x.p!)),
    veredicto,
    cierre("Comenta", "IKEA", "y te paso la comparativa", "Todos los modelos de IKEA, con su carga, su garantía y su alternativa en Amazon.", "elevable.es"),
  ];

  // Dos parejas como mucho: con más, el carrusel se alarga.
  const pares = parejas.slice(0, 2);
  const texto = descripcion([
    "¿Escritorio elevable de IKEA o de Amazon? Depende de lo que vayas a poner encima 👇",
    "",
    `IKEA gana en devolución (${ikea.devolucion_dias} días) y garantía (10 años en ${lista(conDiez)}).`,
    `Amazon gana en carga por el mismo dinero y en anticolisión declarada.`,
    "",
    ...pares.map((x) => `Si miras el ${x.m.nombre}: ${nombre(x.p!)} (nota ${nota(x.p!.puntuacion.total)}).`),
    "",
    `Datos de las fichas de IKEA (comprobados el ${fecha(ikea.verificado)}) y de nuestro catálogo de Amazon.es. Método público en elevable.es.`,
    "",
    "Comenta IKEA y te paso la comparativa completa.",
    AVISO,
    "",
    "#escritorioelevable #teletrabajo #homeoffice #setup #oficinaencasa",
  ]);

  return { slug: "ikea", fotogramas, descripcion: texto };
}
