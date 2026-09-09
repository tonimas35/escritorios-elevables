# Handoff: rediseño de la parte superior de elevable.es

## Overview

Rediseño de la home de elevable.es (comparador de escritorios elevables con enlaces
de afiliado de Amazon) más una plantilla de ficha de modelo individual. El objetivo
del diseño: que alguien que ya ha decidido comprar y está atascado eligiendo modelo
sepa en 30 segundos cuál comprar y por qué, con un tono de análisis independiente y
no de web de afiliados.

Repo destino: `tonimas35/escritorios-elevables` (Next.js App Router, TypeScript,
Tailwind v4 vía `@import "tailwindcss"` en `app/globals.css`).

## About the Design Files

Los ficheros `.dc.html` de este paquete son **referencias de diseño hechas en HTML**:
prototipos que muestran el aspecto y el comportamiento buscados. **No son código de
producción y no deben copiarse tal cual.** Se abren en el navegador pero dependen de
un runtime propio (`support.js`) que no tiene nada que ver con el proyecto destino.

La tarea es **recrear estos diseños en el entorno que ya existe en el repo**: React
Server Components de Next.js, Tailwind, los componentes de `components/` y los tokens
de `app/globals.css`. Toda la estructura de datos ya está en el repo — no hay que
inventar ni un dato.

## Fidelity

**Alta fidelidad.** Colores, tipografía, escala de tamaños, espaciado y estados
finales. Recréalo con precisión. Los valores exactos están en "Design tokens" y en
las especificaciones de cada sección.

---

## Design tokens

El diseño abandona la paleta actual (cobre `#c47a3a` + verde `#2d4a3e` + Fraunces) y
adopta el sistema **Broadsheet**: papel, tinta y serif único, con dos añadidos que
pidió el cliente — CTA en negro tinta y verde botella como color estructural.

### Color

| Rol | Valor | Uso |
| --- | --- | --- |
| Papel (fondo de página) | `#f3f2f2` | `body` |
| Tinta (texto y CTA) | `#201e1d` | texto, fondo de todos los botones de acción |
| Crema (texto sobre tinta) | `#f8f4f4` | texto dentro de los CTA y sobre verde |
| Verde botella | `#2d4a3e` | **solo estructura**: filetes, cabeceras de tabla, etiquetas de especificación, kickers de sección, avatar, borde del `<button>` de filtro, hover de los CTA |
| Verde tinte | `#e8f0ec` | fondo de la celda "Global" en la matriz de notas |
| Superficie (tarjeta) | `#eae9e9` | fondo de la tarjeta de producto recomendado |
| Blanco | `#ffffff` | **solo** el marco de las fotos de producto |
| Neutro 200 | `#eae7e7` | canal vacío de las barras del desglose |
| Neutro 700 | `#7d7979` | texto secundario, etiquetas `<dt>`, microcopy legal |
| Neutro 800 | `#444141` | párrafos de apoyo (standfirst, respuestas) |
| Divisor | `color-mix(in srgb, #201e1d 16%, transparent)` | separadores finos internos |

Reglas de color, no negociables (las pidió el cliente de forma explícita):

- **Prohibido el cian** (`#0088b0`) **y el naranja terracota** (`#c47a3a`) en cualquier
  elemento de interfaz.
- El **único color vivo** de la página es el desregistro de cuatricromía de las cifras
  de puntuación (ver más abajo). En ningún otro sitio.
- El verde botella **nunca** rellena un botón. Solo filetes, fondos de cabecera,
  bordes y texto de etiqueta.

### Tipografía

Una sola familia: **Source Serif 4** (ya está cargada en `app/layout.tsx` vía
`next/font/google`). **Elimina Fraunces y JetBrains Mono**: el diseño no usa display
ni monoespaciada. El serif es también la tipografía de interfaz.

Escala (todos los tamaños son fluidos con `clamp()`, móvil → escritorio):

