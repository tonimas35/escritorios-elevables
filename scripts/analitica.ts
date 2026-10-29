/**
 * Descarga los datos de Search Console y de Google Analytics 4 y los deja en
 * salida/analitica/: un JSON con todo y un resumen en Markdown. Lo lanza cada
 * mañana .github/workflows/analitica.yml y lo sube como artefacto del
 * workflow, así Claude lo puede leer desde GitHub aunque el PC de Toni esté
 * apagado (CLAUDE.md, «Iniciativa»).
 *
 * Solo lee. Entra con una cuenta de servicio de Google con permiso de
 * lectura en las dos herramientas. Su clave vive en el secreto de GitHub
 * GOOGLE_SA_KEY y nunca se escribe en ningún fichero ni en el registro.
 *
 * Variables de entorno:
 *   GOOGLE_SA_KEY    JSON de la clave de la cuenta de servicio (secreto).
 *   GA4_PROPERTY_ID  número de la propiedad de GA4 (Administrar > Detalles).
 *   GSC_SITE         propiedad de Search Console; por defecto sc-domain:elevable.es.
 *
 * Sin dependencias: el token se firma con node:crypto (JWT RS256), como
 * explica la documentación de Google para cuentas de servicio.
 */
import { createSign } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";

const SITE = "https://elevable.es";
const GSC_SITE = process.env.GSC_SITE || "sc-domain:elevable.es";
const GA4 = process.env.GA4_PROPERTY_ID || "";
const clave = JSON.parse(process.env.GOOGLE_SA_KEY || "null") as {
  client_email: string;
  private_key: string;
} | null;
if (!clave) throw new Error("Falta GOOGLE_SA_KEY.");

const b64 = (s: string | Buffer) => Buffer.from(s).toString("base64url");

