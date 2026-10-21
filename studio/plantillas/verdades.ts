/**
 * Plantilla «Lo que nadie te dice antes de comprar un escritorio elevable»:
 * cinco verdades incómodas, cada una con su cifra sacada del catálogo. Si
 * cambia el catálogo, cambian las cifras.
 */
import { catalogo } from "../catalogo.ts";
import { C, pagina, marca, t } from "../diseno.ts";
import { portada, cierre, descripcion, AVISO } from "./comun.ts";
import type { Fotograma, Video } from "./franja.ts";

interface Verdad {
  titular: string;
  dato: string;
  consejo: string;
}

function diapositiva(v: Verdad, n: number, total: number): Fotograma {
  return {
    nombre: `verdad-${n}`,
    segundos: 4,
    html: pagina(`<div class="lienzo" style="gap:40px">
  <div style="display:flex;justify-content:space-between;align-items:center">${marca()}<p style="font-size:38px;font-weight:600;color:${C.gris}">${n}/${total}</p></div>
  <p style="font-family:'Inter Tight',sans-serif;font-weight:800;font-size:200px;line-height:.85;color:${C.acento}">${String(n).padStart(2, "0")}</p>
  <h2 class="titular" style="font-size:88px;line-height:1.05">${t(v.titular)}</h2>
  <p style="font-size:46px;line-height:1.3;font-weight:600">${t(v.dato)}</p>
  <div style="padding:30px 36px;border-radius:32px;background:${C.acentoTinte}">
    <p style="font-size:40px;line-height:1.3"><strong style="color:${C.acento}">Qué hacer:</strong> ${t(v.consejo)}</p>
  </div>
</div>`),
  };
}

export function videoVerdades(): Video {
  const total = catalogo.length;
  const completos = catalogo.filter((p) => p.incluye_tablero);
  const sinAnti = catalogo.filter((p) => p.specs.sistema_anticolision !== true).length;
  const simples = catalogo.filter((p) => p.specs.tipo_motor === "simple").length;
  const sinGarantia = catalogo.filter((p) => p.specs.garantia_anos === null).length;
  const cargas = completos.map((p) => p.specs.peso_max_carga_kg);
  const rango = (xs: number[]) => (Math.min(...xs) === Math.max(...xs) ? `${xs[0]}` : `${Math.min(...xs)} y ${Math.max(...xs)}`);
  const anchos = completos.map((p) => p.specs.ancho_tablero_cm);
  const de100 = anchos.filter((a) => a <= 100).length;

  const verdades: Verdad[] = [
    {
      titular: "La carga máxima incluye el tablero",
      dato: `Los completos del catálogo declaran entre ${rango(cargas)} kg, y eso es todo lo que va encima: tablero, monitores y lo demás.`,
      consejo: "resta el peso del tablero antes de contar el equipo. Si vas justo, busca más carga.",
    },
    {
      titular: "Muchos no dicen si paran al chocar",
      dato: `${sinAnti} de ${total} modelos no declaran anticolisión en su ficha.`,
      consejo: "si la ficha no lo dice, no lo des por hecho. Con niños o mascotas, elige uno que la declare.",
    },
    {
      titular: "100 cm se quedan cortos",
      dato: `${de100 === 1 ? "Hay uno" : `Hay ${de100}`} de 100 cm en el catálogo: para un portátil vale, para monitor y teclado va justo.`,
      consejo: "con monitor externo, mínimo 120 cm. Con dos, 140 o más.",
    },
    {
      titular: "El doble motor no siempre hace falta",
      dato: `${simples} de ${total} llevan un solo motor, y para portátil y monitor van de sobra.`,
      consejo: "doble motor solo con tableros grandes, mucho peso o si cambias de altura muchas veces al día.",
    },
    {
      titular: "Si no pone garantía, tienes 3 años igual",
      dato: `${sinGarantia} de ${total} no declaran años de garantía. Pero en España la garantía legal es de 3 años.`,
      consejo: "si dos modelos te convencen igual, elige el que declare más años: tiene motor y electrónica.",
    },
  ];

  const fotogramas = [
    portada(
      "Antes de comprar",
      "Lo que nadie te dice de los",
      "escritorios elevables",
      `5 cosas que hemos visto comparando ${total} modelos.`,
    ),
    ...verdades.map((v, i) => diapositiva(v, i + 1, verdades.length)),
    cierre(
      "Comenta",
      "ELEVABLE",
      "y te paso la comparativa",
      "Los modelos que sí declaran anticolisión y garantía, con su nota.",
      "elevable.es",
    ),
  ];

  const texto = descripcion([
    `Lo que nadie te dice antes de comprar un escritorio elevable 👇 (comparando ${total} modelos)`,
    "",
    ...verdades.map((v, i) => `${i + 1}. ${v.titular}`),
    "",
    "Guárdalo para cuando vayas a comprar.",
    "Comenta ELEVABLE y te paso la comparativa con los modelos que sí lo declaran.",
    "",
    AVISO,
    "",
    "#escritorioelevable #teletrabajo #homeoffice #setup #standingdesk #oficinaencasa",
  ]);

  return { slug: "verdades", fotogramas, descripcion: texto };
}
