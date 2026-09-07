# Plan SEO — Elevable (elevable.es)

> Diagnóstico y hoja de ruta. Fecha: 2026-09-07.
> **Cómo usar este fichero:** cada bloque (B1…B5) es autocontenido. En una sesión
> nueva de Claude Code basta con decir *"ejecuta el bloque B1 de SEO-PLAN.md"*.
> No hace falta arrastrar el contexto de la conversación original.

---

## 1. Punto de partida (datos reales, no estimaciones)

| | Q2 2026 (abr–jun) | Q3 2026 (1 jul–6 sep) |
|---|---|---|
| Clics de afiliado | 94 | 65 |
| Clics/día | 1,03 | 0,96 |
| Pedidos | 4 | 5 |
| Conversión | 4,26 % | 7,69 % |
| Facturación generada | 543,06 € | 360,29 € |
| Comisión (5 %) | 27,16 € | 17,77 € |
| EPC | 0,29 € | 0,27 € |

**Acumulado: 44,93 €.** Cobrados 27,16 € (20 ago 2026); 12,56 € retenidos por el
umbral de 25 € de Amazon ES.

### GA4 — DE DÓNDE VIENE EL TRÁFICO (resuelto 2026-09-07)

**Últimos 28 días (10 ago – 6 sep), 54 sesiones / 43 usuarios:**

| Canal | Sesiones | Interacción media | Eventos |
|---|---|---|---|
| **AI Assistant** | **29 (53,7 %)** | **19 s** | 125 (58,1 %) |
| Direct | 20 (37,0 %) | 4 s | 75 (34,9 %) |
| Organic Search | 4 (7,4 %) | 8 s | 14 (6,5 %) |
| Unassigned | 1 (1,9 %) | – | 1 |

**Últimos 7 días, fuente/medio exacto:** `chatgpt.com / ai-assistant` **10
sesiones**, `(direct)/(none)` 1, `google/organic` **0**.

**La fuente principal de tráfico de esta web es ChatGPT.** No Google.

Y no es tráfico de relleno: con el 46 % de los usuarios genera el **58 % de los
eventos**, con **19 s** de interacción media frente a los 4 s del directo, y
0,80 sesiones con interacción por usuario frente a 0,29. Es, con diferencia, el
tráfico de más calidad que recibe el sitio.

**Página que se lo lleva casi todo:** `/mejor-escritorio-elevable` (9 de 12
vistas en 7 días). En esos mismos 7 días: 4 eventos `affiliate_click`.

### Google Search Console (añadido 2026-09-07)

| Métrica | Valor |
|---|---|
| Clics orgánicos (6 jun – 29 ago) | **5 en total** |
| Páginas indexadas | **2** |
| Páginas NO indexadas | 2 |
| Páginas que Google ni conoce | **6 de 10** |

El 23 jul 2026 una página pasó de indexada a no indexada (de 3 a 2).

**Dos hechos que lo reordenan todo:**

1. **Google solo tiene 2 páginas tuyas en el índice, de 10.** Y solo conoce 4.
2. **El tráfico que genera dinero NO viene de Google.** 5 clics orgánicos en 3
   meses frente a 65 clics de afiliado en Q3: el ~92 % de tus visitas llegan por
   otro canal sin identificar.

**Conclusión del diagnóstico:** la conversión y la monetización funcionan. El
tráfico está estancado en ~1 clic/día durante dos trimestres seguidos. El único
problema a resolver es **atraer visitas**.

---

## 2. Qué está bien (no tocar)

- **El contenido no es fino.** ~6.960 palabras en `/mejor-escritorio-elevable`,
  ~3.260 en `/flexispot-e7-opiniones`, ~1.560 en el home. Está por encima de la
  media del nicho.
- **Schema markup** de producto/review implementado en las páginas clave.
- **`metadataBase`** correcto (`https://elevable.es`) en `app/layout.tsx`.
- **`robots.txt` y `sitemap.xml` servidos** apuntan bien a elevable.es.
- **Enlazado interno entre reviews y pilares**: cada review enlaza a 3-4 páginas.

---

## 3. Problemas detectados

### CAUSA RAÍZ ENCONTRADA (2026-09-07)

**Hay TRES copias vivas e indexables del mismo sitio, y ninguna declara canonical.**

| Copia | Estado | robots.txt | Contenido |
|---|---|---|---|
| `elevable.es` | 200 | Allow all → sitemap de elevable.es | 6.962 palabras |
| `escritorios-elevables.vercel.app` | **200** | Allow all → sitemap de elevable.es | **6.962 palabras, idéntico** |
| `tonimas35.github.io/escritorios-elevables/` | **200** | Allow all → **sitemap propio de github.io** | 6.163 palabras (versión de marzo) |