| Elemento | Tamaño | Peso | Line-height | Letter-spacing |
| --- | --- | --- | --- | --- |
| H1 home | `clamp(34px, 5.6vw, 64px)` | 600 | 1.02 | -0.022em |
| H1 ficha | `clamp(32px, 5vw, 56px)` | 600 | 1.04 | -0.022em |
| H2 sección | `clamp(27px, 3.4vw, 40px)` | 600 | 1.1 | -0.02em |
| H2 ficha | `clamp(25px, 3vw, 34px)` | 600 | 1.1 | -0.02em |
| H3 | `clamp(20px, 2.2vw, 26px)` | 600 | 1.15–1.2 | — |
| Standfirst | `clamp(17px, 1.7vw, 21px)` | 400 | 1.5 | — |
| Cuerpo | `clamp(15px, 1.5vw, 18px)` | 400 | 1.55–1.6 | — |
| Kicker de sección | 12px | 400 | — | 0.18em, `uppercase` |
| Etiqueta pequeña | 11px | 400 | — | 0.16em, `uppercase` |
| Microcopy legal | 12–13px | 400 | 1.5 | — |
| Riel de cabecera | `clamp(10px, 1.1vw, 12px)` | 400/600 | 1.5 | 0.14em, `uppercase` |

`line-height` base del documento: **1.6**. Medida máxima de los párrafos: entre
`30ch` y `66ch` según el bloque (está anotado en cada sección).

### Radios, sombras, espaciado

- **Radio**: `2px` en botones y en la tarjeta. Nada más lleva radio. El avatar del
  autor es `50%`.
- **Sombras**: ninguna. La página es papel abierto; la jerarquía la dan el tamaño y
  el aire.
- **Anchura de contenido**: `max-width: 1180px`, `margin: 0 auto`,
  `padding-inline: clamp(20px, 4vw, 56px)`.
- **Separación entre secciones**: `padding-top: clamp(52px, 7vw, 96px)`.
- **Filetes**: cabecera `4px solid #201e1d` (grueso) + `1px solid #201e1d` (fino) con
  el riel de fecha entre ambos; separador de sección `2px solid #2d4a3e`; separador de
  fila `1px solid #201e1d`; separador interno `1px solid var(--divisor)`.

### El desregistro de cuatricromía (las cifras de puntuación)

Es el detalle de marca del diseño y **hay que replicarlo**. Cada cifra de puntuación
se imprime como cuatro planchas mal registradas sobre el blanco del papel. La
construcción está en la hoja del sistema (`_ds/.../styles.css`, clase `.cmyk-num`) y
es CSS puro, sin SVG ni filtros:

```html
<span class="cmyk-num" style="font-size: 82px; font-weight: 700">
  <span class="paper">9,7</span>
  <span class="plate plate-c" aria-hidden="true">9,7</span>
  <span class="plate plate-m" aria-hidden="true">9,7</span>
  <span class="plate plate-y" aria-hidden="true">9,7</span>
</span>
```

- `.paper` lleva el texto real (el que leen los lectores de pantalla) en color papel,
  con `text-shadow` desplazado para construir la unión del glifo.
- Las tres `.plate` son repeticiones `aria-hidden` en cian, magenta y amarillo de
  proceso, con `mix-blend-mode: multiply` y un desplazamiento en `em` distinto cada
  una. El solape multiplicado produce el negro del núcleo.
- Si la cifra va sobre un fondo que no es el papel (la tarjeta, `#eae9e9`), pásale
  `--cmyk-num-ground: #eae9e9` o las planchas pierden su fondo.

Copia el bloque `.cmyk-num` de `_ds/broadsheet-.../styles.css` a `app/globals.css` tal
cual. Está en el paquete.

---

## Reglas de contenido (restricciones duras)

Estas reglas vienen del cliente y de la propia normativa de Amazon. Romper una
invalida el diseño.

1. **Ningún precio ni rango de precio en ninguna parte.** Elimina `priceBand()` de
   toda la parte superior. El CTA es siempre **"Ver precio actual en Amazon"**. Bajo
   cada CTA principal, en gris pequeño y en una línea: *"Enlace de afiliado: si
   compras, Amazon nos paga una comisión y tú pagas lo mismo."*
2. **Ninguna cifra de número de opiniones.** Elimina `reviewsAprox()` y el contador de
   "11000+ opiniones verificadas". La nota media (`4,7★`) **sí** se muestra.
3. **Una sola fecha en toda la página**, en el riel de cabecera: *"Septiembre de
   2026"*. Elimina la constante `ACTUALIZADO` calculada en `app/page.tsx` y el
   `"Mar 2026"` fijo del bloque de estadísticas: se contradecían.
4. **Frase de metodología, literal y en todos los sitios donde aparezca la firma**:
   *"12 modelos analizados a partir de las fichas de fabricante y las valoraciones de
   Amazon."* Sustituye a *"No probamos los escritorios físicamente"* como línea de
   firma (esa frase sigue viva, pero solo como titular de la sección 6).
