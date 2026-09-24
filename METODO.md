# Método editorial del catálogo

> **Aprobado por Toni el 23/09/2026**, con todas las cifras tal como estaban
> propuestas. Es la regla del catálogo. Cambiar una cifra de este fichero es
> cambiar el método: se hace aquí primero, con fecha, y luego en el código.

Este documento dice qué modelos recomienda elevable.es, por qué, cómo se puntúan
y cuándo se sustituyen. Todo lo que publica la web sobre un modelo tiene que
poder explicarse con este fichero y con `data/productos.json`.

## 1. Principios

1. **Recomendar lo mejor de cada franja de precio, no lo que más comisión deja.**
   En muebles, Amazon paga el mismo 5 % a todas las marcas: no hay incentivo
   por marca. El único sesgo posible es empujar hacia lo caro, y lo corrige
   cubrir siempre todas las franjas, también la más barata.
2. **Solo datos comprobables, con fuente y fecha.** Si falta un dato, se deja
   vacío y se dice. No se estima, no se copia de un modelo parecido.
3. **No probamos los escritorios físicamente**, y se dice en `/metodologia`.
   Por eso la nota sale de specs y de lo que dicen los compradores, nunca de
   impresiones inventadas.
4. **El método es público.** Franjas, requisitos, fórmula y registro de cambios
   se publican en `/metodologia`.

## 2. Franjas

| Franja | Qué entra | Precio (franja verificada) |
|---|---|---|
| **A** | Escritorio completo (con tablero) | hasta 120 € |
| **B** | Escritorio completo | 120–250 € |
| **C** | Escritorio completo | 250–500 € |
| **M1** | Marco sin tablero | hasta 250 € |
| **M2** | Marco sin tablero | 250–500 € |

- Los marcos iban en una sola franja M hasta el 24/09/2026. Se parte en dos,
  aprobado por Toni, porque juntaba un marco de gama media con uno de gama
  alta y su posición comparaba notas que §5 dice que no se comparan.
- Sin franja de precio verificada, un modelo no tiene franja, sea completo o
  marco.
- Se asigna por el **punto medio** de `precio_min`–`precio_max`, porque las
  franjas publicadas se solapan con los límites (ej.: Devoko 120, 100–130 €,
  punto medio 115 → A).
- **Hasta tres modelos por franja**, y un máximo de 15 en total.
- **No se repiten clones.** Si dos modelos tienen specs idénticas (hoy ErGear
  120 y FEZIBO 120), entra uno: el de mejor valoración con más volumen. Un hueco
  en el catálogo ocupado por un clon es un hueco que no ayuda a nadie.

## 3. Requisitos de entrada

Un modelo entra solo si cumple **todos**:

1. Se vende y se envía en Amazon.es y tiene stock el día de la revisión.
2. Nota media en Amazon **≥ 4,3** con **al menos 100 valoraciones**.
   Menos volumen no es señal fiable.
3. Specs completas (las 14 de `specs`) sacadas de la ficha del fabricante o de
   la de Amazon, con la URL guardada en `fuente_specs`.
4. ~~Garantía declarada por escrito.~~ Retirado el 24/09/2026 como requisito
   de entrada: en la gama barata casi ninguna ficha de Amazon declara los años,
   y exigirlo dejaba sin cubrir las franjas más asequibles. La garantía sigue
   contando en la nota cuando la ficha la declara (§5), y en la web se dice
   "Sin dato" cuando no.
5. Revisión de las **20 reseñas de 1–2 estrellas más recientes**: sin un patrón
   repetido de fallo de motor, de inestabilidad o de piezas que llegan rotas.
   Lo encontrado se resume en `nota_resenas`, aunque sea "nada relevante".

## 4. Motivos de salida

- Descatalogado, o sin stock durante más de 30 días.
- Deja de cumplir algún requisito de §3.
- Aparece un candidato en la misma franja que lo supera en **0,3 puntos** o
  más. Por debajo de ese margen no se rota: sería rotar por ruido.
- Su nota baja de **7,5** (añadido el 24/09/2026 con 6,5; subido a 7,5 el
  mismo día al pasar la escala de §5 a mínimo 6). Es una regla interna: **no
  se publica en la web**. `npm run validar` avisa de los que están por debajo.

Un modelo que sale y tenía página propia redirige (301) a su sucesor. Nunca se
deja un 404.

## 5. La nota

> **Cambio del 24/09/2026, aprobado por Toni.** La primera versión (23/09)
> medía cada escritorio contra el mejor del mercado, con umbrales únicos:
> los de 100 € sacaban entre 3 y 5 aunque cumplieran lo que prometen, y el
> lector lo leía como un suspenso. Ahora cada escritorio se mide contra lo que
> se puede esperar en su **gama de precio**.

