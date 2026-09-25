/**
 * Avisa a Bing (y al resto de buscadores de IndexNow) de las URLs del sitio
 * tras cada despliegue a producción. ChatGPT busca sobre todo en el índice de
 * Bing, así que cuanto antes sepa Bing de un cambio, antes lo puede citar
 * (SEO-PLAN.md §0, P1).
 *
 * Lo lanza .github/workflows/indexnow.yml cuando Vercel marca el despliegue
 * de producción como correcto. Manda todas las URLs del sitemap: son unas
 * veinte, muy por debajo del límite de 10.000 por envío.
 *
 * La clave no es secreta: IndexNow la comprueba leyendo el fichero público
 * public/<clave>.txt, que demuestra que el dominio es nuestro.
 */
export {};

const SITE = "https://elevable.es";
const CLAVE = "3bbe5c4ec6ff064f314d33202d6bc4fa";

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
urls.push(`${SITE}/llms.txt`);

const respuesta = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: CLAVE,
    keyLocation: `${SITE}/${CLAVE}.txt`,
    urlList: urls,
  }),
});

console.log(`IndexNow: ${urls.length} URLs, respuesta ${respuesta.status}`);
// 200 y 202 son aceptadas; cualquier otra cosa hace fallar el job.
if (respuesta.status !== 200 && respuesta.status !== 202) {
  console.error(await respuesta.text());
  process.exit(1);
}
