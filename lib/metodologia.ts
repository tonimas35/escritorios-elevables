import { PESOS } from "./nota";

/**
 * Frase de firma. Va literal en todos los sitios donde aparece el autor,
 * para que la web diga siempre lo mismo sobre como se hace el analisis.
 */
export function firmaMetodologia(total: number): string {
  return `${total} modelos analizados a partir de las fichas de fabricante y las valoraciones de Amazon.`;
}

/**
 * Los cinco apartados de la nota, con su peso y lo que miden. Es la
 * version legible de `calcularNota()` en lib/nota.ts y de METODO.md §5:
 * si cambia uno, cambian los tres.
 *
 * Los pesos se leen de `PESOS` para que el texto publicado no pueda
 * divergir de la formula.
 */
export const CRITERIOS = [
  {
    nombre: "Estabilidad y estructura",
    peso: PESOS.estabilidad,
    base: "Carga máxima declarada, motor doble o simple y peso de la estructura.",
  },
  {
    nombre: "Funciones",
    peso: PESOS.funciones,
    base: "Memorias de altura, anticolisión, velocidad y ruido.",
  },
  {
    nombre: "Recorrido",
    peso: PESOS.recorrido,
    base: "Altura mínima y máxima: si sirve de sentado a una persona de 1,55 m y de pie a una de 1,95 m.",
  },
  {
    nombre: "Garantía",
    peso: PESOS.garantia,
    base: "Años de garantía que declara el fabricante.",
  },
  {
    nombre: "Valoración de compradores",
    peso: PESOS.valoracion,
    base: "Nota media en Amazon España, solo si tiene al menos 100 valoraciones. Si no llega, este apartado no cuenta.",
  },
];
