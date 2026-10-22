import type { Metadata } from "next";
import Link from "next/link";
import { getAvailableProducts } from "@/lib/products";
import { rutaFicha } from "@/lib/rutas";
import { coma, nota } from "@/lib/format";
import { NOMBRE_FRANJA, franja, posicionEnFranja, type Franja } from "@/lib/nota";
import { franjaPrecio, franjaTienda } from "@/lib/ficha";
import type { Product } from "@/lib/types";
import ikea from "@/data/ikea.json";
import { Cta } from "@/components/broadsheet/Cta";
import { Afiliado } from "@/components/broadsheet/Afiliado";
import { Firma } from "@/components/broadsheet/Firma";

/**
 * «Escritorio elevable IKEA» (SEO-PLAN.md §0, P8): 1.300 búsquedas al mes en
 * España según Semrush (22/10/2026), la búsqueda con más volumen que no
 * teníamos.
 *
 * Los datos de IKEA salen de data/ikea.json, comprobados en cada ficha de
 * ikea.com/es; lo que la ficha no dice queda sin dato. El precio de IKEA va
 * en franja con fecha, igual que el de Amazon (CLAUDE.md, «Precios»). IKEA
 * no es afiliado: sus enlaces no llevan tag, y sin su logo ni sus fotos.
 * Todas las comparaciones con el catálogo se calculan, no se escriben.
 */

const SITE = "https://elevable.es";
const RUTA = "/escritorio-elevable-ikea";

type ModeloIkea = (typeof ikea.modelos)[number];

export const metadata: Metadata = {
  title: "Escritorio elevable de IKEA o de Amazon: cuál comprar en 2026",
  description:
    "Los escritorios elevables de IKEA (TROTTEN, MITTZON, IDÅSEN y los manuales) frente a los de Amazon: carga, motores, altura, garantía y franja de precio de cada uno, con los datos de sus fichas.",
  alternates: { canonical: RUTA },
};

