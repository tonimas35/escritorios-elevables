# Plan de migración al diseño Broadsheet

> Referencia visual: `design-ref/`. Lee `design-ref/README.md` antes que nada:
> ahí están las decisiones cerradas y lo que queda fuera de alcance.
>
> Estado al escribir este plan: nada implementado. Tag `pre-rediseno` sobre el
> estado previo (commit `a9a5495`; ver la nota al final sobre su push).

## Regla que manda sobre todo

**El diseño de referencia se aplica SOBRE la arquitectura actual.** No se adopta
su código, ni su estructura de datos, ni su configuración.

En concreto, y sin excepciones:

- No se copia HTML de los `.dc.html`, ni `support.js`, ni `_ds/*`. Se leen para
  saber cómo debe quedar; se reescribe en React Server Components + Tailwind v4.
- No se adopta el array `MODELOS` del prototipo. La fuente de datos sigue siendo
  `data/productos.json` indexado por ASIN, leído por `lib/products.ts`.
- No se adoptan sus tokens `--color-accent: #0088b0` ni el resto del sistema
  Broadsheet genérico. Solo entran los valores que `design-ref/README.md` fija.
- No se toca la arquitectura de rutas, el middleware, el schema ni GA4 salvo
  donde este plan lo diga explícitamente y con motivo.
- Ningún fichero de `app/` o `components/` importa o enlaza nada de `design-ref/`.

---

## 1. Qué stack es y cómo está organizado

| | |
|---|---|
| Framework | Next.js **16.2.1**, App Router, TypeScript `strict` |
| React | 19.2.4 |
| Estilos | **Tailwind v4** vía `@import "tailwindcss"` en `app/globals.css`. No hay `tailwind.config`; el tema se declara con `@theme inline` y variables CSS en `:root` |
| Build | `@tailwindcss/postcss` en `postcss.config.mjs` |
| Lint | `npm run lint` → `eslint` (flat config, `eslint-config-next`) |
| Tests | **No hay.** Tampoco CI |
| Despliegue | Vercel (dominio canónico `elevable.es`) |

Organización:

- `app/` — 11 rutas + `layout.tsx`. Todas son Server Components salvo tres
  (`comparador`, `calculadora-altura`, `que-escritorio-elevable-comprar`), que
  llevan `"use client"` y sacan su `metadata` a un `layout.tsx` hermano.
- `components/` — 11 componentes. Dos son cliente: `AffiliateButton` (por
  `trackClick`) y `MobileMenuButton`. Tres están **muertos**: `QuickVerdict`,
  `RatingBar`, `StarRating` (cero importaciones).
- `lib/` — `types.ts` (interfaces), `products.ts` (acceso y filtros),
  `affiliate.ts` (enlace + evento), `format.ts` (banda de precio, reseñas
  aproximadas), `schema.ts` (JSON-LD), `calculator.ts`.
- `data/` — `productos.json` y `verificacion-amazon.md` (notas de verificación
  contra Amazon).
- `middleware.ts` — 301 de `/test` y `X-Robots-Tag: noindex` para cualquier host
  que no sea `elevable.es`.
- `public/` — `robots.txt` y `sitemap.xml` **estáticos, escritos a mano**.
- `SEO-PLAN.md` — diagnóstico y hoja de ruta SEO viva. Este rediseño no la
  sustituye: la toca en varios puntos y hay que mantenerla al día.

Nota operativa: en el contenedor remoto **no hay `node_modules`**, así que ni
`npm run lint` ni `next build` se han podido ejecutar para tomar una línea base.

## 2. Cómo está estructurado el contenido de los 12 modelos

Vive **entero** en `data/productos.json` (675 líneas). Es un objeto indexado por
ASIN, no un array:

```
"B084KW7N8C": { nombre, marca, modelo, precio, precio_habitual, imagen,
                imagen_alt, rating, num_reviews, disponible, tipo,
                incluye_tablero, specs{14 campos}, categorias[], pros[],
                contras[], veredicto, puntuacion{5 criterios + total},
                ideal_para, slug }
```

