import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Product, ProductMap } from "./types";
import { calcularNota, franja, gama, posicionEnFranja, PESOS } from "./nota.ts";

const catalogo = Object.values(
  JSON.parse(readFileSync(new URL("../data/productos.json", import.meta.url), "utf8")) as ProductMap,
).map((p) => ({ ...p, puntuacion: calcularNota(p) }));

const porSlug = (slug: string) => catalogo.find((p) => p.slug === slug)!;

/** Modelo sintetico: se parte de uno real y se cambia lo que se quiere probar. */
function con(base: string, cambios: { specs?: Partial<Product["specs"]> } & Partial<Omit<Product, "specs">>): Product {
  const p = porSlug(base);
  return { ...p, ...cambios, specs: { ...p.specs, ...(cambios.specs ?? {}) } } as Product;
}

test("los pesos suman 1", () => {
  const suma = Object.values(PESOS).reduce((s, x) => s + x, 0);
  assert.ok(Math.abs(suma - 1) < 1e-9);
});

test("todas las notas y apartados quedan entre 0 y 10 con un decimal", () => {
  for (const p of catalogo) {
    for (const [k, v] of Object.entries(p.puntuacion)) {
      if (v === null) continue;
      assert.ok(v >= 0 && v <= 10, `${p.slug}.${k} = ${v}`);
      assert.equal(Math.round(v * 10) / 10, v, `${p.slug}.${k} tiene más de un decimal`);
    }
  }
});

test("reproduce la simulación aprobada en METODO.md §5", () => {
  const esperado: Record<string, number> = {
    "maidesite-t2-pro-max": 9.2,
    "ergear-120": 9.1,
    "devoko-120": 9.1,
    "sanodesk-140": 8.6,
    "devoko-160": 8.6,
    "songmics-160": 8.5,
    "flexispot-160x80": 8.5,
    "vasagle-160": 8.4,
    "flexispot-eg1": 8.2,
    "maidesite-s2-pro": 8.1,
    "fezibo-120": 7.9,
    "vasagle-100": 7.5,
  };
  for (const [slug, total] of Object.entries(esperado)) {
    assert.equal(porSlug(slug).puntuacion.total, total, slug);
  }
});

test("umbrales fijos por gama: la nota no depende del resto del catálogo", () => {
  const e7 = porSlug("flexispot-eg1");
  assert.deepEqual(calcularNota(e7), e7.puntuacion);
});

test("los extremos se recortan a 0 y 10", () => {
  const tope = calcularNota(con("maidesite-t2-pro-max", { specs: { peso_max_carga_kg: 500, peso_estructura_kg: 100 } }));
  assert.equal(tope.estabilidad, 10);
  const suelo = calcularNota(con("vasagle-100", { specs: { peso_max_carga_kg: 10, peso_estructura_kg: 5 } }));
  assert.equal(suelo.estabilidad, 2.6); // motor simple en gama de entrada (0,3 × 8) y estructura muy ligera (0,2 × 1)
});

test("sin 100 valoraciones el apartado no cuenta y el resto se reescala", () => {
  const t2 = porSlug("maidesite-t2-pro-max"); // 76 valoraciones
  assert.equal(t2.puntuacion.valoracion, null);
  const n = t2.puntuacion;
  const sinValoracion =
    (n.estabilidad * PESOS.estabilidad + n.funciones * PESOS.funciones + n.recorrido * PESOS.recorrido + n.garantia * PESOS.garantia) /
    (1 - PESOS.valoracion);
  assert.ok(Math.abs(sinValoracion - n.total) <= 0.1);
});

test("sin dato de ruido, funciones no se inventa un valor", () => {
  const conRuido = calcularNota(porSlug("songmics-160")); // 50 dB
  const sinRuido = calcularNota(con("songmics-160", { specs: { ruido_db: null } }));
  assert.notEqual(conRuido.funciones, sinRuido.funciones);
  assert.ok(sinRuido.funciones >= 0 && sinRuido.funciones <= 10);
});

