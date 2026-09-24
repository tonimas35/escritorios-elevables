# Plan: catálogo con método profesional (elevable.es)

> **Estado a 23/09/2026:** fases 0 a 4 hechas. `METODO.md` aprobado; datos con
> campos de trazabilidad; `npm run validar`, `npm test` y CI en GitHub
> Actions; nota calculada en `lib/nota.ts` y aplicada en todas las páginas.
> Dos desviaciones del plan: la franja no se guarda en el JSON (se calcula en
> `lib/nota.ts`, ver METODO.md §6) y la fórmula se escribió antes que el
> validador, porque este la necesita para contar modelos por franja.
> **24/09/2026:** el "Flexispot E7" enlazado resultó ser un EG1; corregido
> (datos, ficha, redirección y textos). **En el barrido de octubre, buscar el
> E7 real** para la franja M. La nota se mide ya contra la gama de precio
> (METODO.md §5).
> **Siguiente: fase 5** (barrido de mercado, necesita a Toni en Amazon).
> Pendientes de datos: `fuente_specs`, `specs_verificado` y `nota_resenas` en
> los doce modelos (`npm run validar` los lista).

## Contexto

El catálogo de 12 modelos se eligió en marzo de 2026 y no hay nada escrito que
diga por qué están esos y no otros. Las notas (9,7, 9,5…) están puestas a mano:
`design-ref/README.md` ya reconoce que la nota global no sale de los apartados y
que no hay pesos documentados. La revisión trimestral de `MANTENIMIENTO.md` solo
comprueba que los modelos actuales siguen vivos; nunca busca si ha salido algo
mejor. Hay un hueco sin cubrir entre ~180 y ~310 € y el público real compra
barato (ticket medio 78 €).

Objetivo: que cada recomendación se pueda explicar y reproducir. Franjas fijas,
criterios de entrada y salida escritos, una nota calculada con una fórmula
pública, datos con fuente y fecha, rotación trimestral con registro de cambios y
comprobaciones automáticas que impidan publicar errores. Es lo correcto para el
lector y es también lo que sostiene la confianza de Google y de ChatGPT.

Decisiones ya tomadas por Toni (23/09/2026):
- **Nota: fórmula documentada**, calculada desde datos verificables. El ranking
  puede cambiar de orden.
- **Dedicación: más de 3 h/mes.** Catálogo de 12–15 modelos con ficha propia
  cada uno.
- **Red de seguridad: script validador + CI en GitHub Actions.**

Reglas de `CLAUDE.md` que mandan sobre todo el plan: no inventar datos (un dato
que falta se deja vacío y se avisa), afiliación intacta (`lib/affiliate.ts`,
`rel`, `target`, `trackClick`), precio solo como franja con fecha
(`franjaPrecio()` en `lib/ficha.ts`), un commit por sección, verificar a 375 y
1440 px, castellano con tildes. La matriz de notas por apartado sigue fuera de
alcance.

---

## Fase 0 — Poner la casa en orden *(2 commits, antes de nada)*

1. **Docs al estado real.** `PLAN.md` dice "nada implementado" y el rediseño está
   hecho salvo F5; `SEO-PLAN.md` arrastra pendientes resueltos y cifras viejas.
   Añadir cabecera de estado a ambos y enlazar a este plan. *(commit: docs)*
2. **Título de la home con palabra clave** (`app/layout.tsx`, `title.default` y
   `description`). Hallazgo de la auditoría: hoy es "Elevable — Análisis y
   Comparativas". *(commit: seo)*

## Fase 1 — El método, por escrito *(solo documento; requiere tu visto bueno)*

Nuevo `METODO.md` en la raíz: fuente de verdad del criterio editorial. Nada de
datos ni páginas cambia en esta fase.

- **Franjas** (propuesta, a aprobar):
  - A · Escritorio completo, hasta ~120 €
  - B · Escritorio completo, ~120–250 €
  - C · Escritorio completo, ~250–500 €
  - M · Marco sin tablero (cualquier precio)
  
  Tres modelos por franja como máximo (12 en total, hasta 15 si una franja lo
  justifica). La franja se asigna por `precio_min`/`precio_max` verificados, no
  por el campo interno `precio`.
- **Requisitos de entrada** (todos comprobables): vendido y enviado en
  Amazon.es con stock; nota media ≥ 4,3 con un mínimo de valoraciones (umbral a
  fijar, p. ej. 100); specs completas desde ficha de fabricante o de Amazon;
  garantía declarada; sin quejas repetidas de fallo de motor o inestabilidad en
  las reseñas de 1–2 estrellas (revisión de las 20 más recientes, con nota
  escrita de lo encontrado).
