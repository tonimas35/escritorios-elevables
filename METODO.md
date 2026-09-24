# Método editorial del catálogo

> **Aprobado por Toni el 23/09/2026**, con todas las cifras tal como estaban
> propuestas. Es la regla del catálogo. Solo queda abierta la dirección del
> canal de correcciones (§8). Cambiar una cifra de este fichero es cambiar el
> método: se hace aquí primero, con fecha, y luego en el código.

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
| **M** | Marco sin tablero | cualquier precio |

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
4. Garantía declarada por escrito.
5. Revisión de las **20 reseñas de 1–2 estrellas más recientes**: sin un patrón
   repetido de fallo de motor, de inestabilidad o de piezas que llegan rotas.
   Lo encontrado se resume en `nota_resenas`, aunque sea "nada relevante".

## 4. Motivos de salida

- Descatalogado, o sin stock durante más de 30 días.
- Deja de cumplir algún requisito de §3.
- Aparece un candidato en la misma franja que lo supera en **0,3 puntos** o
  más. Por debajo de ese margen no se rota: sería rotar por ruido.

Un modelo que sale y tenía página propia redirige (301) a su sucesor. Nunca se
deja un 404.

## 5. La nota

Sustituye a la nota actual, que está puesta a mano. Se calcula en el build con
una función pura (`lib/nota.ts`, Fase 4) a partir de los datos del JSON, y la
fórmula se publica.

**Umbrales absolutos**: la nota de un modelo no cambia porque entre o salga
otro. Cada apartado va de 0 a 10.

### Apartados y pesos

| Apartado | Peso | Cómo se calcula |
|---|---|---|
| Estabilidad y estructura | 35 % | 50 % carga (40 kg → 0, 150 kg → 10) · 30 % motor (doble 10, simple 5) · 20 % peso de la estructura (15 kg → 0, 40 kg → 10) |
| Funciones | 25 % | Media de: memorias (4 o más → 10) · anticolisión (sí 10, no 0) · velocidad (2 cm/s → 0, 4 cm/s → 10) · ruido (55 dB → 0, 42 dB → 10) |
| Recorrido | 15 % | Media de: altura mínima (75 cm → 0, 60 cm → 10) y máxima (115 cm → 0, 130 cm → 10). Cubrir de 1,55 a 1,95 m de estatura |
| Garantía | 10 % | 1 año → 0, 5 años → 10 |
| Valoración de compradores | 15 % | Nota media de Amazon (4,0 → 0, 4,8 → 10). Solo con 100 valoraciones o más; si no, este apartado no cuenta y los demás se reescalan |

Entre los extremos, lineal. Fuera de ellos, se queda en 0 o en 10. Total =
media ponderada, con un decimal.

**Salen dos apartados de los actuales:**
- **Relación calidad-precio.** Comparar por precio ya lo hacen las franjas.
  Con esto queda cerrado lo que tenía abierto `design-ref/README.md`.
- **Facilidad de montaje.** No hay dato que la mida. Pasa a pros y contras
  cuando haya una fuente (instrucciones del fabricante o reseñas).

Queda fuera de la nota "calidad de construcción" como apartado aparte: los
datos que la sostienen (peso de la estructura, motor) ya están en estabilidad.
El número de secciones telescópicas no está en el JSON; si se añade con
fuente, puede entrar aquí.

### Simulación sobre el catálogo actual

Con los pesos de arriba y los datos de hoy de `data/productos.json`:

| Modelo | Franja | Nota nueva | Nota actual |
|---|---|---|---|
| Flexispot E7 | M | 8,6 | 9,7 |
| MAIDeSITe T2 Pro MAX | M | 8,5 | 9,4 |
| FLEXISPOT 160x80 | C | 7,1 | 9,5 |
| MAIDeSITe S2 Pro | C | 7,0 | 9,3 |
| SANODESK 140 | B | 5,2 | 9,2 |
| Devoko 160 | B | 5,1 | 8,9 |
| SONGMICS 160 | B | 5,0 | 9,1 |
| ErGear 120 | A | 4,9 | 8,8 |
| VASAGLE 160 | B | 4,9 | 8,7 |
| Devoko 120 | A | 4,8 | 8,7 |
| FEZIBO 120 | B | 4,7 | 8,5 |
| VASAGLE 100 | A | 3,0 | 8,1 |

Lo que enseña:

1. **Las notas actuales están infladas.** Ninguna baja de 8,1 cuando entre el
   modelo más básico y el más completo hay una diferencia enorme de carga,
   motor, velocidad y recorrido. La fórmula la hace visible.
2. **El orden de arriba casi no cambia**: el E7 sigue primero. Donde sí cambia
   es en la zona media (SONGMICS baja, Devoko 160 sube).
3. **Sobran clones en las franjas A y B.** Siete de los doce modelos son
   escritorios de un motor, 72–120 cm, 70–80 kg y 3 años: prácticamente el
   mismo producto con distinto ancho de tablero.
   Cuatro de ellos tienen `define` vacío justo por eso. Ocupan sitio que
   debería ser para algo distinto.