5. **Firma del autor**: avatar circular de 44px, fondo `#2d4a3e`, letra `T` en crema a
   21px/600. Sin foto. Texto al lado: *"Por **Toni**"* y debajo la frase del punto 4
   en `#7d7979`.
6. **Declaración de afiliado** siempre en gris pequeño bajo el CTA, una línea. **No**
   hay bloque grande de dos columnas al final (el diseño anterior lo tenía; se quitó).
7. **Ningún dato que no esté en `data/productos.json`.** Sin especificaciones
   inventadas, sin pesos de ponderación inventados (ver "Cuestión abierta").
8. **Sin señales de urgencia**: nada de contadores, "X personas viendo esto", avisos
   de stock, testimonios ni cifras redondas de credibilidad.
9. **Castellano con tildes correctas.** El JSON del repo tiene errores (`pequenos`,
   `anticolision`, `estandar`, `reviews`, `garantía` sin tilde en algunos sitios); el
   diseño los corrige al mostrarlos. Lo ideal es **corregirlos en el propio
   `productos.json`**.
10. **Decimales con coma**, no con punto: `9,7` y no `9.7`. Formateador:
    `String(n).replace('.', ',')`.

---

## Pantallas

### Pantalla 1 — Home (`app/page.tsx`)

Seis secciones. Principio rector: **cada sección dice una cosa y respira**; lo que va
debajo del veredicto no compite con él.

#### Riel de cabecera (todas las pantallas)

`padding-top: 22px` → filete de `4px` en tinta → fila flex `space-between` con
`padding: 9px 0` → filete de `1px` en tinta.

Izquierda: `<strong>Elevable</strong> · Análisis independiente`.
Derecha, en `#7d7979`: `Septiembre de 2026`.
Ambos a `clamp(10px, 1.1vw, 12px)`, `letter-spacing: 0.14em`, `uppercase`.

#### Sección 1 — Hero (veredicto directo)

Dos columnas flex con envoltura: izquierda `flex: 1 1 400px`, derecha `flex: 0 1 340px`,
`gap: clamp(28px, 4vw, 56px)`. Por debajo de ~740px se apila sola.

Columna izquierda, en orden:

1. Kicker: `Nº 01 · Veredicto` — 12px / 0.18em / uppercase / `#2d4a3e`.
2. H1: **"El mejor escritorio elevable de 2026 es el Flexispot E7"** (con `&nbsp;`
   entre "Flexispot" y "E7"). `text-wrap: pretty`.
3. Standfirst, `max-width: 34ch`, `#444141`: *"Nota 9,7 sobre 10, la más alta del
   catálogo. Doble motor, 125 kg de carga y cinco años de garantía. No incluye
   tablero: ese lo eliges tú."*
4. Línea de exclusión: `padding-left: 15px`, `border-left: 3px solid #2d4a3e`,
   `max-width: 44ch` — *"**No es tu mesa si** no quieres comprar el tablero aparte ni
   montarla entre dos personas."*
5. CTA único: fondo `#201e1d`, texto `#f8f4f4`, `padding: 16px 28px`, radio 2px,
   `font-size: clamp(16px, 1.6vw, 18px)`, peso 600, flecha `→` al final.
   `:hover` → fondo `#2d4a3e`. Enlaza a `affiliateLink('B084KW7N8C')` con
   `target="_blank" rel="nofollow sponsored noopener"` y dispara `trackClick`.
6. Línea de afiliado en 13px / `#7d7979`.
7. Firma del autor (ver regla 5).

Columna derecha:

1. Foto del producto en marco blanco de `padding: 16px`; `<img>` a `width: 100%`,
   `height: clamp(180px, 22vw, 250px)`, `object-fit: contain`.
2. Cifra `9,7` en `.cmyk-num` a `clamp(58px, 7vw, 82px)` / peso 700, alineada por la
   base con un `<span>` de 14px en `#7d7979`: `sobre 10` / `Nº 1 de 12 · 4,7★`.
3. Ficha técnica: filete `2px solid #2d4a3e`, kicker `Ficha técnica`, y un
   `<dl>` en `grid-template-columns: auto 1fr; gap: 7px 20px`, 15px. `<dt>` en
   `#7d7979`, `<dd>` en peso 600. Ocho filas: Motor `Doble · 3,8 cm/s`, Carga
   `125 kg`, Recorrido `58–123 cm`, Memorias `4 · anticolisión`, Ruido `45 dB`,
   Estructura `32 kg`, Garantía `5 años`, Tablero `No incluido`.