- Tipado en `lib/types.ts` (`Product`, `ProductSpecs`, `ProductScore`,
  `ProductMap`). El JSON se importa en tiempo de compilación y se castea:
  `productosData as unknown as ProductMap`. **No hay validación en runtime.**
- Todo acceso pasa por `lib/products.ts`: `getAllProducts`, `getProduct`,
  `getProductBySlug`, `getAvailableProducts`, `getTopProducts`,
  `filterProducts`, `getProductsInHeightRange`.
- Los 12 están `disponible: true`. Orden por `puntuacion.total`: E7 9,7 ·
  FLEXISPOT 160x80 9,5 · T2 Pro MAX 9,4 · S2 Pro 9,3 · SANODESK 9,2 ·
  SONGMICS 9,1 · Devoko 160 8,9 · ErGear 8,8 · VASAGLE 160 8,7 · Devoko 120 8,7
  · FEZIBO 8,5 · VASAGLE 100 8,1.
- Solo 3 de los 12 tienen página propia: `/flexispot-e7-opiniones`,
  `/fezibo-opiniones`, `/maidesite-t2-pro-opiniones`.

**Comprobación hecha:** las especificaciones de los 12 modelos del prototipo
coinciden **exactamente** con las del repo (motor, velocidad, carga, recorrido,
ruido, memorias, anticolisión, peso, garantía, tablero, ancho, profundidad, nota
y rating). No hay deriva de datos. Lo único que cambia el prototipo es el copy.

Higiene pendiente en el JSON (valores, nunca claves):

- **11 frases con precio** dentro de `pros`/`contras`/`veredicto`
  ("solo 80 EUR", "por 110 EUR", "160 cm de tablero por menos de 120 EUR").
- **11 frases con recuento de reseñas** ("2100+ reviews", "951 valoraciones", "(70)").
- **11 frases con decimal en punto** ("4.6 estrellas").
- Tildes: `estandar`×5, `catalogo`×3, `pequenos`/`pequeno`×3, `anticolision`×2,
  `relacion`, `solida`, `construccion`, `limite`. Cuidado: esas mismas cadenas
  aparecen en **claves** (`sistema_anticolision`, `relacion_calidad_precio`,
  `calidad_construccion`, `garantia_anos`) y ahí no se tocan.

## 3. Dónde están los enlaces de afiliado y el tag

Un solo sitio: **`lib/affiliate.ts`**.

```ts
const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || "escritoriosel-21";
affiliateLink(asin) → https://www.amazon.es/dp/{asin}?tag={TAG}&linkCode=ogi&th=1&psc=1
```

- El tag `escritoriosel-21` está **hardcodeado como fallback**; se puede
  sobrescribir con `NEXT_PUBLIC_AMAZON_TAG`. No aparece en ningún otro fichero.
- `affiliateLink` tiene dos consumidores: `components/AffiliateButton.tsx` (el
  `href` visible) y `lib/schema.ts` (`offers.url` del JSON-LD de producto).
- `AffiliateButton` es el **único** componente que renderiza un enlace a Amazon,
  y siempre con `target="_blank" rel="nofollow sponsored noopener"`. Lo usan 7
  páginas + `ProductCard` + `QuickVerdict`.
- `trackClick(asin)` dispara el evento GA4 `affiliate_click` (categoría
  `affiliate`, label = ASIN). Es la métrica de negocio del sitio: **no se puede
  perder en el rediseño**.

Consecuencia para el plan: los CTA cambian de aspecto y de texto, pero el
contrato (`rel`, `target`, `trackClick`, `affiliateLink`) se mantiene intacto.

## 4. Qué hay montado de SEO, sitemap, metadatos y tracking

