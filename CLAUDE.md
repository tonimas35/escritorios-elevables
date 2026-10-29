@AGENTS.md

# Reglas del proyecto

Aplican a todas las sesiones, siempre, sin que haga falta recordarlas.

## Antes de empezar

**Lee `SEO-PLAN.md` §0, `PLAN-CATALOGO.md`, `PLAN.md`, `MANTENIMIENTO.md` y este
fichero al empezar cualquier sesión.** `SEO-PLAN.md` §0 es el plan en curso:
dónde está el tráfico y qué toca, por orden. `PLAN-CATALOGO.md`, el método de
selección, la nota calculada y la rotación del catálogo (en mantenimiento
desde el 25/09); `PLAN.md`, la auditoría del
repo y el plan de migración por fases (casi terminado);
`MANTENIMIENTO.md`, el índice del catálogo —ASIN, slug, dónde sale cada modelo—
y la rutina de revisión; `design-ref/README.md`, las decisiones de diseño ya
cerradas y lo que queda fuera de alcance.

## Iniciativa

**Claude no espera a que le traigan las ideas: las busca, las evalúa y las
trae ya filtradas** (pedido por Toni el 26/10/2026). En cada sesión, sin que
haga falta pedirlo:

1. Mira qué toca hoy: el calendario de publicación (artifact «Calendario
   Elevable», colección `posts`), `SEO-PLAN.md` §0 y las rutinas de
   `MANTENIMIENTO.md`.
2. Lee los datos del día en la rama `analitica` del repo (`datos/resumen.md`
   y `datos/AAAA-MM-DD.json`, con Search Console, indexación de cada URL y
   GA4): los deja cada mañana `.github/workflows/analitica.yml` y se leen
   aunque el PC de Toni esté apagado. Después, las fuentes que estén a mano
   en el Chrome de Toni: el cupo gratuito de
   Semrush (10 consultas cada 24 horas desde el último uso, no a medianoche),
   Search Console, Google Trends, Amazon.es (novedades y más vendidos) y la
   competencia que sale en las búsquedas que importan.
3. Cada idea, con su evaluación: impacto esperado en clics a Amazon, esfuerzo,
   riesgo y si encaja con `METODO.md`. Se presenta como **hacer**, **más
   adelante** o **descartar**, con el motivo, y lo descartado también se
   apunta en `SEO-PLAN.md` para no volver a mirarlo.
4. Lo que no cambia el catálogo, la marca ni un texto publicado redactado de
   nuevo, Claude lo hace y lo cuenta. Lo demás, con el visto bueno de Toni.

No se hace trabajo porque sí: si no toca nada y no hay una mejora con impacto
claro, se dice y ya.

## Afiliación

**Nunca modificar los enlaces de afiliado ni el tag `escritoriosel-21`.** Viven
en `lib/affiliate.ts` y de ahí no se mueven. Tampoco se toca el formato del
enlace, ni `rel="nofollow sponsored noopener"`, ni `target="_blank"`, ni el
evento `trackClick`. Si algo del rediseño parece exigir cambiarlo, es que está
mal planteado: pregunta antes.

## Datos de producto

**Nunca inventar datos de producto.** La fuente es `data/productos.json`. Si
falta un dato, se deja vacío y **me avisas**; no se estima, no se deduce de un
modelo parecido y no se copia de una herramienta de diseño.

Esto incluye el texto redactado por el prototipo de `design-ref/` (los campos
`titular`, `no_es_para` y `define`): es material de diseño, no dato del repo.
Necesita revisión y visto bueno antes de entrar en el JSON.

## Precios

**Precio exacto: nunca. Franja amplia con fecha de verificación: sí, en el
formato `franjaPrecio()` ya implementado.** La función vive en `lib/ficha.ts` y
solo publica algo cuando los tres campos del modelo están rellenos
(`precio_min`, `precio_max`, `precio_verificado` en `data/productos.json`); si
falta uno, no se enseña franja. Ninguna cifra suelta fuera de ese formato: ni en
componentes, ni en prosa, ni en `pros`/`contras`/`veredicto` del JSON, ni en
datos estructurados. El CTA sigue siendo "Ver precio actual en Amazon": el
precio al céntimo vive en Amazon.

## Alcance

**La matriz de notas por apartado está fuera de alcance.** No se construye. El
motivo está en `design-ref/README.md` § FUERA DE ALCANCE, junto con el criterio
"relación calidad-precio", que sigue sin resolver.

## Commits

**Un commit por sección. Nunca un commit que toque varias.** Sección = una
unidad del rediseño (una de las seis de la home, una de la ficha de modelo) o
una unidad del plan de fases. Si un cambio transversal —tokens, un componente
compartido— afecta a varias, va en su propio commit, separado y antes.

Mensajes en castellano, describiendo qué cambia y por qué.

## Verificación

**Verificar en navegador a 375px y a 1440px antes de dar una sección por hecha.**
Las dos anchuras, siempre, no una. El punto de corte del diseño es 700px, así
que 375 y 1440 caen a cada lado. Que compile no es que esté hecho.

En este entorno hay Chromium con Playwright ya configurado
(`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`); no ejecutes `playwright install`.

## Idioma

**Castellano con tildes correctas**, en la interfaz, en el contenido, en los
comentarios y en los mensajes de commit. Cuidado al corregir tildes en
`data/productos.json`: se corrigen los **valores**, nunca las claves
(`sistema_anticolision`, `relacion_calidad_precio`, `calidad_construccion`,
`garantia_anos` se quedan como están).
