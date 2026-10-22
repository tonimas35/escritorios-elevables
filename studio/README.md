# Studio de vídeos de Elevable

Vídeos verticales (1080×1920) y carruseles de fotos (1080×1350) para TikTok e
Instagram, hechos con los datos del catálogo de la web. No tienen datos propios: si cambia
`data/productos.json`, cambia el vídeo.

## Cómo se usa

```bash
cd studio
npm install          # una vez
node generar.ts franja A              # vídeo
node generar.ts franja A --carrusel   # carrusel de fotos
```

El carrusel sale en `studio/salida/<fecha>-franja-a-carrusel/`: las fotos
numeradas en orden y la misma descripción. En Instagram, el 4:5 ocupa más
pantalla en el feed que un vídeo; en TikTok, súbelo como fotos.

Sale en `studio/salida/<fecha>-franja-a/`:

- `video.mp4`: unos 20 segundos, sin música.
- `descripcion.txt`: el texto para pegar al publicar.
- Los fotogramas en PNG, por si quieres subirlos como carrusel de fotos.

Franjas: `A` (completos hasta 120 €), `B` (120–250 €), `C` (250–500 €),
`M1` (bases hasta 250 €) y `M2` (bases de 250 a 500 €).

Hace falta ffmpeg y un Chromium. Usa el de Playwright en `/opt/pw-browsers`;
otro, con `CHROMIUM=/ruta/al/chrome node generar.ts franja A`.

## Al publicar

- **Música:** elígela en la app, de su biblioteca. Una cuenta de empresa solo
  puede usar la música comercial que la app ofrece.
- **Descripción:** pega `descripcion.txt`. Lleva 5 hashtags, el máximo que
  admite Instagram, y el aviso de afiliado: no lo
  quites.
- **Comenta ELEVABLE:** a quien comente, mándale el enlace a
  `elevable.es/mejor-escritorio-elevable`.

## Reglas (las mismas que la web)

- **Ningún dato a mano.** Posición y nota salen de `lib/nota.ts`; specs y
  franja de precio, de `data/productos.json`. Lo que distingue a cada modelo
  se calcula comparándolo con los otros; si nada lo distingue, su primer
  «pro».
- **Precio, solo como franja con fecha**, en el formato de `franjaPrecio()`.
- **Nunca fotos de Amazon.** Sus normas de afiliados no permiten descargarlas
  para archivos propios.
- **Fotos del fabricante, opcionales:** guarda la del modelo en
  `studio/fotos/<slug>.jpg` (el `slug` de `data/productos.json`, p. ej.
  `vasagle-100.jpg`). Mejor con fondo blanco. Si no hay foto, sale la
  ilustración. La carpeta no se sube al repo, que es público.
- **Las fechas importan:** si las franjas de precio tienen más de un mes,
  revísalas antes de publicar (`npm run validar` en la raíz avisa).

## Plantillas

| Plantilla | Qué cuenta |
| --- | --- |
| `franja <F>` | Portada, qué mirar, los 3 primeros de la franja del nº 3 al nº 1 y el cierre con «Comenta ELEVABLE» |
| `altura` | ¿A qué altura debe estar tu mesa? La regla de los codos a 90°, la tabla por estatura (la de la calculadora de la web) y si los escritorios del catálogo llegan. Cierre: «Comenta tu ALTURA» |
| `verdades` | Lo que nadie te dice antes de comprar: 5 verdades con su cifra del catálogo (carga, anticolisión, ancho, motor, garantía) |
