/**
 * "Según tu caso": qué modelo encaja con cada situación concreta de compra.
 *
 * Es la forma en que la gente pregunta a un asistente ("mido 1,90", "tengo
 * poco sitio", "hago videollamadas"), así que la guía responde así además de
 * por franja de precio (SEO-PLAN.md §0, P2).
 *
 * Todo se calcula del catálogo y solo con datos declarados: un modelo con el
 * dato en null no entra en un caso que dependa de ese dato (METODO.md §5). Los
 * empates se deshacen por nota, luego por valoración y luego por slug, para
 * que el resultado no dependa del orden del JSON.
 *
 * Función pura, sin alias de rutas, para poder probarla con node --test.
 */
import type { Product } from "./types";

export interface Caso {
  id: string;
  /** La situación, tal como la diría quien compra. */
  situacion: string;
  producto: Product;
  /** Por qué este modelo, con los datos que lo justifican. */
  motivo: string;
}

const coma = (n: number) => String(n).replace(".", ",");
const nombre = (p: Product) => `${p.marca} ${p.modelo}`;
const desempate = (a: Product, b: Product) =>
  b.puntuacion.total - a.puntuacion.total || b.rating - a.rating || a.slug.localeCompare(b.slug);

/** El mejor según `valor` (mayor o menor), con desempate estable. */
function mejor(ps: Product[], valor: (p: Product) => number, mayor: boolean): Product | undefined {
  return [...ps].sort((a, b) => (mayor ? valor(b) - valor(a) : valor(a) - valor(b)) || desempate(a, b))[0];
}

const puntoMedio = (p: Product) => (p.precio_min! + p.precio_max!) / 2;

/** " (empatado con X)" si otro del grupo comparte el valor: el superlativo no sería cierto a secas. */
function empate(elegido: Product, grupo: Product[], valor: (p: Product) => number): string {
  const otros = grupo.filter((p) => p.slug !== elegido.slug && valor(p) === valor(elegido));
  return otros.length ? ` (empatado con ${otros.map(nombre).join(" y ")})` : "";
}

export function casos(catalogo: Product[]): Caso[] {
  const activos = catalogo.filter((p) => p.disponible);
  const completos = activos.filter((p) => p.incluye_tablero);
  const marcos = activos.filter((p) => !p.incluye_tablero);
  const salida: Caso[] = [];

  // Alto: el que más sube. Si es un marco, se dice hasta dónde llegan los
  // completos, porque quien compra puede no querer poner tablero.
  const alto = mejor(activos, (p) => p.specs.rango_altura_max_cm, true);
  if (alto) {
    const topeCompletos = Math.max(...completos.map((p) => p.specs.rango_altura_max_cm));
    const extra =
      !alto.incluye_tablero && completos.length
        ? ` Es un marco: los que traen tablero se quedan en ${coma(topeCompletos)} cm como mucho.`
        : "";
    salida.push({
      id: "alto",
      situacion: "Si eres alto",
      producto: alto,
      motivo: `Sube hasta ${coma(alto.specs.rango_altura_max_cm)} cm, lo máximo del catálogo${empate(alto, activos, (p) => p.specs.rango_altura_max_cm)}.${extra}`,
    });
  }

  // Poco espacio: el tablero más estrecho de los que lo traen.
  const compacto = mejor(completos, (p) => p.specs.ancho_tablero_cm, false);
  if (compacto) {
    salida.push({
      id: "espacio",
      situacion: "Si tienes poco espacio",
      producto: compacto,
      motivo: `Tablero de ${compacto.specs.ancho_tablero_cm}x${compacto.specs.profundidad_tablero_cm} cm, el más estrecho de los que vienen con tablero${empate(compacto, completos, (p) => p.specs.ancho_tablero_cm)}.`,
    });
  }

  // Dos monitores o equipo pesado: la mayor carga con tablero incluido. Si un
  // marco aguanta más, se menciona.
  const fuerte = mejor(completos, (p) => p.specs.peso_max_carga_kg, true);
  if (fuerte) {
    const marcoFuerte = mejor(marcos, (p) => p.specs.peso_max_carga_kg, true);
    const extra =
      marcoFuerte && marcoFuerte.specs.peso_max_carga_kg > fuerte.specs.peso_max_carga_kg
        ? ` Sin tablero, el ${nombre(marcoFuerte)} llega a ${marcoFuerte.specs.peso_max_carga_kg} kg.`
        : "";
    salida.push({
      id: "carga",
      situacion: "Si vas a poner dos monitores o mucho peso",
      producto: fuerte,
      motivo: `${fuerte.specs.peso_max_carga_kg} kg de carga${fuerte.specs.tipo_motor === "doble" ? " con doble motor" : ""}, la mayor de los que vienen con tablero${empate(fuerte, completos, (p) => p.specs.peso_max_carga_kg)}.${extra}`,
    });
  }

  // Silencio: el menor ruido declarado con tablero. Solo entre los que lo
  // declaran, y se dice cuántos no lo hacen.
  const conRuido = completos.filter((p) => p.specs.ruido_db !== null);
  const silencioso = mejor(conRuido, (p) => p.specs.ruido_db!, false);
  if (silencioso) {
    const sinDato = completos.length - conRuido.length;
    salida.push({
      id: "ruido",
      situacion: "Si haces videollamadas o trabajas en silencio",
      producto: silencioso,
      motivo: `Declara ${silencioso.specs.ruido_db} dB, lo menos de los que vienen con tablero y dan el dato${empate(silencioso, conRuido, (p) => p.specs.ruido_db!)}.${sinDato ? ` ${sinDato} de ${completos.length} no lo declaran.` : ""}`,
    });
  }

  // Tablero propio: el mejor marco de la franja más baja con marcos.
  const marcosConFranja = marcos.filter((p) => p.precio_min !== null && p.precio_max !== null);
  const marcoBarato = mejor(marcosConFranja, puntoMedio, false);
  if (marcoBarato) {
    salida.push({
      id: "marco",
      situacion: "Si quieres elegir tu propio tablero",
      producto: marcoBarato,
      motivo: `El marco más asequible del catálogo: ${marcoBarato.specs.peso_max_carga_kg} kg y de ${coma(marcoBarato.specs.rango_altura_min_cm)} a ${coma(marcoBarato.specs.rango_altura_max_cm)} cm. El tablero se compra aparte.`,
    });
  }

  // Anticolisión al menor precio, con tablero: solo los que la declaran.
  const conAnticolision = completos.filter(
    (p) => p.specs.sistema_anticolision === true && p.precio_min !== null && p.precio_max !== null,
  );
  const seguro = mejor(conAnticolision, puntoMedio, false);
  if (seguro) {
    salida.push({
      id: "anticolision",
      situacion: "Si quieres anticolisión gastando lo mínimo",
      producto: seguro,
      motivo: `El más asequible de los que vienen con tablero y declaran anticolisión: el motor se para si choca con algo al bajar.`,
    });
  }

  return salida;
}
