import type { Product } from "./types";
import { coma, nota } from "./format";

/**
 * Etiquetas de especificacion para las pantallas del rediseño.
 *
 * Todo sale de `specs`. Ninguna de estas funciones inventa un dato: si el
 * campo no esta, devuelven null y quien las llama decide si oculta la fila.
 */

export function motorLargo(p: Product): string {
  const tipo = p.specs.tipo_motor === "doble" ? "Doble" : p.specs.tipo_motor === "simple" ? "Simple" : "Manual";
  return p.specs.velocidad_cm_s !== null ? `${tipo} · ${coma(p.specs.velocidad_cm_s)} cm/s` : tipo;
}

export function motorCorto(p: Product): string {
  if (p.specs.tipo_motor === "doble") return "Doble motor";
  if (p.specs.tipo_motor === "simple") return "Motor simple";
  return "Manual";
}

export function recorrido(p: Product): string {
  return `${coma(p.specs.rango_altura_min_cm)}–${coma(p.specs.rango_altura_max_cm)} cm`;
}

export function carga(p: Product): string {
  return `${p.specs.peso_max_carga_kg} kg`;
}

/** `null` en la ficha es "no lo declara": se escribe "Sin dato", nunca "No". */
export const SIN_DATO = "Sin dato";

export function memorias(p: Product): string {
  const base = p.specs.presets_memoria === null ? SIN_DATO : `${p.specs.presets_memoria}`;
  return p.specs.sistema_anticolision ? `${base} · anticolisión` : base;
}

export function anticolision(p: Product): string {
  return p.specs.sistema_anticolision === null ? SIN_DATO : p.specs.sistema_anticolision ? "Sí" : "No";
}

export function ruido(p: Product): string | null {
  return p.specs.ruido_db === null ? null : `${p.specs.ruido_db} dB`;
}

export function garantia(p: Product): string {
  return p.specs.garantia_anos === null ? SIN_DATO : `${p.specs.garantia_anos} años`;
}

export function tablero(p: Product): string {
  return p.incluye_tablero
    ? `${p.specs.ancho_tablero_cm}x${p.specs.profundidad_tablero_cm} cm`
    : "No incluido";
}

/** Las filas de la ficha tecnica, ya sin las que no tienen dato. */
export function fichaTecnica(p: Product): [string, string][] {
  const filas: [string, string | null][] = [
    ["Motor", motorLargo(p)],
    ["Carga", carga(p)],
    ["Recorrido", recorrido(p)],
    ["Memorias", memorias(p)],
    ["Ruido", ruido(p)],
    ["Estructura", p.specs.peso_estructura_kg !== null ? `${p.specs.peso_estructura_kg} kg` : null],
    ["Garantía", garantia(p)],
    ["Tablero", tablero(p)],
  ];
  return filas.filter((f): f is [string, string] => f[1] !== null);
}

/**
 * Standfirst del veredicto, compuesto con los datos de `specs`.
 *
 * No usa `veredicto` del JSON a proposito: hoy varios llevan precios y
 * recuentos de reseñas dentro del texto, y no pueden publicarse.
 *
 * Sin "la nota más alta del catálogo": las notas de gamas distintas no se
 * comparan (METODO.md §5, "Cómo se publica la nota").
 */
export function standfirst(p: Product): string {
  const frase = `Nota ${nota(p.puntuacion.total)} sobre 10 en su gama de precio.`;
  const ficha =
    p.specs.garantia_anos !== null
      ? `${motorCorto(p)}, ${carga(p)} de carga y ${garantia(p)} de garantía.`
      : `${motorCorto(p)} y ${carga(p)} de carga.`;
  const cierre = p.incluye_tablero
    ? `Tablero de ${p.specs.ancho_tablero_cm}x${p.specs.profundidad_tablero_cm} incluido.`
    : "No incluye tablero.";
  return `${frase} ${ficha} ${cierre}`;
}

export interface Camino {
  etiqueta: string;
  subtitulo: string;
  asin: string;
  producto: Product;
  texto: string;
}

/**
 * Los tres caminos de la seccion 2, por necesidad y no por presupuesto.
 *
 * Se derivan del catalogo en vez de fijar los ASIN a mano: el mejor marco,
 * el mejor modelo con tablero y el de mas carga. Con el catalogo actual
 * salen los mismos tres modelos que marca el diseño, y si el catalogo
 * cambia la seccion sigue diciendo la verdad.
 */
