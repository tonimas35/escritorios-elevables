// Calculadora de alturas: aproximación por proporciones corporales medias.
// No sale de una norma: la EN 527-1 da rangos de altura para mesas, no una
// fórmula por estatura.
// Input: user height in cm
// Output: recommended desk heights

export interface ErgonomicResult {
  alturaSentado: number; // desk height sitting (cm)
  alturaDePie: number; // desk height standing (cm)
  alturaMonitor: number; // monitor top edge height from floor (cm)
  alturaSilla: number; // seat height (cm)
}

export function calculateErgonomicHeight(estaturaCm: number): ErgonomicResult {
  // Sentado: altura de la mesa ≈ 0,4138 × estatura.
  // De pie: altura del codo ≈ 0,63 × estatura.
  const alturaSentado = Math.round(estaturaCm * 0.4138);
  const alturaDePie = Math.round(estaturaCm * 0.63);
  const alturaMonitor = Math.round(alturaDePie + 40); // borde de arriba del monitor, ~40 cm sobre la mesa de pie
  const alturaSilla = Math.round(estaturaCm * 0.25);

  return { alturaSentado, alturaDePie, alturaMonitor, alturaSilla };
}