**Lo que desaparece del hero actual**: el fondo `hero-mesh` con los tres gradientes
radiales, la barra de estadísticas verde con `AnimatedCounter`, el segundo CTA
("Opciones baratas"), el bloque desplazado con `opacity: 0.06` detrás de la tarjeta y
las animaciones `animate-fade-up` / `stagger-*`.

#### Sección 2 — Tres caminos (por necesidad, no por precio)

Filete de sección → kicker `Nº 02 · Tres caminos` → H2 *"Según lo que necesites"* →
párrafo `max-width: 58ch`: *"No segmentamos por presupuesto porque el presupuesto
cambia y el uso no. Estas son las tres decisiones reales."*

Tres columnas `flex: 1 1 260px`, `gap: clamp(24px, 3vw, 44px)`, cada una en columna
flex con `gap: 12px` y el CTA empujado al fondo con `margin-top: auto` (así los tres
botones quedan alineados aunque los textos midan distinto).

Cada columna: filete `1px` en tinta arriba → etiqueta de necesidad (11px / 0.16em /
uppercase / `#2d4a3e`) + subtítulo en 14px `#7d7979` → foto en marco blanco de 10px,
`height: 130px` → H3 con el modelo → línea `Nota **X** · Y★ en Amazon` → párrafo de
16px → CTA en tinta a ancho de contenido → línea de afiliado en 12px.

| Necesidad | Subtítulo | Modelo | ASIN | Nota |
| --- | --- | --- | --- | --- |
| Solo el marco | El tablero lo eliges tú | Flexispot E7 | `B084KW7N8C` | 9,7 |
| Con tablero incluido | Montar y usar, sin más compras | FLEXISPOT 160x80 | `B09R746JHX` | 9,5 |
| Dos monitores o setup grande | Cuando manda la carga | MAIDeSITe T2 Pro MAX | `B0DG2VTCXS` | 9,4 |

En la primera columna, tras la nota, se añade `· el del veredicto` en color tinta —
es el mismo modelo del hero y decirlo evita que parezca un descuido.

**Por qué no son franjas de precio**: los rangos se desactualizan y contradicen la
promesa de no publicar precios; y además el nº 1 del catálogo cae en la franja más
barata, con lo que nadie miraba las otras dos columnas.

#### Sección 3 — El podio

Kicker `Nº 03 · El podio`, H2 *"La recomendación, en detalle"*.

**Tarjeta del recomendado**: fondo `#eae9e9`, radio 2px,
`padding: clamp(18px, 2.4vw, 28px)`. Cabecera con el numeral `01` en `.cmyk-num` a
40px y una etiqueta `Recomendado` sobre fondo `#2d4a3e` en crema (11px / 0.14em /
uppercase / `padding: 5px 11px`). Debajo, dos columnas: foto (`flex: 0 1 250px`,
marco blanco de 14px, `height: 190px`) con la cifra `9,7` a 54px debajo; y la columna
de contenido (`flex: 1 1 340px`) con marca en 12px uppercase `#7d7979`, H3
*"E7 · marco doble motor"*, veredicto en `clamp(16px, 1.6vw, 18px)`, seis etiquetas de
especificación (12px, `border: 1px solid #2d4a3e`, texto `#2d4a3e`,
`padding: 4px 10px`, `gap: 7px`), tres pros con `✓` en verde y peso 700, la línea "No
es tu mesa si" con el borde izquierdo verde, el CTA a ancho completo y la línea de
afiliado.

**Puestos 02 y 03**: kicker `Y si no, estos dos` y dos filas separadas por filetes de
`1px` en tinta (también uno de cierre al final). Cada fila es flex con envoltura:
numeral `.cmyk-num` a 26px, foto de 62×56 en marco blanco de 6px,
nombre + meta (`Doble motor · 100 kg · 71–121 cm · 4,5★`), la frase que lo define
(`flex: 1 1 220px`), la nota a 22px/700 y el CTA.

#### Sección 4 — Los 12 modelos, comparados

Kicker `Nº 04 · Comparativa`, H2 *"Los 12 modelos analizados"*.