export function caminos(catalogo: [string, Product][]): Camino[] {
  const porNota = [...catalogo].sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total);

  const marco = porNota.find(([, p]) => !p.incluye_tablero);
  const conTablero = porNota.find(([, p]) => p.incluye_tablero);
  const usados = new Set([marco?.[0], conTablero?.[0]]);
  const masCarga = [...catalogo]
    .filter(([a]) => !usados.has(a))
    .sort(([, a], [, b]) => b.specs.peso_max_carga_kg - a.specs.peso_max_carga_kg)[0];

  const salida: Camino[] = [];

  if (marco) {
    const [asin, p] = marco;
    salida.push({
      etiqueta: "Solo el marco",
      subtitulo: "El tablero lo eliges tú",
      asin,
      producto: p,
      texto: `${motorCorto(p)}, ${carga(p)} y recorrido de ${coma(p.specs.rango_altura_min_cm)} a ${coma(p.specs.rango_altura_max_cm)} cm. El tablero, a tu medida.`,
    });
  }
  if (conTablero) {
    const [asin, p] = conTablero;
    const material = p.specs.material_tablero ? ` (${p.specs.material_tablero})` : "";
    salida.push({
      etiqueta: "Con tablero incluido",
      subtitulo: "Montar y usar, sin más compras",
      asin,
      producto: p,
      texto:
        p.specs.garantia_anos !== null
          ? `Tablero de ${p.specs.ancho_tablero_cm}x${p.specs.profundidad_tablero_cm}${material}, ${motorCorto(p).toLowerCase()} y ${garantia(p)} de garantía.`
          : `Tablero de ${p.specs.ancho_tablero_cm}x${p.specs.profundidad_tablero_cm}${material} y ${motorCorto(p).toLowerCase()}.`,
    });
  }
  if (masCarga) {
    const [asin, p] = masCarga;
    // "Lo mas amplio" solo si lo es: se comprueba contra el catalogo.
    const tramo = (q: Product) => q.specs.rango_altura_max_cm - q.specs.rango_altura_min_cm;
    const elMasAmplio = catalogo.every(([, q]) => tramo(q) <= tramo(p));
    salida.push({
      etiqueta: "Dos monitores o setup grande",
      subtitulo: "Cuando manda la carga",
      asin,
      producto: p,
      texto: `${carga(p)} de carga y recorrido de ${coma(p.specs.rango_altura_min_cm)} a ${coma(p.specs.rango_altura_max_cm)} cm${elMasAmplio ? ", lo más amplio del catálogo" : ""}. ${p.incluye_tablero ? `Tablero de ${p.specs.ancho_tablero_cm}x${p.specs.profundidad_tablero_cm} incluido.` : "Tampoco incluye tablero."}`,
    });
  }
  return salida;
}

/**
 * Guardarrail al renderizar. El JSON ya esta saneado y el validador del
 * catalogo (scripts/validar-catalogo.ts) rechaza cualquier frase con precio
 * o recuento de reseñas, asi que esto solo protege de un dato que se cuele
 * sin pasar por el validador.
 */
export { publicable } from "./cifras";

/** Titulo del modelo compuesto con lo que dice el catalogo. */
export function tituloModelo(p: Product): string {
  const cuerpo = p.incluye_tablero ? "mesa completa" : "marco";
  return `${p.modelo} · ${cuerpo}, ${motorCorto(p).toLowerCase()}`;
}

/** Las seis etiquetas de especificacion de la tarjeta destacada. */
export function etiquetasSpec(p: Product): string[] {
  const fuera: (string | null)[] = [
    motorLargo(p),
    carga(p),
    recorrido(p),
    p.specs.presets_memoria !== null ? `${p.specs.presets_memoria} memorias` : null,
    p.specs.sistema_anticolision ? "Anticolisión" : null,
    p.specs.garantia_anos !== null ? `${p.specs.garantia_anos} años de garantía` : null,
  ];
  return fuera.filter((x): x is string => x !== null);
}

/** Linea de meta de las filas del podio. */
export function metaFila(p: Product): string {
  return [motorCorto(p), carga(p), recorrido(p), `${coma(p.rating)}★`].join(" · ");
}

