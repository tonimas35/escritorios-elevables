"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Cta } from "./Cta";
import type { InfoFranja } from "@/lib/comparativa";

/**
 * Seccion 4: los modelos del catálogo, filtrables y ordenables.
 *
 * Isla de cliente dentro de una pagina que sigue siendo Server Component.
 * Recibe filas ya calculadas para no serializar el catalogo entero.
 *
 * Filtrado y orden son derivados del estado, no estado en si.
 *
 * Por defecto se ordena por precio: franja a franja, de la más barata a la
 * más cara, y dentro de cada franja por nota. No hay orden por nota a
 * secas: las notas de franjas distintas no se comparan (METODO.md §5).
 */

export interface FilaComparativa extends InfoFranja {
  asin: string;
  nombre: string;
  /** Ficha del modelo en la web, si tiene. El nombre enlaza a ella. */
  ruta?: string | null;
  imagen: string;
  alt: string;
  nota: string;
  notaNum: number;
  rating: string;
  motor: string;
  carga: number;
  cargaTxt: string;
  ancho: number;
  tablero: boolean;
  tableroTxt: string;
  recorrido: string;
  garantia: string;
  /** Solo la franja: "110–150 €". La fecha va una vez en la nota al pie. */
  franja: string | null;
}

type Tablero = "todos" | "marco" | "tablero";
type Orden = "precio" | "carga";

/** El mismo texto que SIN_DATO de lib/ficha.ts, que no se importa aquí por ser isla de cliente. */
const SIN_DATO = "Sin dato";

/** El nombre del modelo, enlazado a su ficha cuando la tiene. */
function Nombre({ f }: { f: FilaComparativa }) {
  return f.ruta ? <Link href={f.ruta}>{f.nombre}</Link> : <>{f.nombre}</>;
}

