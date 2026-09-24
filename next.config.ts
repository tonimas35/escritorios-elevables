import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * www.elevable.es redirige a elevable.es con un 308 permanente.
   *
   * Google tenia indexada la home *con* www mientras el resto del sitio iba
   * sin www: dos copias del mismo contenido compitiendo entre si. El
   * middleware solo marcaba noindex, que borra la pagina del indice pero no
   * traslada nada; la redireccion permanente si consolida las dos versiones
   * en una.
   *
   * Va aqui y no en el middleware porque los redirects de next.config se
   * evaluan antes, y porque Vercel los resuelve en el CDN sin ejecutar la
   * aplicacion.
   */
  async redirects() {
    return [
      {
        source: "/:ruta*",
        has: [{ type: "host", value: "www.elevable.es" }],
        destination: "https://elevable.es/:ruta*",
        permanent: true,
      },
      {
        // El ASIN que se presentaba como "Flexispot E7" es un EG1
        // (data/cambios-catalogo.json, 24/09/2026). La review del E7
        // describia otro producto y se retira; su URL, ya indexada, lleva a
        // la ficha del modelo real en vez de dar un 404.
        source: "/flexispot-e7-opiniones",
        destination: "/flexispot-eg1-opiniones",
        permanent: true,
      },
      {
        // VASAGLE 160x70, retirado el 24/09/2026 (data/cambios-catalogo.json).
        // Su sucesor, el SONGMICS 160x70, no tiene ficha propia todavia:
        // la URL lleva a la guia, donde sale el sucesor, en vez de a un 404.
        source: "/vasagle-160-opiniones",
        destination: "/mejor-escritorio-elevable",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