export interface Duda {
  pregunta: string;
  parrafos: string[];
  /** Enlace contextual, cuando la respuesta lleva de forma natural a una herramienta. */
  enlace?: { previo: string; texto: string; href: string; posterior: string };
}

/**
 * Las tres dudas de la seccion 5.
 *
 * Todas las cifras se calculan del catalogo, no se escriben a mano. El
 * prototipo dice "los 70 kg del modelo con tablero mas modesto" y con los
 * datos del repo son 50: preferimos que el texto siga al dato.
 */
export function dudas(catalogo: [string, Product][]): Duda[] {
  const ps = catalogo.map(([, p]) => p);
  const cargas = ps.map((p) => p.specs.peso_max_carga_kg);
  const conTablero = ps.filter((p) => p.incluye_tablero);
  const marcos = ps.filter((p) => !p.incluye_tablero);
  const dobles = ps.filter((p) => p.specs.tipo_motor === "doble");
  const simples = ps.filter((p) => p.specs.tipo_motor === "simple");

  const rango = (xs: number[]) => {
    const min = Math.min(...xs);
    const max = Math.max(...xs);
    return min === max ? coma(min) : `${coma(min)}–${coma(max)}`;
  };
  const ruidos = (g: Product[]) =>
    g.map((p) => p.specs.ruido_db).filter((r): r is number => r !== null);
  const velocidades = (g: Product[]) =>
    g.map((p) => p.specs.velocidad_cm_s).filter((v): v is number => v !== null);

  const enLista = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} y ${xs.at(-1)}`);
  // Velocidad y ruido solo de los modelos que los declaran (METODO.md §5):
  // si ninguno de un grupo los declara, esa cifra no se da.
  const datosMotor = (g: Product[]) => {
    const v = velocidades(g);
    const r = ruidos(g);
    return [
      ...(v.length ? [`suben a ${rango(v)} cm/s`] : []),
      ...(r.length ? [`declaran ${rango(r)} dB`] : []),
      `aguantan ${rango(g.map((p) => p.specs.peso_max_carga_kg))} kg`,
    ];
  };

  const cargaMinConTablero = Math.min(...conTablero.map((p) => p.specs.peso_max_carga_kg));
  const cargasMarcos = marcos
    .map((p) => p.specs.peso_max_carga_kg)
    .sort((a, b) => a - b)
    .map((c) => `${c}`)
    .join(" y ");

  // ¿Son los marcos los de mas carga y mas recorrido del catalogo?
  const porCarga = [...ps].sort((a, b) => b.specs.peso_max_carga_kg - a.specs.peso_max_carga_kg);
  const porRecorrido = [...ps].sort(
    (a, b) =>
      b.specs.rango_altura_max_cm - b.specs.rango_altura_min_cm -
      (a.specs.rango_altura_max_cm - a.specs.rango_altura_min_cm)
  );
  const marcosArriba =
    marcos.every((m) => porCarga.slice(0, marcos.length).includes(m)) &&
    marcos.every((m) => porRecorrido.slice(0, marcos.length).includes(m));

  const nombresMarcos = marcos.map((p) => `${p.marca} ${p.modelo}`).join(" y ");

  return [
    {
      pregunta: "¿Cuánta carga necesito de verdad?",
      parrafos: [
        `En el catálogo la carga declarada va de ${Math.min(...cargas)} a ${Math.max(...cargas)} kg, y el dato incluye todo lo que apoyes encima —el tablero también, si el modelo es solo marco. Un monitor, un portátil y accesorios no se acercan a los ${cargaMinConTablero} kg del modelo con tablero más modesto de la lista.`,
        `La carga solo decide de verdad en dos casos: tablero grueso a medida o dos monitores con brazo. Ahí es donde tienen sentido los ${cargasMarcos} kg de los marcos.`,
      ],
    },
    {
      pregunta: "¿Marco solo o con tablero?",
      parrafos: [
        `${conTablero.length} de los ${ps.length} modelos vienen con tablero. Los ${marcos.length} que no —${nombresMarcos}—${marcosArriba ? " son también los más capaces en carga y recorrido:" : ":"} pagas estructura y eliges tú medidas, grosor y acabado.`,
        "El tablero aparte es un coste que no publicamos porque no lo controlamos: depende del tablero que elijas. Súmalo antes de comparar un marco con una mesa completa, o la comparación no es honesta.",
      ],
      enlace: {
        previo: "El recorrido solo importa si cubre tu altura de trabajo:",
        texto: "calcula la tuya",
        href: "/calculadora-altura",
        posterior: "y compárala con el rango de cada modelo.",
      },
    },
    {
      pregunta: "¿Un motor o dos?",
      parrafos: [
        `Los ${dobles.length} modelos de doble motor del catálogo ${enLista(datosMotor(dobles))}. Los de motor simple ${enLista(datosMotor(simples))}.`,
        "Si la mesa va a subir y bajar varias veces al día, la diferencia se nota. Si vas a alternar entre dos alturas fijas, el motor simple cumple.",
      ],
    },
  ];
}

const PREFIJO_EXCLUSION = "No es tu mesa si";

/**
 * Parte la linea de exclusion en el arranque fijo y el motivo, para poder
 * destacar el primero. Si el texto no empieza como se espera, devuelve la
 * frase entera como motivo en vez de recortarla mal.
 */
export function exclusion(p: Product): { arranque: string; motivo: string } | null {
  const t = p.no_es_para?.trim();
  if (!t) return null;
  if (!t.startsWith(PREFIJO_EXCLUSION)) return { arranque: "", motivo: t };
  return { arranque: PREFIJO_EXCLUSION, motivo: t.slice(PREFIJO_EXCLUSION.length).trim() };
}

/**
 * Franja de precio con fecha de verificacion.
 *
 * Devuelve null si falta cualquiera de los tres datos: sin fecha la franja
 * es un precio sin caducidad declarada, que es justo lo que se quiere
 * evitar. Quien la llama no pinta nada cuando devuelve null.
 */
export function franjaPrecio(p: Product): string | null {
  const { precio_min: min, precio_max: max, precio_verificado: fecha } = p;
  if (min === null || max === null || !fecha) return null;

  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return null;
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");

  // "y", no "e": la "e" solo sustituye a la "y" delante de palabra que
  // empiece por sonido /i/, y ningun numero en castellano lo hace (ocho,
  // dieciocho, ciento... ninguno empieza por i).
  return `Entre ${min} y ${max} € en Amazon · verificado el ${dd}/${mm}/${d.getUTCFullYear()}`;
}

/** La fecha de verificacion en DD/MM/AAAA, o null si el modelo no publica franja. */
export function fechaVerificacion(p: Product): string | null {
  if (p.precio_min === null || p.precio_max === null || !p.precio_verificado) return null;
  const d = new Date(p.precio_verificado);
  if (Number.isNaN(d.getTime())) return null;
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getUTCFullYear()}`;
}