/** Recorrido, valoración y garantía; al ordenar por carga, también la franja. */
function meta(f: FilaComparativa, orden: Orden): string {
  return [
    f.recorrido,
    `${f.rating}★`,
    f.garantia !== SIN_DATO ? `garantía ${f.garantia}` : null,
    orden === "carga" ? f.franjaNombre : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

const TABLEROS: { valor: Tablero; label: string }[] = [
  { valor: "todos", label: "Todos" },
  { valor: "marco", label: "Solo marco" },
  { valor: "tablero", label: "Con tablero" },
];
const CARGAS = [0, 70, 100, 125];
const ANCHOS = [0, 120, 140, 160];

function Grupo<T extends string | number>({
  etiqueta,
  opciones,
  valor,
  onChange,
  texto,
}: {
  etiqueta: string;
  opciones: T[];
  valor: T;
  onChange: (v: T) => void;
  texto: (v: T) => string;
}) {
  return (
    <div>
      <span className="bs-filtro-etiqueta">{etiqueta}</span>
      <div className="bs-filtro-grupo" role="group" aria-label={etiqueta}>
        {opciones.map((o) => (
          <button
            key={String(o)}
            type="button"
            aria-pressed={o === valor}
            onClick={() => onChange(o)}
          >
            {texto(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Comparativa({ filas }: { filas: FilaComparativa[] }) {
  const [tablero, setTablero] = useState<Tablero>("todos");
  const [cargaMin, setCargaMin] = useState(0);
  const [anchoMin, setAnchoMin] = useState(0);
  const [orden, setOrden] = useState<Orden>("precio");

  const visibles = useMemo(() => {
    const filtradas = filas.filter((f) => {
      if (tablero === "marco" && f.tablero) return false;
      if (tablero === "tablero" && !f.tablero) return false;
      if (f.carga < cargaMin) return false;
      if (f.ancho < anchoMin) return false;
      return true;
    });
    return filtradas.sort((a, b) =>
      orden === "carga"
        ? b.carga - a.carga
        : a.franjaOrden - b.franjaOrden || (a.posicion ?? 99) - (b.posicion ?? 99)
    );
  }, [filas, tablero, cargaMin, anchoMin, orden]);

  const resultado =
    visibles.length === filas.length
      ? `${filas.length} modelos`
      : visibles.length === 1
        ? "1 modelo coincide"
        : `${visibles.length} modelos coinciden`;

  const flecha = (cual: Orden) => (orden === cual ? (cual === "precio" ? " ↑" : " ↓") : "");
  // Cabecera de franja delante del primer modelo de cada una, solo al
  // ordenar por precio.
  const abreFranja = (i: number) =>
    orden === "precio" && (i === 0 || visibles[i - 1].franjaOrden !== visibles[i].franjaOrden);


  // La columna de precio solo existe si hay algun modelo con franja
  // verificada. Con los datos sin rellenar, la tabla queda como estaba.
  const hayFranjas = filas.some((f) => f.franja);
  const columnas = hayFranjas ? 8 : 7;

  return (
    <>
      <div
        className="flex flex-wrap items-end"
        style={{ gap: "20px 32px", marginTop: 32 }}
      >
        <Grupo
          etiqueta="Tablero"
          opciones={TABLEROS.map((t) => t.valor)}
          valor={tablero}
          onChange={setTablero}
          texto={(v) => TABLEROS.find((t) => t.valor === v)!.label}
        />
        <Grupo
          etiqueta="Carga mínima"
          opciones={CARGAS}
          valor={cargaMin}
          onChange={setCargaMin}
          texto={(v) => (v === 0 ? "Cualquiera" : `${v} kg+`)}
        />
        <Grupo
          etiqueta="Ancho mínimo"
          opciones={ANCHOS}
          valor={anchoMin}
          onChange={setAnchoMin}
          texto={(v) => (v === 0 ? "Cualquiera" : `${v} cm+`)}
        />
        <p style={{ fontSize: 15, color: "var(--bs-neutro-700)" }} aria-live="polite">
          {resultado}
        </p>
      </div>

      {/* Estado vacio: el diseño no lo contempla, pero una combinacion de
          filtros sin resultados deja la tabla muda. */}
      {visibles.length === 0 && (
        <p className="bs-cuerpo" style={{ marginTop: 28, color: "var(--bs-neutro-800)" }}>
          Ningún modelo del catálogo cumple estos filtros a la vez. Prueba a
          bajar la carga o el ancho mínimo.
        </p>
      )}

      {/* ---------- Tabla, a partir de 700px ---------- */}
      <div className="bs-solo-ancho" style={{ marginTop: 28, overflowX: "auto" }}>
        <table className="bs-tabla">
          <thead>
            <tr>
              <th style={{ width: 46 }}>#</th>
              <th>Modelo</th>
              <th>Tablero</th>
              <th>
                <button type="button" onClick={() => setOrden("carga")}>
                  Carga{flecha("carga")}
                </button>
              </th>
              <th>Motor</th>
              {hayFranjas && (
                <th>
                  <button type="button" onClick={() => setOrden("precio")}>
                    Precio{flecha("precio")}
                  </button>
                </th>
              )}
              <th>Nota en su franja</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visibles.map((f, i) => [
              abreFranja(i) && (
                <tr key={`franja-${f.franjaOrden}`} className="bs-tabla-grupo">
                  <th colSpan={columnas} scope="colgroup">
                    {f.franjaNombre ?? "Sin franja verificada"}
                  </th>
                </tr>
              ),
              <tr key={f.asin}>
                <td style={{ color: "var(--bs-neutro-700)" }}>
                  {orden === "precio" && f.posicion !== null ? f.posicion : i + 1}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <span className="bs-marco" style={{ padding: 4, flex: "0 0 auto" }}>
                      <span style={{ display: "block", width: 48, height: 44 }}>
                        <Image
                          src={f.imagen}
                          alt={f.alt}
                          width={48}
                          height={44}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      </span>
                    </span>
                    <span>
                      <span style={{ display: "block", fontSize: 16, fontWeight: 600 }}>
                        <Nombre f={f} />
                      </span>
                      <span style={{ fontSize: 13, color: "var(--bs-neutro-700)" }}>
                        {meta(f, orden)}
                      </span>
                    </span>
                  </div>
                </td>
                <td>{f.tableroTxt}</td>
                <td>{f.cargaTxt}</td>
                <td>{f.motor}</td>
                {hayFranjas && (
                  <td style={{ fontSize: 14, color: "var(--bs-neutro-700)", whiteSpace: "nowrap" }}>
                    {f.franja ?? "—"}
                  </td>
                )}
                <td style={{ fontSize: 19, fontWeight: 700 }}>
                  {f.nota}
                  {f.posicionTxt && (
                    <span style={{ display: "block", fontSize: 12, fontWeight: 400, color: "var(--bs-neutro-700)" }}>
                      {f.posicionTxt}
                    </span>
                  )}
                </td>
                <td>
                  <Cta asin={f.asin} texto="Ver en Amazon" mini />
                </td>
              </tr>,
            ])}
          </tbody>
        </table>
      </div>

      {/* ---------- Apilada, por debajo de 700px ---------- */}
      <div className="bs-solo-estrecho" style={{ marginTop: 28 }}>
        <div className="bs-orden-movil">
          <span style={{ fontSize: 13, letterSpacing: "var(--bs-track-riel)", textTransform: "uppercase" }}>
            Orden
          </span>
          <button type="button" aria-pressed={orden === "precio"} onClick={() => setOrden("precio")}>
            Precio{flecha("precio")}
          </button>
          <button type="button" aria-pressed={orden === "carga"} onClick={() => setOrden("carga")}>
            Carga{flecha("carga")}
          </button>
        </div>

        <ul className="bs-apilada">
          {visibles.map((f, i) => [
            abreFranja(i) && (
              <li key={`franja-${f.franjaOrden}`} className="bs-apilada-grupo">
                {f.franjaNombre ?? "Sin franja verificada"}
              </li>
            ),
            <li key={f.asin}>
              <div className="flex gap-3">
                <span style={{ color: "var(--bs-neutro-700)", fontSize: 14 }}>
                  {orden === "precio" && f.posicion !== null ? f.posicion : i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <div className="flex items-start gap-3">
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 16, fontWeight: 600 }}><Nombre f={f} /></p>
                      <p style={{ fontSize: 13, color: "var(--bs-neutro-700)" }}>
                        Nota <strong style={{ color: "var(--bs-tinta)" }}>{f.nota}</strong>
                        {f.posicionTxt ? ` (${f.posicionTxt} en su franja)` : ""} · {f.rating}★
                        {f.garantia !== SIN_DATO ? ` · garantía ${f.garantia}` : ""}
                      </p>
                      {orden === "carga" && f.franjaNombre && (
                        <p style={{ fontSize: 13, color: "var(--bs-neutro-700)" }}>{f.franjaNombre}</p>
                      )}
                    </div>
                    <span className="bs-marco" style={{ padding: 4, flex: "0 0 auto" }}>
                      <span style={{ display: "block", width: 58, height: 52 }}>
                        <Image
                          src={f.imagen}
                          alt={f.alt}
                          width={58}
                          height={52}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      </span>
                    </span>
                  </div>

                  {f.franja && (
                    <p style={{ fontSize: 13, color: "var(--bs-neutro-700)", marginTop: 8 }}>
                      {f.franja}
                    </p>
                  )}

                  <div className="flex flex-wrap" style={{ gap: 6, marginTop: 10 }}>
                    <span className="bs-spec">{f.motor}</span>
                    <span className="bs-spec">{f.cargaTxt}</span>
                    <span className="bs-spec">{f.tableroTxt}</span>
                    <span className="bs-spec">{f.recorrido}</span>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <Cta asin={f.asin} ancho mini />
                  </div>
                </div>
              </div>
            </li>,
          ])}
        </ul>
      </div>
    </>
  );
}