4. **La franja C tiene solo dos modelos y ninguno entre 180 y 350 €.** Es el
   hueco que hay que cubrir en el primer barrido.

### Cómo se publica la nota

Una nota absoluta pone a los escritorios baratos entre 3 y 5. Es honesto (un
escritorio de 80 € no tiene las prestaciones de uno de 400 €), pero un 4,9 en
grande puede leerse como "malo". Por eso la cifra grande de la ficha es la
**posición en su franja** ("Nº 1 de la franja A") y la nota absoluta se enseña
al lado, más pequeña, con un enlace a esta fórmula.

## 5 bis. PROPUESTA: nota por gama de precio (borrador 24/09/2026)

> **Pendiente de aprobación. No aplicada.** Sustituiría a la fórmula de §5.

**Por qué.** Con la escala de §5, un escritorio de 100 € que hace bien lo que
promete saca un 4 o un 5, porque se le mide contra uno de 400 €. El lector lee
"4,7 sobre 10" como un suspenso, y no es lo que queremos decir: si lo
recomendamos es porque está bien *para lo que cuesta*.

**Cómo.** Mismos apartados y pesos que §5. Cambian los umbrales: cada **gama**
tiene los suyos, fijos y publicados. En cada dato, **5 = lo mínimo aceptable en
esa gama** y **10 = lo mejor que se puede esperar en ella**, en línea recta y
recortado entre 0 y 10. Los umbrales no dependen del resto del catálogo: la
nota de un modelo no cambia porque entre otro.

**Gama** por el punto medio de la franja de precio verificada, igual que §2,
pero sin separar marcos de completos: **entrada** hasta 120 €, **media** de 120
a 250 € y **alta** de 250 a 500 €.

| Dato (5 → 10) | Entrada | Media | Alta |
|---|---|---|---|
| Carga | 50 → 80 kg | 70 → 100 kg | 100 → 160 kg |
| Motor (puntos) | simple 7 · doble 10 | simple 7 · doble 10 | simple 2 · doble 10 |
| Peso de la estructura | 15 → 25 kg | 20 → 32 kg | 28 → 40 kg |
| Velocidad | 2 → 3 cm/s | 2 → 3 cm/s | 3 → 4 cm/s |
| Ruido | 55 → 45 dB | 55 → 45 dB | 50 → 42 dB |
| Altura mínima | 74 → 70 cm | 74 → 68 cm | 72 → 62 cm |
| Altura máxima | 115 → 122 cm | 116 → 125 cm | 118 → 130 cm |
| Garantía | 2 → 4 años | 2 → 5 años | 3 → 5 años |

En todas las gamas: memorias 2 → 4; anticolisión sí 10, no 2; valoración de
compradores 4,0 → 4,7 estrellas, y solo con 100 valoraciones o más (§3).

**Norma de entrada nueva:** un modelo con **nota por debajo de 6,5** no se
recomienda y sale en el siguiente barrido. Así, todo lo publicado queda entre
6,5 y 10 porque se ha elegido así, no porque se haya estirado la escala.

**Simulación con los datos de hoy** (sin verificar: ver el aviso de abajo):

| Modelo | Gama | Nota §5 hoy | Nota propuesta |
|---|---|---|---|
| "Flexispot E7" (ver aviso) | media | 8,6 | 9,9 |
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

**Avisos antes de aprobar:**

- El "E7" lleva specs de un E7, pero el ASIN es otro marco (EG1). Con sus datos
  reales su nota bajará. Se corrige aparte.
- 11 de 12 modelos tienen specs sin verificar, y varias ya se sabe que no
  cuadran con Amazon (ErGear, los dos Devoko, VASAGLE 100, SONGMICS, S2 Pro).
  Las notas definitivas saldrán del barrido de octubre, con datos comprobados.
- VASAGLE 100 queda justo en el límite (6,5). Con datos verificados puede
  quedar por encima o salir.
- Los umbrales son una propuesta razonada, no una medición. Se pueden
  discutir, pero una vez aprobados solo se cambian aquí, con fecha, y nunca
  para que un modelo concreto suba o baje.

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
de §7 como tipo `correccion`. El canal es un correo dedicado, pendiente de
crear: hoy la web no tiene ningún contacto.

## 9. Calendario

| Cada | Qué | Tiempo |
|---|---|---|
| Mes | Franjas de precio y stock de los activos | ~1 h |
| Trimestre | Barrido de mercado por franja (§3 y §4) y reseñas negativas de los activos | 3–4 h |
| Semestre | Revisar esta fórmula. Nunca para favorecer lo que más vende | 1 h |

## Pendiente

- **Dirección del canal de correcciones** (§8). Aprobado que sea un correo
  dedicado; falta crearlo y decir cuál es.
