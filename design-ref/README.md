# design-ref — referencia visual del rediseño

Esto **no es código a copiar**. Es la referencia visual del rediseño de la parte
superior de elevable.es, exportada desde Claude Design con el sistema **Broadsheet**
(papel, tinta y un único serif, Source Serif 4).

Los ficheros de `code/` son prototipos HTML: se abren en el navegador, pero dependen
de un runtime propio (`support.js`, `_ds/`) que no tiene nada que ver con este
proyecto. Sirven para mirar cómo debe quedar —color, tipografía, escala, espaciado,
estados— y luego **recrearlo** en el entorno que ya existe en el repo: React Server
Components de Next.js (App Router), Tailwind y los tokens de `app/globals.css`.

Nadie debería importar, copiar ni enlazar nada de `code/` desde `app/` o `components/`.

## Qué hay aquí

| Ruta | Qué es |
| --- | --- |
| `code/README.md` | El handoff completo: tokens, especificación pantalla por pantalla, reglas de contenido |
| `code/github.md` | Mapa de qué pantalla se construyó a partir de qué ficheros del repo |
| `code/Elevable - Actual.dc.html` | Estado actual de la home, para comparar |
| `code/Elevable.dc.html` | Home rediseñada |
| `code/Elevable - Ficha de modelo.dc.html` | Plantilla de ficha de modelo individual |
| `code/_ds/`, `code/support.js` | Runtime y hoja del sistema del prototipo. Solo para que los `.dc.html` se vean |
| `screenshots/` | Capturas de referencia (de momento vacío) |

## Decisiones ya tomadas

Estas no están abiertas a debate en la implementación:

- **CTA en negro tinta (`#201e1d`) con texto crema (`#f8f4f4`).** Todos los botones de
  acción, sin excepción.
- **Verde botella (`#2d4a3e`) solo como color estructural**: cabeceras de tabla,
  filetes y franjas. **Nunca rellena un botón.** Como mucho aparece en bordes,
  etiquetas y el hover de los CTA.
- **Sin precios ni rangos de precio en ninguna parte.** El CTA es siempre "Ver precio
  actual en Amazon"; el precio vive en Amazon, no aquí.
- **Declaración de afiliado en gris pequeño (`#7d7979`, 12–13px) bajo cada CTA**, en
  una línea. No hay bloque grande de afiliado al final de la página.
- **Avatar del autor: monograma "T"**, círculo de 44px con fondo verde botella y la
  letra en crema. Sin foto.

El resto de tokens (paleta completa, escala tipográfica, filetes, el desregistro de
cuatricromía de las cifras de puntuación) está en `code/README.md`.

## FUERA DE ALCANCE

Dos cosas del prototipo **no se implementan**, aunque `code/README.md` las describa.
Ese fichero es el export tal cual salió de la herramienta; esta sección manda sobre él.

### La matriz de notas por apartado

La tabla de 12 modelos × 5 criterios + global que aparece en el prototipo **no se
construye**. Dos razones:

1. **Las notas no cuadran.** Las notas por apartado de `data/productos.json` no
   reconstruyen la nota global: SANODESK y SONGMICS tienen la misma media aritmética
   de los cinco apartados (8,5) y sin embargo globales distintas (9,2 y 9,1). La
   global está puesta a mano, no calculada, y no hay pesos documentados en ninguna
   parte del repo con los que justificarla.
2. **No hay datos reales detrás.** Publicar una matriz de cinco cifras por modelo es
   afirmar que cada cifra se ha medido. No es el caso.

Publicar la matriz haría el problema más visible, no lo resolvería. Queda fuera hasta
que existan notas que se sostengan.

### El criterio "relación calidad-precio"

Sin resolver. El campo `relacion_calidad_precio` existe en `data/productos.json` y es
uno de los cinco apartados, pero **contradice la decisión de no publicar precios**: es
un juicio sobre el precio en una página que, por decisión de diseño, no dice cuánto
cuesta nada. Puntuar la relación calidad-precio sin enseñar el precio no es
comprobable por el lector.

No se muestra en ninguna pantalla mientras la contradicción siga abierta. Salidas
posibles, ninguna elegida todavía: retirar el criterio, renombrarlo a algo que no
hable de precio, o reabrir la decisión sobre publicar precios.