- **Metadatos**: `metadataBase: https://elevable.es`, plantilla de título
  `"%s — Elevable"`, OpenGraph básico en `app/layout.tsx`.
  `alternates.canonical` en **las 11 rutas** (en el `layout.tsx` hermano cuando
  la página es cliente).
- **Datos estructurados**: `WebSite` en el layout; `BreadcrumbList` en 8 rutas;
  `FAQPage` en 5; `Product` + `Review` + `AggregateRating` + `Offer` +
  `additionalProperty` vía `lib/schema.ts` en las reviews y los dos pilares;
  `ItemList` en `/mejor-escritorio-elevable` y `/escritorio-elevable-barato`.
  `offers` va **deliberadamente sin `price`** (Amazon los cambia a diario).
- **Sitemap**: `public/sitemap.xml`, estático, 12 URLs, `lastmod` a mano
  (2026-09-08). `public/robots.txt` lo referencia.
- **Middleware**: 301 de `/test` → `/que-escritorio-elevable-comprar`;
  `noindex, nofollow` en cualquier host distinto de `elevable.es`.
- **Tracking**: GA4 `G-DYSVBYSJN7` con `next/script` (`afterInteractive`) en el
  `<head>` del layout, más el evento `affiliate_click`.
- Contexto de negocio en `SEO-PLAN.md`: la fuente principal de tráfico es
  **ChatGPT** (53,7 % de las sesiones), no Google; la página que se lo lleva casi
  todo es `/mejor-escritorio-elevable`; solo 2 páginas indexadas en Google. El
  rediseño **no toca esa página** en sus fases iniciales, y eso es a propósito.

## 5. Qué distancia real hay entre lo que existe y el diseño

Grande en la capa visual, pequeña en la de datos. Medida:

**Sistema visual — se sustituye entero.** `app/globals.css` son 664 líneas con
~45 clases propias y una paleta cobre `#c47a3a` + verde `#2d4a3e` + tres
familias tipográficas (Fraunces por `<link>`, Source Serif 4 y JetBrains Mono por
`next/font`). El diseño pide papel `#f3f2f2` / tinta `#201e1d` / verde
estructural, **una sola familia** (Source Serif 4), radio 2px y **cero sombras**.

**El acoplamiento es el problema, no el CSS.** Las clases y tokens que el diseño
elimina están usados en **todo el sitio**, no solo en la home:

| Elemento a eliminar | Ficheros que lo usan |
|---|---|
| `var(--font-display)` (Fraunces) | 15 |
| `var(--accent)` (cobre) | 15 |
| `.mono` / `var(--font-mono)` | 11 |
| `.editorial-mark` | 10 |
| `.product-image-container` | 6 |
| `.editorial-rule` | 3 |
| `.btn-primary` | `AffiliateButton` + home |
| `hero-mesh`, `decorative-number`, `animate-fade-up`, `stagger-*` | solo la home |

Cambiar los tokens en `:root` repinta **las 11 páginas a la vez**, y el diseño
solo especifica dos de ellas. Esta es la decisión estructural del plan (§7.1).

**Home (`app/page.tsx`, 350 líneas)** — reescritura completa. Hoy: hero con malla
de gradientes, barra de estadísticas verde con contadores animados, "Top 7 de un
vistazo" con precios, tres tarjetas por franja de precio, cuatro enlaces a guías.
El diseño pide: veredicto directo, tres caminos **por necesidad**, podio,
comparativa filtrable de los 12, tres dudas, metodología. Solo sobrevive la idea
de tabla comparativa, y con otras columnas.

**Ficha de modelo** — no existe como plantilla. Hay 3 páginas escritas a mano de
~3.000 palabras cada una, con estructura propia, FAQ y schema.

