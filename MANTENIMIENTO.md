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
| `B0CF29CLCP` | `vasagle-160` | VASAGLE 160x60 | 100–160 € | — |
| `B0CKVPFSTD` | `devoko-120` | Devoko 120x60 | 100–130 € | — |
| `B0DZCV1MVF` | `fezibo-120` | FEZIBO 120x60 | 120–160 € | `/fezibo-opiniones` |
| `B0CV4V22XL` | `songmics-160` | SONGMICS 160x70 | 120–160 € | — |
| `B0CKVPZ93G` | `devoko-160` | Devoko 160x70 | 110–180 € | — |
| `B0CDLBJ1VW` | `sanodesk-140` | SANODESK 140x60 | 140–180 € | — |
| `B084KW7N8C` | `flexispot-e7` | Flexispot E7 (marco) | 110–150 € | `/flexispot-e7-opiniones`, `/flexispot-vs-maidesite` |
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
- **`puntuacion.total`** — ordena el ranking en todas las listas.

## Rutina

### Cada mes o mes y medio: las franjas de precio

La web muestra "verificado el DD/MM/AAAA" en cada modelo. Esa fecha envejece a
la vista del lector, así que hay que tocarla aunque el precio no se mueva.

1. Abre cada ASIN en Amazon y mira el precio.
2. En `data/productos.json`, ajusta si hace falta `precio_min` y `precio_max`
   (criterio actual: ±15 % sobre el precio visto, redondeado a la decena).
3. Pon `precio_verificado` a la fecha de hoy, **siempre**, en formato
   `AAAA-MM-DD`.

Los tres campos van juntos: `franjaPrecio()` en `lib/ficha.ts` no publica nada
si falta alguno. Poner `null` en los tres es la forma limpia de retirar una
franja de la que ya no te fías.

### Cada trimestre: el catálogo

1. **ASIN vivos.** Un modelo descatalogado es un enlace de afiliado muerto:
   pierdes la venta y el lector se encuentra un "no disponible". Si ha muerto,
   `disponible: false`.
2. **Specs.** Los fabricantes cambian versiones sin cambiar el ASIN. Compara
   `specs` con la ficha de Amazon.
3. **Altas y bajas.** Ver abajo.

### Al dar de alta o de baja un modelo

**Baja rápida:** `disponible: false`. Sale de las listas y no rompe nada.

**Baja definitiva:** antes de borrar la entrada del JSON, comprueba que su
`slug` no esté fijado en ninguna página (`grep -rn 'getProductBySlug(' app/`).
Los modelos de la tabla con ficha propia no se pueden borrar sin retirar también
esas páginas y sus entradas del `sitemap.xml`.

**Alta:** replica la estructura de una entrada existente. Campos obligatorios
para que no se rompa nada: `slug`, `nombre`, `marca`, `modelo`, `precio`,
`disponible`, `puntuacion`, `specs`, `imagen`, `imagen_alt`. Deja
`precio_min`/`precio_max`/`precio_verificado` a `null` hasta que mires el precio
de verdad.

**El tamaño del catálogo lo decide lo que puedes mantener a mano, no el
mercado.** Doce fichas se revisan en un rato; veinte son una tarde entera cada
mes y medio, y una tarea que se abandona. Rotar antes que acumular.

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