/**
 * La franja sola, sin "en Amazon" ni fecha: "110–150 €".
 *
 * Es la forma que va en una celda de tabla. La frase entera repetida en doce
 * filas dice doce veces lo mismo y deja sin sitio al resto de columnas; la
 * cabecera ya dice "Precio" y la fecha va una vez en la nota al pie.
 */
export function franjaCorta(p: Product): string | null {
  if (p.precio_min === null || p.precio_max === null || !p.precio_verificado) return null;
  return `${p.precio_min}–${p.precio_max} €`;
}

/**
 * Nota al pie que cubre las franjas de todas las filas de una tabla.
 * Devuelve null si ninguna fila publica franja.
 */
export function notaFranjas(productos: Product[]): string | null {
  const fechas = [...new Set(productos.map(fechaVerificacion).filter((f): f is string => !!f))];
  if (fechas.length === 0) return null;
  if (fechas.length === 1) {
    return `Franjas de precio comprobadas en Amazon el ${fechas[0]}.`;
  }
  const orden = [...fechas].sort((a, b) => invierte(a).localeCompare(invierte(b)));
  return `Franjas de precio comprobadas en Amazon entre el ${orden[0]} y el ${orden[orden.length - 1]}.`;
}

/** DD/MM/AAAA a AAAA-MM-DD, para poder ordenar fechas como texto. */
function invierte(f: string): string {
  const [dd, mm, aaaa] = f.split("/");
  return `${aaaa}-${mm}-${dd}`;
}
