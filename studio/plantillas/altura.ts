/**
 * Plantilla «¿A qué altura debe estar tu mesa?»: la tabla de alturas por
 * estatura de la calculadora de la web (lib/calculator.ts) y si los
 * escritorios del catálogo llegan.
 *
 * La fórmula es una aproximación por proporciones corporales medias, y así
 * se dice en la diapositiva: no se presenta como norma.
 */
import { calculateErgonomicHeight } from "../../lib/calculator.ts";
import { catalogo } from "../catalogo.ts";
import { C, pagina, marca, t } from "../diseno.ts";
import { portada, cierre, descripcion, AVISO } from "./comun.ts";
import type { Video } from "./franja.ts";

const ESTATURAS = [155, 160, 165, 170, 175, 180, 185, 190, 195];
const metros = (cm: number) => `${Math.floor(cm / 100)},${String(cm % 100).padStart(2, "0")}`;

export function videoAltura(): Video {
  const filas = ESTATURAS.map((e) => ({ e, ...calculateErgonomicHeight(e) }));

  // Lo que hacen los escritorios completos del catálogo, calculado.
  const completos = catalogo.filter((p) => p.incluye_tablero);
  const minimos = completos.map((p) => p.specs.rango_altura_min_cm);
  const maximos = completos.map((p) => p.specs.rango_altura_max_cm);
  const bajaHasta = Math.min(...minimos);
  const bajaHastaMax = Math.max(...minimos);
  const subeTodos = Math.min(...maximos);
  // Hasta qué estatura llegan todos de pie, y desde cuál bajan lo bastante sentado.
  const llegaDePie = Math.max(...ESTATURAS.filter((e) => calculateErgonomicHeight(e).alturaDePie <= subeTodos));
  const bajaSentado = Math.min(...ESTATURAS.filter((e) => calculateErgonomicHeight(e).alturaSentado >= bajaHasta));
  const coma = (n: number) => String(n).replace(".", ",");

  const fotogramas = [
    portada(
      "Ergonomía",
      "¿A qué altura debe estar",
      "tu mesa?",
      "Busca tu estatura: sentado y de pie, en centímetros.",
    ),
    {
      nombre: "como",
      segundos: 4,
      html: pagina(`<div class="lienzo" style="gap:36px">
  ${marca()}
  <h2 class="titular" style="font-size:96px;line-height:1.02">La regla: codos a 90°</h2>
  ${[
    ["Codos", "Doblados en ángulo recto, apoyados a la altura de la mesa."],
    ["Hombros", "Relajados, sin subirlos para llegar al teclado."],
    ["Pantalla", "El borde de arriba, a la altura de los ojos."],
    ["Pies", "Planos en el suelo. Si no llegan, reposapiés."],
  ]
    .map(
      ([titulo, texto]) => `<div style="display:flex;gap:28px;align-items:flex-start;padding:30px 34px;border:3px solid ${C.borde};border-radius:32px">
    <p style="flex:0 0 220px;font-family:'Inter Tight',sans-serif;font-weight:800;font-size:46px;color:${C.acento}">${t(titulo)}</p>
    <p style="font-size:42px;line-height:1.3;font-weight:500">${t(texto)}</p></div>`,
    )
    .join("")}
</div>`),
    },
    {
      nombre: "tabla",
      segundos: 5,
      html: pagina(`<div class="lienzo" style="gap:24px">
  ${marca()}
  <h2 class="titular" style="font-size:80px;line-height:1.02">Busca tu estatura</h2>
  <div style="border:3px solid ${C.borde};border-radius:32px;overflow:hidden">
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));background:${C.superficie};font-size:34px;font-weight:600;color:${C.gris}">
      <p style="padding:20px 32px">Estatura</p><p style="padding:20px 32px;text-align:right">Sentado</p><p style="padding:20px 32px;text-align:right">De pie</p>
    </div>
    ${filas
      .map(
        (f, i) => `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));font-size:44px;${i ? `border-top:2px solid ${C.borde};` : ""}">
      <p style="padding:16px 32px;font-weight:700">${metros(f.e)} m</p>
      <p style="padding:16px 32px;text-align:right">${f.alturaSentado} cm</p>
      <p style="padding:16px 32px;text-align:right;font-weight:700;color:${C.acento}">${f.alturaDePie} cm</p></div>`,
      )
      .join("")}
  </div>
  <p style="font-size:32px;line-height:1.35;color:${C.gris}">Aproximación con proporciones corporales medias. Ajusta hasta tener los codos a 90°.</p>
</div>`),
    },
    {
      nombre: "llega",
      segundos: 5,
      html: pagina(`<div class="lienzo" style="gap:36px">
  ${marca()}
  <h2 class="titular" style="font-size:96px;line-height:1.02">¿Llega tu escritorio?</h2>
  <div style="display:flex;flex-direction:column;gap:12px;padding:36px 40px;border-radius:36px;background:${C.acentoTinte}">
    <p style="font-size:40px;font-weight:600;color:${C.acento}">De pie</p>
    <p style="font-size:48px;line-height:1.25;font-weight:700">Hasta ${metros(llegaDePie)} m, llegan todos los escritorios completos del catálogo.</p>
    <p style="font-size:38px;line-height:1.3;color:${C.gris}">Los escritorios completos suben como poco hasta ${subeTodos}&nbsp;cm.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:12px;padding:36px 40px;border-radius:36px;background:${C.superficie}">
    <p style="font-size:40px;font-weight:600;color:${C.gris}">Sentado</p>
    <p style="font-size:48px;line-height:1.25;font-weight:700">Por debajo de ${metros(bajaSentado)} m, te quedará algo alta.</p>
    <p style="font-size:38px;line-height:1.3;color:${C.gris}">Bajan hasta ${coma(bajaHasta)}–${coma(bajaHastaMax)}&nbsp;cm. Solución: sube la silla y usa reposapiés.</p>
  </div>
</div>`),
    },
    cierre(
      "Comenta tu",
      "ALTURA",
      "y te digo tus medidas",
      "O calcúlalas al centímetro en la calculadora de la web.",
      "elevable.es/calculadora-altura",
    ),
  ];

  const texto = descripcion([
    "¿A qué altura debe estar tu mesa? Busca tu estatura 👇",
    "",
    ...filas.filter((_, i) => i % 2 === 1).map((f) => `${metros(f.e)} m → sentado ${f.alturaSentado} cm · de pie ${f.alturaDePie} cm`),
    "",
    "La regla: codos a 90°, hombros relajados y el borde de la pantalla a la altura de los ojos.",
    "Comenta tu altura y te digo tus medidas, o calcúlalas en elevable.es/calculadora-altura",
    "",
    AVISO,
    "",
    "#escritorioelevable #ergonomia #teletrabajo #homeoffice #setup #oficinaencasa",
  ]);

  return { slug: "altura", fotogramas, descripcion: texto };
}
