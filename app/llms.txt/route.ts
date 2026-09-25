/**
 * /llms.txt: el catalogo en texto plano para asistentes de IA (formato de
 * llmstxt.org). Se genera del catalogo en el build, como el sitemap, para
 * que no se desfase: dar de alta o de baja un modelo no obliga a tocarlo.
 *
 * Mismas reglas que el resto de la web: precio solo como franja con fecha
 * (`franjaPrecio()`), ningun dato en null (`especificaciones()`), nada de
 * recuentos de reseñas y la nota siempre dentro de su franja, porque las
 * notas de franjas distintas no se comparan (METODO.md §5).
 */
import { getAvailableProducts } from "@/lib/products";
import { especificaciones } from "@/lib/schema";
import { franjaPrecio, publicable } from "@/lib/ficha";
import { NOMBRE_FRANJA, posicionEnFranja, type Franja } from "@/lib/nota";
import { rutaFicha } from "@/lib/rutas";
import { coma, nota } from "@/lib/format";
import { REVISION, fechaCorta } from "@/lib/fecha";
import { CRITERIOS, firmaMetodologia } from "@/lib/metodologia";
import { CORREO } from "@/lib/contacto";
import type { Product } from "@/lib/types";

export const dynamic = "force-static";

const SITE = "https://elevable.es";

const PAGINAS: [string, string, string][] = [
  ["/mejor-escritorio-elevable", "Mejores escritorios elevables", "el catálogo completo, modelo a modelo, con guía de compra"],
  ["/escritorio-elevable-barato", "Escritorios elevables baratos", "los modelos de las franjas más bajas"],
  ["/bases-elevables", "Bases elevables", "los marcos sin tablero, por franja y según el caso"],
  ["/que-escritorio-elevable-comprar", "Qué escritorio elevable comprar", "guía para elegir según el uso"],
  ["/flexispot-vs-maidesite", "Flexispot vs MAIDeSITe", "comparativa entre las dos marcas"],
  ["/sanodesk-vs-flexispot", "SANODESK vs FLEXISPOT", "comparativa entre las dos marcas"],
  ["/comparador", "Comparador", "filtra el catálogo por motor, carga, altura y tablero"],
  ["/calculadora-altura", "Calculadora de altura", "la altura de trabajo sentado y de pie según tu estatura"],
];

const nombre = (p: Product) => `${p.marca} ${p.modelo}`;

/** "A", "A y B", "A, B y C". */
const enumerar = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} y ${xs.at(-1)}`);

function urlFicha(p: Product): string {
  const ruta = rutaFicha(p);
  return ruta ? `${SITE}${ruta}` : `${SITE}/mejor-escritorio-elevable#${p.slug}`;
}

function modelo(p: Product, catalogo: Product[]): string[] {
  const pos = posicionEnFranja(p, catalogo);
  const lineas = [`### [${nombre(p)}](${urlFicha(p)})`, ""];

  if (pos) {
    const empate = pos.empateCon.length
      ? ` Empate técnico con ${enumerar(pos.empateCon.map(nombre))}.`
      : "";
    lineas.push(`- Posición: nº ${pos.posicion} de ${pos.de} en ${NOMBRE_FRANJA[pos.franja]}.${empate}`);
  }
  lineas.push(`- Nota: ${nota(p.puntuacion.total)} sobre 10`);
  lineas.push(`- Valoración media en Amazon España: ${coma(p.rating)} sobre 5`);
  const franja = franjaPrecio(p);
  if (franja) lineas.push(`- Precio: ${franja}`);
  for (const [clave, valor] of especificaciones(p)) lineas.push(`- ${clave}: ${valor}`);
  if (p.define && publicable(p.define)) lineas.push(`- Qué lo distingue: ${p.define}`);
  if (publicable(p.veredicto)) lineas.push(`- Veredicto: ${p.veredicto}`);
  if (p.no_es_para && publicable(p.no_es_para)) lineas.push(`- ${p.no_es_para}`);
  const pros = p.pros.filter(publicable);
  const contras = p.contras.filter(publicable);
  if (pros.length) lineas.push(`- A favor: ${pros.join("; ")}`);
  if (contras.length) lineas.push(`- En contra: ${contras.join("; ")}`);
  lineas.push("");
  return lineas;
}

export function GET() {
  const catalogo = getAvailableProducts().map(([, p]) => p);
  const franjas = Object.keys(NOMBRE_FRANJA) as Franja[];
  const enFranja = (f: Franja) =>
    catalogo
      .map((p) => ({ p, pos: posicionEnFranja(p, catalogo) }))
      .filter((x) => x.pos?.franja === f)
      .sort((a, b) => a.pos!.posicion - b.pos!.posicion)
      .map((x) => x.p);
  const sinFranja = catalogo.filter((p) => !posicionEnFranja(p, catalogo));

  const lineas = [
    "# Elevable",
    "",
    "> Comparativa independiente de escritorios elevables a la venta en Amazon España. Cada modelo tiene una nota sobre 10 calculada con un método público, y se mide contra lo que se puede esperar en su franja de precio: las notas de franjas distintas no se comparan entre sí.",
    "",
    `- Última revisión del contenido: ${fechaCorta(REVISION)}`,
    `- ${firmaMetodologia(catalogo.length)}`,
    "- Precios: solo franjas con su fecha de verificación. El precio exacto cambia a diario y se consulta en Amazon.",
    "- Un dato que la ficha del fabricante no declara se omite; no se estima.",
    "- Los enlaces de compra de la web son de afiliado de Amazon: si compras, la web cobra una comisión y tú pagas lo mismo.",
    `- Correcciones y contacto: ${CORREO}`,
    "",
    "## Método",
    "",
    `- [Cómo analizamos los escritorios elevables](${SITE}/metodologia): la fórmula de la nota, las franjas y cuándo entra o sale un modelo.`,
    ...CRITERIOS.map((c) => `- ${c.nombre} (${Math.round(c.peso * 100)} %): ${c.base}`),
    "",
    "## Nº 1 de cada franja",
    "",
    ...franjas.flatMap((f) => {
      const [primero] = enFranja(f);
      return primero
        ? [`- ${NOMBRE_FRANJA[f]}: [${nombre(primero)}](${urlFicha(primero)}), nota ${nota(primero.puntuacion.total)} sobre 10`]
        : [];
    }),
    "",
    ...franjas.flatMap((f) => {
      const modelos = enFranja(f);
      return modelos.length ? [`## Catálogo: ${NOMBRE_FRANJA[f].toLowerCase()}`, "", ...modelos.flatMap((p) => modelo(p, catalogo))] : [];
    }),
    ...(sinFranja.length
      ? ["## Catálogo: sin franja de precio verificada", "", ...sinFranja.flatMap((p) => modelo(p, catalogo))]
      : []),
    "## Páginas",
    "",
    ...PAGINAS.map(([ruta, titulo, texto]) => `- [${titulo}](${SITE}${ruta}): ${texto}`),
    "",
  ];

  return new Response(lineas.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