- **Motivos de salida:** descatalogado o sin stock 30+ días; cae por debajo de
  los requisitos; aparece un candidato que lo supera en la misma franja por
  un margen mínimo (p. ej. 0,3 puntos) para evitar rotar por ruido.
- **Fórmula de la nota** (propuesta, pesos a aprobar). Umbrales absolutos, no
  relativos al catálogo, para que la nota de un modelo no cambie cuando entra
  otro:
  - Estabilidad y estructura 35 %: carga máxima, motor doble/simple, peso de
    estructura, secciones.
  - Funciones 25 %: memorias, anticolisión, velocidad, ruido.
  - Recorrido 15 %: altura mínima y máxima (cubre de 1,55 a 1,95 m).
  - Garantía 10 %.
  - Valoración de usuarios 15 %: nota media de Amazon, solo si supera el umbral
    de volumen.
  
  **Se retira "relación calidad-precio"**: la comparación por precio ya la hacen
  las franjas. Así queda cerrado el problema que está abierto en
  `design-ref/README.md`. **Se retira "facilidad de montaje"** como nota: no hay
  dato medible; pasa a texto en pros/contras cuando haya fuente.
- **Fuentes y fechas:** cada dato lleva de dónde sale y cuándo se miró.
- **Independencia:** en muebles Amazon paga el mismo 5 % a todas las marcas,
  así que no hay incentivo por marca; el sesgo posible es hacia lo caro, y lo
  corrige cubrir las cuatro franjas. Sin pruebas físicas (ya declarado en
  `/metodologia`).
- **Correcciones:** cómo se corrige un error y dónde queda constancia.

## Fase 2 — Datos con fuente y fecha *(commit de datos + tipos)*

- `lib/types.ts` / `data/productos.json`, campos nuevos por modelo:
  `franja` (A/B/C/M), `specs_verificado` (fecha ISO), `fuente_specs` (URL),
  `alta` (fecha), `estado` (`activo` | `en_revision` | `retirado`), `sucesor`
  (slug, opcional), `nota_resenas` (texto breve de la revisión de 1–2★, opcional).
  Se empieza con los campos como opcionales (patrón ya usado en `PLAN.md` F1)
  y pasan a obligatorios cuando los 12 estén completos. **Solo se rellenan con
  datos que tú compruebes**; los que falten quedan vacíos y se listan.
- Nuevo `data/cambios-catalogo.json`: registro de altas, bajas y cambios de
  nota con fecha y motivo. Es lo que se publicará en `/metodologia`.
- Claves existentes intactas (`sistema_anticolision`, `garantia_anos`, …).

## Fase 3 — Red de seguridad *(commit transversal, antes de tocar páginas)*

- `scripts/validar-catalogo.mjs` (Node puro, sin dependencias nuevas), como
  `npm run validar`:
  - **Errores:** campos obligatorios; los tres campos de franja juntos o
    ninguno; slugs únicos; `sucesor` apunta a un modelo que existe; cifras de
    precio o recuentos de reseñas dentro de `pros`/`contras`/`veredicto` (regex
    de la auditoría); franja asignada coherente con `precio_min`/`precio_max`.
  - **Avisos** (no rompen el build): franja verificada hace más de 45 días;
    specs hace más de 120; franja con menos de 2 modelos activos.
- Tests con `node --test` (sin framework): la fórmula de nota (casos límite y
  que el resultado sea estable) y el validador.
- `.github/workflows/ci.yml`: en cada push y PR, `npm ci`, `npm run lint`,
  `npm run validar`, `npm test`, `next build`.
- De paso: quitar la variable sin usar `top3` de
  `app/mejor-escritorio-elevable/page.tsx` para dejar el lint limpio.

## Fase 4 — Nota calculada *(1 commit de lib + un commit por página afectada)*

- `lib/nota.ts`: función pura `calcularNota(product)` → `{ apartados, total }`
  según la fórmula aprobada en Fase 1. Se ejecuta en build.
- Consumidores de `puntuacion` a migrar: `lib/products.ts` (orden),
  `lib/ficha.ts` (caminos, standfirst), `lib/schema.ts` (`ratingValue`),
  `components/CompactRatings.tsx`, `components/ProductCard.tsx`, `app/page.tsx`
  y las páginas que la usan (pilar, baratos, reviews, comparativa, test).
