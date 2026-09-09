"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Cta } from "./Cta";

/**
 * Seccion 4: los 12 modelos, filtrables y ordenables.
 *
 * Isla de cliente dentro de una pagina que sigue siendo Server Component.
 * Recibe filas ya calculadas para no serializar el catalogo entero.
 *
 * Filtrado y orden son derivados del estado, no estado en si.
 */

export interface FilaComparativa {
  asin: string;
  nombre: string;
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
}

type Tablero = "todos" | "marco" | "tablero";
type Orden = "nota" | "carga";

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
  const [orden, setOrden] = useState<Orden>("nota");

  const visibles = useMemo(() => {
    const filtradas = filas.filter((f) => {
      if (tablero === "marco" && f.tablero) return false;
      if (tablero === "tablero" && !f.tablero) return false;
      if (f.carga < cargaMin) return false;
      if (f.ancho < anchoMin) return false;
      return true;
    });
    return filtradas.sort((a, b) =>
      orden === "carga" ? b.carga - a.carga : b.notaNum - a.notaNum
    );
  }, [filas, tablero, cargaMin, anchoMin, orden]);

  const resultado =
    visibles.length === filas.length
      ? `${filas.length} modelos`
      : visibles.length === 1
        ? "1 modelo coincide"
        : `${visibles.length} modelos coinciden`;

  const flecha = (cual: Orden) => (orden === cual ? " ↓" : "");

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
              <th>
                <button type="button" onClick={() => setOrden("nota")}>
                  Nota{flecha("nota")}
                </button>
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visibles.map((f, i) => (
              <tr key={f.asin}>
                <td style={{ color: "var(--bs-neutro-700)" }}>{i + 1}</td>
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
                        {f.nombre}
                      </span>
                      <span style={{ fontSize: 13, color: "var(--bs-neutro-700)" }}>
                        {f.recorrido} · {f.rating}★ · garantía {f.garantia}
                      </span>
                    </span>
                  </div>
                </td>
                <td>{f.tableroTxt}</td>
                <td>{f.cargaTxt}</td>
                <td>{f.motor}</td>
                <td style={{ fontSize: 19, fontWeight: 700 }}>{f.nota}</td>
                <td>
                  <Cta asin={f.asin} texto="Ver en Amazon" mini />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- Apilada, por debajo de 700px ---------- */}
      <div className="bs-solo-estrecho" style={{ marginTop: 28 }}>
        <div className="bs-orden-movil">
          <span style={{ fontSize: 13, letterSpacing: "var(--bs-track-riel)", textTransform: "uppercase" }}>
            Orden
          </span>
          <button type="button" aria-pressed={orden === "nota"} onClick={() => setOrden("nota")}>
            Nota{flecha("nota")}
          </button>
          <button type="button" aria-pressed={orden === "carga"} onClick={() => setOrden("carga")}>
            Carga{flecha("carga")}
          </button>
        </div>

        <ul className="bs-apilada">
          {visibles.map((f, i) => (
            <li key={f.asin}>
              <div className="flex gap-3">
                <span style={{ color: "var(--bs-neutro-700)", fontSize: 14 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div className="flex items-start gap-3">
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 16, fontWeight: 600 }}>{f.nombre}</p>
                      <p style={{ fontSize: 13, color: "var(--bs-neutro-700)" }}>
                        Nota <strong style={{ color: "var(--bs-tinta)" }}>{f.nota}</strong> ·{" "}
                        {f.rating}★ · garantía {f.garantia}
                      </p>
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
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
