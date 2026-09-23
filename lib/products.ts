import productosData from "@/data/productos.json";
import type { Product, ProductMap } from "./types";
import { calcularNota } from "./nota";

// La nota no se guarda en el JSON: se calcula aqui, una vez, con la
// formula de METODO.md §5. Asi todas las paginas leen la misma.
const productos: ProductMap = Object.fromEntries(
  Object.entries(productosData as unknown as ProductMap).map(([asin, p]) => [
    asin,
    { ...p, puntuacion: calcularNota(p) },
  ]),
);
const allEntries: [string, Product][] = Object.entries(productos);

export function getAllProducts(): [string, Product][] {
  return allEntries;
}

export function getProduct(asin: string): Product | undefined {
  return productos[asin];
}

export function getProductBySlug(slug: string): [string, Product] | undefined {
  return allEntries.find(([, p]) => p.slug === slug);
}

export function getAvailableProducts(): [string, Product][] {
  return allEntries.filter(([, p]) => p.disponible);
}

export function getTopProducts(count: number = 3): [string, Product][] {
  return getAvailableProducts()
    .sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total)
    .slice(0, count);
}

export function filterProducts(filters: {
  alturaMaxMin?: number;
  pesoMaxMin?: number;
  motor?: "simple" | "doble" | "manual" | "cualquiera";
  sortBy?: "rating" | "recomendado";
}): [string, Product][] {
  const filtered = getAvailableProducts().filter(([, p]) => {
    if (filters.alturaMaxMin && p.specs.rango_altura_max_cm < filters.alturaMaxMin)
      return false;
    if (filters.pesoMaxMin && p.specs.peso_max_carga_kg < filters.pesoMaxMin)
      return false;
    if (filters.motor && filters.motor !== "cualquiera" && p.specs.tipo_motor !== filters.motor)
      return false;
    return true;
  });

  const sortBy = filters.sortBy || "recomendado";
  return filtered.sort(([, a], [, b]) => {
    if (sortBy === "rating") return b.rating - a.rating;
    return b.puntuacion.total - a.puntuacion.total;
  });
}

export function getProductsInHeightRange(
  minHeight: number,
  maxHeight: number,
  count: number = 3
): [string, Product][] {
  return getAvailableProducts()
    .filter(
      ([, p]) =>
        p.specs.rango_altura_min_cm <= minHeight &&
        p.specs.rango_altura_max_cm >= maxHeight
    )
    .sort(([, a], [, b]) => b.puntuacion.total - a.puntuacion.total)
    .slice(0, count);
}
