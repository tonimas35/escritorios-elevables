export interface ProductSpecs {
  tipo_motor: "simple" | "doble" | "manual";
  rango_altura_min_cm: number;
  rango_altura_max_cm: number;
  velocidad_cm_s: number;
  peso_max_carga_kg: number;
  ancho_tablero_cm: number;
  profundidad_tablero_cm: number;
  peso_estructura_kg: number;
  ruido_db: number | null;
  presets_memoria: number;
  sistema_anticolision: boolean;
  tablero_incluido: boolean;
  material_tablero: string | null;
  garantia_anos: number;
}

/**
 * Nota calculada por `calcularNota()` en lib/nota.ts con la formula de
 * METODO.md §5. No se guarda en el JSON: lib/products.ts la calcula al
 * cargar el catalogo. Cada apartado va de 0 a 10.
 */
export interface ProductScore {
  estabilidad: number;
  funciones: number;
  recorrido: number;
  garantia: number;
  /** `null` si el modelo no llega al minimo de valoraciones en Amazon. */
  valoracion: number | null;
  total: number;
}

export interface Product {
  nombre: string;
  marca: string;
  modelo: string;
  precio: number;
  precio_habitual: number | null;
  /**
   * Franja de precio publicada, con la fecha en que se comprobo en Amazon.
   * Los tres van juntos: sin fecha no se publica la franja, porque una
   * franja sin fecha vuelve a ser un precio que caduca en silencio.
   * `null` mientras no se hayan verificado a mano.
   */
  precio_min: number | null;
  precio_max: number | null;
  /** ISO 8601, AAAA-MM-DD. */
  precio_verificado: string | null;
  imagen: string;
  imagen_alt: string;
  rating: number;
  num_reviews: number;
  disponible: boolean;
  tipo: "doble" | "simple" | "manual";
  incluye_tablero: boolean;
  specs: ProductSpecs;
  categorias: string[];
  pros: string[];
  contras: string[];
  veredicto: string;
  puntuacion: ProductScore;
  ideal_para: string;
  /**
   * Linea de exclusion: "No es tu mesa si...". Derivada solo de specs.
   */
  no_es_para: string;
  /**
   * Que distingue al modelo del resto del catalogo. Vacio a proposito en
   * los cinco modelos que son identicos entre si en carga, recorrido,
   * motor, tablero, ancho y garantia: ahi no hay nada que lo distinga.
   */
  define: string;
  slug: string;
  /**
   * H1 de la ficha del modelo. Texto editorial: entra en el JSON solo con
   * visto bueno (CLAUDE.md). Sin titular, el modelo no tiene ficha de
   * plantilla (lib/rutas.ts).
   */
  titular?: string;

  // Trazabilidad del catalogo (METODO.md §6). Opcionales mientras falten
  // datos en algun modelo; pasan a obligatorios cuando esten los doce.
  // `null` significa "pendiente de comprobar", nunca "no aplica".

  /** Fecha (AAAA-MM-DD) en que el modelo entro en el catalogo. */
  alta?: string;
  /** `retirado` exige `disponible: false`; `activo`, `disponible: true`. */
  estado?: EstadoCatalogo;
  /** Slug del modelo que lo sustituye cuando se retira. */
  sucesor?: string | null;
  /** URL de la ficha de fabricante o de Amazon de donde salen las specs. */
  fuente_specs?: string | null;
  /** Fecha (AAAA-MM-DD) en que se comprobaron las specs contra la fuente. */
  specs_verificado?: string | null;
  /** Resumen de la revision de reseñas de 1-2 estrellas (METODO.md §3.5). */
  nota_resenas?: string | null;
}

export type EstadoCatalogo = "activo" | "en_revision" | "retirado";

/** Entrada de data/cambios-catalogo.json (METODO.md §7). */
export interface CambioCatalogo {
  fecha: string;
  tipo: "alta" | "baja" | "cambio_nota" | "correccion";
  slug: string;
  motivo: string;
  sucesor?: string;
}

export type ProductMap = Record<string, Product>;
