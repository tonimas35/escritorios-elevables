import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal, politica de afiliacion y privacidad.",
};

export default function AvisoLegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Aviso legal</h1>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2>Afiliacion con Amazon</h2>
        <p>
          Este sitio web participa en el Programa de Afiliados de Amazon EU, un
          programa de publicidad para afiliados disenado para ofrecer a sitios
          web un modo de obtener comisiones por publicidad, publicitando e
          incluyendo enlaces a Amazon.es.
        </p>
        <p>
          Como asociado de Amazon, obtenemos ingresos por las compras adscritas
          que cumplen los requisitos aplicables. Esto significa que si haces
          click en uno de nuestros enlaces y compras un producto en Amazon,
          nosotros recibimos una pequena comision sin ningun coste adicional
          para ti.
        </p>
        <p>
          Nuestras recomendaciones son independientes de las comisiones que
          recibimos. Analizamos cada producto de forma objetiva y nuestras
          opiniones no estan influenciadas por la relacion de afiliacion.
        </p>

        <h2>Precios y disponibilidad</h2>
        <p>
          Los precios mostrados en este sitio web son orientativos y pueden
          variar en Amazon.es. Verificamos los precios periodicamente, pero no
          podemos garantizar que sean exactos en el momento de tu compra.
          Consulta siempre el precio final en Amazon antes de comprar.
        </p>

        <h2>Contenido</h2>
        <p>
          La informacion proporcionada en este sitio tiene caracter informativo.
          Nos esforzamos por mantener la informacion actualizada y precisa, pero
          no garantizamos la exactitud completa de todos los datos.
        </p>

        <h2>Politica de privacidad</h2>
        <p>
          Este sitio utiliza Google Analytics para analizar el trafico web. Esta
          herramienta utiliza cookies para recopilar informacion anonima sobre
          como los usuarios utilizan el sitio. No recopilamos datos personales
          identificables.
        </p>

        <h2>Cookies</h2>
        <p>
          Este sitio utiliza cookies tecnicas necesarias para su funcionamiento
          y cookies analiticas de Google Analytics. Puedes desactivar las
          cookies en la configuracion de tu navegador.
        </p>

        <h2>Contacto</h2>
        <p>
          Para cualquier consulta relacionada con este sitio, puedes
          contactarnos a traves de nuestro correo electronico.
        </p>
      </section>
    </div>
  );
}