**Componentes** — `AffiliateButton` cambia estilo y texto por defecto;
`ProductCard` se rehace sin precio ni reseñas; `Header` pasa de barra pegajosa
con logo SVG a riel de cabecera con filetes; `Footer` pierde el párrafo grande de
afiliado. `AnimatedCounter` y `FadeIn` desaparecen de las pantallas rediseñadas
(pero los usan 8 páginas más). `QuickVerdict`, `RatingBar` y `StarRating` ya
están muertos y se pueden borrar sin más.

**Copy con precios y reseñas fuera del JSON** — el diseño prohíbe ambos "en
ninguna parte", y hoy hay **68 menciones de precio** en la prosa escrita a mano:
`/escritorio-elevable-barato` 26, `/flexispot-vs-maidesite` 10,
`/mejor-escritorio-elevable` 8, `/fezibo-opiniones` 7, `/maidesite-t2-pro` 6,
`/flexispot-e7` 5, home 3, `/que-escritorio-elevable-comprar` 3. Más 12
menciones de recuentos de reseñas. `SEO-PLAN.md` ya registra esto como pendiente
y **descarta la conversión automática**: rompía rangos ("entre 40 y 150 euros" →
"entre 40 y 150-200 €"). Es reescritura a mano, página por página.

**Lo que ya encaja y no hay que tocar**: la fuente de datos, `lib/products.ts`,
`lib/affiliate.ts`, el schema, el middleware, GA4, la política de no publicar
precios exactos (`lib/format.ts` ya existe justamente por eso) y el hecho de que
Source Serif 4 ya esté cargada.

## 6. Qué datos pide el diseño que hoy no existen en el repo

Tres campos editoriales por modelo, **36 cadenas** que alguien tiene que escribir
o aprobar. El prototipo ya las trae redactadas (en la clase de lógica de
`Elevable — Ficha de modelo.dc.html`), pero son **texto inventado por la
herramienta de diseño**, no dato del repo:

| Campo | Para qué | Ejemplo |
|---|---|---|
| `titular` | H1 de la ficha de modelo | *"E7: el mejor marco elevable del mercado"* |
| `no_es_para` | La línea "No es tu mesa si" del hero, el podio y la ficha | *"No quieres comprar el tablero aparte ni montarla entre dos personas."* |
| `define` | La frase de una línea en filas de podio y alternativas | *"Lo mejor en estabilidad y recorrido. No incluye tablero."* |

Además, y sin sitio en el JSON:

- **Copy saneado** de `veredicto` (11 de 12 cambian), `pros` y `contras`, sin
  precios ni recuentos. El prototipo trae una versión; hay que revisarla, no
  pegarla a ciegas.
- **Los textos de la sección 5 de la home** ("las tres dudas"): tres preguntas y
  sus respuestas, redactadas contra los datos del JSON. Viven en
  `Elevable.dc.html` sección 5. Cada cifra que contienen es verificable.
- **Una única fecha de publicación** para el riel de cabecera
  ("Septiembre de 2026"). Hoy hay dos fuentes que se contradicen: la constante
  `ACTUALIZADO` calculada en cada render y un `"Mar 2026"` fijo. Debe ser un
  valor único y explícito, no un `new Date()`.
- **Un formateador de coma decimal** (`9.7` → `9,7`). Trivial, va en
  `lib/format.ts`.
- **La posición en el catálogo** ("Nº 6 de 12"). Es derivable del orden por
  `puntuacion.total`, no hace falta guardarla.

Lo que **no** hace falta inventar: ninguna especificación. Están todas.

## 7. Decisiones que hay que tomar antes de escribir código

### 7.1 Alcance del cambio de tokens (bloqueante para F2)

El diseño cubre 2 pantallas; los tokens viven en `:root` y afectan a 11. Tres
salidas:

- **A — Sweep completo.** Cambiar `:root` y arreglar las 11 páginas. Coherente,
  pero mete 8 páginas no diseñadas en el rediseño y multiplica el riesgo sobre
  `/mejor-escritorio-elevable`, que es la página que cita ChatGPT.
