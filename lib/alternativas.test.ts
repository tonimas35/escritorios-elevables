import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { ProductMap } from "./types";
import { calcularNota } from "./nota.ts";
import { alternativas } from "./alternativas.ts";

const catalogo = Object.values(
  JSON.parse(readFileSync(new URL("../data/productos.json", import.meta.url), "utf8")) as ProductMap,
).map((p) => ({ ...p, puntuacion: calcularNota(p) }));
const de = (slug: string) => catalogo.find((p) => p.slug === slug)!;
const slugs = (slug: string) => alternativas(de(slug), catalogo).map((a) => a.producto.slug);

test("siempre tres, sin repetir y sin el propio modelo", () => {
  for (const p of catalogo) {
    const alt = alternativas(p, catalogo);
    assert.equal(alt.length, 3, p.slug);
    assert.equal(new Set(alt.map((a) => a.producto.slug)).size, 3, p.slug);
    assert.ok(!alt.some((a) => a.producto.slug === p.slug), p.slug);
  }
});

test("un escritorio completo propone primero el escalón más cercano por arriba", () => {
  const vasagle = de("vasagle-100"); // la nota más baja
  const [primera] = alternativas(vasagle, catalogo);
  assert.equal(primera.motivo, "El siguiente escalón");
  const porEncima = catalogo
    .filter((p) => p.incluye_tablero && p.puntuacion.total > vasagle.puntuacion.total)
    .map((p) => p.puntuacion.total);
  assert.equal(primera.producto.puntuacion.total, Math.min(...porEncima));
});

test("un escritorio completo no propone un marco antes que otro completo", () => {
  const alt = alternativas(de("sanodesk-140"), catalogo);
  const primerMarco = alt.findIndex((a) => !a.producto.incluye_tablero);
  const ultimoCompleto = alt.map((a) => a.producto.incluye_tablero).lastIndexOf(true);
  assert.ok(primerMarco === -1 || primerMarco > ultimoCompleto);
});

test("un marco propone primero el mejor escritorio con tablero", () => {
  const alt = alternativas(de("flexispot-e7"), catalogo);
  assert.equal(alt[0].motivo, "Si quieres tablero incluido");
  assert.equal(alt[0].producto.slug, "flexispot-160x80");
  assert.ok(slugs("flexispot-e7").includes("maidesite-t2-pro-max"), "más carga");
});

test("un modelo no disponible no aparece como alternativa", () => {
  const sinE7 = catalogo.map((p) => (p.slug === "flexispot-e7" ? { ...p, disponible: false } : p));
  for (const p of sinE7) {
    assert.ok(!alternativas(p, sinE7).some((a) => a.producto.slug === "flexispot-e7"), p.slug);
  }
});

test("más grande o más compacto: primero dentro de su franja de precio", () => {
  const alt = alternativas(de("vasagle-160"), catalogo);
  const compacto = alt.find((a) => a.motivo === "Si te vale uno más compacto");
  assert.ok(compacto, "tiene alternativa más compacta");
  assert.equal(compacto.producto.slug, "sanodesk-140", "el completo de 140 cm de su franja, no el S2 Pro");
});
