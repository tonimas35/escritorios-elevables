/**
 * Validacion del catalogo contra las reglas de CLAUDE.md y METODO.md.
 *
 * Funcion pura: recibe los datos y la fecha de hoy y devuelve errores y
 * avisos. La ejecuta scripts/validar-catalogo.ts en local y en CI.
 *
 * - Error: algo que no se puede publicar. Rompe `npm run validar`.
 * - Aviso: algo que caduca o esta pendiente. Se enseña, no rompe nada,
 *   para que una franja vieja no bloquee un arreglo urgente.
 *
 * Sin alias de rutas ni imports de Next: se ejecuta con Node a secas.
 */
import type { CambioCatalogo, Product, ProductMap } from "./types";
import { CIFRA_PROHIBIDA } from "./cifras.ts";
import { franja } from "./nota.ts";

export interface Resultado {
  errores: string[];
  avisos: string[];
}

/** Dias desde los que una franja de precio se considera vieja. */
export const DIAS_FRANJA = 45;
/** Dias desde los que unas specs verificadas se consideran viejas. */
export const DIAS_SPECS = 120;

const SPECS: (keyof Product["specs"])[] = [
  "tipo_motor",
  "rango_altura_min_cm",
  "rango_altura_max_cm",
  "velocidad_cm_s",
  "peso_max_carga_kg",
  "ancho_tablero_cm",
  "profundidad_tablero_cm",
  "peso_estructura_kg",
  "ruido_db",
  "presets_memoria",
  "sistema_anticolision",
  "tablero_incluido",
  "material_tablero",
  "garantia_anos",
];

const TEXTOS: (keyof Product)[] = ["veredicto", "ideal_para", "no_es_para", "define"];

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

function esFecha(v: unknown): v is string {
  return typeof v === "string" && FECHA.test(v) && !Number.isNaN(Date.parse(v));
}

function dias(desde: string, hoy: Date): number {
  return Math.floor((hoy.getTime() - Date.parse(desde)) / 86_400_000);
}