- **B — Tokens nuevos en paralelo.** Añadir la paleta Broadsheet como variables
  nuevas (`--paper`, `--ink`, `--bottle`…) sin tocar las viejas, y usarlas solo
  en las pantallas rediseñadas. Convive un tiempo con dos sistemas; hay un salto
  visual al navegar de la home a `/mejor-escritorio-elevable`.
- **C — B y luego A.** Empezar por B, y cuando home y ficha estén validadas,
  migrar el resto y borrar la paleta vieja.

**Recomendación: C.** Permite validar el diseño en producción sin arriesgar la
única página que hoy genera tráfico, y no deja dos sistemas para siempre.

### 7.2 Rutas de las 12 fichas (bloqueante para F5)

El diseño propone `/[slug]-opiniones`. Aplicado a los `slug` del JSON produce
URLs **distintas de las ya indexadas**:

| Slug en JSON | URL que generaría | URL real hoy |
|---|---|---|
| `fezibo-120` | `/fezibo-120-opiniones` | `/fezibo-opiniones` |
| `maidesite-t2-pro-max` | `/maidesite-t2-pro-max-opiniones` | `/maidesite-t2-pro-opiniones` |
| `flexispot-e7` | `/flexispot-e7-opiniones` | igual ✅ |

Cambiar las URLs de dos páginas ya indexadas por un detalle de nomenclatura es
perder señales a cambio de nada. **Propuesta: mantener las 3 rutas estáticas tal
cual** y añadir un mapa explícito slug→ruta en `lib/products.ts` para las 9
nuevas. Ninguna redirección, ningún cambio de URL existente.

### 7.3 Las 3 reviews largas no se sustituyen por la plantilla (bloqueante para F5)

Las páginas del E7, Fezibo y MAIDeSITe tienen ~3.000 palabras cada una, FAQ y
schema propio. La plantilla del diseño rinde ~600 palabras. Sustituirlas sería
tirar el activo de contenido descrito en `SEO-PLAN.md` §2 ("no tocar").
**La plantilla se estrena en los 9 modelos que hoy no tienen página**, y las 3
existentes solo adoptan el sistema visual, conservando su contenido.

### 7.4 `aggregateRating` con el recuento oculto (no bloqueante, pero decidir)

El diseño quita de la página toda cifra de reseñas, pero `lib/schema.ts` sigue
declarando `aggregateRating.reviewCount` con `num_reviews`. Google pide que lo
que se declara en datos estructurados sea visible en la página; además
`SEO-PLAN.md` documenta que **2 de 3 recuentos verificados estaban inflados**.
Hay que elegir: dejar de declarar `aggregateRating`, o verificar los 12 ASIN
contra Amazon y dejar visible al menos la nota media (`4,7★`, que el diseño **sí**
muestra). Hasta decidirlo, no se toca `lib/schema.ts`.

### 7.5 Fuera de alcance, ya decidido

Está en `design-ref/README.md` y no se reabre aquí: **la matriz de notas por
apartado no se implementa** y **`relacion_calidad_precio` no se muestra**. Dos
consecuencias prácticas para este plan:

- La sección 6 de la home lleva "Cómo puntuamos" y "De dónde salen los datos",
  **sin** la tabla de 12×5.
- `CompactRatings` (que hoy pinta los 5 criterios en 6 páginas) y el criterio
  "Relación calidad-precio" de `app/metodologia/page.tsx` quedan **como están**
  hasta que se resuelva la contradicción. No se borran a escondidas dentro de
  este rediseño.

---

## 8. Fases

Cada fase es un commit (o unos pocos) que deja el sitio desplegable. Ninguna
depende de trabajo futuro para no romper nada.

### F0 — Línea base *(sin cambios de producto)*

- `npm install`; **leer `node_modules/next/dist/docs/`** antes de escribir código
  (lo exige `AGENTS.md`: esta versión de Next tiene cambios de API respecto a lo
  que uno da por sabido). Verificar convenciones actuales de `metadata`, rutas
  dinámicas y `next/font`.
