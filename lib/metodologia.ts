/**
 * Frase de firma. Va literal en todos los sitios donde aparece el autor,
 * para que la web diga siempre lo mismo sobre como se hace el analisis.
 */
export function firmaMetodologia(total: number): string {
  return `${total} modelos analizados a partir de las fichas de fabricante y las valoraciones de Amazon.`;
}

/**
 * Los cinco apartados con los que se puntua cada modelo.
 *
 * Vivian dentro de app/metodologia/page.tsx. Al necesitarlos tambien la
 * seccion 6 de la home, se suben aqui para que no haya dos copias que
 * puedan divergir.
 */
export const CRITERIOS = [
  {
    nombre: "Calidad de construcción",
    base: "Materiales, grosor del perfil, número de secciones telescópicas y peso de la estructura.",
  },
  {
    nombre: "Estabilidad",
    base: "Carga máxima declarada, peso propio y altura máxima. A más recorrido, más palanca.",
  },
  {
    nombre: "Facilidad de montaje",
    base: "Peso de las piezas, si el tablero viene perforado y lo que reportan las valoraciones.",
  },
  {
    nombre: "Relación calidad-precio",
    base: "Prestaciones frente al precio dentro de su franja, no en términos absolutos.",
  },
  {
    nombre: "Funcionalidades",
    base: "Memorias de altura, anticolisión, velocidad, ruido y garantía.",
  },
];
