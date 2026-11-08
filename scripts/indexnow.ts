/**
 * Avisa a Bing (y al resto de buscadores de IndexNow) de las URLs del sitio
 * que han cambiado tras un despliegue a producción. ChatGPT busca sobre todo
 * en el índice de Bing, así que cuanto antes sepa Bing de un cambio, antes lo
 * puede citar (SEO-PLAN.md §0, P1).
 *
 * Solo se avisa de lo que ha cambiado. Hasta el 8/11 se mandaban las ~30 URLs
 * del sitemap en cada despliegue, también en los que solo tocaban un .md, y
 * Bing llevaba desde el 21/10 sin rastrear nada nuevo: su guía pide enviar
 * solo URLs nuevas o modificadas. Para saber qué ha cambiado, se guarda una
 * huella (SHA-256 del texto visible, sin scripts ni estilos, que cambian en
 * cada build) de cada URL y se compara con la del despliegue anterior. Las
 * huellas viven en la rama «analitica» (datos/indexnow-huellas.json); el
 * workflow las trae antes y las guarda después.
 *
 * La primera vez, sin huellas previas, solo se guardan: no se avisa de nada.
 *
 * La clave no es secreta: IndexNow la comprueba leyendo el fichero público
 * public/<clave>.txt, que demuestra que el dominio es nuestro.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const SITE = "https://elevable.es";
const CLAVE = "3bbe5c4ec6ff064f314d33202d6bc4fa";
const HUELLAS = process.env.HUELLAS ?? "indexnow-huellas.json";

/** Texto visible de la página: lo que cambia cuando cambia el contenido. */
export function huella(html: string): string {
  const texto = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(title|meta)[^>]*>/gi, (m) => ` ${m.match(/content="([^"]*)"/)?.[1] ?? ""} `)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return createHash("sha256").update(texto).digest("hex");
}

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
urls.push(`${SITE}/llms.txt`);

const previas: Record<string, string> | null = existsSync(HUELLAS) ? JSON.parse(readFileSync(HUELLAS, "utf8")) : null;
const actuales: Record<string, string> = {};
for (const url of urls) {
  const r = await fetch(url);
  // Si una página falla, se conserva su huella anterior para no avisar de un error.
  actuales[url] = r.ok ? huella(await r.text()) : (previas?.[url] ?? "");
}
writeFileSync(HUELLAS, JSON.stringify(actuales, null, 2) + "\n");

if (!previas) {
  console.log(`IndexNow: primera vez, se guardan ${urls.length} huellas y no se avisa de nada.`);
  process.exit(0);
}
const cambiadas = urls.filter((u) => actuales[u] && previas[u] !== actuales[u]);
if (cambiadas.length === 0) {
  console.log("IndexNow: ninguna URL ha cambiado, no se avisa.");
  process.exit(0);
}

const respuesta = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: CLAVE,
    keyLocation: `${SITE}/${CLAVE}.txt`,
    urlList: cambiadas,
  }),
});

console.log(`IndexNow: ${cambiadas.length} de ${urls.length} URLs han cambiado, respuesta ${respuesta.status}`);
for (const u of cambiadas) console.log(`  ${u}`);
// 200 y 202 son aceptadas; cualquier otra cosa hace fallar el job.
if (respuesta.status !== 200 && respuesta.status !== 202) {
  console.error(await respuesta.text());
  process.exit(1);
}