**Filtros**: tres controles segmentados más un contador de resultados, en una fila
flex con `gap: 20px 32px` y `align-items: flex-end`. Cada control es un
`<div style="display:inline-flex; border:1px solid #2d4a3e">` con `<button>`s: activo
= fondo `#2d4a3e` y texto crema; inactivo = fondo transparente y texto `#2d4a3e`;
separador `border-left: 1px solid #2d4a3e` en todos menos el primero; `padding: 9px 14px`,
14px. Encima, la etiqueta en 11px / 0.14em / uppercase / `#7d7979`.

- **Tablero**: Todos · Solo marco · Con tablero → filtra por `incluye_tablero`.
- **Carga mínima**: Cualquiera · 70 kg+ · 100 kg+ · 125 kg+ → `specs.peso_max_carga_kg`.
- **Ancho mínimo**: Cualquiera · 120 cm+ · 140 cm+ · 160 cm+ → `specs.ancho_tablero_cm`
  (los marcos valen 0, así que cualquier filtro de ancho los excluye: es correcto).
- Contador: `12 modelos` / `N modelos coinciden` / `1 modelo coincide`.

**Ordenación**: por Nota (por defecto) o por Carga, las dos descendentes. La cabecera
correspondiente es clicable y muestra `↓` cuando está activa. En móvil, como no hay
cabecera de tabla, la ordenación va en una barra verde con dos botones de borde crema.

**Tabla (≥700px)**: `border-collapse: collapse`, 15px. `<thead>` con fondo `#2d4a3e`
y texto crema, `padding: 12px 10px`. Columnas: `#` (46px) · Modelo · Tablero ·
Carga (ordenable) · Motor · Nota (ordenable) · CTA. Celda de modelo: foto de 48×44 en
marco blanco de 4px + nombre en 16px/600 + línea de 13px en `#7d7979` con
`recorrido · rating★ · garantía N años`. Nota a 19px/700. Filas separadas por
`1px solid color-mix(in srgb, #201e1d 8%, transparent)`, `:hover` con
`color-mix(in srgb, #201e1d 4%, transparent)`.

**Apilado (<700px)**: una fila por modelo, `border-bottom: 1px solid` divisor,
`padding: 14px 0`. Índice a la izquierda; a la derecha, nombre + `Nota **X** · Y★ ·
garantía N años`, foto de 58×52, cuatro etiquetas verdes de especificación (motor,
carga, tablero, recorrido) y el CTA a ancho completo.

Al pie: *"Nota sobre 10 según nuestra [metodología](#metodologia). Todos los enlaces
son de afiliado: si compras, Amazon nos paga una comisión y tú pagas lo mismo."*

#### Sección 5 — Las tres dudas antes de comprar

Kicker `Nº 05 · Antes de comprar`, H2 *"Las tres dudas de siempre"*. Tres bloques con
`gap: clamp(24px, 3vw, 36px)`; cada bloque es flex con envoltura: la pregunta como H3
en `flex: 1 1 260px` y la respuesta en `flex: 1 1 380px` (uno o dos párrafos de
`clamp(16px, 1.6vw, 18px)`, el segundo en `#444141`).

Las tres preguntas y sus respuestas están redactadas **solo con datos del JSON**
(rangos del catálogo, recuentos, velocidades, ruido, carga). El texto exacto está en
`Elevable.dc.html`, sección 5. No lo reescribas sin comprobar los datos: cada cifra
que aparece es verificable contra `productos.json`.

#### Sección 6 — Metodología (`id="metodologia"`)

Kicker `Nº 06 · Metodología`, H2 *"Cómo analizamos los escritorios"*, frase destacada
en peso 600 *"No probamos los escritorios físicamente. Conviene decirlo antes que
nada."* y párrafo de contexto (`max-width: 62ch`).

Dos columnas: **Cómo puntuamos** (los cinco criterios de
`app/metodologia/page.tsx`, cada uno con `padding-left: 14px` y
`border-left: 2px solid #2d4a3e`) y **De dónde salen los datos** + **Cómo se financia
esto** + la firma del autor.

Debajo, a ancho completo, **la matriz de notas**: tabla de 12 filas × 5 criterios +
global, dentro de un `overflow-x: auto` con `min-width: 640px` para que en móvil se
desplace. Cabecera verde en crema; celdas de criterio centradas en `#7d7979`; celda
global en peso 700 con fondo `#e8f0ec`. Los valores salen de
`producto.puntuacion.{calidad_construccion, estabilidad, facilidad_montaje,
relacion_calidad_precio, funcionalidades, total}`.