- Ejecutar `npm run lint` y `next build` y **anotar el resultado**. Sin línea
  base no se sabe qué rompe el rediseño y qué ya estaba roto.
- Capturar la home y las 3 reviews actuales a `design-ref/screenshots/`.
- Confirmar que el tag `pre-rediseno` está en el remoto.

**Salida:** build y lint verdes (o su estado documentado) y capturas del antes.

### F1 — Datos y copy *(sin cambios visuales)*

- Sanear `data/productos.json`: quitar las 11 frases con precio y las 11 con
  recuento de reseñas, pasar decimales a coma, corregir tildes **solo en
  valores**.
- Añadir `titular`, `no_es_para` y `define` a los 12 modelos. Redactados a partir
  del prototipo, revisados uno a uno contra las specs.
- Ampliar `lib/types.ts` con los tres campos. Empezar por opcionales (`?:`) para
  que el JSON y el tipo no diverjan si algo falta; pasarlos a obligatorios cuando
  los 12 estén completos.
- Añadir el formateador de coma decimal a `lib/format.ts`. **No** tocar
  `priceBand` ni `reviewsAprox`: los siguen usando 8 páginas.
- Fijar la fecha de publicación como constante única y borrar `ACTUALIZADO`
  del render de la home cuando llegue F4.

**Salida:** `next build` verde, la web idéntica salvo por el copy corregido.
**Riesgo:** bajo. Es el trabajo de mayor valor por unidad de riesgo del plan.

### F2 — Tokens y tipografía

- Añadir la paleta Broadsheet a `app/globals.css` según la opción elegida en
  §7.1 (recomendado: variables nuevas en paralelo).
- `app/layout.tsx`: quitar el `<link>` de Fraunces y el `next/font` de JetBrains
  Mono. Ojo: `var(--font-display)` se usa en 15 ficheros y `.mono` en 11 — si se
  van las fuentes sin arreglar los usos, 8 páginas caen al fallback. O se hace
  con la opción A/C completa, o las variables viejas siguen apuntando a algo
  válido hasta F6.
- Portar el bloque `.cmyk-num` desde `design-ref/code/_ds/.../styles.css`,
  reescrito a mano y sin importar la hoja.

**Salida:** tokens disponibles; ninguna página cambia todavía si se eligió B/C.

### F3 — Componentes base

- `AffiliateButton`: fondo tinta, texto crema, hover verde, radio 2px, sin
  barrido ni sombras; texto por defecto **"Ver precio actual en Amazon"**; fuera
  la variante `showPrice`. **Intactos** `rel`, `target`, `trackClick` y
  `affiliateLink`. Sigue siendo `"use client"`.
- Nuevo componente para la línea de afiliado bajo el CTA (12–13px, `#7d7979`,
  una línea) — es un patrón que se repite en las dos pantallas.
- Nuevo componente de nota en cuatricromía (`.cmyk-num`): el texto real accesible
  en `.paper` y las planchas con `aria-hidden`.
- Riel de cabecera y firma del autor (monograma "T", círculo de 44px).
- `Footer`: quitar el párrafo grande de afiliado.

**Salida:** componentes nuevos con su sitio, aún sin consumidores nuevos.
**Riesgo:** `AffiliateButton` lo usan 7 páginas; su cambio de estilo se ve en
todas a la vez. Es aceptable y deliberado: el CTA debe ser el mismo en todo el
sitio.

### F4 — Home

Reescribir `app/page.tsx` con las seis secciones. Server Component, salvo la
sección 4, que va en una isla cliente con los cuatro estados de filtro y orden
(`tablero`, `cargaMin`, `anchoMin`, `orden`), derivando el resultado sin estado
adicional. Punto de corte único a 700px, resuelto con media queries y las dos
variantes renderizadas en servidor — no con `ResizeObserver`, que es un artefacto
del prototipo. Fuera del render: `hero-mesh`, `AnimatedCounter`, `FadeIn`,
`priceBand`, `reviewsAprox`, la barra de estadísticas y el `new Date()`.

