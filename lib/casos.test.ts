import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Product, ProductMap } from "./types";
import { calcularNota } from "./nota.ts";
import { casos } from "./casos.ts";
import { publicable } from "./cifras.ts";

const catalogo = Object.values(
  JSON.parse(readFileSync(new URL("../data/productos.json", import.meta.url), "utf8")) as ProductMap,
).map((p) => ({ ...p, puntuacion: calcularNota(p) }));
const activos = catalogo.filter((p) => p.disponible);
const completos = activos.filter((p) => p.incluye_tablero);
const caso = (id: string, cat: Product[] = catalogo) => casos(cat).find((c) => c.id === id);

test("solo modelos activos, y cada motivo es publicable", () => {
  for (const c of casos(catalogo)) {
    assert.ok(c.producto.disponible, c.id);
    assert.ok(publicable(c.motivo), `${c.id}: ${c.motivo}`);
  }
});

test("cada caso elige el extremo que dice, con los datos del catálogo", () => {
  const alto = caso("alto")!;
  assert.ok(activos.every((p) => p.specs.rango_altura_max_cm <= alto.producto.specs.rango_altura_max_cm));

  const espacio = caso("espacio")!;
  assert.ok(espacio.producto.incluye_tablero);
  assert.ok(completos.every((p) => p.specs.ancho_tablero_cm >= espacio.producto.specs.ancho_tablero_cm));

  const carga = caso("carga")!;
  assert.ok(carga.producto.incluye_tablero);
  assert.ok(completos.every((p) => p.specs.peso_max_carga_kg <= carga.producto.specs.peso_max_carga_kg));

  assert.equal(caso("marco")!.producto.incluye_tablero, false);
  assert.equal(caso("anticolision")!.producto.specs.sistema_anticolision, true);
});

test("el ruido solo cuenta si la ficha lo declara", () => {
  const ruido = caso("ruido")!;
  assert.notEqual(ruido.producto.specs.ruido_db, null);
  // Un modelo sin dato de ruido no gana aunque tenga mejor nota.
  const sinDato = { ...completos[0], slug: "sin-dato", specs: { ...completos[0].specs, ruido_db: null } };
  sinDato.puntuacion = { ...sinDato.puntuacion, total: 10 };
  assert.notEqual(caso("ruido", [...catalogo, sinDato])!.producto.slug, "sin-dato");
});

test("un empate se deshace por nota, no por el orden del JSON", () => {
  const base = completos[0];
  const mk = (slug: string, total: number): Product => ({
    ...base,
    slug,
    specs: { ...base.specs, ancho_tablero_cm: 80 },
    puntuacion: { ...base.puntuacion, total },
  });
  const a = mk("a-peor", 7);
  const b = mk("b-mejor", 9);
  assert.equal(caso("espacio", [a, b])!.producto.slug, "b-mejor");
  assert.equal(caso("espacio", [b, a])!.producto.slug, "b-mejor");
});
