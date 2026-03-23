export interface ProductSpecs {
  tipo_motor: "simple" | "doble";
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

export interface ProductScore {
  calidad_construccion: number;
  estabilidad: number;
  facilidad_montaje: number;
  relacion_calidad_precio: number;
  funcionalidades: number;
  total: number;
}

export interface Product {
  nombre: string;
  marca: string;
  modelo: string;
  precio: number;
  precio_habitual: number | null;
  imagen: string;
  imagen_alt: string;
  rating: number;
  num_reviews: number;
  disponible: boolean;
  specs: ProductSpecs;
  categorias: string[];
  pros: string[];
  contras: string[];
  veredicto: string;
  puntuacion: ProductScore;
  ideal_para: string;
  slug: string;
}

export type ProductMap = Record<string, Product>;