**Importante**: el enlace "metodología" del titular apunta ahora a esta sección
(`#metodologia`) en lugar de a una página aparte. La ruta `/metodologia` ya existe en
el repo y puede seguir existiendo como página larga; el diseño solo exige que el
enlace de la home lleve a algo que exista.

---

### Pantalla 2 — Ficha de modelo (una plantilla para los 12)

Un solo componente que sirve para los doce modelos. En el prototipo se cambia de
modelo con un riel de pestañas en la cabecera; **en producción eso es la ruta**:
`/[slug]-opiniones` (el repo ya tiene `app/flexispot-e7-opiniones/`,
`app/fezibo-opiniones/`, `app/maidesite-t2-pro-opiniones/`). El riel de pestañas es un
artefacto del prototipo para poder revisar los doce; no hace falta llevarlo a
producción.

Secciones, en orden:

1. **Veredicto** — mismo patrón que el hero de la home: marca en kicker, H1 con el
   titular del modelo, standfirst generado a partir de las especificaciones, CTA,
   línea de afiliado y firma. A la derecha, foto y la cifra en cuatricromía con
   `sobre 10 / X★ en Amazon`. El kicker de sección es el puesto: `Nº 6 de 12 · Veredicto`.
2. **Ficha técnica** — dos `<dl>` de cinco filas cada uno (Motor, Velocidad, Carga
   máxima, Recorrido, Ruido / Memorias, Anticolisión, Peso estructura, Tablero,
   Garantía), a 16px con `gap: 10px 20px`.
3. **Desglose de la nota** — cinco barras: etiqueta de 190px, canal de 8px de alto en
   `#eae7e7` con relleno `#2d4a3e` al `nota × 10 %`, y el valor a la derecha en 40px.
   Cierre con filete de `1px` en tinta y la nota global a 20px/700. Al pie: *"Media
   ponderada de los cinco apartados."* con enlace a la metodología.
4. **Sí y no** — dos columnas: `Es tu mesa si` (frase de `ideal_para` en cursiva +
   los `pros` con `✓` verde) y `No es tu mesa si` (la línea de exclusión con borde
   verde + los `contras` con `×`). Debajo, el `veredicto` completo a `max-width: 66ch`.
5. **Alternativas** — tres filas con el mismo patrón que el podio de la home. Se
   calculan, no se escriben a mano (ver "Lógica de alternativas").
6. **Cierre** — H2 + párrafo a la izquierda, CTA + línea de afiliado a la derecha.

#### Lógica de alternativas

Regla de oro: **las alternativas se quedan en la categoría del modelo que se está
leyendo**. Quien lee la VASAGLE de 100 cm no está comparando un marco de 160 kg. La
lista de modelos está ordenada por nota descendente, así que el primero de cada
filtro es el de mejor nota.

Para un modelo **con tablero**, en este orden de prioridad:

1. *El siguiente escalón* — el modelo con tablero de nota inmediatamente superior (el
   **más cercano** por arriba, no el mejor del catálogo).
2. *Si quieres un tablero más grande* — el mejor modelo del ancho inmediatamente
   superior.
3. *Si te vale uno más compacto* — el mejor modelo del ancho inmediatamente inferior.
4. *Si quieres doble motor* (si el actual es simple) o *Si te sobra con motor simple*
   (si es doble).
5. *Si prefieres elegir tu tablero* — el mejor marco.

Para un modelo **sin tablero** (marco):

1. *Si quieres tablero incluido* — el mejor modelo con tablero.
2. *Si necesitas más carga* — el mejor modelo con más carga que el actual.
3. *El otro marco del catálogo*.
4. *Si te sobra con motor simple* — el mejor modelo simple con tablero.

Después, relleno garantizado hasta tres: primero modelos de la misma categoría de
tablero (*"También con tablero incluido"* / *"También sin tablero"*), luego cualquiera
(*"También en el top del catálogo"*). Se descartan duplicados por `slug` y **nunca**
aparece el modelo que se está viendo. La implementación de referencia está en la clase
de lógica de `Elevable — Ficha de modelo.dc.html`, método `alternativas()`.

---

## Interacciones y comportamiento