test("franja por el punto medio de la franja de precio verificada", () => {
  assert.equal(franja(porSlug("flexispot-eg1")), "M1"); // marco de 110–150
  assert.equal(franja(porSlug("maidesite-t2-pro-max")), "M2"); // marco de 310–430
  assert.equal(franja({ incluye_tablero: false, precio_min: null, precio_max: null }), null); // marco sin franja verificada
  assert.equal(franja(porSlug("vasagle-100")), "A"); // 70–90
  assert.equal(franja(porSlug("devoko-120")), "A"); // 100–130, medio 115
  assert.equal(franja(porSlug("fezibo-120")), "B"); // 120–160
  assert.equal(franja(porSlug("flexispot-160x80")), "C");
  assert.equal(franja({ incluye_tablero: true, precio_min: null, precio_max: null }), null);
  assert.equal(franja({ incluye_tablero: true, precio_min: 600, precio_max: 800 }), null);
  assert.equal(franja({ incluye_tablero: true, precio_min: 100, precio_max: 140 }), "A"); // medio 120: límite incluido
});

test("posición en franja: cada marco solo se compara con los de su franja", () => {
  const t2 = posicionEnFranja(porSlug("maidesite-t2-pro-max"), catalogo)!;
  assert.deepEqual([t2.franja, t2.posicion, t2.de], ["M2", 1, 1]);
  const eg1 = posicionEnFranja(porSlug("flexispot-eg1"), catalogo)!;
  assert.deepEqual([eg1.franja, eg1.posicion, eg1.de], ["M1", 1, 1]);
  const b = catalogo.filter((p) => franja(p) === "B").map((p) => posicionEnFranja(p, catalogo)!.posicion).sort();
  assert.deepEqual(b, b.map((_, i) => i + 1), "posiciones consecutivas aunque haya empate técnico");
});

test("empate técnico: menos de 0,3 puntos en la misma franja", () => {
  const base = porSlug("ergear-120");
  const otro = (slug: string, total: number) =>
    ({ ...base, slug, puntuacion: { ...base.puntuacion, total } }) as Product;
  const grupo = [otro("a", 8.6), otro("b", 8.4), otro("c", 8.3)];
  const empates = (slug: string) =>
    posicionEnFranja(grupo.find((p) => p.slug === slug)!, grupo)!.empateCon.map((p) => p.slug);
  assert.deepEqual(empates("a"), ["b"], "8,6 y 8,3 no empatan aunque la resta dé 0,2999…");
  assert.deepEqual(empates("b"), ["a", "c"]);
  assert.deepEqual(empates("c"), ["b"]);
  // Los de otra franja no empatan aunque tengan la misma nota.
  const marco = { ...otro("m", 8.6), incluye_tablero: false } as Product;
  assert.deepEqual(posicionEnFranja(grupo[0], [...grupo, marco])!.empateCon.map((p) => p.slug), ["b"]);
});

test("gama por el punto medio de la franja de precio, marcos incluidos", () => {
  assert.equal(gama(porSlug("vasagle-100")), "entrada"); // 70–90
  assert.equal(gama(porSlug("fezibo-120")), "media"); // 120–160
  assert.equal(gama(porSlug("flexispot-eg1")), "media"); // marco de 110–150
  assert.equal(gama(porSlug("maidesite-t2-pro-max")), "alta"); // marco de 310–430
  assert.equal(gama({ precio: 100, precio_min: null, precio_max: null }), "entrada"); // sin franja: precio interno
});

test("la misma ficha puntúa más en una gama más barata", () => {
  const base = porSlug("songmics-160");
  const enEntrada = calcularNota({ ...base, precio_min: 80, precio_max: 100 });
  const enAlta = calcularNota({ ...base, precio_min: 300, precio_max: 400 });
  assert.ok(enEntrada.total > base.puntuacion.total && base.puntuacion.total > enAlta.total);
});

test("sin velocidad ni peso de estructura, esos datos no cuentan y no se inventan", () => {
  const base = porSlug("songmics-160");
  const sin = calcularNota(con("songmics-160", { specs: { velocidad_cm_s: null, peso_estructura_kg: null } }));
  for (const v of Object.values(sin)) if (v !== null) assert.ok(v >= 0 && v <= 10);
  assert.notDeepEqual(sin, base.puntuacion);
});
