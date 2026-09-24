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
    // Sin `aggregateRating`. Declaraba reviewCount con num_reviews, un dato
    // que ya no es visible en ninguna pagina desde que se retiraron los
    // recuentos de opiniones, y Google pide que lo declarado se pueda ver.
    // Quitar solo reviewCount deja el bloque invalido —AggregateRating exige
    // reviewCount o ratingCount— asi que se retira entero. La valoracion
    // propia sigue publicandose en `review`, que si es visible: es la nota
    // sobre 10 que aparece en la ficha.
    // AggregateOffer con lowPrice/highPrice, no Offer con `price`.
    //
    // El precio exacto sigue sin declararse: Amazon lo cambia a diario, no
    // tenemos acceso a su API para mantenerlo al dia, y publicar uno obsoleto
    // hace que Google retire el rich result por discrepancia. Lo que si se
    // puede declarar es la franja, porque es exactamente lo que el lector ve
    // en la pagina, con su fecha de verificacion. Google exige que lo
    // declarado se corresponda con lo visible, y aqui se corresponde.
    //
    // AggregateOffer ademas describe lo que este sitio es —un comparador que
    // enlaza a un vendedor— en vez de una ficha de comerciante, que es como
    // Google interpretaba el Offer suelto y por lo que reclamaba
    // shippingDetails y hasMerchantReturnPolicy. Esos datos son de Amazon,
    // no nuestros, y declararlos seria inventar.
    //
    // Si el modelo no tiene los tres campos de precio, se cae al Offer sin
    // precio de antes: es preferible el aviso de Search Console a un dato
    // inventado.
    offers:
      p.precio_min !== null && p.precio_max !== null && p.precio_verificado
        ? {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: p.precio_min,
            highPrice: p.precio_max,
            offerCount: 1,
            availability: "https://schema.org/InStock",
            url: affiliateLink(asin),
          }
        : {
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
      // Sin garantia declarada no se publica: un dato vacio no va al schema.
      ...(p.specs.garantia_anos !== null
        ? [{ "@type": "PropertyValue", name: "Garantia", value: `${p.specs.garantia_anos} años` }]
        : []),
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