**Salida:** home nueva; `alternates.canonical: "/"` intacto; el evento
`affiliate_click` sigue disparándose (verificar en GA4 en tiempo real).
**Riesgo:** medio. La home no es la página que trae el tráfico, lo que la
convierte en el sitio adecuado para estrenar el sistema.

### F5 — Ficha de modelo

- Componente de plantilla con las seis secciones de la pantalla 2, alimentado
  por `lib/products.ts`.
- Lógica de alternativas (§"Lógica de alternativas" del handoff) implementada en
  `lib/products.ts` como función pura y **con tests** — es la única pieza del
  rediseño con reglas de negocio no triviales, y hoy el repo no tiene ni un test.
- Estrenarla en los **9 modelos sin página**, con las rutas decididas en §7.2.
- Aplicar solo el sistema visual a las 3 reviews existentes, sin tocar su
  contenido (§7.3).
- Actualizar `public/sitemap.xml` (12 → 21 URLs) y `lastmod`.
- Reutilizar `lib/schema.ts` tal cual para las 9 nuevas, con la decisión de §7.4
  ya tomada.

**Salida:** 9 URLs nuevas indexables, las 3 antiguas sin cambio de contenido.
**Riesgo:** medio-alto. Es donde se toca superficie indexada.

### F6 — Barrido del resto del sitio

- Migrar las 8 páginas restantes a los tokens nuevos y retirar la paleta vieja
  (cierre de la opción C).
- Reescribir a mano las **68 menciones de precio** y las 12 de recuentos de
  reseñas en la prosa. Página por página; la conversión automática ya se probó y
  se descartó (`SEO-PLAN.md`).
- Borrar `QuickVerdict`, `RatingBar` y `StarRating` (muertos), y `AnimatedCounter`
  y `FadeIn` cuando dejen de tener consumidores.
- Limpiar de `globals.css` lo que ya no use nadie.

**Salida:** un solo sistema visual y cero precios publicados en todo el sitio.

### F7 — Cierre

- `npm run lint` y `next build` verdes.
- Verificar en el HTML servido: canonical en las 21 rutas, JSON-LD válido
  (Rich Results Test), `rel="nofollow sponsored noopener"` en todos los CTA.
- Comprobar `affiliate_click` en GA4 y compararlo con la línea base de F0.
- Actualizar `SEO-PLAN.md` (§3 problemas resueltos, §6.a) y `design-ref/README.md`
  si alguna decisión de §7 cambió algo.
- Tag `post-rediseno`.

---

## 9. Orden y dependencias

```
F0 ─→ F1 ─→ F2 ─→ F3 ─→ F4 ─→ F5 ─→ F6 ─→ F7
       │                  │
       └─ independiente   └─ decisión §7.1 debe estar tomada antes de F2
                              decisiones §7.2 y §7.3 antes de F5
```

F1 se puede hacer y desplegar sola, hoy, sin esperar a ninguna decisión de
diseño: mejora la veracidad del sitio por su cuenta.

## 10. Cómo se sabe que no se ha roto nada

Sin tests y sin CI, la red de seguridad es manual y corta:

1. `next build` en cada fase (detecta imports rotos y tipos).
2. Las 21 URLs devuelven 200 y llevan su canonical.
3. `affiliate_click` sigue llegando a GA4 con el ASIN correcto.
4. El tag `escritoriosel-21` aparece en el `href` de todos los CTA.
5. Rich Results Test sobre una review y sobre el pilar.
6. Comparar con las capturas de F0.

Lo primero que conviene añadir es lo que F5 ya pide: tests de la lógica de
alternativas y del formateo. No hace falta montar un framework para el resto.
