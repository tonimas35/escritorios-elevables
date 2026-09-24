import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { ProductMap } from "./types";
import { calcularNota } from "./nota.ts";
import { alternativas } from "./alternativas.ts";
import { gama } from "./nota.ts";

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

test("el escalón es el mejor de la gama de precio siguiente, no una nota más alta de otra gama", () => {
  const alt = alternativas(de("vasagle-100"), catalogo); // gama de entrada
  const escalon = alt.find((a) => a.motivo === "Si puedes subir de presupuesto");
  assert.ok(escalon);
  assert.equal(gama(escalon.producto), "media");
  const mejorMedia = catalogo
    .filter((p) => p.incluye_tablero && gama(p) === "media")
    .sort((a, b) => b.puntuacion.total - a.puntuacion.total || b.rating - a.rating)[0];
  assert.equal(escalon.producto.slug, mejorMedia.slug);
  // En la gama alta no hay escalón.
  assert.ok(!alternativas(de("maidesite-s2-pro"), catalogo).some((a) => a.motivo === "Si puedes subir de presupuesto"));
});

test("un escritorio completo no propone un marco antes que otro completo", () => {
  const alt = alternativas(de("sanodesk-140"), catalogo);
  const primerMarco = alt.findIndex((a) => !a.producto.incluye_tablero);
  const ultimoCompleto = alt.map((a) => a.producto.incluye_tablero).lastIndexOf(true);
  assert.ok(primerMarco === -1 || primerMarco > ultimoCompleto);
});

test("un marco propone primero el mejor escritorio con tablero", () => {
  const alt = alternativas(de("flexispot-eg1"), catalogo);
  assert.equal(alt[0].motivo, "Si quieres tablero incluido");
  const mejorCompleto = catalogo
    .filter((p) => p.incluye_tablero)
    .sort((a, b) => b.puntuacion.total - a.puntuacion.total || b.rating - a.rating || a.slug.localeCompare(b.slug))[0];
  assert.equal(alt[0].producto.slug, mejorCompleto.slug);
  assert.ok(slugs("flexispot-eg1").includes("maidesite-t2-pro-max"), "más carga");
});

test("un modelo no disponible no aparece como alternativa", () => {
  const sinE7 = catalogo.map((p) => (p.slug === "flexispot-eg1" ? { ...p, disponible: false } : p));
  for (const p of sinE7) {
    assert.ok(!alternativas(p, sinE7).some((a) => a.producto.slug === "flexispot-eg1"), p.slug);
  }
});

test("más grande o más compacto: primero dentro de su franja de precio", () => {
  const alt = alternativas(de("vasagle-160"), catalogo);
  const compacto = alt.find((a) => a.motivo === "Si te vale uno más compacto");
  assert.ok(compacto, "tiene alternativa más compacta");
  assert.equal(compacto.producto.slug, "sanodesk-140", "el completo de 140 cm de su franja, no el S2 Pro");
});