Se calcula en el build con una función pura (`lib/nota.ts`) a partir de los
datos del JSON, y la fórmula se publica.

### Gamas

Por el punto medio de la franja de precio verificada, igual que §2, pero sin
separar marcos de completos: **entrada** hasta 120 €, **media** de 120 a 250 €
y **alta** de 250 a 500 €. Sin franja verificada se usa el campo interno
`precio`.

### Apartados y pesos

| Apartado | Peso | Qué mide |
|---|---|---|
| Estabilidad y estructura | 35 % | 50 % carga · 30 % motor · 20 % peso de la estructura |
| Funciones | 25 % | Media de memorias, anticolisión, velocidad y ruido (si hay dato) |
| Recorrido | 15 % | Media de altura mínima y máxima |
| Garantía | 10 % | Años declarados |
| Valoración de compradores | 15 % | Nota media en Amazon, solo con 100 valoraciones o más; si no, no cuenta y los demás se reescalan |

### Umbrales

> **Reajuste del 24/09/2026, aprobado por Toni.** La escala pasa a dar **6
> puntos al mínimo aceptable** (antes 5) y se afinan los niveles de
> "excelente", los puntos fijos del motor y la anticolisión, y la valoración
> de compradores. Motivo: con el mínimo en 5, lo que recomendamos quedaba en
> notas de 6,5 a 8,7, y el lector lee un 6 o un 7 como un aprobado justo en
> algo que le recomendamos. Todas las notas suben entre 0,5 y 1 punto; el
> orden apenas cambia.

En cada dato, **6 = lo mínimo aceptable en esa gama** y **10 = lo mejor que se
puede esperar en ella**, en línea recta y recortado entre 0 y 10. Son fijos por
gama: la nota de un modelo no cambia porque entre o salga otro.

| Dato (6 → 10) | Entrada | Media | Alta |
|---|---|---|---|
| Carga | 50 → 75 kg | 70 → 95 kg | 100 → 150 kg |
| Motor (puntos) | simple 8 · doble 10 | simple 8 · doble 10 | simple 3 · doble 10 |
| Peso de la estructura | 15 → 23 kg | 20 → 30 kg | 28 → 38 kg |
| Velocidad | 2 → 2,8 cm/s | 2 → 2,8 cm/s | 3 → 3,8 cm/s |
| Ruido | 55 → 47 dB | 55 → 47 dB | 50 → 44 dB |
| Altura mínima | 74 → 71 cm | 74 → 69 cm | 72 → 64 cm |
| Altura máxima | 115 → 120 cm | 116 → 123 cm | 118 → 128 cm |
| Garantía | 2 → 4 años | 2 → 4 años | 3 → 5 años |

En todas las gamas: memorias 2 → 4; anticolisión sí 10, no 3; valoración de
compradores 4,0 → 4,6 estrellas, y solo con 100 valoraciones o más (§3). Si la
ficha no declara velocidad, ruido, peso de la estructura, número de memorias
o si tiene anticolisión, ese dato no cuenta y los demás de su apartado se
reparten el peso. Si no declara la garantía, el apartado de garantía no cuenta
y los demás apartados se reescalan, igual que la valoración sin volumen.

- **Garantía compuesta** (por ejemplo, 5 años el marco y 3 el motor): cuenta
  la menor, porque es la que cubre la pieza que antes falla.
- **Carga:** la que la ficha da en movimiento. Si solo da una cifra, esa.
- **Si la ficha se contradice** (los puntos destacados dicen una cosa y la
  tabla de detalles otra), manda lo que declara el fabricante en el título y
  los puntos destacados; la tabla de Amazon solo se usa si ellos no lo dicen.
- **El peso de la estructura** solo cuenta en marcos, donde el "peso del
  artículo" es el de la estructura. En un escritorio completo ese peso
  incluye el tablero y no sirve.

Añadido el 24/09/2026 al verificar las doce fichas contra Amazon: varias
cifras que había en el catálogo no aparecían en ninguna fuente.

**Consecuencia:** las notas de gamas distintas **no se comparan entre sí**. Un
8 en la gama de entrada y un 8 en la alta dicen lo mismo, "muy bueno para lo
que cuesta", no que sean iguales. Por eso las alternativas suben de gama con
"Si puedes subir de presupuesto" en vez de ordenar por nota
(`lib/alternativas.ts`).

**Salen dos apartados de la primera versión de la nota:** relación
calidad-precio (ahora lo hacen las gamas) y facilidad de montaje (no hay dato
que la mida).

