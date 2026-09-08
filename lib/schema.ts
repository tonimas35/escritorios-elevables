import { affiliateLink } from "./affiliate";
import type { Product } from "./types";

const SITE = "https://elevable.es";

/**
 * Schema.org Product completo para un producto del catalogo.
 *
 * Incluye `additionalProperty` con las especificaciones que la gente pregunta
 * de verdad (motor, altura, carga, tablero, garantia). Los asistentes de IA
 * son hoy la principal fuente de trafico del sitio y leen datos estructurados,
 * asi que cuanto mas completo sea esto, mejor pueden recomendar el producto.
 */
export function productSchema(asin: string, p: Product, pageUrl?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    image: p.imagen,
    description: p.veredicto,
    brand: { "@type": "Brand", name: p.marca },
    ...(p.modelo ? { model: p.modelo } : {}),
    ...(pageUrl ? { url: `${SITE}${pageUrl}#${p.slug}` } : {}),
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: p.puntuacion.total,
        bestRating: 10,
      },
      author: { "@type": "Organization", name: "Elevable.es" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating,
      reviewCount: p.num_reviews,
      bestRating: 5,
    },
    offers: {
      // Sin `price` a proposito. Amazon cambia precios a diario y no tenemos
      // acceso a la API para mantenerlos al dia; declarar un precio obsoleto
      // incumple el Operating Agreement y hace que Google retire el rich
      // result por discrepancia. Mejor no declararlo que declararlo mal.
      "@type": "Offer",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: affiliateLink(asin),
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Tipo de motor", value: p.specs.tipo_motor },
      { "@type": "PropertyValue", name: "Altura minima", value: `${p.specs.rango_altura_min_cm} cm` },
      { "@type": "PropertyValue", name: "Altura maxima", value: `${p.specs.rango_altura_max_cm} cm` },
      { "@type": "PropertyValue", name: "Carga maxima", value: `${p.specs.peso_max_carga_kg} kg` },
      { "@type": "PropertyValue", name: "Tablero incluido", value: p.specs.tablero_incluido ? "Si" : "No" },
      { "@type": "PropertyValue", name: "Garantia", value: `${p.specs.garantia_anos} años` },
    ],
  };
}

/** ItemList: la estructura que describe una comparativa "los mejores X". */
export function itemListSchema(
  name: string,
  entries: [string, Product][],
  pageUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: entries.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: entries.map(([, p], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.nombre,
      url: `${SITE}${pageUrl}#${p.slug}`,
    })),
  };
}
