/**
 * Valida data/productos.json y data/cambios-catalogo.json contra las reglas
 * de CLAUDE.md y METODO.md. Uso: `npm run validar`.
 *
 * Sale con error si hay algo que no se puede publicar. Los avisos (franjas
 * viejas, datos pendientes) se enseñan pero no rompen nada.
 */
import { readFileSync } from "node:fs";
import type { CambioCatalogo, ProductMap } from "../lib/types";
import { validarCandidatos, validarCatalogo, type Candidato } from "../lib/validacion.ts";

const leer = <T>(ruta: string): T =>
  JSON.parse(readFileSync(new URL(`../${ruta}`, import.meta.url), "utf8")) as T;

const productos = leer<ProductMap>("data/productos.json");
const catalogo = validarCatalogo(productos, leer<CambioCatalogo[]>("data/cambios-catalogo.json"), new Date());
const candidatos = validarCandidatos(leer<{ modelos: Candidato[] }>("data/candidatos.json").modelos, productos);
const errores = [...catalogo.errores, ...candidatos.errores];
const avisos = [...catalogo.avisos, ...candidatos.avisos];

for (const a of avisos) console.log(`aviso  ${a}`);
for (const e of errores) console.error(`ERROR  ${e}`);
console.log(`\n${errores.length} errores, ${avisos.length} avisos`);
process.exit(errores.length ? 1 : 0);
