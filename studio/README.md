# Studio de vídeos de Elevable

Vídeos verticales (1080×1920) para TikTok e Instagram Reels, hechos con los
datos del catálogo de la web. No tienen datos propios: si cambia
`data/productos.json`, cambia el vídeo.

## Cómo se usa

```bash
cd studio
npm install          # una vez
node generar.ts franja A
```

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
- **Descripción:** pega `descripcion.txt`. Lleva el aviso de afiliado: no lo
  quites.
- **Comenta ELEVABLE:** a quien comente, mándale el enlace a
  `elevable.es/mejor-escritorio-elevable`.

## Reglas (las mismas que la web)

- **Ningún dato a mano.** Posición y nota salen de `lib/nota.ts`; specs y
  franja de precio, de `data/productos.json`. Lo que distingue a cada modelo
  se calcula comparándolo con los otros; si nada lo distingue, su primer
  «pro».
- **Precio, solo como franja con fecha**, en el formato de `franjaPrecio()`.
- **Sin fotos de producto.** Las condiciones de Amazon Afiliados limitan dónde
  se pueden usar sus imágenes; los vídeos llevan ilustraciones de línea.
- **Las fechas importan:** si las franjas de precio tienen más de un mes,
  revísalas antes de publicar (`npm run validar` en la raíz avisa).

## Plantillas

| Plantilla | Qué cuenta |
| --- | --- |
| `franja <F>` | Portada, qué mirar, los 3 primeros de la franja del nº 3 al nº 1 y el cierre con «Comenta ELEVABLE» |