export function validarCatalogo(
  productos: ProductMap,
  cambios: CambioCatalogo[],
  hoy: Date,
): Resultado {
  const errores: string[] = [];
  const avisos: string[] = [];
  const entradas = Object.entries(productos);
  const slugs = new Set<string>();
  const pendientes: Record<string, string[]> = {
    fuente_specs: [],
    specs_verificado: [],
    nota_resenas: [],
  };

  for (const [asin, p] of entradas) {
    const id = p.slug || asin;

    // Campos obligatorios para que ninguna pagina se rompa (MANTENIMIENTO.md).
    for (const campo of ["slug", "nombre", "marca", "modelo", "imagen", "imagen_alt"] as const) {
      if (typeof p[campo] !== "string" || p[campo] === "") errores.push(`${id}: falta \`${campo}\``);
    }
    if (typeof p.precio !== "number") errores.push(`${id}: falta \`precio\` (segmenta páginas aunque no se publique)`);
    if (typeof p.disponible !== "boolean") errores.push(`${id}: falta \`disponible\``);
    if (!p.specs) {
      errores.push(`${id}: faltan las \`specs\``);
    } else {
      for (const k of SPECS) if (!(k in p.specs)) errores.push(`${id}: falta \`specs.${k}\``);
    }

    if (p.slug) {
      if (slugs.has(p.slug)) errores.push(`${id}: slug repetido`);
      slugs.add(p.slug);
    }

    // Franja de precio: los tres campos juntos o ninguno (CLAUDE.md, "Precios").
    const trio = [p.precio_min, p.precio_max, p.precio_verificado];
    const rellenos = trio.filter((v) => v !== null && v !== undefined).length;
    if (rellenos !== 0 && rellenos !== 3) {
      errores.push(`${id}: precio_min, precio_max y precio_verificado van juntos o ninguno`);
    } else if (rellenos === 3) {
      if ((p.precio_min as number) > (p.precio_max as number)) errores.push(`${id}: precio_min mayor que precio_max`);
      if (!esFecha(p.precio_verificado)) {
        errores.push(`${id}: precio_verificado no es una fecha AAAA-MM-DD`);
      } else {
        const d = dias(p.precio_verificado, hoy);
        if (d < 0) errores.push(`${id}: precio_verificado es una fecha futura`);
        else if (d > DIAS_FRANJA && p.disponible) avisos.push(`${id}: franja verificada hace ${d} días (revisar cada ${DIAS_FRANJA})`);
      }
    }

    // Texto publicable: ni precios sueltos ni recuentos de reseñas.
    const frases: [string, string][] = [
      ...(p.pros ?? []).map((t, i): [string, string] => [`pros[${i}]`, t]),
      ...(p.contras ?? []).map((t, i): [string, string] => [`contras[${i}]`, t]),
      ...TEXTOS.map((k): [string, string] => [k, String(p[k] ?? "")]),
    ];
    for (const [donde, texto] of frases) {
      const m = texto.match(CIFRA_PROHIBIDA);
      if (m) errores.push(`${id}: cifra prohibida en ${donde}: "${m[0]}"`);
    }

    // Estado y sucesor (METODO.md §4 y §6).
    if (p.estado === "retirado" && p.disponible) errores.push(`${id}: retirado pero sigue con disponible: true`);
    if (p.estado === "activo" && !p.disponible) errores.push(`${id}: activo pero con disponible: false`);
    if (p.sucesor) {
      const suc = entradas.find(([, q]) => q.slug === p.sucesor);
      if (!suc) errores.push(`${id}: el sucesor "${p.sucesor}" no existe`);
      else if (suc[1].slug === p.slug) errores.push(`${id}: es su propio sucesor`);
      else if (!suc[1].disponible) errores.push(`${id}: el sucesor "${p.sucesor}" no está disponible`);
    }

    for (const campo of ["alta", "specs_verificado"] as const) {
      const v = p[campo];
      if (v !== null && v !== undefined && !esFecha(v)) errores.push(`${id}: ${campo} no es una fecha AAAA-MM-DD`);
    }
    if (esFecha(p.specs_verificado)) {
      const d = dias(p.specs_verificado, hoy);
      if (d > DIAS_SPECS && p.disponible) avisos.push(`${id}: specs verificadas hace ${d} días (revisar cada ${DIAS_SPECS})`);
    }

    if (p.disponible) {
      if (!p.fuente_specs) pendientes.fuente_specs.push(id);
      if (!p.specs_verificado) pendientes.specs_verificado.push(id);
      if (!p.nota_resenas) pendientes.nota_resenas.push(id);
    }
  }

  // Pendientes agrupados: doce avisos iguales esconden los que importan.
  for (const [campo, ids] of Object.entries(pendientes)) {
    if (ids.length) avisos.push(`${campo} pendiente en ${ids.length}: ${ids.join(", ")}`);
  }

  // Cobertura de franjas (METODO.md §2): al menos dos modelos por franja.
  const porFranja: Record<string, number> = { A: 0, B: 0, C: 0, M: 0 };
  for (const [, p] of entradas) {
    if (!p.disponible) continue;
    const f = franja(p);
    if (f) porFranja[f]++;
  }
  for (const [f, n] of Object.entries(porFranja)) {
    if (n < 2) avisos.push(`franja ${f}: ${n} modelo${n === 1 ? "" : "s"} activo${n === 1 ? "" : "s"} (mínimo 2)`);
    if (n > 3) avisos.push(`franja ${f}: ${n} modelos activos (máximo 3)`);
  }

  // Registro de cambios (METODO.md §7).
  cambios.forEach((c, i) => {
    const donde = `cambios-catalogo.json[${i}]`;
    if (!esFecha(c.fecha)) errores.push(`${donde}: fecha no válida`);
    if (!["alta", "baja", "cambio_nota", "correccion"].includes(c.tipo)) errores.push(`${donde}: tipo "${c.tipo}" no válido`);
    if (!slugs.has(c.slug)) errores.push(`${donde}: el slug "${c.slug}" no está en el catálogo`);
    if (!c.motivo) errores.push(`${donde}: falta el motivo`);
    if (c.sucesor && !slugs.has(c.sucesor)) errores.push(`${donde}: el sucesor "${c.sucesor}" no está en el catálogo`);
  });

  return { errores, avisos };
}
