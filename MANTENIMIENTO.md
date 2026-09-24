# Mantenimiento del catálogo

Este fichero es el índice de los productos que viven en la web y la rutina para
mantenerlos al día. **No es la fuente de los datos**: la fuente es
`data/productos.json` y solo esa. Aquí están el índice estable (ASIN y slug, que
no cambian), dónde aparece cada modelo y qué hay que revisar cada cuánto.

Si al leer esto la tabla no coincide con el JSON, manda el JSON.

## El catálogo: 12 modelos

Última revisión de precios: **10/09/2026**.

| ASIN | slug | Modelo | Franja | Ficha propia |
|---|---|---|---|---|
| `B0FSQ8W2C1` | `vasagle-100` | VASAGLE 100x60 | 70–90 € | — |
| `B0D9MGDDHD` | `ergear-120` | ErGear 120x60 | 90–120 € | — |
| `B0CF29CLCP` | `vasagle-160` | VASAGLE 160x70 | 100–160 € | — |
| `B0CKVPFSTD` | `devoko-120` | Devoko 120x60 | 100–130 € | — |
| `B0DZCV1MVF` | `fezibo-120` | FEZIBO 120x60 | 120–160 € | `/fezibo-opiniones` |
| `B0CV4V22XL` | `songmics-160` | SONGMICS 160x70 | 120–160 € | — |
| `B0CKVPZ93G` | `devoko-160` | Devoko 160x70 | 110–180 € | — |
| `B0CDLBJ1VW` | `sanodesk-140` | SANODESK 140x60 | 140–180 € | — |
| `B084KW7N8C` | `flexispot-eg1` | FLEXISPOT EG1 (marco) | 110–150 € | `/flexispot-eg1-opiniones` (plantilla; `/flexispot-e7-opiniones` redirige), `/flexispot-vs-maidesite` |
| `B0DG2VTCXS` | `maidesite-t2-pro-max` | MAIDeSITe T2 Pro MAX | 310–430 € | `/maidesite-t2-pro-opiniones`, `/flexispot-vs-maidesite` |
| `B09TQR3MMM` | `maidesite-s2-pro` | MAIDeSITe S2 Pro 140x70 | 370–490 € | `/flexispot-vs-maidesite` |
| `B09R746JHX` | `flexispot-160x80` | FLEXISPOT 160x80 | 350–470 € | `/flexispot-vs-maidesite` |

Los doce salen además en la home, en `/mejor-escritorio-elevable` y en
`/comparador`.

### Huecos conocidos

Cinco modelos tienen el campo `define` vacío porque **sus especificaciones no
los distinguen de otro del catálogo**: `ergear-120`, `devoko-120`, `fezibo-120`,
`songmics-160` y `devoko-160`. ErGear y FEZIBO de 120x60 son idénticos en todas
las specs. Rellenarlos exige un dato que hoy no está en el JSON (acabado, tipo
de mando, origen del motor); inventarlo está prohibido por `CLAUDE.md`.

## Qué decide dónde sale cada modelo

Tres campos del JSON gobiernan el reparto. Conviene saberlo antes de tocarlos:

- **`disponible`** — si es `false`, el modelo desaparece de **todos** los
  listados: home, `/mejor-escritorio-elevable`, `/escritorio-elevable-barato`,
  `/comparador` y las recomendaciones de `/calculadora-altura`. Es el
  interruptor para dar de baja algo sin borrarlo. Lo que **no** apaga son las
  fichas propias de la tabla de arriba, que buscan el modelo por su `slug`.
- **`precio`** — **no se publica en ninguna parte, pero segmenta las páginas.**
  `/escritorio-elevable-barato` muestra los de `precio < 220` (hoy, nueve de los
  doce) y `/mejor-escritorio-elevable` reparte en premium (`> 300`), medio
  (`150–300`) y entrada (`< 150`). Si alguien lo borra pensando que sobra porque
  ahora publicamos franjas, esas páginas se rompen sin dar ningún error.
- **La nota** — ordena el ranking en todas las listas. Ya no está en el JSON:
  la calcula `lib/nota.ts` con la fórmula de `METODO.md` §5 a partir de
  `specs`, `rating` y `num_reviews`. Cambiar una spec cambia la nota.
- **`precio_min` y `precio_max`** — deciden la franja (A, B, C, M1 o M2, por el
  punto medio) y con ella la posición del modelo y sus alternativas.
- **`titular`** — si lo tiene y no tiene review propia, el modelo tiene
  ficha en `/{slug}-opiniones` y entra en el sitemap.

## Rutina

El criterio está en `METODO.md`; esto es el cómo. Antes y después de tocar
datos: `npm run validar` (errores rompen, avisos avisan) y `npm test`. La CI de
GitHub los ejecuta también en cada push.