async function token(scope: string): Promise<string> {
  const ahora = Math.floor(Date.now() / 1000);
  const cabecera = b64(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const cuerpo = b64(
    JSON.stringify({
      iss: clave!.client_email,
      scope,
      aud: "https://oauth2.googleapis.com/token",
      iat: ahora,
      exp: ahora + 3600,
    }),
  );
  const firma = createSign("RSA-SHA256").update(`${cabecera}.${cuerpo}`).sign(clave!.private_key);
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${cabecera}.${cuerpo}.${b64(firma)}`,
    }),
  });
  const j = (await r.json()) as { access_token?: string; error_description?: string };
  if (!j.access_token) throw new Error(`Token de Google: ${j.error_description ?? r.status}`);
  return j.access_token;
}

async function pedir(url: string, tk: string, body?: unknown): Promise<unknown> {
  const r = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${tk}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`${r.status} en ${new URL(url).pathname}: ${JSON.stringify(j).slice(0, 300)}`);
  return j;
}

const dia = (d: number) => new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);
// Search Console tarda unos dos días en tener los datos completos.
const gscFin = dia(2);
const gscIni = dia(29);
const hoy = dia(0);
const errores: string[] = [];
const datos: Record<string, unknown> = { generado: new Date().toISOString(), gsc: {}, ga4: {} };

// ---------------- Search Console ----------------
type FilaGsc = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };
try {
  const tk = await token("https://www.googleapis.com/auth/webmasters.readonly");
  const base = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}`;
  const consulta = async (dimensions: string[], rowLimit = 250) =>
    ((await pedir(`${base}/searchAnalytics/query`, tk, { startDate: gscIni, endDate: gscFin, dimensions, rowLimit })) as {
      rows?: FilaGsc[];
    }).rows ?? [];
  const gsc = datos.gsc as Record<string, unknown>;
  gsc.periodo = { inicio: gscIni, fin: gscFin };
  gsc.por_dia = await consulta(["date"], 40);
  gsc.por_pagina = await consulta(["page"]);
  gsc.por_consulta = await consulta(["query"]);
  gsc.sitemaps = ((await pedir(`${base}/sitemaps`, tk)) as { sitemap?: unknown[] }).sitemap ?? [];

  // Estado de indexación de cada URL del sitemap (la API permite 2.000 al día).
  const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const indexacion: { url: string; veredicto: string; estado: string; ultimo_rastreo: string | null }[] = [];
  for (const url of urls) {
    try {
      const r = (await pedir("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", tk, {
        inspectionUrl: url,
        siteUrl: GSC_SITE,
      })) as { inspectionResult?: { indexStatusResult?: { verdict?: string; coverageState?: string; lastCrawlTime?: string } } };
      const s = r.inspectionResult?.indexStatusResult ?? {};
      indexacion.push({ url, veredicto: s.verdict ?? "?", estado: s.coverageState ?? "?", ultimo_rastreo: s.lastCrawlTime ?? null });
    } catch (e) {
      indexacion.push({ url, veredicto: "ERROR", estado: String(e).slice(0, 120), ultimo_rastreo: null });
    }
  }
  gsc.indexacion = indexacion;
} catch (e) {
  errores.push(`Search Console: ${e}`);
}

// ---------------- Google Analytics 4 ----------------
type FilaGa = { dimensionValues: { value: string }[]; metricValues: { value: string }[] };
if (!GA4) {
  errores.push("GA4: falta GA4_PROPERTY_ID.");
} else {
  try {
    const tk = await token("https://www.googleapis.com/auth/analytics.readonly");
    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4}:runReport`;
    const informe = async (dimensiones: string[], metricas: string[], extra: Record<string, unknown> = {}) => {
      const r = (await pedir(url, tk, {
        dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
        dimensions: dimensiones.map((name) => ({ name })),
        metrics: metricas.map((name) => ({ name })),
        limit: 250,
        ...extra,
      })) as { rows?: FilaGa[] };
      return (r.rows ?? []).map((f) =>
        Object.fromEntries([
          ...dimensiones.map((d, i) => [d, f.dimensionValues[i].value]),
          ...metricas.map((m, i) => [m, Number(f.metricValues[i].value)]),
        ]),
      );
    };
    const ga4 = datos.ga4 as Record<string, unknown>;
    ga4.periodo = "últimos 28 días hasta ayer";
    ga4.por_dia = await informe(["date"], ["sessions", "keyEvents"], { orderBys: [{ dimension: { dimensionName: "date" } }] });
    ga4.por_fuente = await informe(["sessionSource", "sessionMedium"], ["sessions", "keyEvents"]);
    ga4.por_entrada = await informe(["landingPage"], ["sessions", "keyEvents"]);
    // Clics a Amazon: el evento affiliate_click de lib/affiliate.ts, con el ASIN en la etiqueta.
    ga4.clics_amazon = await informe(["date", "pagePath"], ["eventCount"], {
      dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { value: "affiliate_click" } } },
    });
  } catch (e) {
    errores.push(`GA4: ${e}`);
  }
}

datos.errores = errores;

// ---------------- Resumen ----------------
const suma = (xs: Record<string, unknown>[] | undefined, k: string) =>
  (xs ?? []).reduce((s, x) => s + (Number(x[k]) || 0), 0);
const gsc = datos.gsc as { por_dia?: FilaGsc[]; por_pagina?: FilaGsc[]; por_consulta?: FilaGsc[]; indexacion?: { url: string; veredicto: string; estado: string }[] };
const ga4 = datos.ga4 as { por_fuente?: Record<string, unknown>[]; por_entrada?: Record<string, unknown>[]; clics_amazon?: Record<string, unknown>[] };
const lineas = [
  `# Analítica de elevable.es · ${hoy}`,
  "",
  `## Search Console (${gscIni} a ${gscFin})`,
  `- Clics: ${(gsc.por_dia ?? []).reduce((s, f) => s + f.clicks, 0)} · Impresiones: ${(gsc.por_dia ?? []).reduce((s, f) => s + f.impressions, 0)}`,
  "",
  "| Página | Clics | Impr. | Posición |",
  "|---|---|---|---|",
  ...(gsc.por_pagina ?? []).slice(0, 15).map((f) => `| ${f.keys[0].replace(SITE, "") || "/"} | ${f.clicks} | ${f.impressions} | ${f.position.toFixed(1)} |`),
  "",
  "| Consulta | Clics | Impr. | Posición |",
  "|---|---|---|---|",
  ...(gsc.por_consulta ?? []).slice(0, 15).map((f) => `| ${f.keys[0]} | ${f.clicks} | ${f.impressions} | ${f.position.toFixed(1)} |`),
  "",
  "### Sin indexar",
  ...((gsc.indexacion ?? []).filter((x) => x.veredicto !== "PASS").map((x) => `- ${x.url.replace(SITE, "") || "/"}: ${x.estado}`) || []),
  "",
  "## GA4 (28 días hasta ayer)",
  `- Sesiones: ${suma(ga4.por_fuente, "sessions")} · Eventos clave: ${suma(ga4.por_fuente, "keyEvents")} · Clics a Amazon: ${suma(ga4.clics_amazon, "eventCount")}`,
  "",
  "| Fuente / medio | Sesiones | Eventos clave |",
  "|---|---|---|",
  ...(ga4.por_fuente ?? [])
    .sort((a, b) => Number(b.sessions) - Number(a.sessions))
    .slice(0, 12)
    .map((f) => `| ${f.sessionSource} / ${f.sessionMedium} | ${f.sessions} | ${f.keyEvents} |`),
  "",
  "| Página de entrada | Sesiones | Eventos clave |",
  "|---|---|---|",
  ...(ga4.por_entrada ?? [])
    .sort((a, b) => Number(b.sessions) - Number(a.sessions))
    .slice(0, 12)
    .map((f) => `| ${f.landingPage} | ${f.sessions} | ${f.keyEvents} |`),
  "",
  errores.length ? `## Errores\n${errores.map((e) => `- ${e}`).join("\n")}` : "",
];

const carpeta = new URL("../salida/analitica/", import.meta.url).pathname;
mkdirSync(carpeta, { recursive: true });
writeFileSync(`${carpeta}${hoy}.json`, JSON.stringify(datos, null, 2));
writeFileSync(`${carpeta}resumen.md`, lineas.join("\n"));
console.log(lineas.slice(0, 4).join("\n"));
if (errores.length) {
  console.error(errores.join("\n"));
  process.exit(1);
}