- **Punto de corte único: 700px.** No hay más. Por debajo: tabla apilada y CTA fijo
  inferior. Por encima: tabla y sin CTA fijo. En el prototipo se mide con un
  `ResizeObserver` sobre el contenedor raíz porque el preview no es una ventana; **en
  Next.js esto es una media query de Tailwind** (`md:` o un breakpoint propio a 700px)
  y las dos variantes se renderizan en el servidor, sin JavaScript.
- **CTA fijo inferior (solo móvil)**: `position: fixed; inset: auto 0 0 0`, fondo
  `#f3f2f2`, `border-top: 2px solid #2d4a3e`, `padding: 10px 16px 16px`. Dentro, el
  CTA a ancho completo con el modelo recomendado y, debajo, una línea centrada de 12px
  en `#7d7979`. Reserva `padding-bottom` en el `<main>` para que no tape el final del
  contenido.
- **Estados de los CTA**: reposo fondo `#201e1d`; `:hover` fondo `#2d4a3e` (el texto
  sigue en crema). Sin transformaciones, sin sombras, sin el barrido de brillo del
  `.btn-primary` actual.
- **Foco de teclado**: `outline: 2px solid` + `outline-offset: 2px`. Usa **tinta o
  verde**, no el cian por defecto del sistema Broadsheet.
- **Enlaces de texto**: subrayados en tinta con `text-underline-offset: 3px` y
  `text-decoration-thickness: 1px`; `:hover` → `#2d4a3e`.
- **Filtros y orden**: estado en cliente. Sin animaciones al refiltrar.
- **Sin animaciones de entrada.** Todo el sistema `animate-fade-up` / `FadeIn` /
  `stagger-*` / `AnimatedCounter` desaparece de estas pantallas.

## Estado

Home, sección 4:

| Estado | Tipo | Inicial |
| --- | --- | --- |
| `tablero` | `'todos' \| 'marco' \| 'tablero'` | `'todos'` |
| `cargaMin` | `0 \| 70 \| 100 \| 125` | `0` |
| `anchoMin` | `0 \| 120 \| 140 \| 160` | `0` |
| `orden` | `'nota' \| 'carga'` | `'nota'` |

Filtrado y ordenación son derivados, no estado. La ficha de modelo no tiene estado en
producción: el modelo lo determina la ruta.

Sin peticiones de datos: `data/productos.json` se importa en tiempo de compilación,
igual que ahora.

## Datos

Todo sale de `data/productos.json` a través de `lib/products.ts`. Correspondencias:

| En el diseño | Campo |
| --- | --- |
| Nombre mostrado | `marca` + ` ` + `modelo` |
| Nota | `puntuacion.total` (coma decimal) |
| Estrellas | `rating` (coma decimal) |
| Motor / Velocidad | `specs.tipo_motor`, `specs.velocidad_cm_s` |
| Carga | `specs.peso_max_carga_kg` |
| Recorrido | `specs.rango_altura_min_cm`–`specs.rango_altura_max_cm` |
| Ruido, memorias, anticolisión | `specs.ruido_db`, `specs.presets_memoria`, `specs.sistema_anticolision` |
| Peso, garantía | `specs.peso_estructura_kg`, `specs.garantia_anos` |
| Tablero | `incluye_tablero` + `specs.ancho_tablero_cm`×`specs.profundidad_tablero_cm` |
| Pros / contras / veredicto / para quién | `pros`, `contras`, `veredicto`, `ideal_para` |
| Desglose y matriz | los cinco campos de `puntuacion` |
| Enlace | `affiliateLink(asin)` de `lib/affiliate.ts` |

Orden del catálogo en todas las pantallas: `puntuacion.total` descendente. Con las
notas actuales: E7 9,7 · FLEXISPOT 160x80 9,5 · T2 Pro MAX 9,4 · S2 Pro 9,3 ·
SANODESK 140x60 9,2 · SONGMICS 160x70 9,1 · Devoko 160x70 8,9 · ErGear 120x60 8,8 ·
VASAGLE 160x60 8,7 · Devoko 120x60 8,7 · FEZIBO 120x60 8,5 · VASAGLE 100x60 8,1.

