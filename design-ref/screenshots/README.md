# Capturas

## home-{375,1440}-{antes,despues}.png

Comparación de la rama `design/tokens`: extracción del sistema visual a
variables CSS. `antes` es `app/globals.css` sin tocar; `despues`, ya
refactorizado. **Los cuatro ficheros salen del mismo commit del JSX**: en esa
rama no se tocó ni una línea de HTML o React.

Los pares son **idénticos al byte** (mismo MD5), que es justo lo que se quería
demostrar. Se comprobaron así las 12 rutas del sitio a las dos anchuras, 24
capturas por pasada; las 24 salieron idénticas píxel a píxel.

Cómo se tomaron, por si hay que repetirlas:

- Build de producción (`next build` + `next start`), no servidor de desarrollo.
- Chromium headless, `deviceScaleFactor: 1`, página completa, animaciones
  congeladas y `prefers-reduced-motion`.
- Se recorre la página entera antes de disparar, para que los
  `IntersectionObserver` de `FadeIn` hayan saltado.
- **Red aislada**: todo lo externo se intercepta. Sin esto la comparación no
  vale nada — entre dos pasadas cambió la disponibilidad de Amazon y de Google
  Fonts, y eso solo ya produce capturas distintas.

Por eso las fotos de producto salen como un rectángulo gris: `m.media-amazon.com`
está bloqueado por la política de salida del contenedor. La maqueta, el
espaciado y el color son los reales; las fotos, no.