### Cada mes (~1 h, el día 15): franjas de precio y stock

1. `npm run validar`: lista las franjas con más de 45 días.
2. Abre cada ASIN activo en Amazon.es. ¿Tiene stock? Si lleva más de 30 días
   sin él, es motivo de salida (METODO.md §4).
3. En `data/productos.json`, ajusta `precio_min` y `precio_max` si hace falta
   (±15 % sobre el precio visto, redondeado a la decena) y pon
   `precio_verificado` a la fecha de hoy, **siempre**, en `AAAA-MM-DD`. Los
   tres campos van juntos; `null` en los tres retira la franja.
4. Si un modelo cambia de franja al moverse el precio, su posición y sus
   alternativas cambian solas. Revisa que su titular siga siendo cierto.

### Cada trimestre (3–4 h, enero, abril, julio y octubre): barrido de mercado

0. **Que el ASIN sea el modelo que nombramos.** El 24/09/2026 se descubrió
   que el "Flexispot E7" que enlazábamos desde marzo era un EG1: otro marco,
   de un motor. En cada activo, comprobar que el título y las fotos de la
   ficha de Amazon corresponden al nombre y a las specs que publicamos, no
   solo que las specs sueltas cuadren.
1. Por franja (A, B, C, M1, M2), los ~10 más vendidos y las novedades en Amazon.es.
2. Filtro de entrada (METODO.md §3): nota ≥ 4,3 con 100 valoraciones o más,
   specs completas con fuente, garantía declarada, sin clones de lo que ya hay.
3. De los que pasan, las 20 reseñas de 1–2★ más recientes: ¿se repite algún
   fallo? Resumen en `nota_resenas`.
4. Claude calcula la nota de candidatos y activos y propone entradas y
   salidas por franja. Solo se sustituye con 0,3 puntos o más de diferencia.
5. Cada alta, baja o corrección, con fecha y motivo, en
   `data/cambios-catalogo.json`. Se publica solo en `/metodologia`.
6. Rellena en los activos lo que falte: `fuente_specs`, `specs_verificado`
   (las specs caducan a los 120 días) y `nota_resenas`.
7. Relee los titulares y las frases con "del catálogo": dependen de qué
   modelos haya.

### Cada semestre (1 h): la fórmula

Revisar pesos y umbrales de `METODO.md` §5. Nunca para favorecer lo que más
vende o más comisión deja. Si cambian, se cambia primero `METODO.md`, con
fecha, luego `lib/nota.ts`, y cada nota que se mueva va al registro.

### Al dar de alta o de baja un modelo

**Baja rápida:** `disponible: false` y `estado: "retirado"`, con entrada en el
registro. Sale de las listas, del sitemap y de las alternativas.

**Baja con sucesor:** además, `sucesor` con el slug del que lo sustituye. Si
tenía página propia, esa URL debe redirigir (301) al sucesor en
`next.config.ts`, nunca quedarse en 404.

**Baja definitiva:** antes de borrar la entrada del JSON, comprueba que su
`slug` no esté fijado en ninguna página (`grep -rn 'getProductBySlug(' app/`)
ni en `RUTAS_FIJAS` de `lib/rutas.ts`.

**Alta:** replica la estructura de una entrada existente. Obligatorios:
`slug`, `nombre`, `marca`, `modelo`, `precio`, `disponible`, `specs`
completas, `imagen`, `imagen_alt`, más `alta`, `estado` y la fuente de las
specs. La franja de precio a `null` hasta mirar el precio de verdad. La ficha
en `/{slug}-opiniones` aparece sola cuando el modelo tiene `titular`, que
necesita visto bueno antes de entrar.

**El tamaño del catálogo lo decide lo que puedes mantener a mano, no el
mercado.** Tres por franja como máximo. Rotar antes que acumular.

## La API de Publicidad de Productos: descartada

Resolvería a la vez los puntos de precio, disponibilidad y specs: los datos
vendrían de Amazon en tiempo real y desaparecería la revisión manual.

**No se puede usar.** Amazon exige **10 ventas aptas en los últimos 30 días**
para obtener el acceso *y para mantenerlo*. En septiembre de 2026 el sitio hace
unas 3 ventas al mes. Pedirla ahora sería que la cortaran a los pocos días.

Si algún día se llega a 10 ventas mensuales, merece la pena retomarlo: son
~15–40 pedidos al mes, o sea 200–300 € de comisión, y a esa altura el
mantenimiento manual ya duele. Ojo entonces con una obligación del acuerdo:
los precios que vengan de la API hay que **refrescarlos cada 24 horas**, lo que
exige una tarea programada, no un script que se ejecuta cuando uno se acuerda.

No volver a investigarlo sin comprobar antes las ventas de los últimos 30 días.
