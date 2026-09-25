import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { rutaFicha } from "@/lib/rutas";
import { REVISION } from "@/lib/fecha";

const SITE = "https://elevable.es";

type Entrada = {
  ruta: string;
  frecuencia: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  prioridad: number;
};

// Paginas que no son ficha de un modelo. Las fichas salen del catalogo, para
// que dar de alta o de baja un modelo no obligue a tocar este fichero.
const PAGINAS: Entrada[] = [
  { ruta: "/", frecuencia: "weekly", prioridad: 1.0 },
  { ruta: "/mejor-escritorio-elevable", frecuencia: "weekly", prioridad: 0.9 },
  { ruta: "/escritorio-elevable-barato", frecuencia: "weekly", prioridad: 0.9 },
  { ruta: "/flexispot-vs-maidesite", frecuencia: "monthly", prioridad: 0.8 },
  { ruta: "/sanodesk-vs-flexispot", frecuencia: "monthly", prioridad: 0.8 },
  { ruta: "/bases-elevables", frecuencia: "weekly", prioridad: 0.9 },
  { ruta: "/que-escritorio-elevable-comprar", frecuencia: "monthly", prioridad: 0.8 },
  { ruta: "/comparador", frecuencia: "monthly", prioridad: 0.7 },
  { ruta: "/calculadora-altura", frecuencia: "monthly", prioridad: 0.5 },
  { ruta: "/metodologia", frecuencia: "monthly", prioridad: 0.5 },
  { ruta: "/aviso-legal", frecuencia: "yearly", prioridad: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Solo modelos disponibles: la ficha de uno retirado redirige a su
  // sucesor (METODO.md §4), y un sitemap no debe listar redirecciones.
  const fichas = new Set<string>();
  for (const [, p] of getAllProducts()) {
    const ruta = rutaFicha(p);
    if (ruta && p.disponible) fichas.add(ruta);
  }
  const entradas: Entrada[] = [
    ...PAGINAS,
    ...[...fichas].map((ruta): Entrada => ({ ruta, frecuencia: "monthly", prioridad: 0.8 })),
  ];
  return entradas.map((e) => ({
    url: e.ruta === "/" ? `${SITE}/` : `${SITE}${e.ruta}`,
    lastModified: REVISION,
    changeFrequency: e.frecuencia,
    priority: e.prioridad,
  }));
}