- `CRITERIOS` en `lib/metodologia.ts` se reescribe con los apartados nuevos.
- Revisar a mano la prosa que afirma rankings ("lo mejor de la franja: el marco
  Flexispot" en `/escritorio-elevable-barato`, veredictos de las reviews) por si
  el nuevo orden la contradice. Página por página, un commit cada una.
- Actualizar `design-ref/README.md` (§ relación calidad-precio: resuelto).

## Fase 5 — Primer barrido de mercado *(octubre, con tu trabajo en Amazon)*

1. **Tú:** por franja, los ~10 más vendidos y las novedades en Amazon.es. Me
   pasas ASIN y ficha (copiar y pegar basta) de los que pasen un primer filtro.
2. **Yo:** aplico requisitos y fórmula a candidatos y modelos actuales y te
   preparo una tabla por franja: quién entra, quién sale y por qué, qué dato
   falta. Nada entra al JSON sin tu visto bueno.
3. **Tú:** revisión de reseñas de 1–2★ de los que entran; verificas la franja.
4. Commit de datos + entrada en `cambios-catalogo.json`. Prioridad: cubrir el
   hueco de la franja B alta y C baja (~180–310 €).
5. **Bajas con página propia:** redirección 301 al sucesor en `next.config.ts`
   (`redirects()`), nunca un 404. Las bajas sin página solo pasan a
   `estado: retirado`.

## Fase 6 — Una ficha por modelo y sitemap automático *(F5 pendiente del PLAN)*

- Plantilla de ficha para todo modelo activo sin página, según `PLAN.md` §7.2 y
  §7.3 (se conservan las 3 reviews largas y sus URLs). Con esto, dar de alta un
  modelo es añadir una entrada al JSON; la página sale sola.
- `titular` de cada ficha: lo propongo yo, tú lo apruebas (regla de
  `CLAUDE.md`).
- Sustituir `public/sitemap.xml` estático por `app/sitemap.ts` generado desde el
  catálogo (leer antes la guía de `node_modules/next/dist/docs/`), para que la
  rotación no dependa de editar el XML a mano. Comprobar que `robots.txt` sigue
  apuntando bien.
- Un commit por sección de la plantilla, verificada a 375 y 1440 px.

## Fase 7 — Publicar el método *(commit por sección de /metodologia)*

- `/metodologia`: franjas, requisitos, fórmula con sus pesos, fuentes, fechas,
  política de correcciones y el registro de cambios generado desde
  `data/cambios-catalogo.json`.
- Cada ficha muestra "specs verificadas el …" junto a la franja existente.

## Fase 8 — Rutina y calendario

`MANTENIMIENTO.md` se reescribe como checklist:
- **Mensual (~1 h):** franjas de precio y stock de los activos.
- **Trimestral (~3–4 h):** barrido de mercado de la Fase 5 y revisión de
  reseñas negativas de los activos.
- **Semestral:** revisar pesos de la fórmula con los datos de ventas (sin
  cambiar notas por la comisión).
- Recordatorios automáticos en esta cuenta (una Routine mensual y otra
  trimestral) si me lo confirmas al acabar.

## Calendario hasta el Black Friday (27/11/2026)

| Semana | Fases |
|---|---|
| 24–30 sep | 0, 1 (borrador de `METODO.md` para tu revisión) |
| 1–12 oct | 2, 3, 4 |
| 13–26 oct | 5 (barrido) + revisión de precios mensual |
| 27 oct–15 nov | 6, 7 |
| 16–22 nov | 8 + revisión de precios final antes del Black Friday |

## Decisiones que quedan abiertas (se piden en su fase)

- Pesos exactos, umbral de valoraciones y margen para sustituir (Fase 1).
- Límites exactos de las franjas (Fase 1).
- ~~Canal para correcciones~~: resuelto el 24/09, escritorioelevable@gmail.com (METODO.md §8).
- Los "tres caminos" de la home, que hoy son por necesidad: si pasan a ser por
  franja, habría que reabrir una decisión de diseño (Fase 6).

## Verificación

- En cada commit: `npm run lint`, `npm run validar`, `npm test`, `next build`.
- Páginas: arrancar con `next start` y comprobar con Playwright (Chromium de
  `/opt/pw-browsers`) a **375 y 1440 px**: sin desbordamiento horizontal, CTA
  visible, franja con fecha.
- Afiliación: cada `href` a `amazon.es/dp/` lleva `escritoriosel-21` (recuento
  de enlaces = recuento de tags en el HTML servido); `rel` y `target` intactos.
- SEO: todas las rutas del catálogo dan 200 con canonical; las retiradas dan
  301 al sucesor; `sitemap.xml` generado lista exactamente las rutas activas;
  JSON-LD parsea.
- Datos: `git diff data/productos.json` revisado contigo antes de cada commit de
  datos; ningún valor sin fuente.
