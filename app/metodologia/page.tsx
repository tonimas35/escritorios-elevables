import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { CRITERIOS } from "@/lib/metodologia";
import {
  MEMORIAS,
  MIN_VALORACIONES,
  PUNTOS_EXCELENTE,
  PUNTOS_MINIMO,
  SIN_ANTICOLISION,
  NOMBRE_FRANJA,
  UMBRALES,
  VALORACION,
  type Franja,
  type Gama,
} from "@/lib/nota";
import { coma } from "@/lib/format";
import { fechaCorta } from "@/lib/fecha";
import cambiosData from "@/data/cambios-catalogo.json";
import type { CambioCatalogo } from "@/lib/types";

// Registro publico de cambios del catalogo (METODO.md §7), el mas reciente
// primero. Los slugs se traducen a nombre con el catalogo actual.
// Tabla de umbrales de METODO.md §5, leida de lib/nota.ts para que lo
// publicado no pueda divergir de la formula.
const GAMAS: Gama[] = ["entrada", "media", "alta"];
const NOMBRE_GAMA: Record<Gama, string> = { entrada: "Entrada", media: "Media", alta: "Alta" };
type Umbrales = (typeof UMBRALES)[Gama];
const rango = ([a, b]: [number, number], unidad: string) => `${coma(a)} → ${coma(b)} ${unidad}`;
const FILAS_UMBRALES: [string, (u: Umbrales) => string][] = [
  ["Carga", (u) => rango(u.carga, "kg")],
  ["Motor", (u) => `simple ${u.motor.simple} · doble ${u.motor.doble}`],
  ["Peso de la estructura", (u) => rango(u.estructura, "kg")],
  ["Velocidad", (u) => rango(u.velocidad, "cm/s")],
  ["Ruido", (u) => rango(u.ruido, "dB")],
  ["Altura mínima", (u) => rango(u.alturaMin, "cm")],
  ["Altura máxima", (u) => rango(u.alturaMax, "cm")],
  ["Garantía", (u) => rango(u.garantia, "años")],
];

const TIPO_CAMBIO: Record<CambioCatalogo["tipo"], string> = {
  alta: "Alta",
  baja: "Baja",
  cambio_nota: "Nota",
  correccion: "Corrección",
};

export const metadata: Metadata = {
  title: "Cómo analizamos los escritorios elevables",
  description:
    "Qué hacemos y qué no: no probamos los escritorios físicamente. Explicamos de dónde salen los datos, cómo puntuamos cada modelo y cómo se financia la web.",
  alternates: { canonical: "/metodologia" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://elevable.es" },
    { "@type": "ListItem", position: 2, name: "Metodología", item: "https://elevable.es/metodologia" },
  ],
};

