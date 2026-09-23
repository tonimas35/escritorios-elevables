# Método editorial del catálogo

> **BORRADOR para revisión (23/09/2026).** Nada de lo que dice este fichero se
> aplica todavía a los datos ni a la web. Las cifras marcadas **[decidir]** son
> propuestas. Cuando Toni las apruebe, este fichero pasa a ser la regla y se
> ejecutan las fases 2 a 4 de `PLAN-CATALOGO.md`.

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

## 2. Franjas **[decidir límites]**

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
2. Nota media en Amazon **≥ 4,3** con **al menos 100 valoraciones** **[decidir]**.
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
  más **[decidir]**. Por debajo de ese margen no se rota: sería rotar por ruido.

Un modelo que sale y tenía página propia redirige (301) a su sucesor. Nunca se
deja un 404.

## 5. La nota

Sustituye a la nota actual, que está puesta a mano. Se calcula en el build con
una función pura (`lib/nota.ts`, Fase 4) a partir de los datos del JSON, y la
fórmula se publica.

**Umbrales absolutos**: la nota de un modelo no cambia porque entre o salga
otro. Cada apartado va de 0 a 10.

### Apartados y pesos **[decidir pesos]**

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

### Cómo se publica la nota **[decidir]**

Una nota absoluta pone a los escritorios baratos entre 3 y 5. Es honesto (un
escritorio de 80 € no tiene las prestaciones de uno de 400 €), pero un 4,9 en
grande puede leerse como "malo". Propuesta: la cifra grande de la ficha pasa a
ser la **posición en su franja** ("Nº 1 de la franja A") y la nota absoluta se
enseña al lado, más pequeña, con un enlace a esta fórmula.

## 6. Fuentes y fechas por modelo

Campos nuevos en `data/productos.json` (Fase 2 del plan):

| Campo | Qué es |
|---|---|
| `franja` | A, B, C o M |
| `fuente_specs` | URL de la ficha de donde salen las specs |
| `specs_verificado` | Fecha (AAAA-MM-DD) en que se comprobaron las specs |
| `alta` | Fecha en que entró en el catálogo |
| `estado` | `activo`, `en_revision` o `retirado` |
| `sucesor` | Slug del modelo que lo sustituye, si se retira |
| `nota_resenas` | Resumen de la revisión de reseñas de 1–2★ |

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

## 8. Correcciones **[decidir canal]**

Si alguien avisa de un error, se comprueba, se corrige y queda en el registro
de §7 como tipo `correccion`. Hoy la web no tiene canal de contacto: hay que
elegir uno (un correo dedicado es lo mínimo).

## 9. Calendario

| Cada | Qué | Tiempo |
|---|---|---|
| Mes | Franjas de precio y stock de los activos | ~1 h |
| Trimestre | Barrido de mercado por franja (§3 y §4) y reseñas negativas de los activos | 3–4 h |
| Semestre | Revisar esta fórmula. Nunca para favorecer lo que más vende | 1 h |

## Decisiones pendientes para aprobar este borrador

1. Límites de las franjas (§2).
2. Umbral de valoraciones: 4,3 y 100 (§3).
3. Margen para sustituir: 0,3 puntos (§4).
4. Pesos y umbrales de la fórmula (§5).
5. Cómo se publica la nota: posición en la franja en grande y nota absoluta al lado (§5).
6. Canal de correcciones (§8).