**Limpieza de copy necesaria en el JSON.** Varios `pros`, `contras` y `veredicto`
llevan precios dentro del texto ("solo 80 EUR", "por 110 EUR", "Solo 107 EUR por el
marco") y recuentos de reseñas ("2100+ reviews", "1684 opiniones", "(70)"). El
prototipo los muestra ya recortados. Como la regla es que no aparezcan **en ninguna
parte**, lo correcto es **editar `productos.json`** en lugar de recortar al renderizar.
Los textos ya saneados de los doce modelos están en la clase de lógica de
`Elevable — Ficha de modelo.dc.html`: cópialos de ahí.

## Assets

- **Fotos de producto**: URLs remotas de `m.media-amazon.com`, ya en `productos.json`.
  Se muestran con `next/image` sobre fondo blanco y `object-fit: contain`. El
  contenedor blanco necesita ancho y alto explícitos.
- **Foto del autor**: no hay. Es un monograma tipográfico (regla 6).
- **Iconos**: ninguno. Las flechas son el carácter `→` y las marcas de lista los
  caracteres `✓` y `×`, todos en el serif. No añadas una librería de iconos.
- **Fuente**: Source Serif 4, ya cargada. Quita Fraunces y JetBrains Mono de
  `app/layout.tsx`.

## Cuestión abierta: los pesos de la ponderación

`app/metodologia/page.tsx` afirma que la nota global es *"su media ponderada"* de los
cinco apartados, pero los pesos no están documentados en ninguna parte del repo — y no
se pueden deducir: SANODESK y SONGMICS tienen la misma media aritmética de los cinco
apartados (8,5) y notas globales distintas (9,2 y 9,1), así que la global está puesta a
mano, no calculada.

El diseño resuelve esto **publicando la matriz completa** de las cinco notas por modelo
y diciendo con claridad que los pesos no se publican porque no están documentados. Si
en algún momento se fijan los pesos de verdad, sustituye ese párrafo por la tabla de
pesos y calcula la global a partir de ellos.

## Ficheros

En este paquete:

| Fichero | Qué es |
| --- | --- |
| `Elevable.dc.html` | La home. Estructura, copy y valores exactos de las seis secciones. |
| `Elevable — Ficha de modelo.dc.html` | La ficha de modelo, con los datos saneados de los doce y la lógica de alternativas. |
| `Elevable — Actual.dc.html` | Recreación fiel de la home **actual**, para comparar antes/después. |
| `support.js` | Runtime de los prototipos. No es código de producción, pero hace falta para abrir los `.dc.html` en el navegador. |
| `_ds/broadsheet-.../styles.css` | Hoja del sistema Broadsheet. De aquí sale el bloque `.cmyk-num`. |
| `_ds/broadsheet-.../_ds_bundle.js` | Bundle del sistema, necesario para los prototipos. |
| `github.md` | Asociación con el repo de origen y mapa de pantalla → ficheros. |

Ficheros del repo que toca este rediseño:

| Fichero | Qué hacer |
| --- | --- |
| `app/page.tsx` | Reescribir con las seis secciones. Elimina `ACTUALIZADO`, `priceBand`, `reviewsAprox`, `AnimatedCounter`, `FadeIn`, la barra de estadísticas y las secciones "Por presupuesto" y "Guías y comparativas" de la parte superior. |
| `app/globals.css` | Sustituir la paleta cobre/verde por los tokens de arriba. Copia el bloque `.cmyk-num`. Elimina `hero-mesh`, `decorative-number`, `editorial-mark`, `animate-fade-up`, `stagger-*`, `btn-primary`, `btn-amazon`, `product-image-container`. |
| `app/layout.tsx` | Quitar Fraunces y JetBrains Mono; dejar solo Source Serif 4. |
| `components/AffiliateButton.tsx` | Nuevo estilo (tinta/crema) y texto por defecto **"Ver precio actual en Amazon"**. Elimina la variante `showPrice`. |
| `components/ProductCard.tsx` | Rehacer según la tarjeta de la sección 3: sin precio, sin recuento de reseñas, con la línea "No es tu mesa si". |
| `components/Header.tsx` | Sustituir por el riel de cabecera (filete grueso/fino con la fecha). |
| `components/Footer.tsx` | Quitar el párrafo grande de afiliado del final: la declaración va bajo cada CTA. |
| `lib/format.ts` | `priceBand` y `reviewsAprox` dejan de usarse en la parte superior. Añade el formateador de coma decimal. |
| `data/productos.json` | Corregir tildes y quitar precios y recuentos del copy. |
| `app/metodologia/page.tsx` | Fuente de la sección 6. Puede seguir existiendo como página larga. |
| Nueva ruta `/[modelo]-opiniones` | La ficha de modelo, una por ASIN. |