const fecha = (iso: string) => {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
};
const lista = (xs: string[]) =>
  xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} y ${xs[xs.length - 1]}`;
const rango = (xs: number[]) => {
  const min = Math.min(...xs);
  const max = Math.max(...xs);
  return min === max ? `${coma(min)}` : `${coma(min)} y ${coma(max)}`;
};

const franjaIkeaTexto = (m: ModeloIkea) => franjaTienda(m.precio_min, m.precio_max, ikea.verificado, "IKEA");

/** La franja del catálogo en la que caería un modelo de IKEA por su precio. */
function franjaIkea(m: ModeloIkea): Franja | null {
  return franja({ incluye_tablero: true, precio_min: m.precio_min, precio_max: m.precio_max });
}

export default function IkeaPage() {
  const todos = getAvailableProducts();
  const catalogo = todos.map(([, p]) => p);
  const asinDe = new Map(todos.map(([asin, p]) => [p.slug, asin]));
  const nombre = (p: Product) => `${p.marca} ${p.modelo}`;

  const electricos = ikea.modelos.filter((m) => m.mecanismo === "eléctrico");
  const manuales = ikea.modelos.filter((m) => m.mecanismo !== "eléctrico");
  const conDiez = electricos.filter((m) => m.garantia_anos !== null && m.garantia_anos >= 10).map((m) => m.nombre);
  const masBaratoIkea = [...electricos].sort((a, b) => a.precio_min - b.precio_min)[0];
  const dobleIkea = electricos.filter((m) => m.motores === 2).map((m) => m.nombre);

  // El catálogo, para comparar: solo los completos, como los de IKEA.
  const completos = catalogo.filter((p) => p.incluye_tablero);
  const cargasCatalogo = completos.map((p) => p.specs.peso_max_carga_kg);
  const cargasIkea = electricos.map((m) => m.carga_kg);
  const conAnti = catalogo.filter((p) => p.specs.sistema_anticolision === true).length;
  const primeroDe = (f: Franja) =>
    catalogo
      .map((p) => ({ p, pos: posicionEnFranja(p, catalogo) }))
      .find((x) => x.pos?.franja === f && x.pos.posicion === 1)?.p ?? null;
  const primeroA = primeroDe("A");
  const maxGarantia = Math.max(...catalogo.map((p) => p.specs.garantia_anos ?? 0));
  const amazonEmpiezaMenos = primeroA !== null && primeroA.precio_max !== null && primeroA.precio_max < masBaratoIkea.precio_min;

  const ventajasIkea: { titulo: string; texto: string }[] = [
    {
      titulo: `${ikea.devolucion_dias} días para devolverlo`,
      texto: `IKEA anuncia ${ikea.devolucion_dias} días de devolución en sus fichas. En un mueble que pesa y abulta, es mucho margen para probarlo en casa.`,
    },
    {
      titulo: "10 años de garantía",
      texto: `La declaran ${lista(conDiez)}. En el catálogo de Amazon, la más larga que se declara es de ${maxGarantia} años.`,
    },
    {
      titulo: "Lo puedes ver antes",
      texto: "Si tu tienda lo tiene expuesto, puedes subirlo, bajarlo y ver cuánto se mueve el tablero de pie. En Amazon eso solo lo sabes por las reseñas.",
    },
  ];
  const ventajasAmazon: { titulo: string; texto: string }[] = [
    {
      titulo: "Más carga",
      texto: `Los eléctricos de IKEA aguantan entre ${rango(cargasIkea)} kg; los completos del catálogo, entre ${rango(cargasCatalogo)} kg. Con dos monitores con brazo, se nota.`,
    },
    {
      titulo: "Anticolisión declarada",
      texto: `${conAnti} de los ${catalogo.length} modelos del catálogo la declaran en su ficha. IKEA no la menciona en ninguna de las suyas.`,
    },
    {
      titulo: "Se empieza por menos",
      texto: primeroA
        ? `El eléctrico más asequible de IKEA es el ${masBaratoIkea.nombre}: ${franjaIkeaTexto(masBaratoIkea)}. El primero de los completos hasta 120 € del catálogo es el ${nombre(primeroA)}: ${franjaPrecio(primeroA)}.`
        : `El eléctrico más asequible de IKEA es el ${masBaratoIkea.nombre}: ${franjaIkeaTexto(masBaratoIkea)}.`,
    },
  ];

  // Para cada eléctrico de IKEA, el primero del catálogo en su misma franja.
  const equivalentes = electricos.map((m) => {
    const f = franjaIkea(m);
    return { m, f, p: f ? primeroDe(f) : null };
  });

  const faqItems: { q: string; a: string }[] = [
    {
      q: "¿IKEA tiene escritorios elevables eléctricos?",
      a: `Sí. En su web española vende ${electricos.length} eléctricos (${lista(electricos.map((m) => m.nombre))}) y ${manuales.length} manuales, sin motor (${lista(manuales.map((m) => m.nombre))}).`,
    },
    {
      q: "¿Cuál es el escritorio elevable eléctrico más barato de IKEA?",
      a: `El ${masBaratoIkea.nombre}: ${franjaIkeaTexto(masBaratoIkea)}, según el tamaño. Lleva ${masBaratoIkea.motores === 1 ? "un motor" : "motor"} y aguanta ${masBaratoIkea.carga_kg} kg.`,
    },
    {
      q: "¿Qué escritorio elevable de IKEA tiene doble motor?",
      a: dobleIkea.length
        ? `${lista(dobleIkea)}, según su ficha. En las demás, IKEA no dice cuántos motores llevan, salvo el ${masBaratoIkea.nombre}, que lleva uno.`
        : "Ninguna ficha de IKEA lo declara.",
    },
    {
      q: "¿Qué garantía tienen los escritorios elevables de IKEA?",
      a: `${lista(conDiez)} declaran 10 años. En el resto la ficha no da plazo y cuenta la garantía legal, que en España es de 3 años.`,
    },
    {
      q: "¿Es mejor un escritorio elevable de IKEA o uno de Amazon?",
      a: `Depende de lo que pongas encima. Para un portátil y un monitor, IKEA cumple y da más garantía y más plazo de devolución. Si vas a cargar más de ${Math.max(...cargasIkea)} kg o quieres anticolisión declarada, en Amazon hay más donde elegir${amazonEmpiezaMenos ? " y se empieza por menos" : ""}.`,
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
          { "@type": "ListItem", position: 2, name: "IKEA o Amazon", item: `${SITE}${RUTA}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  const filaIkea = (m: ModeloIkea) => (
    <div key={m.nombre} className="bs-fila" style={{ alignItems: "flex-start" }}>
      <div style={{ flex: "1 1 260px", minWidth: 0 }}>
        <h4 style={{ fontSize: 18, fontWeight: 700 }}>
          {m.nombre}
          <span style={{ fontWeight: 400, color: "var(--bs-neutro-700)" }}> · {m.tamanos.join(", ")} cm</span>
        </h4>
        <div className="flex flex-wrap" style={{ gap: 6, marginTop: 8 }}>
          <span className="bs-spec">
            {m.mecanismo === "eléctrico" ? (m.motores === 2 ? "Doble motor" : m.motores === 1 ? "Un motor" : "Eléctrico") : "Manual, sin motor"}
          </span>
          <span className="bs-spec">{m.carga_kg} kg</span>
          <span className="bs-spec">
            {m.altura_min_cm}–{m.altura_max_cm} cm
          </span>
          {m.memorias !== null && <span className="bs-spec">{m.memorias} memorias</span>}
          <span className="bs-spec">{m.garantia_anos !== null ? `${m.garantia_anos} años de garantía` : "Garantía: sin dato"}</span>
        </div>
        {m.aviso && (
          <p className="bs-cuerpo" style={{ marginTop: 8, fontSize: 14, color: "var(--bs-neutro-800)" }}>
            {m.aviso}
          </p>
        )}
        <p className="bs-afiliado bs-afiliado-mini" style={{ marginTop: 8 }}>
          {franjaIkeaTexto(m)}
        </p>
      </div>
      <a href={m.url} target="_blank" rel="noopener" style={{ fontSize: 15, fontWeight: 600, whiteSpace: "nowrap" }}>
        Ver en IKEA →
      </a>
    </div>
  );

  return (
    <div className="bs-pagina">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* ============================================================
          Nº 01 · La respuesta corta
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <p className="bs-kicker">Nº 01 · IKEA o Amazon</p>
        <h1 className="bs-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>
          Escritorio elevable de IKEA o de Amazon: <span className="bs-fluor">cuál te conviene</span>
        </h1>
        <p className="bs-standfirst" style={{ maxWidth: "54ch", marginTop: 18 }}>
          IKEA vende {electricos.length} escritorios elevables eléctricos y {manuales.length} manuales en su web
          española. Los hemos puesto al lado de los {catalogo.length} del catálogo de Amazon, con lo que declara
          cada ficha.
        </p>
        <p style={{ fontSize: 14, marginTop: 14, color: "var(--bs-neutro-700)" }}>
          Datos y precios de IKEA comprobados en ikea.com el {fecha(ikea.verificado)}. IKEA no nos paga nada: sus
          enlaces no son de afiliado.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: 16,
            marginTop: 36,
          }}
        >
          {[
            { titulo: "Mejor en IKEA", items: ventajasIkea },
            { titulo: "Mejor en Amazon", items: ventajasAmazon },
          ].map((col) => (
            <div key={col.titulo} className="bs-tarjeta" style={{ padding: 22, minWidth: 0 }}>
              <p className="bs-sello">{col.titulo}</p>
              <div className="flex flex-col" style={{ gap: 18, marginTop: 18 }}>
                {col.items.map((v) => (
                  <div key={v.titulo}>
                    <h2 className="bs-h3" style={{ fontSize: 19, fontWeight: 700 }}>
                      {v.titulo}
                    </h2>
                    <p className="bs-cuerpo" style={{ marginTop: 6, color: "var(--bs-neutro-800)" }}>
                      {v.texto}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-end" style={{ gap: "16px 40px", marginTop: 32 }}>
          <div style={{ flex: "1 1 320px", maxWidth: "62ch" }}>
            <Afiliado />
          </div>
          <Firma total={catalogo.length} />
        </div>
      </section>

      {/* ============================================================
          Nº 02 · Los de IKEA, uno a uno
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 02 · Los de IKEA</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Los {electricos.length} eléctricos de IKEA, con sus datos
          </h2>
          <p className="bs-cuerpo" style={{ marginTop: 12, maxWidth: "62ch", color: "var(--bs-neutro-800)" }}>
            Lo que dice cada ficha de ikea.com. Si un dato no aparece, es que IKEA no lo publica. Ninguna ficha
            menciona anticolisión.
          </p>
          <div style={{ marginTop: 24 }}>{electricos.map(filaIkea)}</div>

          <h3 className="bs-h3" style={{ marginTop: 44 }}>
            Los manuales, sin motor
          </h3>
          <p className="bs-cuerpo" style={{ marginTop: 8, maxWidth: "62ch", color: "var(--bs-neutro-800)" }}>
            Se suben a mano. Aguantan entre {rango(manuales.map((m) => m.carga_kg))} kg: para un portátil, no para
            un monitor grande.
          </p>
          <div style={{ marginTop: 12 }}>{manuales.map(filaIkea)}</div>
        </div>
      </section>

      {/* ============================================================
          Nº 03 · Lo que hay en Amazon por lo mismo
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 03 · Por lo mismo, en Amazon</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            Si mirabas uno de IKEA, esto es lo que hay en Amazon a su precio
          </h2>
          <p className="bs-cuerpo" style={{ marginTop: 12, maxWidth: "62ch", color: "var(--bs-neutro-800)" }}>
            Para cada eléctrico de IKEA, el primero del catálogo en su misma franja de precio.
          </p>
          <div style={{ marginTop: 24 }}>
            {equivalentes.map(({ m, f, p }) => (
              <div key={m.nombre} className="bs-fila" style={{ alignItems: "flex-start" }}>
                <div style={{ flex: "1 1 300px", minWidth: 0 }}>
                  <p className="bs-etiqueta">
                    En lugar del {m.nombre} · {m.carga_kg} kg · {m.altura_min_cm}–{m.altura_max_cm} cm
                  </p>
                  {p ? (
                    <>
                      <h4 style={{ fontSize: 17, fontWeight: 600, marginTop: 4 }}>
                        {rutaFicha(p) ? <Link href={rutaFicha(p)!}>{nombre(p)}</Link> : nombre(p)}
                        <span style={{ fontWeight: 400, color: "var(--bs-neutro-700)" }}>
                          {" "}· nº 1 de {NOMBRE_FRANJA[f!].toLowerCase()} · nota {nota(p.puntuacion.total)}
                        </span>
                      </h4>
                      <p className="bs-cuerpo" style={{ marginTop: 4, fontSize: 15 }}>
                        {p.specs.tipo_motor === "doble" ? "Doble motor" : "Un motor"} · {p.specs.peso_max_carga_kg} kg ·{" "}
                        {coma(p.specs.rango_altura_min_cm)}–{coma(p.specs.rango_altura_max_cm)} cm
                        {p.specs.sistema_anticolision === true ? " · anticolisión" : ""}
                      </p>
                      <p className="bs-afiliado bs-afiliado-mini" style={{ marginTop: 6 }}>
                        {franjaPrecio(p)}
                      </p>
                    </>
                  ) : (
                    <p className="bs-cuerpo" style={{ marginTop: 4, fontSize: 15 }}>
                      Está por encima de los 500 €: en el catálogo no hay escritorios completos tan caros.
                    </p>
                  )}
                </div>
                {p && <Cta asin={asinDe.get(p.slug)!} mini />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Nº 04 · Preguntas frecuentes
          ============================================================ */}
      <section className="bs-contenido bs-seccion">
        <div className="bs-filete-seccion" style={{ paddingTop: 28 }}>
          <p className="bs-kicker">Nº 04 · Preguntas frecuentes</p>
          <h2 className="bs-h2" style={{ marginTop: 12 }}>
            IKEA, en corto
          </h2>
          <div className="flex flex-col" style={{ gap: "var(--bs-hueco-bloques)", marginTop: 36 }}>
            {faqItems.map((f) => (
              <div key={f.q} className="flex flex-wrap" style={{ gap: "clamp(12px, 3vw, 40px)" }}>
                <h3 className="bs-h3" style={{ flex: "1 1 260px" }}>
                  {f.q}
                </h3>
                <p className="bs-cuerpo" style={{ flex: "1 1 380px" }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>

          <h3 className="bs-h3" style={{ marginTop: 56 }}>
            Sigue leyendo
          </h3>
          <ul className="flex flex-col" style={{ gap: 10, marginTop: 14, fontSize: 16 }}>
            <li>
              <Link href="/mejor-escritorio-elevable">Los mejores escritorios elevables de 2026</Link>: todo el catálogo, modelo a modelo.
            </li>
            <li>
              <Link href="/escritorio-elevable-barato">Escritorios elevables baratos</Link>: los de las franjas más bajas.
            </li>
            <li>
              <Link href="/calculadora-altura">Calculadora de altura</Link>: a qué altura poner la mesa según lo que mides.
            </li>
            <li>
              <Link href="/metodologia">Metodología</Link>: cómo se calcula la nota y cómo comprobamos los precios.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
