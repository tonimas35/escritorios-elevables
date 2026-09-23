import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { CambioCatalogo, Product, ProductMap } from "./types";
import { validarCatalogo, DIAS_FRANJA } from "./validacion.ts";

const leer = <T>(ruta: string): T =>
  JSON.parse(readFileSync(new URL(`../${ruta}`, import.meta.url), "utf8")) as T;

const real = leer<ProductMap>("data/productos.json");
const cambios = leer<CambioCatalogo[]>("data/cambios-catalogo.json");
const HOY = new Date("2026-09-23");

/** Copia del catálogo real con un modelo modificado. */
function catalogoCon(slug: string, cambio: (p: Product) => void): ProductMap {
  const copia = structuredClone(real);
  const p = Object.values(copia).find((q) => q.slug === slug)!;
  cambio(p);
  return copia;
}

const errores = (c: ProductMap, cam = cambios, hoy = HOY) => validarCatalogo(c, cam, hoy).errores;
const avisos = (c: ProductMap, cam = cambios, hoy = HOY) => validarCatalogo(c, cam, hoy).avisos;

test("el catálogo real no tiene errores", () => {
  assert.deepEqual(errores(real), []);
});

test("precio suelto o recuento de reseñas en el texto es error", () => {
  const c1 = catalogoCon("flexispot-e7", (p) => p.pros.push("Cuesta solo 110 €"));
  assert.match(errores(c1).join("\n"), /cifra prohibida en pros/);
  const c2 = catalogoCon("flexispot-e7", (p) => (p.veredicto = "Con más de 500 valoraciones"));
  assert.match(errores(c2).join("\n"), /cifra prohibida en veredicto/);
});

test("franja de precio incompleta es error", () => {
  const c = catalogoCon("flexispot-e7", (p) => (p.precio_verificado = null));
  assert.match(errores(c).join("\n"), /van juntos o ninguno/);
});

test("franja con mínimo mayor que máximo es error", () => {
  const c = catalogoCon("flexispot-e7", (p) => (p.precio_min = 200));
  assert.match(errores(c).join("\n"), /precio_min mayor que precio_max/);
});

test("franja vieja es aviso, no error", () => {
  const tarde = new Date(HOY.getTime() + (DIAS_FRANJA + 30) * 86_400_000);
  assert.deepEqual(errores(real, cambios, tarde), []);
  assert.match(avisos(real, cambios, tarde).join("\n"), /franja verificada hace/);
});

test("slug repetido es error", () => {
  const c = catalogoCon("ergear-120", (p) => (p.slug = "fezibo-120"));
  assert.match(errores(c).join("\n"), /slug repetido/);
});

test("retirado pero disponible es error", () => {
  const c = catalogoCon("fezibo-120", (p) => (p.estado = "retirado"));
  assert.match(errores(c).join("\n"), /retirado pero sigue/);
});

test("sucesor inexistente o no disponible es error", () => {
  const c1 = catalogoCon("fezibo-120", (p) => (p.sucesor = "no-existe"));
  assert.match(errores(c1).join("\n"), /no existe/);
  const c2 = catalogoCon("ergear-120", (p) => (p.disponible = false, p.estado = "retirado"));
  const c3 = structuredClone(c2);
  Object.values(c3).find((p) => p.slug === "fezibo-120")!.sucesor = "ergear-120";
  assert.match(errores(c3).join("\n"), /no está disponible/);
});

test("falta un campo de specs es error", () => {
  const c = catalogoCon("flexispot-e7", (p) => delete (p.specs as Partial<Product["specs"]>).garantia_anos);
  assert.match(errores(c).join("\n"), /specs.garantia_anos/);
});

test("el registro de cambios solo admite slugs del catálogo", () => {
  const mal = [...cambios, { fecha: "2026-09-23", tipo: "baja", slug: "fantasma", motivo: "x" } as CambioCatalogo];
  assert.match(errores(real, mal).join("\n"), /"fantasma" no está en el catálogo/);
});

test("avisa de franjas con más de tres modelos", () => {
  assert.match(avisos(real).join("\n"), /franja B: \d modelos activos \(máximo 3\)/);
});

test("el titular tampoco puede llevar precio", () => {
  const c = catalogoCon("vasagle-100", (p) => (p.titular = "VASAGLE 100x60 por 79 €"));
  assert.match(errores(c).join("\n"), /cifra prohibida en titular/);
});

test("el filtro de cifras no confunde un nombre de modelo con un recuento", () => {
  const c = catalogoCon("flexispot-e7", (p) => (p.titular = "Flexispot E7, opiniones: marco de doble motor"));
  assert.deepEqual(errores(c), []);
  for (const mal of ["2.100 valoraciones", "951 opiniones", "2100+ reviews", "12,50 €", "110 EUR"]) {
    const c2 = catalogoCon("flexispot-e7", (p) => (p.veredicto = mal));
    assert.match(errores(c2).join("\n"), /cifra prohibida/, mal);
  }
});