export default function MetodologiaPage() {
  const total = getAllProducts().length;
  const nombre = (slug: string) => {
    const p = getAllProducts().find(([, q]) => q.slug === slug)?.[1];
    return p ? `${p.marca} ${p.modelo}` : slug;
  };
  const cambios = [...(cambiosData as CambioCatalogo[])].reverse();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <p className="editorial-mark" style={{ color: "var(--color-secondary)" }}>
        Metodología
      </p>
      <h1 className="text-3xl md:text-4xl mt-2" >
        Cómo analizamos los escritorios
      </h1>

      <div className="divider my-8" />

      <section className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        <p style={{ color: "var(--text-primary)", fontWeight: 500 }}>
          No probamos los escritorios físicamente. Conviene decirlo antes que nada.
        </p>
        <p>
          Elevable es un trabajo de análisis de datos, no un laboratorio. No montamos
          los modelos ni los tenemos en casa, así que no vas a encontrar aquí
          impresiones de uso inventadas. Lo que sí hacemos es reunir las
          especificaciones de {total} escritorios, contrastarlas con lo que declara
          cada fabricante en Amazon y ordenarlas con un criterio explícito.
        </p>
        <p>
          Nos parece más útil eso que una reseña que finge haber usado quince
          escritorios distintos.
        </p>
      </section>

      <div className="divider my-8" />

      <section>
        <h2 className="text-xl mb-4" >
          De dónde salen los datos
        </h2>
        <ul className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Especificaciones:</strong>{" "}
            ficha del fabricante en Amazon España. Altura, carga, motor, velocidad,
            ruido, memorias y garantía.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Valoraciones:</strong>{" "}
            nota media de Amazon España, redondeada a la baja porque solo puede
            subir.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Precios:</strong> una franja
            amplia comprobada a mano en Amazon, con la fecha de la comprobación. El
            importe exacto lo ves en Amazon.
          </li>
        </ul>
      </section>

      <div className="divider my-8" />

      <section>
        <h2 className="text-xl mb-4" >
          Cómo puntuamos
        </h2>
        <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
          Cada modelo recibe una nota sobre 10 en cinco apartados, calculada con sus
          datos y nunca puesta a mano. La nota global es su media ponderada con los
          pesos de abajo. Si un modelo no llega a 100 valoraciones en Amazon, ese
          apartado no cuenta y los otros cuatro se reparten su peso.
        </p>
        <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--text-primary)" }}>Cada escritorio se mide
          contra lo que se puede esperar en su gama de precio</strong>, no contra el
          más caro del mercado: entrada (hasta 120 €), media (de 120 a 250 €) o alta
          (de 250 a 500 €). En cada dato, un 6 es lo mínimo aceptable en esa gama y un
          10, lo mejor que se puede pedirle. Por eso un 8 en la gama de entrada y un 8
          en la alta significan lo mismo, «muy bueno para lo que cuesta», y no que
          sean escritorios iguales. Los umbrales son fijos: la nota de un modelo no
          cambia porque entre o salga otro del catálogo.
        </p>
        <div className="space-y-4">
          {CRITERIOS.map((c) => (
            <div key={c.nombre} className="pl-4" style={{ borderLeft: "2px solid var(--color-secondary)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {c.nombre}{" "}
                <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>
                  · {Math.round(c.peso * 100)} %
                </span>
              </p>
              <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--text-secondary)" }}>
                {c.base}
              </p>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <caption className="text-left text-sm font-semibold pb-2" style={{ color: "var(--text-primary)" }}>
              Umbrales por gama: de lo mínimo aceptable ({PUNTOS_MINIMO}) a lo mejor esperable ({PUNTOS_EXCELENTE})
            </caption>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="text-left py-2 pr-3 font-semibold">Dato</th>
                {GAMAS.map((g) => (
                  <th key={g} className="text-left py-2 pr-3 font-semibold">{NOMBRE_GAMA[g]}</th>
                ))}
              </tr>
            </thead>
            <tbody style={{ color: "var(--text-secondary)" }}>
              {FILAS_UMBRALES.map(([dato, valor]) => (
                <tr key={dato} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="py-2 pr-3" style={{ color: "var(--text-primary)" }}>{dato}</td>
                  {GAMAS.map((g) => (
                    <td key={g} className="py-2 pr-3 whitespace-nowrap">{valor(UMBRALES[g])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            En todas las gamas: memorias de {MEMORIAS[0]} a {MEMORIAS[1]}; anticolisión, sí 10 y no {SIN_ANTICOLISION};
            valoración de compradores de {coma(VALORACION[0])} a {coma(VALORACION[1])} estrellas.
          </p>
        </div>
      </section>

      <div className="divider my-8" />

      <section>
        <h2 className="text-xl mb-4" >
          Qué modelos entran y cuándo salen
        </h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
          Recomendamos lo mejor de cada franja de precio, no lo que más comisión
          deja. Por eso el catálogo se reparte en cuatro franjas, con dos o tres
          modelos en cada una, y ninguna se queda sin cubrir, tampoco la más
          barata:
        </p>
        <ul className="space-y-1 text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          {(Object.keys(NOMBRE_FRANJA) as Franja[]).map((f) => (
            <li key={f}>
              <strong style={{ color: "var(--text-primary)" }}>{f}</strong> · {NOMBRE_FRANJA[f]}
            </li>
          ))}
        </ul>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--text-primary)" }}>Para entrar</strong>, un modelo
          tiene que cumplir todo esto:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          <li>Se vende y se envía en Amazon España y tiene stock.</li>
          <li>Nota media de 4,3 o más en Amazon, con al menos {MIN_VALORACIONES} valoraciones.</li>
          <li>Especificaciones completas, sacadas de la ficha del fabricante o de Amazon.</li>
          <li>Garantía declarada por escrito.</li>
          <li>
            En sus reseñas de una y dos estrellas más recientes no se repite ningún
            fallo de motor, de estabilidad o de piezas rotas.
          </li>
          <li>No es un clon de otro modelo del catálogo con las mismas especificaciones.</li>
        </ul>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--text-primary)" }}>Sale</strong> si se descataloga,
          si pasa más de un mes sin stock, si deja de cumplir algún requisito o si
          aparece otro en su franja que lo supera en tres décimas o más. Revisamos el
          mercado cada trimestre. Cuando un modelo con página propia sale, su página
          lleva a su sustituto.
        </p>
        <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--text-primary)", fontWeight: 500 }}>
          Los modelos que ves hoy se eligieron antes de que existiera este método y
          todavía no han pasado por él. El primer repaso completo con estos criterios
          es en octubre de 2026, y lo que cambie quedará en el registro de abajo.
        </p>
      </section>

      <div className="divider my-8" />

      <section>
        <h2 className="text-xl mb-4" >
          Por qué no publicamos precios exactos
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Amazon cambia precios a diario. Una cifra escrita hoy está desactualizada
          en una semana, y mostrar un precio que ya no existe es engañar al lector.
          Por eso publicamos solo una franja amplia con la
          fecha en que la comprobamos, que sirve para situar cada modelo, y el
          importe del día lo ves en Amazon, que es el único sitio donde siempre es
          correcto. Las franjas se revisan cada mes o mes y medio.
        </p>
      </section>

      <div className="divider my-8" />

      <section>
        <h2 className="text-xl mb-4" >
          Cómo se financia esto
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Con comisiones de afiliado de Amazon. Si compras a través de un enlace de
          la web, Amazon nos paga un porcentaje y tú pagas lo mismo. No cobramos de
          ninguna marca ni aceptamos productos a cambio de reseñas, entre otras
          cosas porque no hacemos reseñas de uso.
        </p>
        <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--text-secondary)" }}>
          El orden de los modelos sale de la puntuación, no de la comisión. En
          escritorios, además, Amazon paga el mismo porcentaje por todas las
          marcas, así que no hay ninguna que nos convenga más que otra.
        </p>
      </section>

      <div className="divider my-8" />

      <section id="registro">
        <h2 className="text-xl mb-4" >
          Registro de cambios
        </h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
          Cada alta, baja, cambio de nota o corrección del catálogo, con su fecha y
          su motivo. Si ves un error, lo corregimos y queda aquí.
        </p>
        <ol className="space-y-3 text-sm">
          {cambios.map((c, i) => (
            <li key={i} className="pl-4" style={{ borderLeft: "2px solid var(--border)" }}>
              <p style={{ color: "var(--text-muted)" }}>
                {fechaCorta(c.fecha)} · {TIPO_CAMBIO[c.tipo]} ·{" "}
                <strong style={{ color: "var(--text-primary)" }}>{nombre(c.slug)}</strong>
              </p>
              <p className="mt-1" style={{ color: "var(--text-secondary)" }}>{c.motivo}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="divider my-8" />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/mejor-escritorio-elevable" className="underline" style={{ color: "var(--verde-estructura)" }}>
          Ver la comparativa
        </Link>
        <Link href="/comparador" className="underline" style={{ color: "var(--verde-estructura)" }}>
          Comparador
        </Link>
        <Link href="/que-escritorio-elevable-comprar" className="underline" style={{ color: "var(--verde-estructura)" }}>
          Test de recomendación
        </Link>
      </div>
    </div>
  );
}
