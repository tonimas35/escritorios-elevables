import { Cta } from "./Cta";

/**
 * CTA fijo al pie, solo por debajo del punto de corte de 700px.
 *
 * Se oculta por CSS, no por JavaScript, para que las dos variantes salgan
 * del servidor. El hueco que ocupa se reserva con padding-bottom en
 * .bs-pagina; si no, tapa el final del contenido.
 */
export function CtaFijo({ asin, nombre }: { asin: string; nombre: string }) {
  return (
    <div className="bs-cta-fijo bs-solo-estrecho">
      <Cta asin={asin} texto={`Ver el ${nombre} en Amazon`} ancho mini />
      <p className="bs-afiliado bs-afiliado-mini" style={{ textAlign: "center", marginTop: 6 }}>
        Nuestra recomendación · enlace de afiliado
      </p>
    </div>
  );
}
