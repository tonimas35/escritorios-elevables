import { getAvailableProducts } from "/home/claude/escritorios-elevables/lib/products.ts";
import { franja, posicionEnFranja, gama } from "/home/claude/escritorios-elevables/lib/nota.ts";
const cat = getAvailableProducts().map(([, p]) => p);
for (const p of cat) { const pos = posicionEnFranja(p, cat); console.log(p.slug.padEnd(24), franja(p), gama(p), p.puntuacion.total, pos?.posicion+'/'+pos?.de, pos?.empateCon.map(q=>q.slug).join(',')); }
