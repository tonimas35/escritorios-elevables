@AGENTS.md

# Reglas del proyecto

Aplican a todas las sesiones, siempre, sin que haga falta recordarlas.

## Antes de empezar

**Lee `PLAN.md` y este fichero al empezar cualquier sesión.** `PLAN.md` tiene la
auditoría del repo y el plan de migración por fases; `design-ref/README.md`, las
decisiones de diseño ya cerradas y lo que queda fuera de alcance.

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

**Ni precios ni rangos de precio en ninguna parte.** Ni en componentes, ni en
prosa, ni en `pros`/`contras`/`veredicto` del JSON, ni en datos estructurados.
El CTA es "Ver precio actual en Amazon": el precio vive en Amazon.

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