Bien resuelto: `www.elevable.es` y `http://` redirigen a `https://elevable.es`.

El peor caso es GitHub Pages. **Sirve desde la rama `gh-pages`** (config:
`build_type: legacy`, `source: {branch: gh-pages, path: /}`), cuyo último commit
es del **23 mar 2026** — la versión congelada de aquel día. Incluye un
`robots.txt` que anuncia su propio sitemap con 9 URLs de github.io, pidiéndole
activamente a Google que indexe la copia vieja.

Nota: los ficheros del export estático que hay en la raíz de `master` **no** son
lo que sirve Pages. Son basura muerta del repo (conviene borrarlos, pero
borrarlos no apaga la copia). Lo que apaga la copia es desactivar Pages.

**Por qué esto explica los síntomas exactamente:** Google ve el mismo contenido
en tres dominios sin ninguna señal de cuál es el bueno. Elige uno por URL y
descarta los otros. Por eso `elevable.es` aparece con solo 2 páginas indexadas:
las otras 8 no es que estén rechazadas, es que Google se las ha atribuido a
`vercel.app` o a `github.io`. Y por eso una página "se desindexó" el 23/7 — no
desapareció, cambió de dominio ganador.

**CONFIRMADO EN SEARCH CONSOLE (2026-09-07).** Motivos de no indexación, en
palabras de Google:

| Motivo | Páginas |
|---|---|
| **"Duplicada: el usuario no ha indicado ninguna versión canónica"** | 1 |
| **"Página con redirección"** | 1 |
| "Rastreada: actualmente sin indexar" | 0 |

Indexadas: 2. Sin indexar: 2. Diagnóstico confirmado palabra por palabra.

### Y hay una cuarta copia que se me había pasado: www

El informe de *Páginas* del rendimiento lo deja claro:

| Página | Clics | Impresiones |
|---|---|---|
| `https://www.elevable.es/` | 3 | **254** |
| `https://elevable.es/` | 2 | 92 |
| `https://elevable.es/comparador` | 0 | 18 |

