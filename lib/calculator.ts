// Ergonomic height calculator based on EN 527-1 and OSHA guidelines
// Input: user height in cm
// Output: recommended desk heights

export interface ErgonomicResult {
  alturaSentado: number; // desk height sitting (cm)
  alturaDePie: number; // desk height standing (cm)
  alturaMonitor: number; // monitor top edge height from floor (cm)
  alturaSilla: number; // seat height (cm)
}

export function calculateErgonomicHeight(estaturaCm: number): ErgonomicResult {
  // EN 527-1: desk height ≈ 0.4138 × body height (sitting)
  // Standing: elbow height ≈ 0.63 × body height
  const alturaSentado = Math.round(estaturaCm * 0.4138);
  const alturaDePie = Math.round(estaturaCm * 0.63);
  const alturaMonitor = Math.round(alturaDePie + 40); // monitor center ~40cm above desk
  const alturaSilla = Math.round(estaturaCm * 0.25);

  return { alturaSentado, alturaDePie, alturaMonitor, alturaSilla };
}