### Simulación del 24/09/2026 (escala con mínimo 5)

Primera versión de la nota por gama, con los datos de ese día sin verificar
(ver §6). Con el reajuste a mínimo 6 las notas quedaban entre 7,5 y 9,2, y
tras verificar las doce fichas contra Amazon.es (24/09/2026) entre 6,8 y 9,4.
Todas están en el registro de cambios.

| Modelo | Gama | Primera versión | Nota por gama |
|---|---|---|---|
| "Flexispot E7" (el ASIN es un EG1: se corrige aparte) | media | 8,6 | 9,9 |
| MAIDeSITe T2 Pro MAX | alta | 8,5 | 8,7 |
| ErGear 120 | entrada | 4,9 | 8,3 |
| Devoko 120 | entrada | 4,8 | 8,2 |
| FLEXISPOT 160x80 | alta | 7,1 | 7,8 |
| SANODESK 140 | media | 5,2 | 7,7 |
| Devoko 160 | media | 5,1 | 7,7 |
| VASAGLE 160 | media | 4,9 | 7,6 |
| SONGMICS 160 | media | 5,0 | 7,6 |
| MAIDeSITe S2 Pro | alta | 7,0 | 7,4 |
| Fezibo 120 | media | 4,7 | 7,1 |
| VASAGLE 100 | entrada | 3,0 | 6,5 |

### Cómo se publica la nota

La cifra grande de la ficha es la **posición en su franja** ("Nº 1 de la franja
A") y la nota se enseña al lado, más pequeña, con un enlace a esta fórmula.

Aprobado por Toni el 24/09/2026:

- **Empates.** Dos modelos de la misma franja cuya nota se diferencia en menos
  de **0,3 puntos** (el mismo margen que §4 exige para rotar) se publican como
  **empate técnico**, nombrando al otro. La posición se mantiene, porque el
  orden hace falta, pero no se presenta como una ventaja real. El desempate
  interno sigue siendo la valoración de Amazon y, después, el orden
  alfabético.
- **La home no nombra "el mejor" del catálogo.** Como las notas de gamas
  distintas no se comparan, el veredicto de la home da el primero de cada
  franja, no un ganador absoluto. Por la misma razón ninguna ficha dice "la
  nota más alta del catálogo".
- **La sección de detalle de la home** ("El podio") es el nº 1 de la franja B
  y sus dos siguientes, no la nota más alta del catálogo. El CTA fijo del
  móvil apunta a ese mismo modelo.

## 6. Fuentes y fechas por modelo

Campos nuevos en `data/productos.json` (Fase 2 del plan):

| Campo | Qué es |
|---|---|
| `fuente_specs` | URL de la ficha de donde salen las specs |
| `specs_verificado` | Fecha (AAAA-MM-DD) en que se comprobaron las specs |
| `alta` | Fecha en que entró en el catálogo |
| `estado` | `activo`, `en_revision` o `retirado` |
| `sucesor` | Slug del modelo que lo sustituye, si se retira |
| `nota_resenas` | Resumen de la revisión de reseñas de 1–2★ |

La **franja no se guarda**: se calcula en `lib/nota.ts` con la regla de §2 a
partir de `incluye_tablero`, `precio_min` y `precio_max`. Guardarla sería tener
dos fuentes que pueden contradecirse.

Siguen como están: `precio_min`, `precio_max` y `precio_verificado` (ya con su
regla en `CLAUDE.md`). `num_reviews` se usa para el umbral de §3 y no se
publica.

## 7. Registro de cambios

Cada alta, baja o cambio de nota queda en `data/cambios-catalogo.json` con
fecha, modelo y motivo, y se publica en `/metodologia`. Ejemplo de entrada:

```json
{ "fecha": "2026-10-20", "tipo": "baja", "slug": "fezibo-120",
  "motivo": "Clon de ErGear 120 (specs idénticas); se queda el de más valoraciones.",
  "sucesor": "ergear-120" }
```

## 8. Correcciones

Si alguien avisa de un error, se comprueba, se corrige y queda en el registro
de §7 como tipo `correccion`. El canal es el correo
**escritorioelevable@gmail.com** (24/09/2026), publicado en `/metodologia` y en
el aviso legal desde `lib/contacto.ts`.

## 9. Calendario

| Cada | Qué | Tiempo |
|---|---|---|
| Mes | Franjas de precio y stock de los activos | ~1 h |
| Trimestre | Barrido de mercado por franja (§3 y §4) y reseñas negativas de los activos | 3–4 h |
| Semestre | Revisar esta fórmula. Nunca para favorecer lo que más vende | 1 h |