**Google trata `www` y sin `www` como dos páginas distintas**, y le da más peso a
la versión `www` — que además **redirige** a la otra (de ahí el motivo "Página
con redirección"). El redirect está bien hecho, pero sin canonical no basta:
Google reparte las señales entre las dos en vez de consolidarlas.

### Lo más grave de todo

**Solo el home y `/comparador` reciben impresiones. Nada más.**
`/mejor-escritorio-elevable` — 6.962 palabras, la página que ChatGPT cita y la
que genera el dinero — tiene **cero impresiones en Google**. No está indexada.

### Rendimiento actual en Google (6 jun – 5 sep)

- Clics: **5** · Impresiones: **358** · CTR: 1,4 % · **Posición media: 38,1**
- Consultas top: `escritorio elevable` (77 impr., 1 clic), `escritorios
  elevables` (76), `elevable` (42), `elevadesk` (20), `bases elevables` (19).

Traducción: Google **sí** te muestra para las keywords correctas del nicho, pero
en la **posición 38** — página 4. Por eso 358 impresiones dan 5 clics.

### El sitemap no es el problema

Enviado el 23 mar 2026, estado *Correcto*, **11 páginas descubiertas**. Pero
**la última lectura fue el 26 mar 2026**: Google no ha vuelto a leerlo en más de
cinco meses. Síntoma de prioridad de rastreo casi nula, consecuencia de lo
anterior.

### BLOQUEANTE
0. **Solo 2 de 10 páginas están indexadas en Google.** Verificado que NO es un
   problema técnico: el sitemap se sirve correctamente con las 10 URLs
   (`content-type: application/xml`, HTTP 200), ninguna página lleva `noindex`
   ni cabecera `X-Robots-Tag`, y las 10 responden 200.
   Las dos causas probables, por orden:
   - **El sitemap no está enviado en Search Console** (GSC solo conoce 4 URLs;
     si lo hubiera procesado conocería 10). → Comprobar en GSC → *Sitemaps*.
   - **Falta de autoridad**: sin enlaces entrantes, Google detecta las páginas
     pero decide no indexarlas ("Detectada: actualmente sin indexar"). Es el
     patrón típico de un sitio de afiliación nuevo. → Comprobar en GSC →
     *Páginas* → motivos de no indexación.

   **Mientras esto no se resuelva, escribir contenido nuevo no sirve de nada.**

### Críticos
1. **No hay etiquetas `<link rel="canonical">` en ninguna página.** Verificado en
   el HTML servido de `/`, `/mejor-escritorio-elevable` y `/flexispot-e7-opiniones`.
   `metadataBase` está puesto pero sin `alternates.canonical`, así que Next no
   emite la etiqueta. Riesgo de duplicados y de dilución de señales.
2. **El `<h1>` de las reviews es el título crudo de Amazon.** En
   `/flexispot-e7-opiniones` el h1 es *"Flexispot E7 Estructura Escritorio
   Elevable Doble Motor"* — nombre de producto, no keyword. El `<title>` sí está
   optimizado ("Flexispot E7 opiniones y review 2026"), pero el h1 no acompaña.
3. **Solo 10 URLs indexables.** Superficie mínima para captar long-tail. Es la
   causa raíz del techo de tráfico.

### Medios
4. **`/test` responde 200 en producción** y es rastreable (fuera del sitemap,
   pero `robots.txt` no lo bloquea y no tiene `noindex`).
5. **Herramientas huérfanas.** `/comparador` y `/calculadora-altura` no tienen
   ningún enlace interno saliente y casi nadie enlaza hacia ellas (solo
   `fezibo-opiniones`). Son el diferenciador real frente a la competencia y
   están enterradas.
6. **Catálogo inconsistente.** `data/productos.json` tiene 12 productos, pero 3
   (`B0DG2VTCXS`, `B09TQR3MMM`, `B09R746JHX`) solo llevan 14 campos frente a los
   20 de los otros 9.
7. **Ticket medio de 72-136 €** frente a un catálogo de 200-430 €: parte de las
   comisiones probablemente no son escritorios sino compras colaterales de la
   cookie de 24 h. **Verificar en Amazon Afiliados → Comisiones → tabla
   "Producto vinculado"** antes de decidir dónde poner el foco.

### Menores
8. Ficheros del export estático viejo commiteados en la raíz (`index.html`,
   `*.txt`, `_next/`, `robots.txt` con URL de github.io). No se sirven, pero
   ensucian el repo y confunden cualquier auditoría.

---

## 4. Estrategia

Con los datos de Search Console, la estrategia cambia de orden.

**El SEO todavía no ha empezado.** No es que posicione mal: es que Google apenas
tiene el sitio en el índice. Ampliar contenido (B3) antes de arreglar la
indexación es llenar un cubo agujereado.

**Y hay una incógnita mayor:** si el 92 % del tráfico no viene de Google, viene
de algún sitio que no hemos identificado y que ya está funcionando. Saber cuál
es puede ser más rentable que todo el SEO junto, porque es un canal ya probado.
Sale del informe de Adquisición de GA4.

**Hay dos canales, no uno, y el que funciona no es Google:**

- **Canal IA (ChatGPT): ya funciona.** Es el 54 % del tráfico y el de mejor
  calidad, sin haber hecho nada para conseguirlo. Es lo que ha pagado los
  44,93 €. Optimizar para ser citado por asistentes (datos estructurados,
  tablas comparativas, veredictos explícitos, precios frescos, schema limpio)
  es trabajo distinto del SEO clásico y es donde está el retorno probado.
- **Canal Google: a cero, pero por un bug, no por falta de calidad.** 4 sesiones
  orgánicas en 28 días con contenido de 7.000 palabras no es un problema de
  contenido: es el reparto entre tres dominios. Arreglarlo abre un canal entero
  que hoy no existe.

La buena noticia es que las dos cosas se alimentan: los duplicados también
confunden a los rastreadores de IA, y el contenido citable posiciona bien.

Cuando la indexación esté resuelta, la vía sigue siendo **long-tail** (cada
modelo, cada duda concreta = una puerta de entrada), porque competir de frente
por *"mejor escritorio elevable"* contra josepdeulofeu, ergohogar o aiho no es
viable sin autoridad. Con un EPC probado de ~0,28 €, **cada 100 clics/mes extra
son ~28 €/mes**.

---

## 5. Bloques ejecutables

### B0 — Matar los duplicados ✅ **COMPLETADO 2026-09-07**

Desplegado en producción (commit `c2713fc` en master). Verificado en vivo:
`elevable.es` sirve las 10 páginas con canonical absoluto y sin `X-Robots-Tag`;
`escritorios-elevables.vercel.app` devuelve `noindex, nofollow`;
`tonimas35.github.io` devuelve 404; `www.elevable.es` redirige.
Sitemap reenviado en GSC. Indexación manual solicitada para
`/mejor-escritorio-elevable`, `/escritorio-elevable-barato` y
`/flexispot-e7-opiniones`.

Dato que salió al inspeccionar: esas páginas tenían **"Último rastreo: N/D"** —
Google nunca las había llegado a rastrear, ni una sola vez.

Pendiente menor: solicitar indexación de `/fezibo-opiniones`,
`/maidesite-t2-pro-opiniones`, `/flexispot-vs-maidesite`, `/comparador` y
`/calculadora-altura`. No es urgente: las tres solicitadas enlazan a todas, así
que Google debería descubrirlas al rastrearlas.

---

#### Detalle de lo ejecutado

**En código (Claude, 1 sesión corta):**
1. **Canonicals absolutos** en las 10 páginas: `alternates: { canonical: "https://elevable.es/ruta" }`.
   Es la señal que resuelve el conflicto aunque las copias sigan vivas, y de
   paso consolida `www` con el dominio sin `www`, que hoy compiten entre sí.
2. **`middleware.ts`**: devolver `X-Robots-Tag: noindex` cuando el `host` no sea
   `elevable.es`. Mata la indexabilidad de `*.vercel.app` sin tocar producción.
3. **Borrar de la raíz del repo** los restos del export estático (`index.html`,
   `*.html`, `*.txt`, `_next/`, `robots.txt` con URL de github.io) y añadirlos
   al `.gitignore`. Es limpieza, no arregla nada por sí solo.

**Tú, en los paneles (5 minutos):**
4. ~~**GitHub → Settings → Pages → Branch: None.**~~ ✅ **HECHO (2026-09-07).**
   Verificado: la API de Pages devuelve 404 y todas las URLs de github.io
   (incluidos `robots.txt` y `sitemap.xml`) devuelven 404. Copia eliminada.
   Producción sin cambios (elevable.es sigue 200). Opcional: borrar la rama
   `gh-pages`, que ya no sirve para nada.
5. **Vercel → Settings → Domains**: dejar `elevable.es` como producción y, si el
   panel lo permite, redirigir el dominio `.vercel.app` hacia él.

**Tú, en Search Console (10 minutos):**
6. ~~*Sitemaps* → enviar el sitemap~~ **YA ESTÁ ENVIADO** (23 mar, estado
   Correcto, 11 páginas descubiertas). No hay nada que hacer aquí.
- *Páginas* → informe completo → anotar el motivo exacto de no indexación de
  cada URL. Ese motivo decide todo lo que viene después.
- *Inspección de URLs* → pedir indexación manual de las 8 páginas que faltan,
  **empezando por `/mejor-escritorio-elevable`**, que hoy tiene 0 impresiones.
- Averiguar qué página se desindexó el 23/7 y por qué.

**Impacto: máximo.** Es la explicación de los 5 clics orgánicos. Nada de lo
demás funciona hasta resolver esto, y una vez resuelto la indexación debería
recuperarse sola en 2-4 semanas sin escribir ni una palabra nueva.

### B1 — Higiene técnica *(1 sesión corta, esfuerzo normal)*
- Añadir `alternates: { canonical: "/ruta" }` al `metadata` de las 10 páginas.
- Arreglar los `<h1>` de las 4 reviews: keyword principal, no título de Amazon.
  Ej.: *"Flexispot E7: opiniones y review 2026"*.
- Eliminar `/test` (o `noindex` + `Disallow` en robots).
- Completar los 3 productos incompletos de `data/productos.json`.
- Limpiar de la raíz los restos del export estático y añadirlos a `.gitignore`.

**Impacto:** bajo-medio. **Coste:** bajo. Es la base sobre la que va lo demás.

### B2 — Rescatar las herramientas *(1 sesión, esfuerzo normal)*
- Enlazar `/comparador` y `/calculadora-altura` desde el home y desde las 4
  reviews y los 2 pilares.
- Añadir navegación de salida en ambas hacia los pilares.
- Revisar sus `title`/`description` (ya los tienen en sus `layout.tsx`, junto
  con schema BreadcrumbList — no hay que crearlos, solo afinarlos).
- Keywords objetivo: *"calculadora altura escritorio"*, *"altura ideal escritorio
  de pie"*, *"comparador escritorios elevables"* — long-tail informacional con
  competencia baja.

**Impacto:** medio. Son activos ya construidos que ahora mismo no rinden nada,
y son lo único que la competencia no tiene.

### B3 — Ampliar superficie: +6 reviews *(2-3 sesiones)*
Una review por modelo del catálogo que aún no la tenga. Plantilla ya probada en
las 4 existentes (~3.000 palabras, schema, tabla, veredicto).
Patrón de URL que ya funciona: `/{marca}-{modelo}-opiniones`.
Prioridad: los modelos con más búsquedas del catálogo actual.

**Impacto:** alto. Es la palanca principal. Cada review es una puerta nueva.

### B3.5 — Optimizar para asistentes de IA *(NUEVO, alta prioridad)*

#### ✅ Hecho 2026-09-07: rescatados los 3 premium (commit `d7d53a3`)
Los 3 escritorios de 370-430 EUR llevaban desde marzo sin mostrarse por un
esquema de datos incompatible (`amazonRating` vs `rating`, `carga_max_kg` vs
`peso_max_carga_kg`, y sin campo `disponible`, que todas las paginas filtran).
La web decia "12 mejores" y mostraba 9, con techo de 160 EUR.
Normalizados con datos verificados en Amazon.es ese dia. Corregida ademas una
afirmacion falsa ("1800+ reviews" cuando Amazon muestra 951).
**Efecto directo: la comision maxima posible pasa de 8 EUR a 21,50 EUR.**

#### Pendiente en este bloque
El canal que ya funciona. Trabajo concreto sobre `/mejor-escritorio-elevable`
primero, que es la página que ChatGPT cita:
- **Veredictos explícitos y extraíbles**: "el mejor para X es Y porque Z".
  Los modelos citan afirmaciones claras, no prosa evasiva.
- **Tablas comparativas** con specs completas y homogéneas por producto.
- **Precios y fechas frescos**: un modelo descarta lo que parece obsoleto.
  Automatizar la actualización de precios sería lo ideal.
- **Schema `Product` completo**: el pilar solo emite 3 bloques `Product` de los
  12 productos. Ampliarlo a los 12 daria a los asistentes datos estructurados
  de todo el catalogo, no solo del podio.
- **Hueco de catalogo entre 160 y 370 EUR**: no hay ningun producto en la franja
  200-350, que es justo donde compra mucha gente.
- **FAQ con preguntas en lenguaje natural**, que es como se pregunta a un chat.
- Replicar en las reviews individuales lo que funcione en el pilar.

**Impacto: el más alto con evidencia detrás.** Es el único canal del que
sabemos con certeza que convierte en esta web.

### B4 — Contenido informacional *(2 sesiones)*
Artículos que no venden directamente pero captan long-tail y alimentan enlaces
internos hacia los pilares:
- *"¿Merece la pena un escritorio elevable?"*
- *"Escritorio elevable eléctrico vs manual"*
- *"Altura ideal del escritorio según tu estatura"* (enlaza a la calculadora)
- *"Cuánto peso aguanta un escritorio elevable"*
- *"Problemas comunes de los escritorios elevables"*

**Impacto:** medio-alto, pero más lento en madurar.

### B5 — Autoridad externa *(manual, no automatizable)*
Sin enlaces entrantes el techo se mantiene, hagamos lo que hagamos on-page.
- Dar de alta en Google Search Console (imprescindible; hoy no sabemos ni qué
  keywords tenemos a tiro).
- Foros y comunidades españolas de teletrabajo/ergonomía/setup.
- Reddit (r/es, r/spain, r/teletrabajo), Forocoches setup, Mediavida hardware.
- La calculadora de altura es el mejor gancho enlazable: es útil y se comparte.

**Impacto:** el más alto a largo plazo. **Coste:** tiempo tuyo, no de Claude.

---

## 6. Orden recomendado

1. **B0** — matar los duplicados. Bloqueante para Google, y ayuda al canal IA.
2. **B1** (higiene) — los canonicals son señal de indexación, va acompañado.
3. **B2** (herramientas) — barato, y la calculadora es el mejor gancho para B5.
4. **Esperar 3-4 semanas** y volver a mirar *Páginas* en GSC. Si las 10 están
   indexadas, el motor funciona.
5. **B3.5** (optimizar para IA) — se puede hacer en paralelo desde ya, porque
   no depende de la indexación de Google.
6. **Solo entonces B3** (reviews). Con el motor parado no tiene sentido.
6. **B5** (autoridad) en paralelo desde el principio: si el motivo de no
   indexación es falta de autoridad, B5 deja de ser opcional y pasa a ser la
   única solución.

## 7. Métrica de éxito

Dos, y en este orden:

**1. Páginas indexadas en Google.** Hoy **2 de 10**. Sin llegar a 10 no hay
partido. Es la métrica de las próximas 4 semanas.

**2. Clics de afiliado por día.** Hoy 0,96.

- Objetivo 3 meses: **3 clics/día** (~25 €/mes).
- Objetivo 6 meses: **10 clics/día** (~85 €/mes).

Si tras B1+B2+B3 y 60 días la métrica no se mueve, el problema es de autoridad
(B5) y no de contenido: replantear en vez de seguir escribiendo.
