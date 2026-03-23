import productosData from "@/data/productos.json";
import type { Product, ProductMap } from "./types";

const productos = productosData as unknown as ProductMap;
const allEntries: [string, Product][] = Object.entries(productos) as [string, Product][];

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
  precioMax?: number;
  alturaMaxMin?: number;
  pesoMaxMin?: number;
  motor?: "simple" | "doble" | "cualquiera";
  sortBy?: "precio" | "rating" | "recomendado";
}): [string, Product][] {
  const filtered = getAvailableProducts().filter(([, p]) => {
    if (filters.precioMax && p.precio > filters.precioMax) return false;
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
    if (sortBy === "precio") return a.precio - b.precio;
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
