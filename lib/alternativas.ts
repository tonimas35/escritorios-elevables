/**
 * Alternativas de la ficha de modelo (design-ref/code/README.md, "Logica de
 * alternativas"). Se calculan, no se escriben a mano.
 *
 * Regla de oro: las alternativas se quedan en la categoria del modelo que se
 * esta leyendo. Quien lee un escritorio completo de 100 cm no esta
 * comparando un marco de 160 kg.
 *
 * Funcion pura, sin alias de rutas, para poder probarla con node --test.
 */
import type { Product } from "./types";
import { franja } from "./nota.ts";

export interface Alternativa {
  motivo: string;
  producto: Product;
}

const porNota = (a: Product, b: Product) =>
  b.puntuacion.total - a.puntuacion.total || b.rating - a.rating || a.slug.localeCompare(b.slug);

export function alternativas(actual: Product, catalogo: Product[], cuantas = 3): Alternativa[] {
  const resto = catalogo.filter((p) => p.disponible && p.slug !== actual.slug).sort(porNota);
  const conTablero = resto.filter((p) => p.incluye_tablero);
  const marcos = resto.filter((p) => !p.incluye_tablero);
  const simpleConTablero = conTablero.filter((p) => p.specs.tipo_motor === "simple");

  const candidatas: [string, Product | undefined][] = [];

  if (actual.incluye_tablero) {
    // El mas cercano por arriba, no el mejor del catalogo.
    const escalon = conTablero
      .filter((p) => p.puntuacion.total > actual.puntuacion.total)
      .sort((a, b) => a.puntuacion.total - b.puntuacion.total || porNota(a, b))[0];
    // Mas grande o mas compacto: primero dentro de su franja de precio
    // (METODO.md §2). Quien mira un completo de 100-160 € no busca uno mas
    // pequeño de 400 €. Si en la franja no hay otro ancho, cualquiera.
    const ancho = actual.specs.ancho_tablero_cm;
    const deTamano = (cmp: (a: number) => boolean, desc: boolean) => {
      for (const grupo of [conTablero.filter((p) => franja(p) === franja(actual)), conTablero]) {
        const anchos = [...new Set(grupo.map((p) => p.specs.ancho_tablero_cm))].filter(cmp).sort((a, b) => (desc ? b - a : a - b));
        if (anchos.length) return grupo.find((p) => p.specs.ancho_tablero_cm === anchos[0]);
      }
      return undefined;
    };
    const doble = actual.specs.tipo_motor !== "doble";

    candidatas.push(
      ["El siguiente escalón", escalon],
      ["Si quieres un tablero más grande", deTamano((a) => a > ancho, false)],
      ["Si te vale uno más compacto", deTamano((a) => a < ancho, true)],
      doble
        ? ["Si quieres doble motor", conTablero.find((p) => p.specs.tipo_motor === "doble")]
        : ["Si te sobra con motor simple", simpleConTablero[0]],
      ["Si prefieres elegir tu tablero", marcos[0]],
    );
  } else {
    candidatas.push(
      ["Si quieres tablero incluido", conTablero[0]],
      ["Si necesitas más carga", resto.find((p) => p.specs.peso_max_carga_kg > actual.specs.peso_max_carga_kg)],
      ["El otro marco del catálogo", marcos[0]],
      ["Si te sobra con motor simple", simpleConTablero[0]],
    );
  }

  // Relleno garantizado: primero la misma categoria, luego cualquiera.
  const misma = actual.incluye_tablero ? conTablero : marcos;
  for (const p of misma) candidatas.push([actual.incluye_tablero ? "También con tablero incluido" : "También sin tablero", p]);
  for (const p of resto) candidatas.push(["También en el top del catálogo", p]);

  const vistos = new Set<string>();
  const salida: Alternativa[] = [];
  for (const [motivo, p] of candidatas) {
    if (!p || vistos.has(p.slug)) continue;
    vistos.add(p.slug);
    salida.push({ motivo, producto: p });
    if (salida.length === cuantas) break;
  }
  return salida;
}
