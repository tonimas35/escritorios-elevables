import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Dominio canonico del sitio. Los previews de Vercel y cualquier otro host
// que sirva este mismo contenido se marcan como noindex para que Google no
// los trate como una copia competidora de elevable.es.
//
// www.elevable.es NO llega hasta aqui: lo redirige antes el 308 permanente
// de next.config.ts, que se evalua antes que el middleware.
const CANONICAL_HOST = "elevable.es";

// El quiz vivia en /test, una URL sin ninguna intencion de busqueda.
const REDIRECCIONES: Record<string, string> = {
  "/test": "/que-escritorio-elevable-comprar",
};

export function middleware(request: NextRequest) {
  const destino = REDIRECCIONES[request.nextUrl.pathname];
  if (destino) {
    const url = request.nextUrl.clone();
    url.pathname = destino;
    return NextResponse.redirect(url, 301);
  }

  const response = NextResponse.next();
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();

  // noindex a secas, sin nofollow: el nofollow impedia que Google siguiera
  // los enlaces de esas paginas, y con la home indexada en www eso cortaba
  // el rastreo del resto del sitio desde ese punto de entrada.
  if (host !== CANONICAL_HOST) {
    response.headers.set("X-Robots-Tag", "noindex");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
